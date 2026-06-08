// import React from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../components/Common/Button';
// import Card from '../../components/Common/Card';
// import { GraduationCap, ShieldCheck, DollarSign, ArrowRight, CheckCircle2, Landmark, HelpCircle, MapPin, Scale } from 'lucide-react';

// export default function HomePage() {
//   const navigate = useNavigate();

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.15, delayChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
//   };

//   // 8 Target Countries (Sweden replaced with Ireland)
//   const targetCountries = [
//     { name: "Canada", code: "CA", cost: "BDT 12-22 Lakhs/Yr", language: "English/French", pr: "Excellent (Express Entry)", color: "border-red-200 hover:border-red-400" },
//     { name: "United Kingdom", code: "GB", cost: "BDT 15-26 Lakhs/Yr", language: "English", pr: "Moderate (Graduate Route)", color: "border-blue-200 hover:border-blue-400" },
//     { name: "United States", code: "US", cost: "BDT 18-35 Lakhs/Yr", language: "English", pr: "Complex (H-1B to EB)", color: "border-indigo-200 hover:border-indigo-400" },
//     { name: "Australia", code: "AU", cost: "BDT 16-28 Lakhs/Yr", language: "English", pr: "Very Good (GSM Pathway)", color: "border-amber-200 hover:border-amber-400" },
//     { name: "Germany", code: "DE", cost: "BDT 0-11 Lakhs/Yr (Tuition Free)", language: "German/English", pr: "Excellent (EU Blue Card)", color: "border-orange-200 hover:border-orange-400" },
//     { name: "Japan", code: "JP", cost: "BDT 8-15 Lakhs/Yr", language: "Japanese", pr: "Good (Highly Skilled)", color: "border-red-100 hover:border-red-300" },
//     { name: "Ireland", code: "IE", cost: "BDT 12-22 Lakhs/Yr", language: "English", pr: "Good (Critical Skills)", color: "border-emerald-200 hover:border-emerald-400" },
//     { name: "Finland", code: "FI", cost: "BDT 10-18 Lakhs/Yr", language: "Finnish/English", pr: "Very Good (Post-Grad PR)", color: "border-cyan-200 hover:border-cyan-400" }
//   ];

//   const features = [
//     {
//       title: "100% Direct Application Process",
//       desc: "Traditional student agencies charge BDT 1 to 3 Lakhs in hidden fees. PathFinder equips you to apply directly to target universities yourself, retaining full control of your academic destiny.",
//       icon: DollarSign,
//       color: "text-blue-600 bg-blue-50"
//     },
//     {
//       title: "AI Document Matcher & Templates",
//       desc: "Generate professional Statements of Purpose (SOPs), Letter of Recommendation (LOR) drafts, and Gap Explanations customized to meet stringent visa success ratios.",
//       icon: ShieldCheck,
//       color: "text-indigo-600 bg-indigo-50"
//     },
//     {
//       title: "Authentic & Verified BDT Cost Calculators",
//       desc: "Calculate complete tuition fees, mandatory health insurance premiums, university deposits, and actual monthly living costs meticulously converted to BDT.",
//       icon: GraduationCap,
//       color: "text-emerald-600 bg-emerald-50"
//     }
//   ];

//   const whyChooseUs = [
//     "No middleman markup - submit your fees directly to the university.",
//     "Verified step-by-step visa checklist tailored for Bangladeshi applicants.",
//     "Access actual admissions data, real-time scholarship deadlines, and score prerequisites.",
//     "Generate custom study-gap justification letters instantly."
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 animated-bg pt-24 relative overflow-hidden flex flex-col justify-between">
      
//       {/* Background soft color panels */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[100px] rounded-full pointer-events-none" />

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
//         {/* Left Hero Text */}
//         <motion.div 
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//           className="flex flex-col gap-6 lg:col-span-7"
//         >
//           <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 w-fit">
//             <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
//             Designed for Bangladeshi Aspiring Scholars
//           </motion.div>

//           <motion.h1 
//             variants={itemVariants} 
//             className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900"
//           >
//             Study abroad <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700">
//               without agency fees.
//             </span>
//           </motion.h1>

//           <motion.p variants={itemVariants} className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
//             Stop paying lakhs to middlemen. PathFinder gives you the roadmap, dynamic document generator, and direct university matching systems to handle your own admissions and student visa processing flawlessly.
//           </motion.p>

//           <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
//             <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
//               Start Your Journey <ArrowRight size={16} className="ml-2" />
//             </Button>
//             <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
//               Explore Destinational Roadmaps
//             </Button>
//           </motion.div>

