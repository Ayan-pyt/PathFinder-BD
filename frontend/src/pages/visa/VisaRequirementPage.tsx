import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, DollarSign, Clock, Phone, Globe, AlertCircle, CheckCircle, MapPin, Shield, Stamp, Mail } from 'lucide-react';

const VISA_DATA: Record<string, {
  country: string; flag: string; visaType: string; processingWeeks: number; fee: string;
  embassy: { name: string; address: string; phone: string; email: string; website: string; applyUrl: string };
  bankBalance: string; bankPeriod: string;
  documents: { name: string; notes: string; mandatory: boolean }[];
  rejectionReasons: string[];
  bdNotes: string;
}> = {
  AU: {
    country: 'Australia', flag: '🇦🇺',
    visaType: 'Australia Student Visa (Subclass 500)',
    processingWeeks: 4,
    fee: 'AUD 710 (approx. BDT 55,000)',
    embassy: {
      name: 'Australian High Commission Dhaka',
      address: '184 Gulshan Avenue, Dhaka 1212',
      phone: '+880-2-9881818',
      email: 'ahc.dhaka@dfat.gov.au',
      website: 'https://bangladesh.highcommission.gov.au',
      applyUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
    },
    bankBalance: 'AUD 24,505/year tuition + AUD 21,041 living (full genuine evidence required)',
    bankPeriod: 'Must demonstrate genuine access to funds — no fixed period but consistent history preferred',
    documents: [
      { name: 'Confirmation of Enrolment (CoE)', notes: 'Issued by a CRICOS-registered institution. Must have this before applying.', mandatory: true },
      { name: 'Valid Passport', notes: 'Valid for the full intended period of stay in Australia', mandatory: true },
      { name: 'Genuine Temporary Entrant (GTE) Statement', notes: 'Critical — explains why you will return to Bangladesh. The most important document for BD applicants.', mandatory: true },
      { name: 'Financial Evidence', notes: 'Bank statements showing tuition + living funds. Parents\' accounts accepted with relationship proof.', mandatory: true },
      { name: 'English Proficiency (IELTS / PTE)', notes: 'IELTS 6.0–6.5 minimum. Exact requirement varies by institution.', mandatory: true },
      { name: 'Academic Transcripts & Certificates', notes: 'All previous qualifications — certified English copies', mandatory: true },
      { name: 'Overseas Student Health Cover (OSHC)', notes: 'Must purchase from Medibank, Bupa, AHM, NIB or Allianz BEFORE visa is granted', mandatory: true },
      { name: 'Health Examination', notes: 'Medical exam at DOHA-approved panel physician if requested', mandatory: false },
      { name: 'National ID Card (NID)', notes: 'Photocopy as supplementary identity document', mandatory: false },
    ],
    rejectionReasons: [
      'GTE statement not convincing — insufficient ties to Bangladesh (no property, family, future job)',
      'Financial evidence inconsistent, funds recently deposited, or insufficient',
      'OSHC not arranged before visa grant',
      'Academic documents not certified by authorized body',
      'Prior visa refusal to any country not disclosed — always disclose',
    ],
    bdNotes: 'The GTE (Genuine Temporary Entrant) statement is the single most critical document for Bangladeshi applicants. Demonstrate strong ties to Bangladesh — family dependents, land/property ownership, job offers for when you return. Apply online via ImmiAccount at immi.homeaffairs.gov.au. OSHC must be purchased from a DOHA-approved provider before visa grant. Apply at least 8 weeks before your course start date.'
  },

  NZ: {
    country: 'New Zealand', flag: '🇳🇿',
    visaType: 'New Zealand Fee Paying Student Visa',
    processingWeeks: 3,
    fee: 'NZD 375 (approx. BDT 26,200)',
    embassy: {
      name: 'NZ Honorary Consulate, Dhaka (Applications: online only)',
      address: 'Bashoti Horizon, Flat B-3, 3rd Floor, Plot 21, Road 17, Banani, Dhaka 1213',
      phone: '+880-2-886-1947',
      email: 'nzimmigration@mfat.govt.nz',
      website: 'https://www.mfat.govt.nz/en/countries-and-regions/south-asia/bangladesh',
      applyUrl: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/',
    },
    bankBalance: 'NZD 15,000/year living + first year tuition fees (≈ BDT 18–35 Lakhs combined)',
    bankPeriod: '3–6 months consistent history required. Sudden large deposits raise red flags.',
    documents: [
      { name: 'Offer of Place from NZ Education Provider', notes: 'From an NZQA-approved institution. Must include a declaration that you meet English and academic requirements.', mandatory: true },
      { name: 'Valid Passport', notes: 'Valid for at least 3 months beyond intended departure from NZ', mandatory: true },
      { name: 'Financial Evidence', notes: 'NZD 15,000/year living + full tuition fees — last 3–6 months bank statements', mandatory: true },
      { name: 'English Proficiency Proof', notes: 'IELTS 6.0+ or equivalent (PTE, TOEFL). Must match institution requirement.', mandatory: true },
      { name: 'Academic Transcripts & Certificates', notes: 'All previous degrees, notarized English copies', mandatory: true },
      { name: 'Medical Certificate (INZ form)', notes: 'eMedical form completed at an INZ-approved panel physician in Dhaka', mandatory: true },
      { name: 'Passport Size Photos', notes: '35 × 45 mm, white background — 2 copies', mandatory: true },
      { name: 'Police Clearance Certificate', notes: 'Bangladesh police certificate — required for stays over 24 months', mandatory: false },
      { name: 'Sponsor Evidence (if family-funded)', notes: 'Parents\' bank statements + NID + signed relationship declaration', mandatory: false },
    ],
    rejectionReasons: [
      'Insufficient financial evidence or funds held for too short a period',
      'English language score below the institution\'s stated requirement',
      'Medical certificate not completed via INZ-approved eMedical system',
      'Study purpose not clearly linked to career goals in Bangladesh',
      'Prior immigration overstay or breach in any country',
    ],
    bdNotes: 'All NZ student visa applications must be submitted ONLINE at immigration.govt.nz — paper applications are no longer accepted. The honorary consulate in Banani handles only honorary functions, not visa processing. Book your medical eMedical at an INZ-approved panel physician in Dhaka in advance. NZ post-study open work visa allows up to 3 years of work after graduation — a major benefit. Allow at least 6 weeks before course start to apply.'
  },

  IR: {
    country: 'Ireland', flag: '🇮🇪',
    visaType: 'Ireland Long Stay Study Visa (Type D)',
    processingWeeks: 8,
    fee: 'EUR 100 (approx. BDT 12,500)',
    embassy: {
      name: 'Embassy of Ireland, New Delhi (no Ireland embassy in Bangladesh)',
      address: 'C-17, Malcha Marg, Chanakyapuri, New Delhi 110021, India',
      phone: '+91-11-49403200',
      email: 'newdelhivisa@dfa.ie',
      website: 'https://www.ireland.ie/en/india/newdelhi/',
      applyUrl: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/',
    },
    bankBalance: 'EUR 7,000 minimum personal funds beyond tuition + first semester tuition paid upfront to the Irish institution',
    bankPeriod: '6 months consistent bank history. Large sudden deposits are flagged and can cause refusal.',
    documents: [
      { name: 'Offer Letter from Irish HEI', notes: 'From an ILEP (Interim List of Eligible Programmes) institution. Must state course, duration, annual fees.', mandatory: true },
      { name: 'Proof of Tuition Fee Payment', notes: 'Receipt for at least first semester fees paid — mandatory before visa application. This is strictly enforced.', mandatory: true },
      { name: 'Valid Passport', notes: 'Valid for full course duration plus at least 12 months beyond arrival date', mandatory: true },
      { name: 'Financial Evidence (Bank Statement)', notes: 'Last 6 months: EUR 7,000+ beyond tuition. Include parents\' statements if family-sponsored.', mandatory: true },
      { name: 'English Language Proficiency', notes: 'IELTS 6.5 or equivalent — exact requirement varies by university', mandatory: true },
      { name: 'Academic Transcripts & Degree Certificate', notes: 'Notarized English copies of all qualifications', mandatory: true },
      { name: 'Private Medical / Travel Insurance', notes: 'Comprehensive cover for full visa duration — EU-level standard', mandatory: true },
      { name: 'Cover Letter / Personal Statement', notes: 'Why Ireland, why this course, your future career plan in Bangladesh after graduation', mandatory: true },
      { name: 'Passport-size Photos', notes: '2 recent photos, white background, 35 × 45 mm', mandatory: true },
      { name: 'CV / Résumé', notes: 'Academic and professional background', mandatory: false },
    ],
    rejectionReasons: [
      'Tuition fee not paid upfront before visa application — this is strictly enforced by ISD',
      'Financial evidence insufficient or large recent deposit without clear source of funds',
      'Cover letter unconvincing — no clear career plan after return to Bangladesh',
      'Discrepancy between financial documents and stated budget in application',
      'Missing medical/travel insurance proof',
      'Previous Irish or Schengen visa refusal not disclosed',
    ],
    bdNotes: 'There is NO Irish Embassy in Bangladesh. Bangladeshi students apply through the Embassy of Ireland in New Delhi, India — or submit via VFS Global. Start your online visa application at irishimmigration.ie first. You MUST pay your first semester tuition before applying for the visa. Processing is 8 weeks. After arriving in Ireland, you must register with GNIB / ISD within 90 days to get your Irish Residence Permit (IRP) card. Working rights: 20 hrs/week during term, 40 hrs/week during college holidays (June–Sept, mid-Dec to mid-Jan).'
  },

  FI: {
    country: 'Finland', flag: '🇫🇮',
    visaType: 'Finland Residence Permit for Studies',
    processingWeeks: 12,
    fee: 'EUR 350 (approx. BDT 43,750)',
    embassy: {
      name: 'Honorary Consulate General of Finland, Dhaka (Applications: enterfinland.fi)',
      address: 'Summit Centre, 18 Karwan Bazar C/A, Dhaka 1215',
      phone: '+880-2-550-12612',
      email: 'kirjaamo.um@gov.fi',
      website: 'https://um.fi/en/finland-s-missions-abroad',
      applyUrl: 'https://enterfinland.fi/eservices/info/studypermit',
    },
    bankBalance: 'EUR 560/month × length of permit (e.g., EUR 6,720 for 12 months) + tuition fees',
    bankPeriod: 'Full funds must be available at time of application for the entire permit period',
    documents: [
      { name: 'Admission Letter from Finnish University', notes: 'Official admission decision from a Finnish university (AMK or yliopisto). Must state degree, field and start date.', mandatory: true },
      { name: 'Completed enterfinland.fi Application (OLE_OPI)', notes: 'MUST submit online at enterfinland.fi FIRST before booking embassy biometric appointment', mandatory: true },
      { name: 'Valid Passport', notes: 'Valid for the full duration of the permit period. Include all previous passports.', mandatory: true },
      { name: 'Financial Evidence', notes: 'Bank statement showing EUR 560/month for full study period. Scholarship letter accepted as financial proof.', mandatory: true },
      { name: 'Tuition Fee Payment Proof or Scholarship Waiver', notes: 'Non-EU/EEA students pay tuition at most Finnish universities. Receipt or scholarship waiver letter required.', mandatory: true },
      { name: 'English Proficiency', notes: 'IELTS 6.0+ or university-specific equivalent. Most Finnish programs are taught in English.', mandatory: true },
      { name: 'Academic Transcripts & Degree', notes: 'Notarized English copies. Grade conversion to Finnish scale may be needed.', mandatory: true },
      { name: 'Biometric Passport Photos', notes: '3 copies, 36 × 47 mm, white background, taken within last 6 months', mandatory: true },
      { name: 'Health Insurance Proof', notes: 'Private comprehensive insurance for initial period. Kela (Finnish social insurance) covers after registration.', mandatory: true },
    ],
    rejectionReasons: [
      'Insufficient financial evidence — EUR 560/month is the legal minimum, strictly enforced',
      'Application submitted too late — apply at least 3–4 months before study start',
      'Tuition fee not paid or scholarship waiver letter missing',
      'enterfinland.fi online application incomplete before biometric appointment',
      'Passport validity insufficient for the full permit period',
      'Previous Schengen area violation or overstay',
    ],
    bdNotes: 'For Finland, you must start at enterfinland.fi to submit your online application FIRST — then book the biometric appointment at the Honorary Consulate General in Karwan Bazar, Dhaka. The honorary consulate does NOT make visa decisions — that is done by Migri (Finnish Immigration Service) in Finland. Processing at Migri can take 10–14 weeks, so apply 3–4 months before program start. Most Finnish universities charge tuition for non-EU students (EUR 8,000–18,000/year) but offer merit-based scholarship waivers — check your admission letter carefully. After arriving in Finland, register at DVV (Digital and Population Data Services) within one week.'
  },
};

