// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
// import {
//   GraduationCap, LogOut, User, LayoutDashboard, Menu, X,
//   Compass, FileCheck, Layers, Sparkles, Award, MapPin, FileText
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Navbar() {
//   const { user, isAuthenticated, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = () => { logout(); setOpen(false); navigate('/login'); };

//   const navLinks = [
//     { to: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
//     { to: '/countries',    label: 'Countries',   icon: Compass },
//     { to: '/universities', label: 'Universities', icon: GraduationCap },
//     { to: '/compare',      label: 'Compare',     icon: Layers },
//     { to: '/ai-recommend', label: 'AI Match',    icon: Sparkles },
//     { to: '/scholarships', label: 'Scholarships', icon: Award },
//     { to: '/test-centres', label: 'IELTS/TOEFL', icon: MapPin },
//     { to: '/documents',    label: 'Documents',   icon: FileCheck },
//     { to: '/sop-generator', label: 'SOP',        icon: FileText },
//   ];

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       scrolled
//         ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 py-2 shadow-sm'
//         : 'bg-transparent py-4'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
//             <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
//               <GraduationCap size={18} className="text-white" />
//             </div>
//             <span className="font-extrabold text-lg tracking-tight text-slate-900">
//               Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Finder</span>
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <div className="hidden lg:flex items-center gap-0.5">
//             {isAuthenticated && navLinks.map(({ to, label, icon: Icon }) => {
//               const isActive = location.pathname === to;
//               return (
//                 <Link key={to} to={to}
//                   className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
//                     isActive
//                       ? 'text-blue-600 bg-blue-50 border border-blue-100'
//                       : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
//                   }`}>
//                   <Icon size={13} />{label}
//                   {isActive && (
//                     <motion.span layoutId="activeIndicator"
//                       className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"
//                       transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           <div className="hidden lg:flex items-center gap-2">
//             {isAuthenticated ? (
//               <>
//                 <Link to="/profile"
//                   className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
//                   <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-xs text-white">
//                     {user?.name ? user.name[0].toUpperCase() : 'U'}
//                   </div>
//                   <span className="text-xs font-semibold text-slate-700">{user?.name?.split(' ')[0]}</span>
//                 </Link>
//                 <button onClick={handleLogout}
//                   className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
//                   <LogOut size={13} /> Sign out
//                 </button>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5">Login</Link>
//                 <Link to="/register" className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
//                   Get Started
//                 </Link>
//               </div>
//             )}
//           </div>

//           <button className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
//             onClick={() => setOpen(!open)}>
//             {open ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile drawer */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
//             className="lg:hidden bg-white border-t border-slate-200 px-4 pb-5 pt-2 flex flex-col gap-1 shadow-lg">
//             {isAuthenticated ? (
//               <>
//                 {navLinks.map(({ to, label, icon: Icon }) => (
//                   <Link key={to} to={to} onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
//                     <Icon size={15} /> {label}
//                   </Link>
//                 ))}
//                 <div className="h-px bg-slate-100 my-1" />
//                 <Link to="/profile" onClick={() => setOpen(false)}
//                   className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
//                   <User size={15} /> Profile
//                 </Link>
//                 <button onClick={handleLogout}
//                   className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 cursor-pointer">
//                   <LogOut size={15} /> Sign out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" onClick={() => setOpen(false)}
//                   className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Login</Link>
//                 <Link to="/register" onClick={() => setOpen(false)}
//                   className="flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600">
//                   Get Started
//                 </Link>
//               </>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Finder</span>
          </span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <Link to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === '/dashboard'
                  ? 'text-blue-600 bg-blue-50 border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <Link to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all font-medium">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              {user?.name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-medium cursor-pointer">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5">Login</Link>
            <Link to="/register" className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}