//           {/* Quick value tags */}
//           <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-200 pt-6">
//             <div>
//               <p className="text-2xl font-bold text-slate-900">8+</p>
//               <p className="text-xs text-slate-500 font-medium">Verified Countries</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-slate-900">100%</p>
//               <p className="text-xs text-slate-500 font-medium">Direct Admissions</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-slate-900">BDT 0</p>
//               <p className="text-xs text-slate-500 font-medium">Agency Charges</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-slate-900">24/7</p>
//               <p className="text-xs text-slate-500 font-medium">Admissions Assistant</p>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Right Hero Image/Graphic panel (Static & Clean Realistic representation of active countries) */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ type: 'spring', damping: 20, delay: 0.3 }}
//           className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative"
//         >
//           <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 flex items-center gap-1">
//             <MapPin size={12} /> Target Destinations
//           </div>
//           <h3 className="text-md font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
//             <Landmark className="text-blue-600" size={16} /> Clean Roadmap Scope
//           </h3>
//           <p className="text-xs text-slate-500 mb-4">Select from our 8 verified partner-level target destinations once logged in:</p>
//           <div className="grid grid-cols-2 gap-3">
//             {targetCountries.map((c, i) => (
//               <div 
//                 key={i} 
//                 className={`p-3 rounded-xl border bg-slate-50 transition-all duration-200 text-left ${c.color}`}
//               >
//                 <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
//                   <span className="w-2 h-2 rounded-full bg-blue-500" />
//                   {c.name}
//                 </p>
//                 <p className="text-[10px] text-slate-500 mt-1">{c.cost}</p>
//                 <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">{c.pr}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
//             <p className="text-xs font-semibold text-blue-700">All student resources are securely locked behind authentication.</p>
//           </div>
//         </motion.div>
//       </div>

//       {/* Feature section */}
//       <div className="bg-white border-t border-slate-200 py-20 relative z-10">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Core Pillars</span>
//             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Empowering Independent Candidates</h2>
//             <p className="text-slate-500 text-sm mt-3">All tools, resources, and templates needed to secure an offer letter and complete visa processing successfully.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {features.map((f, i) => {
//               const Icon = f.icon;
//               return (
//                 <Card key={i} className="relative overflow-hidden group hover:border-blue-200 hover:shadow-md">
//                   <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-6`}>
//                     <Icon size={22} />
//                   </div>
//                   <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
//                   <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Why Choose Us & Legal Info */}
//       <div className="bg-slate-50 border-t border-b border-slate-200 py-20 relative z-10">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Our Promise</span>
//             <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-6">Why Bangladeshi Students Choose PathFinder</h2>
//             <div className="flex flex-col gap-4">
//               {whyChooseUs.map((item, i) => (
//                 <div key={i} className="flex gap-3 items-start">
//                   <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
//                   <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
//             <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
//               <Scale size={18} className="text-blue-600" /> Transparent & Compliant Framework
//             </h3>
//             <p className="text-xs text-slate-600 leading-relaxed mb-4">
//               PathFinder operates under standard digital services compliance guidelines. We are not a travel agency, nor do we submit false documentation on behalf of scholars. 
//             </p>
//             <p className="text-xs text-slate-600 leading-relaxed mb-4">
//               All financial calculators, IELTS assessment modules, and visa checklist parameters serve as reference models for personal application submission. By using PathFinder, you agree to act in good faith and submit only genuine personal records to high commissions and foreign universities.
//             </p>
//             <div className="h-[1px] bg-slate-100 my-4" />
//             <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
//               <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
//               <span>•</span>
//               <span className="hover:text-blue-600 cursor-pointer">Privacy Protocol</span>
//               <span>•</span>
//               <span className="hover:text-blue-600 cursor-pointer">Admissions Disclosure</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-slate-200 py-10 relative z-10">
//         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
//               <GraduationCap size={16} />
//             </div>
//             <span className="font-extrabold text-sm text-slate-900 tracking-tight">PathFinder BD</span>
//           </div>
//           <p className="text-xs text-slate-500 text-center">
//             © {new Date().getFullYear()} PathFinder. Developed independently to empower students. All rights reserved.
//           </p>
//           <div className="flex gap-4 text-xs font-bold text-slate-400">
//             <span className="hover:text-slate-600 cursor-pointer">Bangladesh Office</span>
//             <span>•</span>
//             <span className="hover:text-slate-600 cursor-pointer">Contact Support</span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