// Per-country accent colours for the hero gradient
const ACCENTS: Record<string, { gradient: string; badge: string }> = {
  AU: { gradient: 'from-[#00205B] via-[#1a3a7a] to-[#C60C30]', badge: 'bg-red-700' },
  NZ: { gradient: 'from-[#00247D] via-[#1a3a8a] to-[#CC0000]', badge: 'bg-red-800' },
  IR: { gradient: 'from-[#169B62] via-[#0f7a4e] to-[#FF883E]', badge: 'bg-orange-600' },
  FI: { gradient: 'from-[#003580] via-[#003580] to-[#1a4fa0]', badge: 'bg-blue-800' },
};

// Opens Gmail compose with pre-filled To field
function gmailLink(email: string, countryName: string) {
  const subject = encodeURIComponent(`Student Visa Enquiry — Bangladeshi Applicant — ${countryName}`);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
}

export default function VisaRequirementPage() {
  const { countryCode } = useParams<{ countryCode: string }>();
  const code = (countryCode || 'AU').toUpperCase() as keyof typeof VISA_DATA;
  const visa = VISA_DATA[code];
  const accent = ACCENTS[code] ?? ACCENTS['AU'];

  if (!visa) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Country not available</h2>
          <p className="text-slate-500 mb-6 text-sm">Visa data for "{countryCode}" is not in the current version of PathFinder BD.</p>
          <Link to="/visa/AU" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
            View Australia Visa Guide
          </Link>
        </div>
      </div>
    );
  }

  const mandatoryCount = visa.documents.filter(d => d.mandatory).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${accent.gradient}`}>
        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-4 right-6 opacity-[0.08]">
            <Stamp size={130} className="text-white rotate-12" />
          </div>
          <div className="absolute bottom-2 right-40 opacity-[0.06]">
            <Shield size={90} className="text-white -rotate-6" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <Link to="/countries" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-bold mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Countries
          </Link>

          {/* Country switcher */}
          <div className="flex flex-wrap gap-2 mb-7">
            {Object.keys(VISA_DATA).map(fc => (
              <Link
                key={fc}
                to={`/visa/${fc}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  code === fc
                    ? 'bg-white text-slate-800 border-white shadow-sm'
                    : 'bg-white/10 text-white border-white/25 hover:bg-white/20'
                }`}
              >
                <span>{VISA_DATA[fc].flag}</span>
                <span>{VISA_DATA[fc].country}</span>
              </Link>
            ))}
          </div>

          {/* Title — always white, always visible */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-4xl">{visa.flag}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm leading-tight">
                {visa.country} Student Visa Guide
              </h1>
              <p className="text-white/75 text-sm mt-1 font-medium">{visa.visaType} — for Bangladeshi applicants</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-7 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-bold">Important:</strong> Visa requirements are sourced from official government websites and embassy portals. Requirements may change — always verify on the official visa website before applying.{' '}
            <strong>Last verified: June 2026.</strong>
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Clock,      label: 'Processing Time',     value: `${visa.processingWeeks} weeks`,     bg: 'bg-blue-50',    ic: 'text-blue-600'   },
            { icon: DollarSign, label: 'Visa Fee',            value: visa.fee,                            bg: 'bg-emerald-50', ic: 'text-emerald-600'},
            { icon: FileText,   label: 'Mandatory Documents', value: `${mandatoryCount} items`,           bg: 'bg-violet-50',  ic: 'text-violet-600' },
            { icon: Globe,      label: 'Application Method',  value: 'Online first',                      bg: 'bg-amber-50',   ic: 'text-amber-600'  },
          ].map(({ icon: Icon, label, value, bg, ic }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon size={16} className={ic} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Documents */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" /> Required Documents
                </h2>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                  {mandatoryCount} mandatory · {visa.documents.length - mandatoryCount} optional
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {visa.documents.map((doc, i) => (
                  <div key={i} className={`flex items-start gap-3 px-6 py-4 transition-colors ${doc.mandatory ? 'hover:bg-blue-50/40' : 'hover:bg-slate-50'}`}>
                    <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${doc.mandatory ? 'text-blue-500' : 'text-slate-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex items-center flex-wrap gap-2">
                        {doc.name}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          doc.mandatory
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {doc.mandatory ? 'Required' : 'Optional'}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{doc.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reasons */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" /> Common Rejection Reasons
              </h2>
              <ul className="space-y-2.5">
                {visa.rejectionReasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-red-50 rounded-xl p-2.5 border border-red-100">
                    <span className="text-red-500 mt-0.5 flex-shrink-0 font-bold">✗</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">

            {/* Financial */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-500" /> Financial Requirement
              </h3>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 mb-3">
                <p className="text-xs font-bold text-emerald-800 mb-1">Minimum Bank Balance</p>
                <p className="text-xs text-emerald-700 leading-relaxed">{visa.bankBalance}</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <strong>Period:</strong> {visa.bankPeriod}
              </p>
            </div>

            {/* Embassy / Contact */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">Embassy / Application Contact</h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="font-bold text-slate-800 leading-snug">{visa.embassy.name}</p>
                <p className="flex items-start gap-2">
                  <MapPin size={11} className="mt-0.5 text-slate-400 flex-shrink-0" />
                  <span>{visa.embassy.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={11} className="text-slate-400 flex-shrink-0" />
                  <span>{visa.embassy.phone}</span>
                </p>
                {/* Email — opens Gmail compose with pre-filled recipient */}
                <a
                  href={gmailLink(visa.embassy.email, visa.country)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  title="Open Gmail to email this embassy"
                >
                  <Mail size={11} className="flex-shrink-0" />
                  <span className="truncate">{visa.embassy.email}</span>
                  <span className="text-[9px] bg-blue-50 border border-blue-100 rounded px-1 py-0.5 text-blue-500 font-bold flex-shrink-0">Gmail ↗</span>
                </a>
              </div>
              <a
                href={visa.embassy.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all w-full justify-center shadow-sm shadow-blue-200"
              >
                <Globe size={13} /> Official Application Portal
              </a>
            </div>

            {/* BD Notes */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-extrabold text-amber-900 text-sm mb-3 flex items-center gap-1.5">
                🇧🇩 BD-Specific Notes
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">{visa.bdNotes}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


// import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft, FileText, DollarSign, Clock, Phone, Globe, AlertCircle, CheckCircle, MapPin, Shield, Stamp } from 'lucide-react';

// const VISA_DATA: Record<string, {
//   country: string; flag: string; visaType: string; processingWeeks: number; fee: string;
//   embassy: { name: string; address: string; phone: string; email: string; website: string };
//   bankBalance: string; bankPeriod: string;
//   documents: { name: string; notes: string; mandatory: boolean }[];
//   rejectionReasons: string[];
//   bdNotes: string;
// }> = {
//   AU: {
//     country: 'Australia', flag: '🇦🇺', visaType: 'Australia Student Visa (Subclass 500)',
//     processingWeeks: 4, fee: 'AUD 710 (approx. BDT 55,000)',
//     embassy: {
//       name: 'Australian High Commission Dhaka',
//       address: '184 Gulshan Avenue, Dhaka 1212',
//       phone: '+880-2-9881818',
//       email: 'ahc.dhaka@dfat.gov.au',
//       website: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'
//     },
//     bankBalance: 'AUD 24,505/year tuition + AUD 21,041 living (apply with full evidence)',
//     bankPeriod: 'Must demonstrate genuine access to funds',
//     documents: [
//       { name: 'Confirmation of Enrolment (CoE)', notes: 'Issued by CRICOS-registered institution', mandatory: true },
//       { name: 'Valid Passport', notes: 'Valid for intended stay period', mandatory: true },
//       { name: 'Genuine Temporary Entrant (GTE) Statement', notes: 'Critical — explains why you will return to Bangladesh', mandatory: true },
//       { name: 'Financial Evidence', notes: 'Bank statements showing tuition + living funds', mandatory: true },
//       { name: 'English Proficiency (IELTS / PTE)', notes: 'IELTS 6.0–6.5 minimum for most programs', mandatory: true },
//       { name: 'Academic Transcripts', notes: 'All previous qualifications — certified copies', mandatory: true },
//       { name: 'Overseas Student Health Cover (OSHC)', notes: 'Mandatory — purchase from Medibank, Bupa, AHM, NIB or Allianz before visa grant', mandatory: true },
//       { name: 'Health Examination', notes: 'Medical exam at panel physician if requested by DOHA', mandatory: false },
//       { name: 'National ID Card (NID)', notes: 'Photocopy as supplementary identity document', mandatory: false },
//     ],
//     rejectionReasons: [
//       'GTE statement not convincing — insufficient ties to Bangladesh',
//       'Financial evidence inconsistent or insufficient',
//       'OSHC not arranged before visa grant',
//       'Academic documents not certified',
//       'Incomplete or inconsistent application',
//       'Prior visa refusal to any country not disclosed'
//     ],
//     bdNotes: 'The GTE (Genuine Temporary Entrant) statement is the single most critical part for Bangladeshi applicants. You must demonstrate strong ties to Bangladesh — family, property, future job prospects, community. Apply online via ImmiAccount at immi.homeaffairs.gov.au. OSHC must be purchased from a DOHA-approved provider before the visa can be granted. Processing is currently around 4 weeks but can vary. Apply at least 8 weeks before course start.'
//   },
//   NZ: {
//     country: 'New Zealand', flag: '🇳🇿', visaType: 'New Zealand Student Visa (Fee-paying Student)',
//     processingWeeks: 3, fee: 'NZD 375 (approx. BDT 26,200)',
//     embassy: {
//       name: 'New Zealand High Commission (processed via VFS)',
//       address: 'VFS Global, Plot 7, Road 11, Block F, Banani, Dhaka 1213',
//       phone: '+880-2-9893813',
//       email: 'nzvisa.dhaka@vfshelpline.com',
//       website: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/fee-paying-student-visa'
//     },
//     bankBalance: 'NZD 15,000/year living + first year tuition fees (≈ BDT 18–35 Lakhs combined)',
//     bankPeriod: '3–6 months consistent bank history required',
//     documents: [
//       { name: 'Offer of Place (Acceptance Letter)', notes: 'From a New Zealand Education Sector approved institution listed on NZQA', mandatory: true },
//       { name: 'Valid Passport', notes: 'Valid for at least 3 months beyond intended departure from NZ', mandatory: true },
//       { name: 'Financial Evidence', notes: 'Bank statement: NZD 15,000/year + tuition — last 3–6 months', mandatory: true },
//       { name: 'English Proficiency Proof', notes: 'IELTS 6.0+ or equivalent (PTE, TOEFL). Must match institution requirement.', mandatory: true },
//       { name: 'Academic Transcripts & Certificates', notes: 'All previous degrees, notarized English copies', mandatory: true },
//       { name: 'Sponsor Evidence (if family-funded)', notes: 'Parents\' bank statements + NID + relationship proof', mandatory: false },
//       { name: 'Medical Certificate', notes: 'INZ Medical Certificate form (eMedical) from approved panel physician in Dhaka', mandatory: true },
//       { name: 'Police Clearance Certificate (PCC)', notes: 'Bangladesh Police Certificate — required for stays over 24 months', mandatory: false },
//       { name: 'Passport Size Photos', notes: '35 × 45 mm, white background — 2 copies', mandatory: true },
//     ],
//     rejectionReasons: [
//       'Insufficient financial evidence — funds not held long enough',
//       'English language score below institutional requirement',
//       'Medical certificate not from INZ-approved physician',
//       'Study purpose not clearly linked to career plan',
//       'Prior immigration breach or overstay in any country',
//       'Incomplete INZ application form 1012'
//     ],
//     bdNotes: 'New Zealand visa applications from Bangladesh are submitted through VFS Global in Banani, Dhaka — they do not have a standalone embassy. Book your VFS appointment early as slots can be limited. The medical examination must be done at an INZ-approved panel physician in Dhaka (e.g., International Medical Clinic). NZ post-study work visa allows up to 3 years of work after graduation — a major drawcard for Bangladeshi students. Always check the Immigration New Zealand website for the most current requirements: immigration.govt.nz'
//   },
//   IR: {
//     country: 'Ireland', flag: '🇮🇪', visaType: 'Ireland Study Visa (Long Stay D Visa)',
//     processingWeeks: 8, fee: 'EUR 100 (approx. BDT 12,500)',
//     embassy: {
//       name: 'Embassy of Ireland, Dhaka',
//       address: 'Plot 8, Road 7, Diplomatic Enclave, Baridhara, Dhaka 1212',
//       phone: '+880-2-9888222',
//       email: 'dhakaembassy@dfa.ie',
//       website: 'https://www.ireland.ie/en/bangladesh/dhaka/services/visas/applying-for-a-visa-to-ireland/'
//     },
//     bankBalance: 'EUR 7,000 minimum personal funds beyond tuition (≈ BDT 8.75 Lakhs), plus first semester tuition paid upfront',
//     bankPeriod: '6 months consistent bank history; large sudden deposits will raise flags',
//     documents: [
//       { name: 'Offer Letter from Irish Higher Education Institution (HEI)', notes: 'From an IUA or TU member institution. Must state course, duration, and annual fees.', mandatory: true },
//       { name: 'Proof of Tuition Fee Payment', notes: 'Receipt for at least first semester or year fees paid to the Irish institution — mandatory before visa application', mandatory: true },
//       { name: 'Valid Passport', notes: 'Valid for entire course duration plus 3 months. Include photocopy of all used pages.', mandatory: true },
//       { name: 'Financial Evidence (Bank Statement)', notes: 'Last 6 months: EUR 7,000+ beyond tuition. Parents\' statements if family-sponsored.', mandatory: true },
//       { name: 'English Language Proficiency', notes: 'IELTS 6.5 or equivalent (university-dependent). Exemptions possible for Commonwealth countries.', mandatory: true },
//       { name: 'Academic Transcripts & Degree Certificate', notes: 'Notarized English copies of all qualifications', mandatory: true },
//       { name: 'Private Medical/Travel Insurance', notes: 'For the duration of the visa — EU-type comprehensive cover', mandatory: true },
//       { name: 'Cover Letter / Personal Statement', notes: 'Why Ireland, why this course, your future career plan. Required by Irish Immigration.', mandatory: true },
//       { name: 'Passport-size Photos', notes: '2 recent photos, white background, 35 × 45 mm', mandatory: true },
//       { name: 'CV / Résumé', notes: 'Academic and professional background', mandatory: false },
//     ],
//     rejectionReasons: [
//       'Tuition fee not paid upfront before visa application — this is strictly enforced',
//       'Financial evidence insufficient or bank balance too recent (sudden large deposit)',
//       'Cover letter unconvincing — no clear career plan after return to Bangladesh',
//       'Discrepancy between financial documents and stated budget',
//       'Missing medical/travel insurance proof',
//       'Previous Irish or Schengen visa refusal not disclosed'
//     ],
//     bdNotes: 'The most important thing for Irish visa from Bangladesh: you must pay your first semester or year tuition to the Irish institution BEFORE applying for the visa. Submit the fee receipt with your application. Applications are submitted at the Irish Embassy, Baridhara, Dhaka — book an appointment through their online system at ireland.ie. Processing is typically 8 weeks but can be longer in busy season (June–August). After arrival, you must register with GNIB (Garda National Immigration Bureau) within 90 days to get your Irish Residence Permit (IRP). Working rights: up to 20 hrs/week during term, 40 hrs/week during holidays.'
//   },
//   FI: {
//     country: 'Finland', flag: '🇫🇮', visaType: 'Finland Residence Permit for Studies (Type D)',
//     processingWeeks: 10, fee: 'EUR 350 (approx. BDT 43,750)',
//     embassy: {
//       name: 'Embassy of Finland, Dhaka',
//       address: 'House NW(J) 1, Road 51, Gulshan 2, Dhaka 1212',
//       phone: '+880-2-9882459',
//       email: 'sanomat.dha@formin.fi',
//       website: 'https://migri.fi/en/studying'
//     },
//     bankBalance: 'EUR 560/month × length of permit (e.g., EUR 6,720/year) + tuition fees for non-EU students (≈ BDT 8.4L/year living)',
//     bankPeriod: 'Funds must be demonstrably available for the full permit period at time of application',
//     documents: [
//       { name: 'Admission Letter from Finnish University', notes: 'Official admission decision from a Finnish university (AMK or yliopisto). Must state degree level, field, and start date.', mandatory: true },
//       { name: 'Valid Passport', notes: 'Valid for the full duration of the permit period + extra margin. Include all previous passports.', mandatory: true },
//       { name: 'Financial Evidence', notes: 'Bank statement showing EUR 560/month for full study period. Scholarship letter counts as financial proof.', mandatory: true },
//       { name: 'Tuition Fee Payment Proof (if applicable)', notes: 'Non-EU/EEA students at most Finnish universities pay tuition. Receipt or scholarship waiver required.', mandatory: true },
//       { name: 'English Proficiency', notes: 'IELTS 6.0+ or equivalent. Finnish-language programs: YKI test. Most bachelor/master programs taught in English.', mandatory: true },
//       { name: 'Academic Transcripts & Degree', notes: 'Notarized English copies. AY (Academic Year) grade conversion to Finnish scale may be needed.', mandatory: true },
//       { name: 'Passport Photos', notes: 'Biometric format — 3 copies, 36 × 47 mm, white background, taken within 6 months', mandatory: true },
//       { name: 'Health Insurance Proof', notes: 'Private insurance for the first period. After registration with Kela (Finnish social insurance), becomes available. EU/EEA-level insurance preferred.', mandatory: true },
//       { name: 'Completed Migri Online Application (OLE_OPI form)', notes: 'Applied at enterfinland.fi — the online system for Finnish immigration. Must be submitted before booking embassy appointment.', mandatory: true },
//     ],
//     rejectionReasons: [
//       'Insufficient financial evidence — EUR 560/month is the minimum and is enforced strictly',
//       'Application submitted too late — apply at least 3 months before study start',
//       'Tuition fee not paid or scholarship waiver not included',
//       'Passport validity insufficient for the permit period',
//       'enterfinland.fi application incomplete or missing attachments',
//       'Previous Schengen area violations or overstay'
//     ],
//     bdNotes: 'For Finnish residence permit, start the online application at enterfinland.fi FIRST — complete and submit your application there before booking the embassy appointment in Dhaka. Processing at Migri (Finnish Immigration Service) can take 10–14 weeks, so apply 3–4 months before your program starts. The Finnish Embassy in Dhaka (Gulshan 2) handles biometric appointments. Most Finnish universities charge tuition for non-EU students (EUR 8,000–18,000/year) but offer scholarship waivers — check your admission letter carefully. After arrival, register at the local Digital and Population Data Services Agency (DVV) within a week. Working rights: unlimited working hours after first year in Finland (subject to residence permit type).'
//   },
// };

// const COUNTRY_ACCENTS: Record<string, { from: string; to: string; badge: string; text: string }> = {
//   AU: { from: 'from-[#00205B]', to: 'to-[#FF0000]',   badge: 'bg-red-600',    text: 'text-red-100' },
//   NZ: { from: 'from-[#00247D]', to: 'to-[#CC0000]',   badge: 'bg-red-700',    text: 'text-red-100' },
//   IR: { from: 'from-[#169B62]', to: 'to-[#FF883E]',   badge: 'bg-orange-600', text: 'text-orange-100' },
//   FI: { from: 'from-[#003580]', to: 'to-[#003580]',   badge: 'bg-blue-700',   text: 'text-blue-100' },
// };

// export default function VisaRequirementPage() {
//   const { countryCode } = useParams<{ countryCode: string }>();
//   const code = (countryCode || 'AU').toUpperCase() as keyof typeof VISA_DATA;
//   const visa = VISA_DATA[code];
//   const accent = COUNTRY_ACCENTS[code] ?? COUNTRY_ACCENTS['AU'];

//   if (!visa) {
//     return (
//       <div className="min-h-screen bg-slate-50 pt-28 pb-16">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <AlertCircle size={28} className="text-red-500" />
//           </div>
//           <h2 className="text-xl font-bold text-slate-800 mb-2">Country not available</h2>
//           <p className="text-slate-500 mb-6 text-sm">Visa data for this country is not available in the current version.</p>
//           <Link to="/visa/AU" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
//             View Australia Visa Guide
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mandatoryCount = visa.documents.filter(d => d.mandatory).length;

//   return (
//     <div className="min-h-screen bg-slate-50 pt-20 pb-16">

//       {/* ── Hero ─────────────────────────────────────────────────────── */}
//       <div className={`relative overflow-hidden bg-gradient-to-br ${accent.from} ${accent.to}`}>
//         {/* Decorative shapes */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
//           <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
//           {/* Stamp watermark */}
//           <div className="absolute top-6 right-8 opacity-10">
//             <Stamp size={120} className="text-white rotate-12" />
//           </div>
//           <div className="absolute bottom-4 right-36 opacity-[0.07]">
//             <Shield size={80} className="text-white -rotate-12" />
//           </div>
//         </div>

//         <div className="relative max-w-5xl mx-auto px-6 py-10">
//           <Link to="/countries" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-bold mb-6 transition-colors">
//             <ArrowLeft size={14} /> Back to Countries
//           </Link>

//           {/* Country Switcher */}
//           <div className="flex flex-wrap gap-2 mb-7">
//             {Object.keys(VISA_DATA).map(fc => (
//               <Link
//                 key={fc}
//                 to={`/visa/${fc}`}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
//                   code === fc
//                     ? 'bg-white text-slate-800 border-white shadow-sm'
//                     : 'bg-white/10 text-white border-white/25 hover:bg-white/20'
//                 }`}
//               >
//                 <span>{VISA_DATA[fc].flag}</span>
//                 <span>{VISA_DATA[fc].country}</span>
//               </Link>
//             ))}
//           </div>

