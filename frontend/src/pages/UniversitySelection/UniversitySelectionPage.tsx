import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import {
  Search, GraduationCap, Award, MapPin, Sparkles,
  BookmarkPlus, BookmarkCheck, SlidersHorizontal,
  X, ExternalLink, Loader2
} from 'lucide-react';
import { universitiesApi } from '../../services/api/universitiesApi';
import { dashboardApi } from '../../services/api/dashboardApi';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/Common/Modal';

const EXCHANGE_RATES: Record<string, number> = {
  AUD: 90.5, NZD: 70.3, EUR: 125.2, GBP: 148.4, USD: 117.8,
};

const COUNTRIES = ['All', 'Australia', 'New Zealand', 'Ireland', 'Finland'];
const SUBJECTS  = ['All', 'Computer Science', 'Data Science', 'Engineering', 'Business', 'AI'];

// Temporary static data until university research is complete
// Replace with real API data once seedUniversities.js is run with your research
const PLACEHOLDER_UNIS = [
  // ── NEW ZEALAND ──────────────────────────────────────────────────────────
  { _id:'nz1', name:'University of Auckland', city:'Auckland', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:65}, admission:{minGPA:3.0,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:43000,max:60000,currency:'NZD'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1.5 yrs'},{name:'Data Science',degree:'MSc',duration:'1.5 yrs'},{name:'Engineering',degree:'ME',duration:'2 yrs'}], scholarships:[{name:'International Student Excellence Scholarship',amount:'Up to NZD 10,000',eligibility:'Academic merit',link:'https://www.auckland.ac.nz/en/study/scholarships-and-awards.html'}], website:'https://www.auckland.ac.nz', howToApplyURL:'https://www.auckland.ac.nz/en/study/applications-and-admissions.html', intakeMonths:['February','July'] },
  { _id:'nz2', name:'University of Otago', city:'Dunedin', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:197}, admission:{minGPA:3.0,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:37000,max:50000,currency:'NZD'}}, programs:[{name:'Data Science',degree:'MAppSc',duration:'1.5 yrs'},{name:'Finance',degree:'MFin',duration:'1 yr'},{name:'Commerce',degree:'MCom',duration:'1 yr'}], scholarships:[{name:'International Excellence Scholarship',amount:'NZD 5,000–10,000',eligibility:'Academic merit',link:'https://www.otago.ac.nz/study/scholarships'}], website:'https://www.otago.ac.nz', howToApplyURL:'https://www.otago.ac.nz/study/how-to-apply', intakeMonths:['February','July'] },
  { _id:'nz3', name:'Massey University', city:'Palmerston North', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:230}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:34000,max:48000,currency:'NZD'}}, programs:[{name:'Data Analytics',degree:'MSc',duration:'1.5 yrs'},{name:'Management',degree:'MBA',duration:'1.5 yrs'},{name:'Engineering',degree:'ME',duration:'2 yrs'}], scholarships:[{name:'Massey International Excellence Award',amount:'NZD 3,000–8,000',eligibility:'Academic merit',link:'https://www.massey.ac.nz/fees-and-scholarships/scholarships/'}], website:'https://www.massey.ac.nz', howToApplyURL:'https://www.massey.ac.nz/study/apply/', intakeMonths:['February','July'] },
  { _id:'nz4', name:'Victoria University of Wellington', city:'Wellington', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:240}, admission:{minGPA:3.0,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:36000,max:52000,currency:'NZD'}}, programs:[{name:'Data Science',degree:'MSc',duration:'1.5 yrs'},{name:'Computer Science',degree:'MSc',duration:'1.5 yrs'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[{name:'Victoria Excellence Award',amount:'Up to NZD 10,000',eligibility:'International students with strong academic record',link:'https://www.wgtn.ac.nz/scholarships'}], website:'https://www.wgtn.ac.nz', howToApplyURL:'https://www.wgtn.ac.nz/study/enrolment-and-fees/enrolment/graduate-enrolment', intakeMonths:['February','July'] },
  { _id:'nz5', name:'University of Canterbury', city:'Christchurch', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:261}, admission:{minGPA:2.8,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:37000,max:53000,currency:'NZD'}}, programs:[{name:'Engineering',degree:'ME',duration:'2 yrs'},{name:'Computer Science',degree:'MSc',duration:'1.5 yrs'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[], website:'https://www.canterbury.ac.nz', howToApplyURL:'https://www.canterbury.ac.nz/study/apply-to-uc/', intakeMonths:['February','July'] },
  { _id:'nz6', name:'University of Waikato', city:'Hamilton', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:235}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:33000,max:46000,currency:'NZD'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1.5 yrs'},{name:'Business',degree:'MBA',duration:'1.5 yrs'},{name:'Data Analytics',degree:'MSc',duration:'1 yr'}], scholarships:[{name:'Waikato International Excellence Scholarship',amount:'NZD 3,000–5,000',eligibility:'Postgrad international students with B+ average',link:'https://www.waikato.ac.nz/study/scholarships/'}], website:'https://www.waikato.ac.nz', howToApplyURL:'https://www.waikato.ac.nz/study/apply/', intakeMonths:['February','July'] },
  { _id:'nz7', name:'Auckland University of Technology', city:'Auckland', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:410}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:35000,max:50000,currency:'NZD'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1.5 yrs'},{name:'Engineering',degree:'ME',duration:'2 yrs'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[{name:'AUT International Excellence Scholarship',amount:'NZD 5,000',eligibility:'Academic excellence',link:'https://www.aut.ac.nz/fees-and-scholarships/scholarships'}], website:'https://www.aut.ac.nz', howToApplyURL:'https://www.aut.ac.nz/applying-to-aut', intakeMonths:['February','July'] },
  { _id:'nz8', name:'Lincoln University', city:'Christchurch', country:{name:'New Zealand',flag:'🇳🇿',code:'NZ'}, ranking:{global:407}, admission:{minGPA:2.5,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-08-01',spring:'2027-03-01'}}, tuitionFees:{graduate:{min:32000,max:42000,currency:'NZD'}}, programs:[{name:'Agriculture',degree:'MSc',duration:'1.5 yrs'},{name:'Environmental Mgmt',degree:'MEm',duration:'1.5 yrs'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[], website:'https://www.lincoln.ac.nz', howToApplyURL:'https://www.lincoln.ac.nz/study/applying-to-lincoln/', intakeMonths:['February','July'] },

  // ── IRELAND ──────────────────────────────────────────────────────────────
  { _id:'ie1', name:'Trinity College Dublin', city:'Dublin', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:87}, admission:{minGPA:3.0,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-05-31'}}, tuitionFees:{graduate:{min:14000,max:40000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Data Science',degree:'MSc',duration:'1 yr'},{name:'AI',degree:'MSc',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[{name:'Trinity International Student Award',amount:'EUR 5,000',eligibility:'Academic merit',link:'https://www.tcd.ie/scholarships/postgraduate/'}], website:'https://www.tcd.ie', howToApplyURL:'https://www.tcd.ie/study/postgrad/how-to-apply/', intakeMonths:['September'] },
  { _id:'ie2', name:'University College Dublin', city:'Dublin', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:181}, admission:{minGPA:2.8,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:13000,max:25000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'AI',degree:'MSc',duration:'1 yr'},{name:'Data Analytics',degree:'MSc',duration:'1 yr'}], scholarships:[{name:'UCD Global Excellence Scholarship',amount:'EUR 2,000–7,500',eligibility:'Non-EU students — merit-based',link:'https://www.ucd.ie/global/scholarships/'}], website:'https://www.ucd.ie', howToApplyURL:'https://www.ucd.ie/graduateadmissions/howtoapply/', intakeMonths:['September'] },
  { _id:'ie3', name:'University College Cork', city:'Cork', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:303}, admission:{minGPA:2.8,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-05-31'}}, tuitionFees:{graduate:{min:13000,max:22000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Data Science',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'}], scholarships:[{name:'UCC International Student Scholarship',amount:'EUR 3,000',eligibility:'Non-EU first-class honours students',link:'https://www.ucc.ie/en/study/postgraduate/scholarships/'}], website:'https://www.ucc.ie', howToApplyURL:'https://www.ucc.ie/en/study/postgraduate/how-to-apply/', intakeMonths:['September'] },
  { _id:'ie4', name:'University of Galway', city:'Galway', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:290}, admission:{minGPA:2.8,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-05-31'}}, tuitionFees:{graduate:{min:12000,max:22000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Data Science',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'}], scholarships:[{name:'College of Science & Engineering Scholarship',amount:'EUR 3,000',eligibility:'International Science/Engineering postgrad students',link:'https://www.universityofgalway.ie/scholarships-and-bursaries/'}], website:'https://www.universityofgalway.ie', howToApplyURL:'https://www.universityofgalway.ie/courses/how-to-apply/', intakeMonths:['September'] },
  { _id:'ie5', name:'University of Limerick', city:'Limerick', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:601}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:11000,max:20000,currency:'EUR'}}, programs:[{name:'Engineering',degree:'ME',duration:'1 yr'},{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[{name:'UL International Scholarship',amount:'EUR 3,000',eligibility:'Non-EU postgraduate taught students',link:'https://www.ul.ie/international/scholarships'}], website:'https://www.ul.ie', howToApplyURL:'https://www.ul.ie/gsp/applying-ul', intakeMonths:['September'] },
  { _id:'ie6', name:'Dublin City University', city:'Dublin', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:501}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:11000,max:20000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Data Analytics',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'}], scholarships:[], website:'https://www.dcu.ie', howToApplyURL:'https://www.dcu.ie/international/applying-for-admission', intakeMonths:['September'] },
  { _id:'ie7', name:'Maynooth University', city:'Maynooth', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:701}, admission:{minGPA:2.5,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:9000,max:18000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'1 yr'},{name:'Data Science',degree:'MSc',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[{name:'Maynooth Postgraduate Scholarship',amount:'EUR 2,000',eligibility:'First-class honours international applicants',link:'https://www.maynoothuniversity.ie/study-maynooth/postgraduate-students/scholarships'}], website:'https://www.maynoothuniversity.ie', howToApplyURL:'https://www.maynoothuniversity.ie/study-maynooth/postgraduate-students/how-apply', intakeMonths:['September'] },
  { _id:'ie8', name:'Technological University Dublin', city:'Dublin', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:null}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:8000,max:16000,currency:'EUR'}}, programs:[{name:'Computing',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[], website:'https://www.tudublin.ie', howToApplyURL:'https://www.tudublin.ie/study/international-students/applying-to-tu-dublin/', intakeMonths:['September'] },
  { _id:'ie9', name:'South East Technological University', city:'Waterford', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:null}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:7500,max:15000,currency:'EUR'}}, programs:[{name:'Computing',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[], website:'https://www.setu.ie', howToApplyURL:'https://www.setu.ie/international/how-to-apply', intakeMonths:['September'] },
  { _id:'ie10', name:'Atlantic Technological University', city:'Sligo', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:null}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:7500,max:14000,currency:'EUR'}}, programs:[{name:'Computing',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'}], scholarships:[], website:'https://www.atu.ie', howToApplyURL:'https://www.atu.ie/international/how-to-apply', intakeMonths:['September'] },
  { _id:'ie11', name:'Munster Technological University', city:'Cork', country:{name:'Ireland',flag:'🇮🇪',code:'IE'}, ranking:{global:null}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-06-30'}}, tuitionFees:{graduate:{min:7500,max:15000,currency:'EUR'}}, programs:[{name:'Computing',degree:'MSc',duration:'1 yr'},{name:'Engineering',degree:'ME',duration:'1 yr'},{name:'Business',degree:'MBA',duration:'1 yr'}], scholarships:[], website:'https://www.mtu.ie', howToApplyURL:'https://www.mtu.ie/international/how-to-apply/', intakeMonths:['September'] },

  // ── FINLAND ───────────────────────────────────────────────────────────────
  { _id:'fi1', name:'University of Helsinki', city:'Helsinki', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:107}, admission:{minGPA:2.8,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:13000,max:18000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Data Science',degree:'MSc',duration:'2 yrs'},{name:'Life Sciences',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'University of Helsinki Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA students with excellent academic record',link:'https://www.helsinki.fi/en/admissions-and-education/scholarships'}], website:'https://www.helsinki.fi', howToApplyURL:'https://www.helsinki.fi/en/admissions-and-education/apply-bachelors-and-masters-programmes', intakeMonths:['September'] },
  { _id:'fi2', name:'Aalto University', city:'Espoo', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:119}, admission:{minGPA:3.0,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:12000,max:16000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Data Science',degree:'MSc',duration:'2 yrs'},{name:'Engineering',degree:'MSc',duration:'2 yrs'},{name:'Business',degree:'MBA',duration:'2 yrs'}], scholarships:[{name:'Aalto University Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA students by academic merit',link:'https://www.aalto.fi/en/study-at-aalto/scholarships'}], website:'https://www.aalto.fi', howToApplyURL:'https://www.aalto.fi/en/study-at-aalto/applying-to-masters-programmes', intakeMonths:['September'] },
  { _id:'fi3', name:'Tampere University', city:'Tampere', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:351}, admission:{minGPA:2.7,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:12000,max:16000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Engineering',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'Tampere University Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU students in English-taught Masters',link:'https://www.tuni.fi/en/study-with-us/applying/fees-and-scholarships'}], website:'https://www.tuni.fi', howToApplyURL:'https://www.tuni.fi/en/study-with-us/applying/how-to-apply-masters', intakeMonths:['September'] },
  { _id:'fi4', name:'University of Oulu', city:'Oulu', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:401}, admission:{minGPA:2.7,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:16000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Engineering',degree:'MSc',duration:'2 yrs'},{name:'Wireless Comm',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'University of Oulu Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA international Masters students',link:'https://www.oulu.fi/en/for-students/applying/scholarships-and-grants'}], website:'https://www.oulu.fi', howToApplyURL:'https://www.oulu.fi/en/for-students/applying/applying-masters-programme', intakeMonths:['September'] },
  { _id:'fi5', name:'University of Turku', city:'Turku', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:451}, admission:{minGPA:2.7,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:16000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Bioinformatics',degree:'MSc',duration:'2 yrs'},{name:'Business',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'UTU Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA students with min B+ average',link:'https://www.utu.fi/en/university/come-and-study-at-utu/scholarships'}], website:'https://www.utu.fi', howToApplyURL:'https://www.utu.fi/en/university/come-and-study-at-utu/applying-for-admission', intakeMonths:['September'] },
  { _id:'fi6', name:'University of Eastern Finland', city:'Joensuu', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:601}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:15000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Environmental Sci',degree:'MSc',duration:'2 yrs'},{name:'Business',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'UEF Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA Masters students by academic merit',link:'https://www.uef.fi/en/scholarship-programme'}], website:'https://www.uef.fi', howToApplyURL:'https://www.uef.fi/en/how-to-apply', intakeMonths:['September'] },
  { _id:'fi7', name:'LUT University', city:'Lappeenranta', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:651}, admission:{minGPA:2.7,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:16000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Engineering',degree:'MSc',duration:'2 yrs'},{name:'Business Analytics',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'LUT Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA — automatic evaluation on application',link:'https://www.lut.fi/en/study/applying/tuition-fees-and-scholarship'}], website:'https://www.lut.fi', howToApplyURL:'https://www.lut.fi/en/study/applying/how-to-apply', intakeMonths:['September'] },
  { _id:'fi8', name:'University of Jyväskylä', city:'Jyväskylä', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:601}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:15000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Education',degree:'MEd',duration:'2 yrs'},{name:'Business',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'JYU Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA Masters students by merit',link:'https://www.jyu.fi/en/study-and-research/study-at-jyu/scholarships'}], website:'https://www.jyu.fi', howToApplyURL:'https://www.jyu.fi/en/study-and-research/study-at-jyu/how-to-apply', intakeMonths:['September'] },
  { _id:'fi9', name:'Åbo Akademi University', city:'Turku', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:801}, admission:{minGPA:2.5,minIELTS:6.0,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-20'}}, tuitionFees:{graduate:{min:10000,max:15000,currency:'EUR'}}, programs:[{name:'Computer Science',degree:'MSc',duration:'2 yrs'},{name:'Engineering',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'ÅAU Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA international applicants',link:'https://www.abo.fi/en/scholarships/'}], website:'https://www.abo.fi', howToApplyURL:'https://www.abo.fi/en/applying/', intakeMonths:['September'] },
  { _id:'fi10', name:'Hanken School of Economics', city:'Helsinki', country:{name:'Finland',flag:'🇫🇮',code:'FI'}, ranking:{global:null}, admission:{minGPA:2.7,minIELTS:6.5,backlogsAccepted:true,applicationDeadlines:{fall:'2027-01-31'}}, tuitionFees:{graduate:{min:12000,max:16000,currency:'EUR'}}, programs:[{name:'Business',degree:'MSc',duration:'2 yrs'},{name:'Finance',degree:'MSc',duration:'2 yrs'},{name:'Marketing',degree:'MSc',duration:'2 yrs'}], scholarships:[{name:'Hanken Scholarship',amount:'50–100% tuition waiver',eligibility:'Non-EU/EEA students — merit based',link:'https://www.hanken.fi/en/admission/masters-programs/scholarships'}], website:'https://www.hanken.fi', howToApplyURL:'https://www.hanken.fi/en/admission/masters-programs/how-apply', intakeMonths:['September'] },
] as const;

type UniRecord = typeof PLACEHOLDER_UNIS[number];

export default function UniversitySelectionPage() {
  const { user, refreshUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [subject, setSubject] = useState('All');
  const [userGPA, setUserGPA] = useState('');
  const [userIELTS, setUserIELTS] = useState('');
  const [onlyScholarships, setOnlyScholarships] = useState(false);
  const [showBDT, setShowBDT] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedUni, setSelectedUni] = useState<UniRecord | null>(null);

  // Try real API first, fall back to placeholder data
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['universities'],
    queryFn: universitiesApi.getAll,
    retry: 1,
  });

  const shortlistMutation = useMutation({
    mutationFn: (id: string) => universitiesApi.shortlist(id),
    onSuccess: async () => {
      // Refresh user from server to get populated shortlisted universities
      await refreshUser();
    },
  });

  const bookmarkScholarshipMutation = useMutation({
    mutationFn: (data: { universityId: string, scholarshipId: string }) => dashboardApi.bookmarkScholarship(data),
    onSuccess: async () => {
      await refreshUser();
    },
  });

  const rawList: UniRecord[] = (apiData?.data?.length > 0 ? apiData.data : PLACEHOLDER_UNIS) as UniRecord[];

  const filtered = rawList.filter(u => {
    const c = u.country as { name: string };
    if (country !== 'All' && c.name !== country) return false;
    if (userGPA && u.admission.minGPA > parseFloat(userGPA)) return false;
    if (userIELTS && u.admission.minIELTS > parseFloat(userIELTS)) return false;
    if (onlyScholarships && u.scholarships.length === 0) return false;
    if (subject !== 'All' && !u.programs.some(p => p.name.toLowerCase().includes(subject.toLowerCase()))) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const isShortlisted = (id: string) =>
    user?.targetUniversities?.some((u: { _id?: string } | string) =>
      (typeof u === 'string' ? u : u?._id) === id
    );

  const isScholarshipBookmarked = (scholarshipId: string) =>
    user?.bookmarkedScholarships?.some((b: { scholarshipId: string }) => b.scholarshipId === scholarshipId);

  const formatTuition = (min: number, currency: string) => {
    if (min === 0) return '🆓 Free';
    if (showBDT) {
      const bdt = min * (EXCHANGE_RATES[currency] || 100);
      return `৳${(bdt / 100000).toFixed(1)}L/yr`;
    }
    return `${currency} ${min.toLocaleString()}/yr`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-xs font-semibold text-violet-700 mb-2">
              <Sparkles size={11} /> University Matcher — V1 (AU · NZ · IE · FI)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Find Universities</h1>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} universities · Each card links to the official application portal</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBDT(!showBDT)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${showBDT ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {showBDT ? '৳ BDT Mode' : 'Show in BDT ৳'}
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
              <SlidersHorizontal size={13} /> {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Filter by eligibility</h3>
              <button onClick={() => { setCountry('All'); setSubject('All'); setUserGPA(''); setUserIELTS(''); setOnlyScholarships(false); }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer">
                <X size={12} /> Reset
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Field of Study</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Your CGPA</label>
                <input type="number" step="0.1" placeholder="e.g. 3.3" value={userGPA} onChange={e => setUserGPA(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">IELTS Score</label>
                <input type="number" step="0.5" placeholder="e.g. 6.5" value={userIELTS} onChange={e => setUserIELTS(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-end pb-1.5">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" checked={onlyScholarships} onChange={() => setOnlyScholarships(!onlyScholarships)} className="w-4 h-4 accent-blue-600 rounded" />
                  Scholarships only
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by university name or city..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-slate-200">
                <GraduationCap size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No universities match your filters.</p>
                <button onClick={() => { setCountry('All'); setSubject('All'); setUserGPA(''); setUserIELTS(''); setOnlyScholarships(false); setSearch(''); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">Reset filters</button>
              </div>
            ) : filtered.map(uni => {
              const c = uni.country as { name: string; flag: string };
              const fees = uni.tuitionFees.graduate;
              const shortlisted = isShortlisted(uni._id);
              return (
                <div key={uni._id} onClick={() => setSelectedUni(uni)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{c.flag}</span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{uni.name}</h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-blue-400" /> {uni.city}, {c.name}
                          </span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); shortlistMutation.mutate(uni._id); }}
                        className={`p-1.5 rounded-lg transition-all ${shortlisted ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'}`}>
                        {shortlisted ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">QS Rank</p>
                        <p className="text-sm font-bold text-slate-800">#{uni.ranking.global}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Tuition/yr</p>
                        <p className="text-xs font-bold text-slate-800">{formatTuition(fees.min, fees.currency)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {uni.programs.slice(0, 3).map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-medium rounded-lg">{p.name}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                        <span>GPA {uni.admission.minGPA}+</span>
                        <span>IELTS {uni.admission.minIELTS}+</span>
                      </div>
                      {uni.scholarships.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                          <Award size={10} /> Scholarship
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedUni} onClose={() => setSelectedUni(null)} title={selectedUni?.name}>
        {selectedUni && (() => {
          const fees = selectedUni.tuitionFees.graduate as { min: number; max?: number; currency: string };
          const c = selectedUni.country as { name: string; flag: string };
          const deadlines = selectedUni.admission.applicationDeadlines as { fall?: string; spring?: string } | undefined;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <p className="text-xs text-slate-500">{selectedUni.city}, {c.name}</p>
                  <p className="text-xs font-bold text-slate-600">QS Rank #{selectedUni.ranking.global}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Min CGPA</p>
                  <p className="text-base font-bold text-blue-600">{selectedUni.admission.minGPA}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Min IELTS</p>
                  <p className="text-base font-bold text-indigo-600">{selectedUni.admission.minIELTS}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Backlogs</p>
                  <p className="text-base font-bold text-slate-800">{selectedUni.admission.backlogsAccepted ? 'Accepted' : 'No'}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-800">Annual Tuition</p>
                <p className="text-base font-bold text-blue-900">
                  {fees.min === 0 ? '🆓 Free / Semester fees only' : `${fees.currency} ${fees.min.toLocaleString()} – ${(fees.max || fees.min).toLocaleString()}`}
                </p>
                {showBDT && fees.min > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    ≈ ৳{((fees.min * (EXCHANGE_RATES[fees.currency] || 100)) / 100000).toFixed(1)}L – ৳{(((fees.max || fees.min) * (EXCHANGE_RATES[fees.currency] || 100)) / 100000).toFixed(1)}L BDT
                  </p>
                )}
              </div>

              {/* Intake deadlines */}
              {(deadlines?.fall || deadlines?.spring) && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-800 mb-1.5">Application Deadlines</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {deadlines?.fall && (
                      <div><p className="text-amber-600 font-bold">Fall intake</p><p className="text-amber-800">{new Date(deadlines.fall).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                    )}
                    {deadlines?.spring && (
                      <div><p className="text-amber-600 font-bold">Spring intake</p><p className="text-amber-800">{new Date(deadlines.spring).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Programs</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUni.programs.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <GraduationCap size={12} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        {'degree' in p && 'duration' in p && <p className="text-[10px] text-slate-400">{(p as {degree:string;duration:string}).degree} · {(p as {degree:string;duration:string}).duration}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUni.scholarships.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Scholarships Available</p>
                  {selectedUni.scholarships.map((sch: any) => {
                    const bookmarked = isScholarshipBookmarked(sch._id);
                    return (
                      <div key={sch._id || sch.name} className="flex items-center justify-between mt-2 p-2 bg-white rounded-lg border border-emerald-100">
                        <div>
                          <p className="text-xs font-bold text-emerald-700">{sch.name}</p>
                          {sch.amount && <p className="text-[10px] text-emerald-600 mt-0.5">Amount: {sch.amount}</p>}
                        </div>
                        {sch._id && (
                          <button
                            onClick={() => bookmarkScholarshipMutation.mutate({ universityId: selectedUni._id, scholarshipId: sch._id })}
                            className={`p-1.5 rounded-lg transition-all ${bookmarked ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                            title="Bookmark Scholarship"
                          >
                            {bookmarked ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action buttons — real URLs */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <a href={selectedUni.website} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  <ExternalLink size={13} /> Visit Website
                </a>
                <a href={selectedUni.howToApplyURL} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all">
                  <ExternalLink size={13} /> How to Apply
                </a>
                <button onClick={() => { shortlistMutation.mutate(selectedUni._id); setSelectedUni(null); }}
                  className="px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer">
                  {isShortlisted(selectedUni._id) ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}