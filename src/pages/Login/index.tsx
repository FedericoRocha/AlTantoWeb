import { useState, type FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext)!;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the login function from context
      login();
      
      // Redirect to the map page
      navigate('/map');
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      {/* Fondo con overlay oscuro */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url(/fondo.jpg)',
          opacity: 0.2
        }}
      />
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm py-4 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-orange-500 hover:text-orange-400">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <img 
              src="/logo-altanto.png" 
              alt="Al Tanto" 
              className="h-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Iniciar sesión</h2>
            <p className="text-gray-400">Ingresa tus credenciales para acceder</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <a href="#" className="text-sm text-orange-400 hover:text-orange-300">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : 'Iniciar sesión'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-orange-400 hover:text-orange-300 font-medium"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Al Tanto. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