//           {/* Title */}
//           <div className="flex items-center gap-5">
//             <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center flex-shrink-0 shadow-lg">
//               <span className="text-4xl">{visa.flag}</span>
//             </div>
//             <div>
//               {/* ✅ FIX: white text so country name is always visible */}
//               <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">
//                 {visa.country} Student Visa Guide
//               </h1>
//               <p className="text-white/75 text-sm mt-1 font-medium">{visa.visaType} — for Bangladeshi applicants</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Body ─────────────────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-6 py-8">

//         {/* Disclaimer */}
//         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-7 flex items-start gap-3">
//           <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
//           <p className="text-xs text-amber-800 leading-relaxed">
//             <strong className="font-bold">Important:</strong> Visa requirements are sourced from official government websites and Bangladesh embassy portals. Requirements may change — always verify the latest information on the official visa website before applying.{' '}
//             <strong>Last verified: June 2026.</strong>
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//           {[
//             { icon: Clock,     label: 'Processing Time',       value: `${visa.processingWeeks} weeks`,    bg: 'bg-blue-50',   icon_color: 'text-blue-600'   },
//             { icon: DollarSign,label: 'Visa Fee',               value: visa.fee,                           bg: 'bg-emerald-50',icon_color: 'text-emerald-600' },
//             { icon: FileText,  label: 'Documents Required',     value: `${mandatoryCount} required items`, bg: 'bg-violet-50', icon_color: 'text-violet-600'  },
//             { icon: Globe,     label: 'Application',            value: 'Online + Embassy',                 bg: 'bg-amber-50',  icon_color: 'text-amber-600'   },
//           ].map(({ icon: Icon, label, value, bg, icon_color }) => (
//             <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
//                 <Icon size={16} className={icon_color} />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
//                 <p className="text-xs font-extrabold text-slate-800 mt-0.5 leading-tight">{value}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* ── Left column ─── */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* Documents */}
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//                 <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
//                   <FileText size={16} className="text-blue-500" /> Required Documents
//                 </h2>
//                 <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
//                   {mandatoryCount} mandatory · {visa.documents.length - mandatoryCount} optional
//                 </span>
//               </div>
//               <div className="divide-y divide-slate-50">
//                 {visa.documents.map((doc, i) => (
//                   <div key={i} className={`flex items-start gap-3 px-6 py-4 ${doc.mandatory ? 'hover:bg-blue-50/30' : 'hover:bg-slate-50'} transition-colors`}>
//                     <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${doc.mandatory ? 'text-blue-500' : 'text-slate-300'}`} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-bold text-slate-800 flex items-center flex-wrap gap-2">
//                         {doc.name}
//                         <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
//                           doc.mandatory
//                             ? 'bg-blue-100 text-blue-700 border border-blue-200'
//                             : 'bg-slate-100 text-slate-500 border border-slate-200'
//                         }`}>
//                           {doc.mandatory ? 'Required' : 'Optional'}
//                         </span>
//                       </p>
//                       <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{doc.notes}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Rejection Reasons */}
//             <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
//               <h2 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
//                 <AlertCircle size={16} className="text-red-500" /> Common Rejection Reasons
//               </h2>
//               <ul className="space-y-2.5">
//                 {visa.rejectionReasons.map((r, i) => (
//                   <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-red-50 rounded-xl p-2.5 border border-red-100">
//                     <span className="text-red-500 mt-0.5 flex-shrink-0 font-bold">✗</span>
//                     {r}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//           </div>

