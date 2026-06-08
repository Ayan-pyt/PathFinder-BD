import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/Common/ChatbotWidget';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CountriesPage from './pages/countries/CountriesPage';
import CountryDetailPage from './pages/countries/CountryDetailPage';
import CountryCompare from './pages/countries/CountryCompare';
import UniversitySelectionPage from './pages/UniversitySelection/UniversitySelectionPage';
import DocumentManagementPage from './pages/DocumentPreparation/DocumentManagementPage';
import ProfileSetupPage from './pages/profile/ProfileSetupPage';
import ProfileViewPage from './pages/profile/ProfileViewPage';
import SOPGeneratorPage from './pages/SOPGeneratorPage';
import SOPCheckerPage from './pages/SOPCheckerPage';
import AIRecommendPage from './pages/ai/AIRecommendPage';
import ScholarshipPage from './pages/scholarships/ScholarshipPage';
import IELTSCentrePage from './pages/ielts/IELTSCentrePage';
import IELTSPrepHub from './pages/ielts/IELTSPrepHub';
import CommunityHubPage from './pages/community/CommunityHubPage';
import VisaRequirementPage from './pages/visa/VisaRequirementPage';
import OfferLetterPage from './pages/journey/OfferLetterPage';
import ApplicationHistoryPage from './pages/journey/ApplicationHistoryPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import CostCalculatorPage from './pages/tools/CostCalculatorPage';
import WorkspacePage from './pages/workspace/WorkspacePage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } }
});

function NavbarWrapper() {
  const location = useLocation();
  if (location.pathname === '/dashboard') return null;
  return <Navbar />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:id" element={<CountryDetailPage />} />
          <Route path="/universities" element={<UniversitySelectionPage />} />
          <Route path="/cost-calculator" element={<CostCalculatorPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfileViewPage />} />
            <Route path="/profile/setup" element={<ProfileSetupPage />} />
            <Route path="/compare" element={<CountryCompare />} />
            <Route path="/documents" element={<DocumentManagementPage />} />
            <Route path="/sop-generator" element={<SOPGeneratorPage />} />
            <Route path="/sop-checker" element={<SOPCheckerPage />} />
            <Route path="/ai-recommend" element={<AIRecommendPage />} />
            <Route path="/scholarships" element={<ScholarshipPage />} />
            <Route path="/test-centres" element={<IELTSCentrePage />} />
            <Route path="/ielts-hub" element={<IELTSPrepHub />} />
            <Route path="/community" element={<CommunityHubPage />} />
            <Route path="/visa/:countryCode" element={<VisaRequirementPage />} />
            <Route path="/offer-letters" element={<OfferLetterPage />} />
            <Route path="/applications" element={<ApplicationHistoryPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/admin/news" element={<AdminNewsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </QueryClientProvider>
  );
}


// import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Navbar from './components/Layout/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import ChatbotWidget from './components/Common/ChatbotWidget';

// import LandingPage from './pages/LandingPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import LoginPage from './pages/auth/LoginPage';
// import DashboardPage from './pages/Dashboard/DashboardPage';
// import CountriesPage from './pages/countries/CountriesPage';
// import CountryDetailPage from './pages/countries/CountryDetailPage';
// import CountryCompare from './pages/countries/CountryCompare';
// import UniversitySelectionPage from './pages/UniversitySelection/UniversitySelectionPage';
// import DocumentManagementPage from './pages/DocumentPreparation/DocumentManagementPage';
// import ProfileSetupPage from './pages/profile/ProfileSetupPage';
// import ProfileViewPage from './pages/profile/ProfileViewPage';
// import SOPGeneratorPage from './pages/SOPGeneratorPage';
// import SOPCheckerPage from './pages/SOPCheckerPage';
// import AIRecommendPage from './pages/ai/AIRecommendPage';
// import ScholarshipPage from './pages/scholarships/ScholarshipPage';
// import IELTSCentrePage from './pages/ielts/IELTSCentrePage';
// import IELTSPrepHub from './pages/ielts/IELTSPrepHub';
// import CommunityHubPage from './pages/community/CommunityHubPage';
// import VisaRequirementPage from './pages/visa/VisaRequirementPage';
// import OfferLetterPage from './pages/journey/OfferLetterPage';
// import ApplicationHistoryPage from './pages/journey/ApplicationHistoryPage';
// import AdminNewsPage from './pages/admin/AdminNewsPage';

// const queryClient = new QueryClient({
//   defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } }
// });

// function NavbarWrapper() {
//   const location = useLocation();
//   if (location.pathname === '/dashboard') return null;
//   return <Navbar />;
// }

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <NavbarWrapper />
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/countries" element={<CountriesPage />} />
//           <Route path="/countries/:id" element={<CountryDetailPage />} />
//           <Route path="/universities" element={<UniversitySelectionPage />} />

//           <Route element={<ProtectedRoute />}>
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="/profile" element={<ProfileViewPage />} />
//             <Route path="/profile/setup" element={<ProfileSetupPage />} />
//             <Route path="/compare" element={<CountryCompare />} />
//             <Route path="/documents" element={<DocumentManagementPage />} />
//             <Route path="/sop-generator" element={<SOPGeneratorPage />} />
//             <Route path="/sop-checker" element={<SOPCheckerPage />} />
//             <Route path="/ai-recommend" element={<AIRecommendPage />} />
//             <Route path="/scholarships" element={<ScholarshipPage />} />
//             <Route path="/test-centres" element={<IELTSCentrePage />} />
//             <Route path="/ielts-hub" element={<IELTSPrepHub />} />
//             <Route path="/community" element={<CommunityHubPage />} />
//             <Route path="/visa/:countryCode" element={<VisaRequirementPage />} />
//             <Route path="/offer-letters" element={<OfferLetterPage />} />
//             <Route path="/applications" element={<ApplicationHistoryPage />} />
            
//             {/* Admin Routes */}
//             <Route path="/admin/news" element={<AdminNewsPage />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         <ChatbotWidget />
//       </BrowserRouter>
//     </QueryClientProvider>
//   );
// }
