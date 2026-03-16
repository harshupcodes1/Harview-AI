import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import InterviewRoom from './InterviewRoom.jsx'
import Feedback from './Feedback.jsx'
import AuthPage from './AuthPage.jsx'
import PricingPage from './PricingPage.jsx'
import AdminPanel from './AdminPanel.jsx'
import ATSChecker from './ATSChecker.jsx'
import Profile from './Profile.jsx'
import Footer from './components/Footer.jsx'
import { Terms, Privacy, Refund, Contact } from './LegalPage.jsx'
import { Outlet, ScrollRestoration } from 'react-router-dom'

// Layout wrapper to include Footer
const Layout = () => {
  return (
    <>
      <ScrollRestoration />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/interview/new', element: <InterviewRoom /> },
      { path: '/feedback/:id', element: <Feedback /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/admin', element: <AdminPanel /> },
      { path: '/ats', element: <ATSChecker /> },
      { path: '/profile', element: <Profile /> },
      { path: '/terms', element: <Terms /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/refund', element: <Refund /> },
      { path: '/contact', element: <Contact /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
