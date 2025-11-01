import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  // Datos de ejemplo - puedes reemplazarlos con datos reales
  const incidents = [
    { id: 1, type: 'Accidente', description: 'Choque en intersección', time: 'Hace 15 min' },
    { id: 2, type: 'Seguridad', description: 'Persona sospechosa', time: 'Hace 30 min' },
    { id: 3, type: 'Incendio', description: 'Incendio en edificio', time: 'Hace 1 hora' },
    { id: 4, type: 'Corte de calle', description: 'Manifestación en Av. Principal', time: 'Hace 2 horas' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors mr-2"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">Notificaciones</h1>
          <div className="ml-auto bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">
            {incidents.length} activos
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4">
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div 
              key={incident.id} 
              className="p-4 bg-gray-800/50 hover:bg-gray-800/80 rounded-xl border border-gray-700/50 transition-colors"
            >
              <div className="flex items-start">
                <div className="bg-orange-500/20 p-2 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-white">{incident.type}</h3>
                    <span className="text-xs bg-gray-700/70 text-gray-300 px-2 py-1 rounded-full">
                      {incident.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{incident.description}</p>
                  <div className="mt-3 flex items-center text-xs text-orange-400 cursor-pointer hover:underline">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>Ver en el mapa</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