//           {/* ── Right column ─── */}
//           <div className="space-y-4">

//             {/* Financial */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//               <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
//                 <DollarSign size={14} className="text-emerald-500" /> Financial Requirement
//               </h3>
//               <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 mb-3">
//                 <p className="text-xs font-bold text-emerald-800 mb-1">Minimum Bank Balance</p>
//                 <p className="text-xs text-emerald-700 leading-relaxed">{visa.bankBalance}</p>
//               </div>
//               <p className="text-[10px] text-slate-500">
//                 <strong>Period:</strong> {visa.bankPeriod}
//               </p>
//             </div>

//             {/* Embassy */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//               <h3 className="font-extrabold text-slate-900 text-sm mb-4">Embassy Contact</h3>
//               <div className="space-y-2.5 text-xs text-slate-600">
//                 <p className="font-bold text-slate-800 leading-snug">{visa.embassy.name}</p>
//                 <p className="flex items-start gap-2">
//                   <MapPin size={11} className="mt-0.5 text-slate-400 flex-shrink-0" />
//                   <span>{visa.embassy.address}</span>
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <Phone size={11} className="text-slate-400 flex-shrink-0" />
//                   <span>{visa.embassy.phone}</span>
//                 </p>
//                 <a href={`mailto:${visa.embassy.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
//                   <Globe size={11} className="flex-shrink-0" />
//                   <span className="truncate">{visa.embassy.email}</span>
//                 </a>
//               </div>
//               <a
//                 href={visa.embassy.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all w-full justify-center shadow-sm shadow-blue-200"
//               >
//                 <Globe size={13} /> Official Application Portal
//               </a>
//             </div>

//             {/* BD Notes */}
//             <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
//               <h3 className="font-extrabold text-amber-900 text-sm mb-3 flex items-center gap-2">
//                 🇧🇩 BD-Specific Notes
//               </h3>
//               <p className="text-xs text-amber-800 leading-relaxed">{visa.bdNotes}</p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

 