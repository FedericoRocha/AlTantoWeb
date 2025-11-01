import { useNavigate } from 'react-router-dom';
import { MapPin, Bell, Users, LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo-altanto.png" 
              alt="Al Tanto" 
              className="h-10"
            />
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
        {/* Fondo con imagen */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/fondo.jpg)' }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mantente informado y seguro en tu comunidad
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Reporta incidentes en tiempo real y recibe alertas sobre lo que sucede a tu alrededor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/register')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Crear cuenta
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Iniciar sesión
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all">
              <div className="bg-orange-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Reporta incidentes</h3>
              <p className="text-gray-300">Informa sobre situaciones de riesgo en tu zona de manera rápida y sencilla.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all">
              <div className="bg-orange-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Alertas en tiempo real</h3>
              <p className="text-gray-300">Recibe notificaciones sobre incidentes reportados cerca de tu ubicación.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all">
              <div className="bg-orange-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Comunidad activa</h3>
              <p className="text-gray-300">Conéctate con otros usuarios y trabaja juntos para mantener tu comunidad segura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Al Tanto. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">Términos de servicio</a>
              <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">Política de privacidad</a>
              <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
