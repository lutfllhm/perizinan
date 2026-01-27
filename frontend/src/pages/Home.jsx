import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/img/bg.jpeg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/90" />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <section className="relative z-20 min-h-screen flex items-center px-4 pt-20">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6">
            Sistem Perizinan
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Cuti & Lembur
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10">
            Kelola pengajuan dengan mudah dan efisien
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/ajukan">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold">
                Ajukan Sekarang
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold">
                Login Staff
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
