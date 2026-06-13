import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, UploadCloud, CheckCircle, Download, Copy,
  ArrowLeft, Award, Loader2, ChevronDown,
  ChevronUp, Trash2, Eye, Calendar, X, FolderOpen
} from 'lucide-react';
import { documentApi, type Document } from '../../services/api/documentApi';

// Document type options for upload
const DOCUMENT_TYPES = {
  student_vault: [
    { value: 'offer_letter', label: '📜 Offer Letter', icon: '📜' },
    { value: 'visa_grant_letter', label: '🛂 Visa Grant Letter', icon: '🛂' },
    { value: 'nid_card', label: '🆔 NID Card', icon: '🆔' },
    { value: 'birth_certificate', label: '🎂 Birth Certificate', icon: '🎂' },
    { value: 'passport', label: '📘 Passport Copy', icon: '📘' },
  ],
  academic: [
    { value: 'transcript', label: '📚 Academic Transcript', icon: '📚' },
    { value: 'certificate', label: '📜 Degree Certificate', icon: '📜' },
    { value: 'sop', label: '✍️ Statement of Purpose (SOP)', icon: '✍️' },
    { value: 'lor', label: '📝 Letter of Recommendation', icon: '📝' },
    { value: 'cv', label: '📄 CV/Resume', icon: '📄' },
    { value: 'ielts', label: '🎯 IELTS Score', icon: '🎯' },
    { value: 'toefl', label: '🎯 TOEFL Score', icon: '🎯' },
  ],
  financial: [
    { value: 'bank_statement', label: '💰 Bank Statement', icon: '💰' },
    { value: 'sponsor_letter', label: '📋 Sponsor Letter', icon: '📋' },
    { value: 'scholarship_letter', label: '🏆 Scholarship Letter', icon: '🏆' },
  ],
  visa: [
    { value: 'visa_application', label: '📄 Visa Application Form', icon: '📄' },
    { value: 'biometrics', label: '🖐️ Biometrics Receipt', icon: '🖐️' },
    { value: 'medical_certificate', label: '🏥 Medical Certificate', icon: '🏥' },
  ],
  other: [
    { value: 'other', label: '📁 Other Document', icon: '📁' },
  ]
};

// Templates
const LOR_TEMPLATE = `LETTER OF RECOMMENDATION TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[DATE]

To the Admissions Committee,
[Target University Name]

Dear Members of the Committee,

It is with great pleasure that I recommend [Student Full Name] for admission to the [Program Name] at your esteemed institution. I have known [Student Name] for [X] years in my capacity as [Your Title] at [Your University/Institution], where they enrolled in my courses on [Subject 1] and [Subject 2].

During this period, [Student Name] consistently demonstrated exceptional academic ability, intellectual curiosity, and a strong work ethic. They achieved a CGPA of [X.XX/4.00] and were placed in the top [X]% of their batch.

I recommend [Student Name] without reservation for your program.

Sincerely,

[Professor Full Name]
[Designation] | [Department]
[University Name], Bangladesh`;

const GAP_TEMPLATE = `STUDY GAP EXPLANATION STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: [Current Date]

To Whom It May Concern,

Subject: Explanation of Academic Study Gap — [Your Full Name]

I am writing to formally address the academic gap between my completion of [Bachelor's/previous degree] in [Month, Year] and my current application for the [Master's Program] beginning [Intake Year] at [Target University].

[Explain your gap reason professionally]

This gap has not diminished my academic capability. I am fully prepared to re-engage with rigorous academic work.

Sincerely,

[Your Full Name]`;

