import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import HRDDashboard from './pages/HRDDashboard.jsx';
import PengajuanForm from './pages/PengajuanForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App bg-slate-900 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pengajuan-form" element={<PengajuanForm />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/hrd/*" 
            element={
              <PrivateRoute role="hrd">
                <HRDDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="dark"
          limit={3}
        />
      </div>
    </Router>
  );
}

export default App;
