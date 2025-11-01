import { useNavigate } from 'react-router-dom';
import { Car, Wrench, MapPin, ChevronLeft, Map, Shield, Droplet, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Coordenadas del Obelisco, Buenos Aires
const DEFAULT_POSITION: [number, number] = [-34.6037, -58.3816];

const CreateReport = () => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState('Cargando ubicación...');
  const [isLoading, setIsLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const reportCategories = [
    { 
      id: 1, 
      name: 'Seguridad', 
      icon: <Shield className="h-8 w-8" />, 
      color: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400'
    },
    { 
      id: 2, 
      name: 'Accidente', 
      icon: <Car className="h-8 w-8" />, 
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400'
    },
    { 
      id: 3, 
      name: 'Vía Pública', 
      icon: <Wrench className="h-8 w-8" />, 
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400'
    },
    { 
      id: 4, 
      name: 'Clima', 
      icon: <Droplet className="h-8 w-8" />, 
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400'
    },
  ];

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Inicializar mapa y ubicación
  useEffect(() => {
    // Simular carga de ubicación
    const timer = setTimeout(() => {
      setCurrentLocation('Avenida Corrientes 1234, CABA');
      setIsLoading(false);
      
      // Inicializar mapa después de cargar la ubicación
      if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: userPosition,
          zoom: 16,
          zoomControl: false,
          attributionControl: false
        });

        // Agregar capa de OpenStreetMap con estilo oscuro
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          className: 'map-tiles'
        }).addTo(map);

        // Agregar marcador de usuario
        const userIcon = L.icon({
          iconUrl: '/user-icon.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'user-location-marker'
        });

        L.marker(userPosition, { icon: userIcon })
          .addTo(map)
          .bindPopup('Tu ubicación actual')
          .openPopup();

        mapRef.current = map;
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userPosition]);

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden relative">
      {/* Background with animated gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ 
            backgroundImage: 'url(/fondo.jpg)', 
            filter: 'blur(8px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/50 to-gray-900/90" />
      </div>
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm p-3 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors mr-2"
            aria-label="Volver"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Crear reporte
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full overflow-hidden relative z-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Selecciona una categoría</h2>
          <div className="grid grid-cols-4 gap-3">
            {reportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`group relative overflow-hidden p-0.5 rounded-xl transition-all duration-300 hover:scale-[1.02] ${selectedCategory === category.id ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-orange-500' : ''}`}
              >
                <div className={`h-full w-full backdrop-blur-sm rounded-xl p-2 flex flex-col items-center justify-center transition-all ${selectedCategory === category.id ? 'bg-gray-700/80' : 'bg-gray-800/80'}`}>
                  <div className={`p-2 rounded-full ${category.iconColor} ${selectedCategory === category.id ? 'bg-opacity-100' : 'bg-opacity-50 group-hover:bg-opacity-70'} transition-colors`}>
                    {category.icon}
                  </div>
                  <span className={`font-medium text-xs mt-1 ${selectedCategory === category.id ? 'text-white' : 'text-gray-200'}`}>
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-300 flex items-center">
              <MapPin className="h-5 w-5 text-orange-400 mr-2" />
              Ubicación actual
            </h3>
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
              {isLoading ? 'Cargando...' : 'En línea'}
            </span>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 flex-1 overflow-hidden relative">
            <div 
              ref={mapContainerRef} 
              className="w-full h-full min-h-[300px] z-10"
              style={{ position: 'relative' }}
            >
              {/* El mapa se renderizará aquí */}
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-400 truncate pr-2">
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin mr-2 h-3.5 w-3.5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Obteniendo ubicación...
                </span>
              ) : (
                <span className="text-orange-400">{currentLocation}</span>
              )}
            </p>
            
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView(userPosition, 16);
                }
              }}
              className="p-2 bg-orange-500/20 text-orange-400 rounded-full hover:bg-orange-500/30 transition-colors"
              title="Centrar en mi ubicación"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={() => {
              if (selectedCategory) {
                const selectedCategoryData = reportCategories.find(cat => cat.id === selectedCategory);
                if (!selectedCategoryData) return;
                
                // Solo pasar datos serializables en el estado
                const navigationState = { 
                  category: {
                    id: selectedCategoryData.id,
                    name: selectedCategoryData.name,
                    color: selectedCategoryData.color,
                    iconColor: selectedCategoryData.iconColor
                  },
                  position: userPosition 
                };
                
                console.log('Navigating to report form with:', navigationState);
                
                // Navegar a la ruta con el estado
                navigate('/report-form', { 
                  state: navigationState,
                  replace: false
                });
              } else {
                // Mostrar mensaje de que debe seleccionar una categoría
                alert('Por favor selecciona una categoría antes de continuar');
              }
            }}
            disabled={!selectedCategory}
            className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg ${
              selectedCategory 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/20 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap className="h-5 w-5" />
            {selectedCategory ? 'Crear reporte en esta ubicación' : 'Selecciona una categoría'}
          </button>
        </div>

      </main>
      
      {/* Footer simplificado */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 p-3">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button 
            onClick={() => navigate('/map')}
            className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center"
          >
            Ver mapa completo
            <ChevronLeft className="h-4 w-4 transform rotate-180 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
