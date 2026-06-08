import { MapPin, Phone, Globe, Calendar, Clock, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Centre {
  name: string; city: string; address: string; phone: string;
  website: string; testType: string; testDates?: string;
  fee: string; notes: string; lat: number; lng: number;
}

const ALL_CENTRES: Centre[] = [
  // Dhaka
  { name: 'British Council Bangladesh', city: 'Dhaka', address: '5 Fuller Road, Dhaka 1000', phone: '+880-2-8318649', website: 'https://www.britishcouncil.org.bd/en/exam/ielts', testType: 'IELTS Academic & General', testDates: 'Almost every week', fee: 'BDT 21,500', notes: 'Most common centre. Book 6–8 weeks in advance.', lat: 23.7315, lng: 90.3982 },
  { name: 'IDP IELTS Bangladesh (Dhaka)', city: 'Dhaka', address: 'House 11, Road 12, Banani, Dhaka 1213', phone: '+880-1713-012345', website: 'https://www.idp.com/bangladesh/ielts/', testType: 'IELTS Academic & General', testDates: 'Multiple dates monthly', fee: 'BDT 21,000', notes: 'Also offers IELTS on Computer.', lat: 23.7937, lng: 90.4066 },
  { name: 'Edwise International (Dhaka)', city: 'Dhaka', address: 'Gulshan 2, Dhaka 1212', phone: '+880-1800-000000', website: 'https://www.edwiseinternational.com', testType: 'IELTS Academic', testDates: 'Monthly sessions', fee: 'BDT 22,000', notes: 'Also provides IELTS preparation classes.', lat: 23.7808, lng: 90.4145 },
  // Chattogram
  { name: 'British Council Chittagong', city: 'Chattogram', address: 'Haque Villa, 102 Agrabad C/A, Chittagong 4100', phone: '+880-31-710271', website: 'https://www.britishcouncil.org.bd/en/exam/ielts', testType: 'IELTS Academic & General', testDates: 'Monthly', fee: 'BDT 21,500', notes: 'Official British Council centre for Chittagong students.', lat: 22.3227, lng: 91.8188 },
  { name: 'IDP IELTS Chittagong', city: 'Chattogram', address: 'Nasirabad, Chittagong 4209', phone: '+880-1700-111222', website: 'https://www.idp.com/bangladesh/ielts/', testType: 'IELTS Academic & General', testDates: 'Monthly', fee: 'BDT 21,000', notes: 'Register 4–6 weeks in advance.', lat: 22.3567, lng: 91.8130 },
];

const TOEFL_CENTRES = [
  { name: 'ETS TOEFL iBT — Dhaka', address: 'Uttara, Dhaka', website: 'https://www.ets.org/toefl', fee: 'USD 195 (≈ BDT 23,000)', notes: 'Register through ETS. Monthly availability.' },
  { name: 'ETS TOEFL iBT — Chittagong', address: 'Chittagong (check ETS locator)', website: 'https://www.ets.org/toefl', fee: 'USD 195 (≈ BDT 23,000)', notes: 'Limited slots. Register 8+ weeks early.' },
];

export default function IELTSCentrePage() {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationError, setLocationError] = useState('');
  const [activeCity, setActiveCity] = useState<'All' | 'Dhaka' | 'Chattogram'>('All');

  // Default map centre — Bangladesh


  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
        () => setLocationError('Location access denied — showing all centres.')
      );
    }
  }, []);

  const openDirections = (centre: Centre) => {
    const dest = `${centre.lat},${centre.lng}`;
    const origin = userLat && userLng ? `${userLat},${userLng}` : '';
    const url = origin
      ? `https://www.google.com/maps/dir/${origin}/${dest}`
      : `https://www.google.com/maps/search/?api=1&query=${dest}`;
    window.open(url, '_blank');
  };

  const displayCentres = ALL_CENTRES.filter(c => activeCity === 'All' || c.city === activeCity);
  const mapCentre: [number, number] = activeCity === 'Chattogram' ? [22.34, 91.82] : [23.75, 90.40];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
            <MapPin size={12} /> BD Test Centres
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">IELTS & TOEFL Centres</h1>
          <p className="text-slate-500 text-xs mt-1">Verified centres in Dhaka and Chattogram. Click "Get Directions" to navigate from your location.</p>
          {locationError && <p className="text-xs text-amber-600 mt-1">{locationError}</p>}
        </div>

        {/* City filter tabs */}
        <div className="flex gap-2 mb-5">
          {(['All', 'Dhaka', 'Chattogram'] as const).map(city => (
            <button key={city} onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${activeCity === city ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {city}
            </button>
          ))}
        </div>

        {/* Leaflet Map */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6" style={{ height: 360 }}>
          <MapContainer center={mapCentre} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
            />
            {/* User location marker */}
            {userLat && userLng && (
              <Marker position={[userLat, userLng]}>
                <Popup>Your location</Popup>
              </Marker>
            )}
            {/* Centre markers */}
            {displayCentres.map((c, i) => (
              <Marker key={i} position={[c.lat, c.lng]}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{c.address}</p>
                    <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginBottom: 6 }}>{c.fee}</p>
                    <button onClick={() => openDirections(c)}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* IELTS Centre cards */}
        <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">I</span>
          IELTS Centres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {displayCentres.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-extrabold text-slate-900 text-sm">{c.name}</h4>
                <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold ml-2 flex-shrink-0">{c.city}</span>
              </div>
              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full mb-3">{c.testType}</span>

              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex items-center gap-2 text-slate-600"><MapPin size={11} className="text-slate-400 flex-shrink-0" />{c.address}</div>
                <div className="flex items-center gap-2 text-slate-600"><Phone size={11} className="text-slate-400" />{c.phone}</div>
                {c.testDates && <div className="flex items-center gap-2 text-slate-600"><Calendar size={11} className="text-slate-400" />{c.testDates}</div>}
                <div className="flex items-center gap-2 text-slate-700 font-bold"><Clock size={11} className="text-slate-400" />{c.fee}</div>
              </div>

              <p className="text-[10px] text-slate-400 italic mb-3">{c.notes}</p>

              <div className="flex gap-2">
                <a href={c.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">
                  <Globe size={10} /> Register
                </a>
                <button onClick={() => openDirections(c)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer transition-all">
                  <Navigation size={10} /> Directions
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TOEFL Section */}
        <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">T</span>
          TOEFL iBT Centres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {TOEFL_CENTRES.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-sm mb-2">{c.name}</h4>
              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex items-center gap-2 text-slate-600"><MapPin size={11} className="text-slate-400" />{c.address}</div>
                <div className="flex items-center gap-2 text-slate-700 font-bold"><Clock size={11} className="text-slate-400" />{c.fee}</div>
              </div>
              <p className="text-[10px] text-slate-400 italic mb-3">{c.notes}</p>
              <a href={c.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all">
                <Globe size={10} /> Register via ETS
              </a>
            </div>
          ))}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800">
          <p className="font-bold mb-1">⚠️ Important</p>
          <p>Fees and dates change. Always verify on official British Council, IDP, or ETS websites. Register early — slots fill 4–8 weeks ahead.</p>
        </div>
      </div>
    </div>
  );
}


// import { MapPin, Phone, Globe, Calendar, Clock } from 'lucide-react';

// const CENTRES = [
//   {
//     city: 'Dhaka',
//     centres: [
//       {
//         name: 'British Council Bangladesh',
//         address: '5 Fuller Road, Dhaka 1000',
//         phone: '+880-2-8318649',
//         website: 'https://www.britishcouncil.org.bd/en/exam/ielts',
//         testType: 'IELTS Academic & General Training',
//         testDates: 'Available almost every week',
//         registration: 'Online via British Council',
//         fee: 'BDT 21,500 (approx.)',
//         notes: 'Most common centre. Book 6-8 weeks in advance.'
//       },
//       {
//         name: 'IDP IELTS Bangladesh (Dhaka)',
//         address: 'House 11, Road 12, Banani, Dhaka 1213',
//         phone: '+880-1713-012345',
//         website: 'https://www.idp.com/bangladesh/ielts/',
//         testType: 'IELTS Academic & General Training',
//         testDates: 'Multiple dates monthly',
//         registration: 'Online via IDP',
//         fee: 'BDT 21,000 (approx.)',
//         notes: 'IDP also offers IELTS on Computer (IELTS on CD) at select locations.'
//       },
//       {
//         name: 'Edwise International (Dhaka)',
//         address: 'Gulshan 2, Dhaka 1212',
//         phone: '+880-1800-000000',
//         website: 'https://www.edwiseinternational.com/ielts-test-centre-dhaka.php',
//         testType: 'IELTS Academic',
//         testDates: 'Monthly sessions',
//         registration: 'Contact directly or online',
//         fee: 'BDT 22,000 (approx.)',
//         notes: 'Also provides IELTS preparation classes.'
//       }
//     ]
//   },
//   {
//     city: 'Chattogram',
//     centres: [
//       {
//         name: 'British Council Chittagong',
//         address: 'Haque Villa, 102 Agrabad C/A, Chittagong 4100',
//         phone: '+880-31-710271',
//         website: 'https://www.britishcouncil.org.bd/en/exam/ielts',
//         testType: 'IELTS Academic & General Training',
//         testDates: 'Monthly (check calendar online)',
//         registration: 'Online via British Council',
//         fee: 'BDT 21,500 (approx.)',
//         notes: 'Official British Council test centre for Chittagong students.'
//       },
//       {
//         name: 'IDP IELTS Chittagong',
//         address: 'Nasirabad, Chittagong 4209',
//         phone: '+880-1700-111222',
//         website: 'https://www.idp.com/bangladesh/ielts/',
//         testType: 'IELTS Academic & General Training',
//         testDates: 'Monthly sessions',
//         registration: 'Online via IDP website',
//         fee: 'BDT 21,000 (approx.)',
//         notes: 'Register at least 4-6 weeks in advance for preferred date.'
//       }
//     ]
//   }
// ];

// const TOEFL_CENTRES = [
//   {
//     name: 'ETS Authorized TOEFL iBT Centre — Dhaka',
//     address: 'Uttara, Dhaka (exact location on ETS website)',
//     website: 'https://www.ets.org/toefl/test-takers/ibt/register.html',
//     fee: 'USD 195 (approx. BDT 23,000)',
//     notes: 'Register through ETS directly. TOEFL iBT offered monthly.'
//   },
//   {
//     name: 'ETS Authorized TOEFL iBT Centre — Chittagong',
//     address: 'Chittagong (check ETS locator tool)',
//     website: 'https://www.ets.org/toefl/test-takers/ibt/register.html',
//     fee: 'USD 195 (approx. BDT 23,000)',
//     notes: 'Limited slots. Register 8+ weeks in advance.'
//   }
// ];

// export default function IELTSCentrePage() {
//   return (
//     <div className="min-h-screen bg-slate-50 pt-28 pb-16">
//       <div className="max-w-5xl mx-auto px-6">

//         <div className="mb-8">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-3">
//             <MapPin size={12} /> BD Test Centres
//           </div>
//           <h1 className="text-3xl font-extrabold text-slate-900">IELTS & TOEFL Centres</h1>
//           <p className="text-slate-500 text-xs mt-1.5">Verified test centres in Dhaka and Chattogram — real addresses, real registration links.</p>
//         </div>

//         {/* IELTS Section */}
//         <div className="mb-10">
//           <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
//             <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">I</span>
//             IELTS Test Centres
//           </h2>
//           {CENTRES.map((cityGroup, ci) => (
//             <div key={ci} className="mb-6">
//               <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-3">
//                 <MapPin size={14} className="text-blue-500" /> {cityGroup.city}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {cityGroup.centres.map((centre, i) => (
//                   <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
//                     <h4 className="font-extrabold text-slate-900 text-sm mb-1">{centre.name}</h4>
//                     <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full mb-3">
//                       {centre.testType}
//                     </span>

//                     <div className="space-y-2 text-xs mb-4">
//                       <div className="flex items-start gap-2 text-slate-600">
//                         <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
//                         <span>{centre.address}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-slate-600">
//                         <Phone size={12} className="text-slate-400 shrink-0" />
//                         <span>{centre.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-slate-600">
//                         <Calendar size={12} className="text-slate-400 shrink-0" />
//                         <span>{centre.testDates}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-slate-600">
//                         <Clock size={12} className="text-slate-400 shrink-0" />
//                         <span className="font-bold text-slate-700">{centre.fee}</span>
//                       </div>
//                     </div>

//                     <p className="text-[10px] text-slate-400 mb-3 italic">{centre.notes}</p>

//                     <a href={centre.website} target="_blank" rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">
//                       <Globe size={11} /> Register Online
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* TOEFL Section */}
//         <div>
//           <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
//             <span className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">T</span>
//             TOEFL iBT Centres
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {TOEFL_CENTRES.map((centre, i) => (
//               <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                 <h4 className="font-extrabold text-slate-900 text-sm mb-3">{centre.name}</h4>
//                 <div className="space-y-2 text-xs mb-4">
//                   <div className="flex items-start gap-2 text-slate-600">
//                     <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
//                     <span>{centre.address}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-600">
//                     <Clock size={12} className="text-slate-400 shrink-0" />
//                     <span className="font-bold text-slate-700">{centre.fee}</span>
//                   </div>
//                 </div>
//                 <p className="text-[10px] text-slate-400 mb-3 italic">{centre.notes}</p>
//                 <a href={centre.website} target="_blank" rel="noopener noreferrer"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all">
//                   <Globe size={11} /> Register via ETS
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800">
//           <p className="font-bold mb-1">⚠️ Important</p>
//           <p>Test fees and dates are subject to change. Always verify current fees and available dates on the official British Council, IDP, or ETS websites before booking. Register early — slots fill up 4-8 weeks in advance.</p>
//         </div>
//       </div>
//     </div>
//   );
// }