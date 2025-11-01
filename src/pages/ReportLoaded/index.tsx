import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, MapPin, Clock, AlertCircle, ChevronLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the type for the location state
interface CategoryData {
  id: number;
  name: string;
  color: string;
  iconColor: string;
}

interface LocationState {
  category: CategoryData;
  position: [number, number];
}

const ReportLoaded = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const { category, position = [-34.6037, -58.3816] } = state || {};
  const timestamp = new Date().toISOString();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initMap = () => {
      try {
        // Default to Buenos Aires coordinates if no position is provided
        const defaultPosition: [number, number] = [-34.6037, -58.3816];
        const mapPosition = position || defaultPosition;
        
        // Initialize the map
        const map = L.map(mapContainerRef.current!, {
          center: mapPosition,
          zoom: 16,
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add marker
        const markerIcon = L.icon({
          iconUrl: '/user-icon.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        L.marker(mapPosition, { icon: markerIcon })
          .addTo(map)
          .bindPopup('Ubicación del reporte')
          .openPopup();

        // Store map instance
        mapRef.current = map;

        // Handle window resize
        const handleResize = () => map.invalidateSize();
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Small delay to ensure the container is rendered
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [position]);
  
  const formattedTime = new Date().toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
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
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800/80 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 mr-2"
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Reporte Enviado
          </h1>
        </div>
      </header>

      <main className="relative z-10 py-8 px-4 sm:px-6 flex-1 flex flex-col min-h-0">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full opacity-20 blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-5 rounded-full shadow-lg">
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2">¡Reporte Enviado!</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Tu reporte ha sido registrado correctamente y está siendo procesado por nuestro equipo.
          </p>
          
          {/* Report Details Card */}
          <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl shadow-black/30 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-3 rounded-xl mr-4">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Detalles del Reporte</h3>
                {category?.name && (
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="text-gray-400">Categoría:</span> {category.name}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-400 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Enviado {formattedTime}</span>
                </div>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="w-full rounded-xl overflow-hidden bg-gray-900/50 border border-gray-700/50" style={{ height: '16rem' }}>
              <div 
                ref={mapContainerRef}
                className="w-full h-full rounded-xl"
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/map')}
              className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white hover:from-orange-600 hover:via-orange-500 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>Volver al Mapa</span>
            </button>
            
            <button
              onClick={() => navigate('/create-report')}
              className="w-full py-3 px-6 rounded-xl font-medium bg-gray-800/50 text-orange-400 border border-gray-700 hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Crear otro reporte</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50 py-3 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p className="mb-2 sm:mb-0 font-medium">
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent font-bold">AlTanto</span> 
            <span className="text-gray-300">- Reportes en tiempo real</span>
          </p>
          <p className="text-xs text-gray-500">Seguridad Comunitaria • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default ReportLoaded;
