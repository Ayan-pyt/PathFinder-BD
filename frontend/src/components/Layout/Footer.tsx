import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-amber-800">
              <p className="font-bold mb-1">⚠️ Information Disclaimer</p>
              <p>
                Information on this platform is sourced from official government and university portals and updated periodically. 
                Always verify directly with the respective institution before making decisions. 
                PathFinder BD is an information resource, not an accredited education agent.
              </p>
              <p className="mt-2 text-amber-700">
                Last site-wide verification: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">PathFinder BD</span>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-blue-600 transition">Disclaimer</Link>
            <a href="mailto:info@pathfinderbd.com" className="hover:text-blue-600 transition">Contact</a>
          </div>
          <div className="text-xs text-slate-400">
            Trusted by Bangladeshi students since 2024
          </div>
        </div>
      </div>
    </footer>
  );
}