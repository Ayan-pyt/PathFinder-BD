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

// Templates (keep existing)
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
  const storageLimit = 50 * 1024 * 1024; // 50MB free limit
  const storagePercent = Math.min(100, (totalStorageUsed / storageLimit) * 100);

  // Get categories to display
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
                                href={`http://localhost:5000${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100 transition"
                              >
                                <Eye size={12} /> Preview
                              </a>
                              <a
                                href={`http://localhost:5000${doc.fileUrl}`}
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
            {/* Keep existing templates here - same as before */}
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
              {/* File input */}
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

              {/* Category */}
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

              {/* Custom category name */}
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

              {/* Document Type */}
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

              {/* Display Name */}
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

              {/* Notes */}
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

              {/* Document Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Date (Optional)</label>
                <input
                  type="date"
                  value={uploadForm.documentDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentDate: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              {/* Expiry Date */}
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

// import {
//   FileText, UploadCloud, CheckCircle, Download, Copy,
//   ArrowLeft, GraduationCap, Award, CreditCard, User,
//   Loader2, ChevronDown, ChevronUp, Sparkles
// } from 'lucide-react';

// interface DocItem {
//   id: string;
//   name: string;
//   category: 'academic' | 'identity' | 'financial';
//   required: boolean;
//   desc: string;
//   status: 'pending' | 'uploading' | 'uploaded';
//   fileUrl?: string;
//   fileName?: string;
// }

// const CHECKLIST_BASE: DocItem[] = [
//   { id: '1', name: 'Bachelor Academic Transcript & Certificate', category: 'academic', required: true, desc: 'Official copy sealed and attested by university registrar. All semesters included.', status: 'pending' },
//   { id: '2', name: 'Valid Passport (Minimum 1-Year validity)', category: 'identity', required: true, desc: 'Clear scan of data page. Must be valid for duration of intended study.', status: 'pending' },
//   { id: '3', name: 'Statement of Purpose (SOP)', category: 'academic', required: true, desc: 'A 1000-word essay on your goals, experiences, and motivation. Use our AI generator.', status: 'pending' },
//   { id: '4', name: 'Letters of Recommendation (×2)', category: 'academic', required: true, desc: 'From 2 professors/supervisors on official letterhead. Use the template below.', status: 'pending' },
//   { id: '5', name: 'CV / Academic Resume', category: 'academic', required: true, desc: 'Academic format — education, publications, projects, skills. 1-2 pages max.', status: 'pending' },
//   { id: '6', name: 'IELTS / TOEFL Score Certificate', category: 'academic', required: true, desc: 'Minimum IELTS 6.5 overall for most universities. Must be from an approved centre.', status: 'pending' },
//   { id: '7', name: 'Sponsor Bank Statement (1-Year Solvency)', category: 'financial', required: true, desc: 'Bank statement showing minimum ৳35L BDT equivalent maintained for at least 28 days.', status: 'pending' },
//   { id: '8', name: 'Study Gap Explanation Certificate', category: 'academic', required: false, desc: 'Only if you have a gap of 1+ year between graduation and application. See template below.', status: 'pending' },
// ];

// const CATEGORY_CONFIG = {
//   academic:  { label: 'Academic',  icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-100' },
//   identity:  { label: 'Identity',  icon: User,          color: 'text-violet-600 bg-violet-50 border-violet-100' },
//   financial: { label: 'Financial', icon: CreditCard,     color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
// };

// const LOR_TEMPLATE = `LETTER OF RECOMMENDATION TEMPLATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// [DATE]

// To the Admissions Committee,
// [Target University Name]

// Dear Members of the Committee,

// It is with great pleasure that I recommend [Student Full Name] for admission to the [Program Name] at your esteemed institution. I have known [Student Name] for [X] years in my capacity as [Your Title] at [Your University/Institution], where they enrolled in my courses on [Subject 1] and [Subject 2].

// During this period, [Student Name] consistently demonstrated exceptional academic ability, intellectual curiosity, and a strong work ethic. They achieved a CGPA of [X.XX/4.00] and were placed in the top [X]% of their batch. Their research project titled "[Project Title]" demonstrated outstanding analytical skills and original thinking.

// I was particularly impressed by [Student Name]'s ability to [specific skill or achievement]. They are highly collaborative, communicative, and show the kind of intellectual initiative that thrives in graduate-level academic environments.

// I recommend [Student Name] without reservation for your [Program Name] program. I am confident they will bring the same dedication and excellence to your institution.

// Please do not hesitate to contact me should you require further information.

// Yours sincerely,

// [Professor Full Name]
// [Designation] | [Department]
// [University Name], Bangladesh
// Email: [professor@university.edu.bd]
// Phone: [+880-...]`;

// const GAP_TEMPLATE = `STUDY GAP EXPLANATION STATEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Date: [Current Date]

// To Whom It May Concern,

// Subject: Explanation of Academic Study Gap — [Your Full Name]

// I am writing to formally address the academic gap between my completion of [Bachelor's/previous degree] in [Month, Year] and my current application for the [Master's Program] beginning [Intake Year] at [Target University].

// Following my graduation from [Your University] with a degree in [Your Field], I [chose to / was required to] take a break from formal academic study for the following reasons:

// [CHOOSE ONE OR MORE THAT APPLIES:]

// 1. Professional Experience: I worked as a [Job Title] at [Company Name] from [Start Date] to [End Date], gaining hands-on industry experience directly relevant to my intended graduate studies. This experience strengthened my technical foundation and confirmed my academic and career goals.

// 2. Family Responsibilities: During this period, I managed [brief description of family circumstances], which required my full attention and time.

// 3. Research & Preparation: I dedicated this time to [self-study / research / IELTS preparation / other] to better prepare for graduate-level studies.

// This gap has not diminished my academic capability. If anything, it has deepened my motivation and professional clarity to pursue [Target Field] at the graduate level.

// I am fully prepared to re-engage with rigorous academic work and am committed to maintaining the highest standards at [Target University].

// Sincerely,

// [Your Full Name]
// [Your Email Address]
// [Your Phone Number]
// [Date]`;

// export default function DocumentManagementPage() {
//   // const { user } = useAuthStore();
//   const [checklist, setChecklist] = useState<DocItem[]>(CHECKLIST_BASE);
//   const [activeTab, setActiveTab] = useState<'checklist' | 'templates'>('checklist');
//   const [expandedTemplate, setExpandedTemplate] = useState<'lor' | 'gap' | null>('lor');
//   const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

//   const uploadedCount = checklist.filter(i => i.status === 'uploaded').length;
//   const requiredCount = checklist.filter(i => i.required).length;
//   const requiredDone  = checklist.filter(i => i.required && i.status === 'uploaded').length;
//   const progressPct   = Math.round((uploadedCount / checklist.length) * 100);

//   const handleFileUpload = async (id: string, file: File) => {
//     if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
//     setChecklist(prev => prev.map(i => i.id === id ? { ...i, status: 'uploading' } : i));

//     try {
//       const token = localStorage.getItem('pf_token');
//       const form = new FormData();
//       form.append('document', file);

//       const res = await fetch('/api/documents/upload', {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });
//       const data = await res.json();

//       if (data.success) {
//         setChecklist(prev => prev.map(i => i.id === id
//           ? { ...i, status: 'uploaded', fileUrl: data.data.url, fileName: file.name }
//           : i
//         ));
//       } else {
//         throw new Error(data.message);
//       }
//     } catch {
//       // Fallback: simulate upload for demo if Cloudinary not configured
//       setChecklist(prev => prev.map(i => i.id === id
//         ? { ...i, status: 'uploaded', fileUrl: '#', fileName: file.name }
//         : i
//       ));
//     }
//   };

//   const copyTemplate = (text: string, key: string) => {
//     navigator.clipboard.writeText(text);
//     setCopiedTemplate(key);
//     setTimeout(() => setCopiedTemplate(null), 2500);
//   };

//   const categoryGroups = (['academic', 'identity', 'financial'] as const).map(cat => ({
//     cat,
//     items: checklist.filter(i => i.category === cat)
//   }));

//   return (
//     <div className="min-h-screen bg-slate-50 pb-16 pt-20">
//       <div className="max-w-5xl mx-auto px-6">

//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4 transition-colors">
//             <ArrowLeft size={14} /> Back to Dashboard
//           </Link>
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-2">
//                 <FileText size={11} /> Legal Document Manager
//               </div>
//               <h1 className="text-2xl font-extrabold text-slate-900">Document Management</h1>
//               <p className="text-slate-500 text-sm mt-1">Upload, track and download all your study abroad documents in one place.</p>
//             </div>
//             <Link to="/sop-generator"
//               className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
//               <Sparkles size={15} /> Generate SOP with AI
//             </Link>
//           </div>
//         </div>

//         {/* Progress bar */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <p className="text-sm font-extrabold text-slate-800">Overall Progress</p>
//               <p className="text-xs text-slate-400 mt-0.5">{requiredDone} of {requiredCount} required documents uploaded</p>
//             </div>
//             <div className="text-right">
//               <span className="text-2xl font-extrabold text-blue-600">{progressPct}%</span>
//               <p className="text-[10px] text-slate-400 font-medium">{uploadedCount}/{checklist.length} total</p>
//             </div>
//           </div>
//           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
//             <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
//               style={{ width: `${progressPct}%` }} />
//           </div>
//           <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
//             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> {uploadedCount} uploaded</span>
//             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200 inline-block" /> {checklist.length - uploadedCount} remaining</span>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6">
//           {(['checklist', 'templates'] as const).map(tab => (
//             <button key={tab} onClick={() => setActiveTab(tab)}
//               className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//                 activeTab === tab
//                   ? 'bg-slate-900 text-white shadow-sm'
//                   : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
//               }`}>
//               {tab === 'checklist' ? '📋 Document Checklist' : '📝 Templates'}
//             </button>
//           ))}
//         </div>

//         {/* CHECKLIST TAB */}
//         {activeTab === 'checklist' && (
//           <div className="space-y-6">
//             {categoryGroups.map(({ cat, items }) => {
//               const cfg = CATEGORY_CONFIG[cat];
//               const CatIcon = cfg.icon;
//               const catDone = items.filter(i => i.status === 'uploaded').length;
//               return (
//                 <div key={cat} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                   {/* Category header */}
//                   <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//                     <div className="flex items-center gap-2.5">
//                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${cfg.color}`}>
//                         <CatIcon size={15} />
//                       </div>
//                       <h3 className="font-extrabold text-slate-800 text-sm">{cfg.label} Documents</h3>
//                     </div>
//                     <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
//                       {catDone}/{items.length} done
//                     </span>
//                   </div>

//                   {/* Document rows */}
//                   <div className="divide-y divide-slate-50">
//                     {items.map(doc => (
//                       <div key={doc.id} className={`flex items-start gap-4 px-6 py-4 transition-all ${
//                         doc.status === 'uploaded' ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
//                       }`}>
//                         {/* Status icon */}
//                         <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
//                           doc.status === 'uploaded'   ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
//                           doc.status === 'uploading'  ? 'bg-blue-50 border-blue-100 text-blue-500' :
//                           'bg-slate-50 border-slate-100 text-slate-400'
//                         }`}>
//                           {doc.status === 'uploading' ? <Loader2 size={15} className="animate-spin" /> :
//                            doc.status === 'uploaded'  ? <CheckCircle size={15} /> :
//                            <FileText size={15} />}
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-0.5">
//                             <p className="text-sm font-bold text-slate-800 leading-tight">{doc.name}</p>
//                             <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
//                               doc.required
//                                 ? 'bg-red-50 text-red-500 border border-red-100'
//                                 : 'bg-slate-100 text-slate-400'
//                             }`}>
//                               {doc.required ? 'Required' : 'Optional'}
//                             </span>
//                           </div>
//                           <p className="text-xs text-slate-400 leading-relaxed mb-2">{doc.desc}</p>

//                           {/* Uploaded file info */}
//                           {doc.status === 'uploaded' && doc.fileName && (
//                             <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//                               <FileText size={12} className="text-emerald-600 flex-shrink-0" />
//                               <span className="text-xs font-medium text-emerald-700 truncate">{doc.fileName}</span>
//                               {doc.fileUrl && doc.fileUrl !== '#' && (
//                                 <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download={doc.fileName}
//                                   className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex-shrink-0">
//                                   <Download size={11} /> Download
//                                 </a>
//                               )}
//                             </div>
//                           )}
//                         </div>

//                         {/* Upload button */}
//                         <div className="flex-shrink-0">
//                           {doc.status === 'uploading' ? (
//                             <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 rounded-xl text-xs text-blue-500 font-medium">
//                               <Loader2 size={12} className="animate-spin" /> Uploading...
//                             </div>
//                           ) : doc.status === 'uploaded' ? (
//                             <label className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium hover:bg-slate-50 transition-all cursor-pointer">
//                               <UploadCloud size={13} /> Replace
//                               <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
//                                 onChange={e => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])} />
//                             </label>
//                           ) : (
//                             <label className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
//                               <UploadCloud size={13} /> Upload
//                               <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
//                                 onChange={e => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])} />
//                             </label>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700">
//               <p className="font-bold mb-1">📌 Important — file requirements</p>
//               <p>Upload files in PDF, JPG, or PNG format. Max size 5MB per file. All academic documents must be attested by your university registrar or the Bangladesh Ministry of Foreign Affairs before submission to universities or embassies.</p>
//             </div>
//           </div>
//         )}

//         {/* TEMPLATES TAB */}
//         {activeTab === 'templates' && (
//           <div className="space-y-5">
//             {[
//               { key: 'lor', title: 'Letter of Recommendation (LOR) Template', icon: Award, desc: 'For professors/supervisors to write on your behalf. Professional format aligned with international standards.', template: LOR_TEMPLATE, color: 'text-blue-600 bg-blue-50 border-blue-100' },
//               { key: 'gap', title: 'Study Gap Explanation Statement', icon: FileText, desc: 'Required if you have a 1+ year gap between graduation and your master\'s application. Accepted by embassies and universities.', template: GAP_TEMPLATE, color: 'text-violet-600 bg-violet-50 border-violet-100' },
//             ].map(tpl => {
//               const Icon = tpl.icon;
//               const isOpen = expandedTemplate === tpl.key;
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
//                     {isOpen ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
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
//                       <p className="text-xs text-slate-400 mt-3 italic">Replace all [BRACKETED] fields with your actual information before use.</p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

