import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Menu, Bell, Plus, X, LogOut, User, Settings, HelpCircle, AlertCircle, Locate, Layers, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../App';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const MainMap = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext)!;

  // Simulated incident data
  const incidents = [
    { id: 1, type: 'Accidente', description: 'Choque en intersección', time: 'Hace 15 min' },
    { id: 2, type: 'Seguridad', description: 'Persona sospechosa', time: 'Hace 30 min' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // Coordenadas del Obelisco, Buenos Aires
      const defaultPosition: [number, number] = [-34.6037, -58.3816];
      
      // Crear el mapa
      const map = L.map(mapContainerRef.current, {
        center: defaultPosition,
        zoom: 15,
        zoomControl: false, // Deshabilitar controles por defecto para personalizarlos
        attributionControl: false // Controlamos la atribución manualmente
      });

      // Agregar capa de OpenStreetMap con estilo oscuro
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Crear ícono personalizado con la imagen de usuario
      const userIcon = L.icon({
        iconUrl: '/user-icon.png',
        iconSize: [32, 32],     // Tamaño del ícono
        iconAnchor: [16, 16],   // Punto de anclaje (centro del ícono)
        popupAnchor: [0, -16],  // Donde se abre el popup relativo al iconAnchor
        className: 'user-location-marker'
      });

      // Agregar marcador en la posición actual con el ícono personalizado
      L.marker(defaultPosition, { 
        icon: userIcon,
        title: 'Tu ubicación',
        alt: 'Marcador de ubicación del usuario',
        riseOnHover: true
      })
      .addTo(map)
      .bindPopup('¡Estás aquí!')
      .openPopup();

      // Guardar referencia al mapa
      mapRef.current = map;
      setIsMapLoading(false);

      // Limpieza al desmontar el componente
      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
      setMapError(true);
      setIsMapLoading(false);
    }
  }, []);

  // Funciones de control del mapa
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const locateUser = () => {
    if (mapRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.flyTo([latitude, longitude], 15);
          
          // Agregar marcador en la ubicación del usuario
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div class="custom-marker-icon" style="background: #3182ce;"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
          });
          
          L.marker([latitude, longitude], { icon: customIcon })
            .addTo(mapRef.current!)
            .bindPopup('¡Tu ubicación actual!')
            .openPopup();
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          alert('No se pudo obtener tu ubicación. Asegúrate de haber otorgado los permisos necesarios.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('La geolocalización no es compatible con tu navegador');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors md:hidden"
              aria-label="Menú"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo-altanto.png" 
                alt="Al Tanto" 
                className="h-8"
              />
            </div>
          </div>
          
          {/* User menu */}
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-700/80 transition-colors"
              aria-label="Menú de usuario"
              aria-expanded={isUserMenuOpen}
            >
              <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:inline text-sm font-medium">Usuario</span>
            </button>
            
            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-40">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">usuario@ejemplo.com</p>
                  <p className="text-xs text-gray-400">Usuario Estándar</p>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi perfil
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/help');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ayuda
                  </button>
                </div>
                <div className="border-t border-gray-700 py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div 
              className="fixed inset-0 bg-black/70 z-30"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div className="fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-700 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                <h2 className="text-xl font-bold text-white">Menú</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="p-2 bg-gray-900">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800/90 flex items-center text-gray-200 transition-colors"
                >
                  <User className="h-5 w-5 mr-3 text-orange-400" />
                  Mi perfil
                </button>
                <button 
                  onClick={() => {
                    navigate('/reports');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800/90 flex items-center text-gray-200 transition-colors"
                >
                  <AlertTriangle className="h-5 w-5 mr-3 text-orange-400" />
                  Mis reportes
                </button>
                <button 
                  onClick={() => {
                    navigate('/settings');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800/90 flex items-center text-gray-200 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-orange-400" />
                  Configuración
                </button>
                <button 
                  onClick={() => {
                    navigate('/help');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800/90 flex items-center text-gray-200 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 mr-3 text-orange-400" />
                  Ayuda
                </button>
                <div className="border-t border-gray-700 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/10 flex items-center text-red-400 mt-2"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Cerrar sesión
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (hidden on mobile) */}
        <aside className={`bg-gray-800 w-72 border-r border-gray-700 hidden md:block overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Incidentes recientes</h2>
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">
                {incidents.length} activos
              </span>
            </div>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="p-4 bg-gray-700/50 hover:bg-gray-700/80 rounded-xl border border-gray-600/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="bg-orange-500/20 p-2 rounded-lg mr-3">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{incident.type}</h3>
                        <span className="text-xs bg-gray-600/50 text-gray-300 px-2 py-0.5 rounded-full">
                          {incident.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{incident.description}</p>
                      <div className="mt-2 flex items-center text-xs text-orange-400">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>Ver en el mapa</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative bg-gray-900">
          {/* Contenedor del mapa */}
          <div 
            ref={mapContainerRef} 
            className="absolute inset-0 z-0"
            style={{ backgroundColor: '#1a202c' }}
          >
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="animate-pulse flex flex-col items-center">
                  <MapPin className="h-12 w-12 text-orange-500 mb-2 animate-bounce" />
                  <p className="text-gray-400">Cargando mapa...</p>
                </div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center p-6 max-w-sm">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Error al cargar el mapa</h3>
                  <p className="text-gray-400 mb-4">No se pudo cargar el mapa en este momento. Por favor, inténtalo de nuevo más tarde.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Controles del mapa */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
            <button 
              onClick={zoomIn}
              className="p-3 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg text-white border border-gray-700 transition-colors"
              title="Acercar"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button 
              onClick={zoomOut}
              className="p-3 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg text-white border border-gray-700 transition-colors"
              title="Alejar"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <div className="h-px bg-gray-600 my-1"></div>
            <button 
              onClick={locateUser}
              className="p-3 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg text-white border border-gray-700 transition-colors"
              title="Mi ubicación"
            >
              <Locate className="h-5 w-5" />
            </button>
          </div>
          
          {/* Indicador de carga */}
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-lg text-white backdrop-blur-sm border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-lg text-white backdrop-blur-sm border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 flex justify-around p-2">
        <button 
          className="flex flex-col items-center text-orange-500 p-2 rounded-lg w-full max-w-[100px] hover:bg-gray-700/50 transition-colors"
          aria-label="Mapa"
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs mt-1">Mapa</span>
        </button>
        <button 
          onClick={() => navigate('/create-report')}
          className="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg w-full max-w-[100px] hover:bg-gray-700/50 transition-colors"
          aria-label="Reportar"
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs mt-1">Reportar</span>
        </button>
        <button 
          onClick={() => navigate('/notifications')}
          className="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg w-full max-w-[100px] hover:bg-gray-700/50 transition-colors relative"
          aria-label="Notificaciones"
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs mt-1">Notificaciones</span>
          <span className="absolute top-1 right-4 h-2 w-2 bg-orange-500 rounded-full"></span>
        </button>
      </nav>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/create-report')}
        className="fixed bottom-20 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg md:hidden transition-colors z-20"
        aria-label="Crear reporte"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MainMap;