export default function DocumentManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'vault' | 'templates'>('vault');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<'lor' | 'gap' | null>('lor');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    documentType: 'offer_letter',
    category: 'student_vault' as string,
    customCategoryName: '',
    displayName: '',
    notes: '',
    documentDate: '',
    expiryDate: ''
  });

  // Fetch user's documents
  const { data: vaultData, isLoading } = useQuery({
    queryKey: ['userVault'],
    queryFn: documentApi.getUserVault,
  });

  const documents: Document[] = vaultData?.documents || [];
  const grouped = vaultData?.grouped || {};

  // Helper function to get preview URL - uses Google Docs Viewer for PDFs to force inline preview
  const getPreviewUrl = (doc: Document) => {
    let fileUrl = doc.fileUrl?.startsWith("http") 
      ? doc.fileUrl 
      : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${doc.fileUrl}`;
    
    // For PDF files - use Google Docs Viewer to force inline preview (works 100% of the time)
    if (doc.fileName?.toLowerCase().endsWith('.pdf')) {
      // For Cloudinary PDFs, ensure raw URL format
      let pdfUrl = fileUrl;
      if (fileUrl.includes('cloudinary.com')) {
        pdfUrl = fileUrl.replace('/image/upload/', '/raw/upload/');
      }
      // Use Google Docs Viewer to force preview instead of download
      return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    }
    
    return fileUrl;
  };

  // Helper function to get download URL
  const getDownloadUrl = (doc: Document) => {
    let url = doc.fileUrl?.startsWith("http") 
      ? doc.fileUrl 
      : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${doc.fileUrl}`;
    
    // For Cloudinary PDFs, ensure correct resource type
    if (url.includes('cloudinary.com') && doc.fileName?.toLowerCase().endsWith('.pdf')) {
      url = url.replace('/image/upload/', '/raw/upload/');
    }
    return url;
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await documentApi.uploadDocument(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userVault'] });
      setShowUploadModal(false);
      setUploadForm({
        file: null,
        documentType: 'offer_letter',
        category: 'student_vault',
        customCategoryName: '',
        displayName: '',
        notes: '',
        documentDate: '',
        expiryDate: ''
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await documentApi.deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userVault'] });
      setShowDeleteConfirm(null);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', file.name, file.size, file.type);
      setUploadForm({ ...uploadForm, file: file });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('documentType', uploadForm.documentType);
    formData.append('category', uploadForm.category);
    formData.append('displayName', uploadForm.displayName || uploadForm.file.name);
    if (uploadForm.customCategoryName) formData.append('customCategoryName', uploadForm.customCategoryName);
    if (uploadForm.notes) formData.append('notes', uploadForm.notes);
    if (uploadForm.documentDate) formData.append('documentDate', uploadForm.documentDate);
    if (uploadForm.expiryDate) formData.append('expiryDate', uploadForm.expiryDate);

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const copyTemplate = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(key);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const totalStorageUsed = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
  const storageLimit = 50 * 1024 * 1024;
  const storagePercent = Math.min(100, (totalStorageUsed / storageLimit) * 100);

  const categories = ['all', ...Object.keys(grouped).filter(k => grouped[k]?.length > 0)];
  
  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-2">
                <FileText size={11} /> Personal Document Vault
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Document Vault</h1>
              <p className="text-slate-500 text-sm mt-1">Securely store and organize all your study abroad documents in one place.</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg transition-all"
            >
              <UploadCloud size={15} /> Upload Document
            </button>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Storage Used</span>
            <span className="text-xs font-bold text-slate-700">
              {(totalStorageUsed / (1024 * 1024)).toFixed(1)} MB / {(storageLimit / (1024 * 1024)).toFixed(0)} MB
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {documents.length} documents in your vault
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('vault')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}>
            📂 My Vault ({documents.length})
          </button>
          <button onClick={() => setActiveTab('templates')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}>
            📝 Templates & Resources
          </button>
        </div>

        {/* VAULT TAB */}
        {activeTab === 'vault' && (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Documents' : 
                   cat === 'student_vault' ? 'Student Vault' :
                   cat === 'academic' ? 'Academic' :
                   cat === 'financial' ? 'Financial' :
                   cat === 'visa' ? 'Visa' : cat}
                </button>
              ))}
            </div>

            {/* Documents Grid */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={28} className="animate-spin text-blue-600" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FolderOpen size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                >
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDocuments.map((doc) => {
                  const docTypeInfo = DOCUMENT_TYPES[doc.category as keyof typeof DOCUMENT_TYPES]?.find(t => t.value === doc.documentType) || 
                                      { label: doc.displayName, icon: '📄' };
                  
                  return (
                    <div key={doc._id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all overflow-hidden group">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                              {docTypeInfo.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{doc.displayName}</h4>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <FileText size={9} /> {formatFileSize(doc.fileSize)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(doc._id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {doc.notes && (
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.notes}</p>
                        )}

                        {doc.documentDate && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2">
                            <Calendar size={10} /> Issued: {new Date(doc.documentDate).toLocaleDateString()}
                          </div>
                        )}

                        {doc.expiryDate && (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 mb-3">
                            <Calendar size={10} /> Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                          {doc.fileUrl && (
                            <>
                              <a
                                href={getPreviewUrl(doc)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100 transition"
                              >
                                <Eye size={12} /> Preview
                              </a>
                              <a
                                href={getDownloadUrl(doc)}
                                download={doc.fileName}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
                              >
                                <Download size={12} /> Download
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-5">
            {[
              { key: 'lor', title: 'Letter of Recommendation (LOR) Template', icon: Award, desc: 'For professors to write on your behalf.', template: LOR_TEMPLATE, color: 'text-blue-600 bg-blue-50 border-blue-100' },
              { key: 'gap', title: 'Study Gap Explanation Statement', icon: FileText, desc: 'Required if you have a 1+ year gap.', template: GAP_TEMPLATE, color: 'text-violet-600 bg-violet-50 border-violet-100' },
            ].map(tpl => {
              const Icon = tpl.icon;
              const isOpen = expandedTemplate === tpl.key as 'lor' | 'gap';
              return (
                <div key={tpl.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <button onClick={() => setExpandedTemplate(isOpen ? null : tpl.key as 'lor' | 'gap')}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-all cursor-pointer text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tpl.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">{tpl.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{tpl.desc}</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-6 pb-6">
                      <div className="relative mt-4">
                        <pre className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                          {tpl.template}
                        </pre>
                        <button onClick={() => copyTemplate(tpl.template, tpl.key)}
                          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            copiedTemplate === tpl.key
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}>
                          {copiedTemplate === tpl.key ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select File *</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="w-full border border-slate-200 rounded-xl p-2 text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG, DOC — Max 5MB</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category *</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="student_vault">Student Vault (Offer Letter, Visa, NID, etc.)</option>
                  <option value="academic">Academic (Transcripts, SOP, LOR, IELTS)</option>
                  <option value="financial">Financial (Bank Statement, Sponsor Letter)</option>
                  <option value="visa">Visa (Application, Biometrics, Medical)</option>
                  <option value="custom">Custom Category</option>
                </select>
              </div>

              {uploadForm.category === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={uploadForm.customCategoryName}
                    onChange={(e) => setUploadForm({ ...uploadForm, customCategoryName: e.target.value })}
                    placeholder="e.g., Housing, Insurance"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
                <select
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                >
                  {DOCUMENT_TYPES[uploadForm.category as keyof typeof DOCUMENT_TYPES]?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                  {!DOCUMENT_TYPES[uploadForm.category as keyof typeof DOCUMENT_TYPES] && (
                    <option value="other">📁 Other Document</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Display Name</label>
                <input
                  type="text"
                  value={uploadForm.displayName}
                  onChange={(e) => setUploadForm({ ...uploadForm, displayName: e.target.value })}
                  placeholder="e.g., University of Toronto Offer Letter"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Notes (Optional)</label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Add any notes about this document..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Date (Optional)</label>
                <input
                  type="date"
                  value={uploadForm.documentDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentDate: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={uploadForm.expiryDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadForm.file || uploadMutation.isPending}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploadMutation.isPending ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Document?</h2>
              <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The document will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
                >
                  {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   FileText, UploadCloud, CheckCircle, Download, Copy,
//   ArrowLeft, Award, Loader2, ChevronDown,
//   ChevronUp, Trash2, Eye, Calendar, X, FolderOpen
// } from 'lucide-react';
// import { documentApi, type Document } from '../../services/api/documentApi';

// // Document type options for upload
// const DOCUMENT_TYPES = {
//   student_vault: [
//     { value: 'offer_letter', label: '📜 Offer Letter', icon: '📜' },
//     { value: 'visa_grant_letter', label: '🛂 Visa Grant Letter', icon: '🛂' },
//     { value: 'nid_card', label: '🆔 NID Card', icon: '🆔' },
//     { value: 'birth_certificate', label: '🎂 Birth Certificate', icon: '🎂' },
//     { value: 'passport', label: '📘 Passport Copy', icon: '📘' },
//   ],
//   academic: [
//     { value: 'transcript', label: '📚 Academic Transcript', icon: '📚' },
//     { value: 'certificate', label: '📜 Degree Certificate', icon: '📜' },
//     { value: 'sop', label: '✍️ Statement of Purpose (SOP)', icon: '✍️' },
//     { value: 'lor', label: '📝 Letter of Recommendation', icon: '📝' },
//     { value: 'cv', label: '📄 CV/Resume', icon: '📄' },
//     { value: 'ielts', label: '🎯 IELTS Score', icon: '🎯' },
//     { value: 'toefl', label: '🎯 TOEFL Score', icon: '🎯' },
//   ],
//   financial: [
//     { value: 'bank_statement', label: '💰 Bank Statement', icon: '💰' },
//     { value: 'sponsor_letter', label: '📋 Sponsor Letter', icon: '📋' },
//     { value: 'scholarship_letter', label: '🏆 Scholarship Letter', icon: '🏆' },
//   ],
//   visa: [
//     { value: 'visa_application', label: '📄 Visa Application Form', icon: '📄' },
//     { value: 'biometrics', label: '🖐️ Biometrics Receipt', icon: '🖐️' },
//     { value: 'medical_certificate', label: '🏥 Medical Certificate', icon: '🏥' },
//   ],
//   other: [
//     { value: 'other', label: '📁 Other Document', icon: '📁' },
//   ]
// };

// // Templates
// const LOR_TEMPLATE = `LETTER OF RECOMMENDATION TEMPLATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// [DATE]

// To the Admissions Committee,
// [Target University Name]

// Dear Members of the Committee,

// It is with great pleasure that I recommend [Student Full Name] for admission to the [Program Name] at your esteemed institution. I have known [Student Name] for [X] years in my capacity as [Your Title] at [Your University/Institution], where they enrolled in my courses on [Subject 1] and [Subject 2].

// During this period, [Student Name] consistently demonstrated exceptional academic ability, intellectual curiosity, and a strong work ethic. They achieved a CGPA of [X.XX/4.00] and were placed in the top [X]% of their batch.

// I recommend [Student Name] without reservation for your program.

// Sincerely,

// [Professor Full Name]
// [Designation] | [Department]
// [University Name], Bangladesh`;

// const GAP_TEMPLATE = `STUDY GAP EXPLANATION STATEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Date: [Current Date]

// To Whom It May Concern,

// Subject: Explanation of Academic Study Gap — [Your Full Name]

// I am writing to formally address the academic gap between my completion of [Bachelor's/previous degree] in [Month, Year] and my current application for the [Master's Program] beginning [Intake Year] at [Target University].

// [Explain your gap reason professionally]

// This gap has not diminished my academic capability. I am fully prepared to re-engage with rigorous academic work.

// Sincerely,

// [Your Full Name]`;

// export default function DocumentManagementPage() {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState<'vault' | 'templates'>('vault');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
//   const [expandedTemplate, setExpandedTemplate] = useState<'lor' | 'gap' | null>('lor');
//   const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
//   const [uploadForm, setUploadForm] = useState({
//     file: null as File | null,
//     documentType: 'offer_letter',
//     category: 'student_vault' as string,
//     customCategoryName: '',
//     displayName: '',
//     notes: '',
//     documentDate: '',
//     expiryDate: ''
//   });

//   // Fetch user's documents
//   const { data: vaultData, isLoading } = useQuery({
//     queryKey: ['userVault'],
//     queryFn: documentApi.getUserVault,
//   });

//   const documents: Document[] = vaultData?.documents || [];
//   const grouped = vaultData?.grouped || {};

//   // Helper function to get preview URL (fixes PDF preview issue)
//   const getPreviewUrl = (doc: Document) => {
//     let url = doc.fileUrl?.startsWith("http") 
//       ? doc.fileUrl 
//       : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${doc.fileUrl}`;
    
//     // For Cloudinary PDFs, add fl_attachment=false to preview inline instead of downloading
//     if (url.includes('cloudinary.com') && doc.fileName?.toLowerCase().endsWith('.pdf')) {
//       url = url.includes('?') ? `${url}&fl_attachment=false` : `${url}?fl_attachment=false`;
//     }
//     return url;
//   };

//   // Helper function to get download URL
//   const getDownloadUrl = (doc: Document) => {
//     return doc.fileUrl?.startsWith("http") 
//       ? doc.fileUrl 
//       : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${doc.fileUrl}`;
//   };

//   // Upload mutation
//   const uploadMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       return await documentApi.uploadDocument(formData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userVault'] });
//       setShowUploadModal(false);
//       setUploadForm({
//         file: null,
//         documentType: 'offer_letter',
//         category: 'student_vault',
//         customCategoryName: '',
//         displayName: '',
//         notes: '',
//         documentDate: '',
//         expiryDate: ''
//       });
//     }
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       return await documentApi.deleteDocument(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userVault'] });
//       setShowDeleteConfirm(null);
//     }
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       console.log('File selected:', file.name, file.size, file.type);
//       setUploadForm({ ...uploadForm, file: file });
//     }
//   };

//   const handleUpload = async () => {
//     if (!uploadForm.file) {
//       alert('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', uploadForm.file);
//     formData.append('documentType', uploadForm.documentType);
//     formData.append('category', uploadForm.category);
//     formData.append('displayName', uploadForm.displayName || uploadForm.file.name);
//     if (uploadForm.customCategoryName) formData.append('customCategoryName', uploadForm.customCategoryName);
//     if (uploadForm.notes) formData.append('notes', uploadForm.notes);
//     if (uploadForm.documentDate) formData.append('documentDate', uploadForm.documentDate);
//     if (uploadForm.expiryDate) formData.append('expiryDate', uploadForm.expiryDate);

//     uploadMutation.mutate(formData);
//   };

//   const handleDelete = (id: string) => {
//     deleteMutation.mutate(id);
//   };

//   const copyTemplate = (text: string, key: string) => {
//     navigator.clipboard.writeText(text);
//     setCopiedTemplate(key);
//     setTimeout(() => setCopiedTemplate(null), 2500);
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
//   };

//   const totalStorageUsed = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
//   const storageLimit = 50 * 1024 * 1024;
//   const storagePercent = Math.min(100, (totalStorageUsed / storageLimit) * 100);

//   const categories = ['all', ...Object.keys(grouped).filter(k => grouped[k]?.length > 0)];
  
//   const filteredDocuments = selectedCategory === 'all' 
//     ? documents 
//     : documents.filter(doc => doc.category === selectedCategory);

//   return (
//     <div className="min-h-screen bg-slate-50 pb-16 pt-20">
//       <div className="max-w-6xl mx-auto px-6">

//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4 transition-colors">
//             <ArrowLeft size={14} /> Back to Dashboard
//           </Link>
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-2">
//                 <FileText size={11} /> Personal Document Vault
//               </div>
//               <h1 className="text-2xl font-extrabold text-slate-900">Document Vault</h1>
//               <p className="text-slate-500 text-sm mt-1">Securely store and organize all your study abroad documents in one place.</p>
//             </div>
//             <button
//               onClick={() => setShowUploadModal(true)}
//               className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg transition-all"
//             >
//               <UploadCloud size={15} /> Upload Document
//             </button>
//           </div>
//         </div>

//         {/* Storage Usage */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-medium text-slate-500">Storage Used</span>
//             <span className="text-xs font-bold text-slate-700">
//               {(totalStorageUsed / (1024 * 1024)).toFixed(1)} MB / {(storageLimit / (1024 * 1024)).toFixed(0)} MB
//             </span>
//           </div>
//           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//             <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
//           </div>
//           <p className="text-[10px] text-slate-400 mt-2">
//             {documents.length} documents in your vault
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6">
//           <button onClick={() => setActiveTab('vault')}
//             className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//               activeTab === 'vault'
//                 ? 'bg-slate-900 text-white shadow-sm'
//                 : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
//             }`}>
//             📂 My Vault ({documents.length})
//           </button>
//           <button onClick={() => setActiveTab('templates')}
//             className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//               activeTab === 'templates'
//                 ? 'bg-slate-900 text-white shadow-sm'
//                 : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
//             }`}>
//             📝 Templates & Resources
//           </button>
//         </div>

//         {/* VAULT TAB */}
//         {activeTab === 'vault' && (
//           <>
//             {/* Category Filters */}
//             <div className="flex flex-wrap gap-2 mb-6">
//               {categories.map(cat => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
//                     selectedCategory === cat
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
//                   }`}
//                 >
//                   {cat === 'all' ? 'All Documents' : 
//                    cat === 'student_vault' ? 'Student Vault' :
//                    cat === 'academic' ? 'Academic' :
//                    cat === 'financial' ? 'Financial' :
//                    cat === 'visa' ? 'Visa' : cat}
//                 </button>
//               ))}
//             </div>

//             {/* Documents Grid */}
//             {isLoading ? (
//               <div className="flex justify-center py-16">
//                 <Loader2 size={28} className="animate-spin text-blue-600" />
//               </div>
//             ) : filteredDocuments.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
//                 <FolderOpen size={48} className="text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
//                 <button
//                   onClick={() => setShowUploadModal(true)}
//                   className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
//                 >
//                   Upload Your First Document
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {filteredDocuments.map((doc) => {
//                   const docTypeInfo = DOCUMENT_TYPES[doc.category as keyof typeof DOCUMENT_TYPES]?.find(t => t.value === doc.documentType) || 
//                                       { label: doc.displayName, icon: '📄' };
                  
//                   return (
//                     <div key={doc._id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all overflow-hidden group">
//                       <div className="p-5">
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
//                               {docTypeInfo.icon}
//                             </div>
//                             <div>
//                               <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{doc.displayName}</h4>
//                               <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
//                                 <FileText size={9} /> {formatFileSize(doc.fileSize)}
//                               </span>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => setShowDeleteConfirm(doc._id)}
//                             className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>

//                         {doc.notes && (
//                           <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.notes}</p>
//                         )}

//                         {doc.documentDate && (
//                           <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2">
//                             <Calendar size={10} /> Issued: {new Date(doc.documentDate).toLocaleDateString()}
//                           </div>
//                         )}

//                         {doc.expiryDate && (
//                           <div className="flex items-center gap-1.5 text-[10px] text-amber-600 mb-3">
//                             <Calendar size={10} /> Expires: {new Date(doc.expiryDate).toLocaleDateString()}
//                           </div>
//                         )}

//                         <div className="flex gap-2 pt-3 border-t border-slate-100">
//                           {doc.fileUrl && (
//                             <>
//                               <a
//                                 href={getPreviewUrl(doc)}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100 transition"
//                               >
//                                 <Eye size={12} /> Preview
//                               </a>
//                               <a
//                                 href={getDownloadUrl(doc)}
//                                 download={doc.fileName}
//                                 className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
//                               >
//                                 <Download size={12} /> Download
//                               </a>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* TEMPLATES TAB */}
//         {activeTab === 'templates' && (
//           <div className="space-y-5">
//             {[
//               { key: 'lor', title: 'Letter of Recommendation (LOR) Template', icon: Award, desc: 'For professors to write on your behalf.', template: LOR_TEMPLATE, color: 'text-blue-600 bg-blue-50 border-blue-100' },
//               { key: 'gap', title: 'Study Gap Explanation Statement', icon: FileText, desc: 'Required if you have a 1+ year gap.', template: GAP_TEMPLATE, color: 'text-violet-600 bg-violet-50 border-violet-100' },
//             ].map(tpl => {
//               const Icon = tpl.icon;
//               const isOpen = expandedTemplate === tpl.key as 'lor' | 'gap';
//               return (
//                 <div key={tpl.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                   <button onClick={() => setExpandedTemplate(isOpen ? null : tpl.key as 'lor' | 'gap')}
//                     className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-all cursor-pointer text-left">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tpl.color}`}>
//                         <Icon size={18} />
//                       </div>
//                       <div>
//                         <h3 className="font-extrabold text-slate-800 text-sm">{tpl.title}</h3>
//                         <p className="text-xs text-slate-400 mt-0.5">{tpl.desc}</p>
//                       </div>
//                     </div>
//                     {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
//                   </button>

//                   {isOpen && (
//                     <div className="border-t border-slate-100 px-6 pb-6">
//                       <div className="relative mt-4">
//                         <pre className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
//                           {tpl.template}
//                         </pre>
//                         <button onClick={() => copyTemplate(tpl.template, tpl.key)}
//                           className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//                             copiedTemplate === tpl.key
//                               ? 'bg-emerald-500 text-white'
//                               : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
//                           }`}>
//                           {copiedTemplate === tpl.key ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
//           <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold text-slate-800">Upload Document</h2>
//               <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Select File *</label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                   className="w-full border border-slate-200 rounded-xl p-2 text-sm"
//                 />
//                 <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG, DOC — Max 5MB</p>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Category *</label>
//                 <select
//                   value={uploadForm.category}
//                   onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 >
//                   <option value="student_vault">Student Vault (Offer Letter, Visa, NID, etc.)</option>
//                   <option value="academic">Academic (Transcripts, SOP, LOR, IELTS)</option>
//                   <option value="financial">Financial (Bank Statement, Sponsor Letter)</option>
//                   <option value="visa">Visa (Application, Biometrics, Medical)</option>
//                   <option value="custom">Custom Category</option>
//                 </select>
//               </div>

//               {uploadForm.category === 'custom' && (
//                 <div>
//                   <label className="block text-xs font-bold text-slate-600 mb-1">Category Name</label>
//                   <input
//                     type="text"
//                     value={uploadForm.customCategoryName}
//                     onChange={(e) => setUploadForm({ ...uploadForm, customCategoryName: e.target.value })}
//                     placeholder="e.g., Housing, Insurance"
//                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
//                 <select
//                   value={uploadForm.documentType}
//                   onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 >
//                   {DOCUMENT_TYPES[uploadForm.category as keyof typeof DOCUMENT_TYPES]?.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                   {!DOCUMENT_TYPES[uploadForm.category as keyof typeof DOCUMENT_TYPES] && (
//                     <option value="other">📁 Other Document</option>
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Display Name</label>
//                 <input
//                   type="text"
//                   value={uploadForm.displayName}
//                   onChange={(e) => setUploadForm({ ...uploadForm, displayName: e.target.value })}
//                   placeholder="e.g., University of Toronto Offer Letter"
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Notes (Optional)</label>
//                 <textarea
//                   value={uploadForm.notes}
//                   onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
//                   placeholder="Add any notes about this document..."
//                   rows={2}
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Document Date (Optional)</label>
//                 <input
//                   type="date"
//                   value={uploadForm.documentDate}
//                   onChange={(e) => setUploadForm({ ...uploadForm, documentDate: e.target.value })}
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date (Optional)</label>
//                 <input
//                   type="date"
//                   value={uploadForm.expiryDate}
//                   onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
//                   className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpload}
//                 disabled={!uploadForm.file || uploadMutation.isPending}
//                 className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
//               >
//                 {uploadMutation.isPending ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Upload'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
//           <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
//             <div className="text-center">
//               <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
//               <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Document?</h2>
//               <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The document will be permanently removed.</p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(showDeleteConfirm)}
//                   disabled={deleteMutation.isPending}
//                   className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
//                 >
//                   {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

