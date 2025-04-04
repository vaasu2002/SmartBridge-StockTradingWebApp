import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/Home';
import RegisterPage from './pages/Registration';
import BankAccountManager from './pages/Bank';
import ProtectedNav from './components/ProtectedNav';
import Portfolio from './pages/Portfolio';
import Wallet from './pages/Wallet'
// Layout component with Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  
  // Don't show navbar on auth pages (home/login and register)
  return (
    <div className='min-h-screen bg-black text-white'>
      {!isAuthPage && <ProtectedNav />}
      {children}
    </div>
  );
};

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/bank-accounts' element={
            <Layout>
              <BankAccountManager />
            </Layout>
          } />
          <Route path='/portfolio' element={
            <Layout>
              <Portfolio />
            </Layout>
          } />
          <Route path='/wallet' element={
            <Layout>
              <Wallet />
            </Layout>
          } />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    </Router>
  );
}