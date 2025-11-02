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
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors md:hidden"
              aria-label="Menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/notifications')}
              className="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg w-full max-w-[100px] hover:bg-gray-700/50 transition-colors relative"
              aria-label="Notificaciones"
            >
              <Bell className="h-6 w-6" />
              <span className="text-xs mt-1">Notificaciones</span>
              <span className="absolute top-1 right-4 h-2 w-2 bg-orange-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                aria-label="Menú de usuario"
              >
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-300" />
                </div>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg py-1 z-50 border border-gray-700">
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Mi perfil</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/help');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Ayuda</span>
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Map container */}
        <main className="flex-1 relative overflow-hidden">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full"
            style={{ backgroundColor: '#1a202c' }}
          >
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10 p-4">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Error al cargar el mapa</h3>
                  <p className="text-gray-300 mb-4">No se pudo cargar el mapa. Por favor, verifica tu conexión a internet e inténtalo de nuevo.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Map controls */}
          <div className="absolute bottom-24 right-4 z-10 flex flex-col space-y-2">
            <button 
              onClick={() => mapRef.current?.zoomIn()}
              className="p-3 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg text-white border border-gray-700 transition-colors"
              title="Acercar"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button 
              onClick={() => mapRef.current?.zoomOut()}
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
          
          {/* Loading indicator */}
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-lg text-white backdrop-blur-sm border border-gray-700">
              <Layers className="h-5 w-5" />
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-lg text-white backdrop-blur-sm border border-gray-700">
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden bottom-nav">
        <div className="flex justify-around p-1">
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
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg w-full max-w-[100px] hover:bg-gray-700/50 transition-colors"
            aria-label="Perfil"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MainMap;
