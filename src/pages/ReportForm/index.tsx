import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Clock, FileText, Shield, Car, Wrench, Droplet, AlertCircle, X } from 'lucide-react';

type IncidentType = 'Seguridad' | 'Accidente' | 'Vía Pública' | 'Clima';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}

const ReportForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState<IncidentType>('Seguridad');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Categorías de reporte
  const reportCategories: Category[] = [
    { 
      id: 1, 
      name: 'Seguridad', 
      icon: <Shield className="h-6 w-6" />, 
      color: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400'
    },
    { 
      id: 2, 
      name: 'Accidente', 
      icon: <Car className="h-6 w-6" />, 
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400'
    },
    { 
      id: 3, 
      name: 'Vía Pública', 
      icon: <Wrench className="h-6 w-6" />, 
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400'
    },
    { 
      id: 4, 
      name: 'Clima', 
      icon: <Droplet className="h-6 w-6" />, 
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400'
    },
  ];

  // Obtener la categoría seleccionada de la ubicación
  useEffect(() => {
    if (location.state?.category) {
      const categoryData = location.state.category;
      // Reconstruir la categoría con el ícono correspondiente
      const categoryWithIcon: Category = {
        ...categoryData,
        icon: getCategoryIcon(categoryData.id, categoryData.iconColor),
        color: categoryData.color || 'from-gray-500/20 to-gray-600/10',
        iconColor: categoryData.iconColor || 'text-gray-400'
      };
      setSelectedCategory(categoryWithIcon);
      setIncidentType(categoryData.name as IncidentType);
    }
  }, [location.state]);

  // Función para obtener el ícono según el ID de categoría
  const getCategoryIcon = (categoryId: number, color: string): React.ReactElement => {
    const iconProps = { 
      className: 'h-6 w-6',
      style: { color } 
    };
    
    switch(categoryId) {
      case 1: // Seguridad
        return <Shield {...iconProps} />;
      case 2: // Accidente
        return <Car {...iconProps} />;
      case 3: // Vía Pública
        return <Wrench {...iconProps} />;
      case 4: // Clima
        return <Droplet {...iconProps} />;
      default:
        return <AlertCircle {...iconProps} />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    // Resetear el input de archivo
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log({ incidentType, description, file });
      // Navegar a la página de reporte cargado
      navigate('/report-loaded', { 
        state: { 
          category: selectedCategory?.name,
          timestamp: new Date().toISOString()
        } 
      });
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-x-hidden">
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
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Nuevo Reporte
          </h1>
        </div>
      </header>

      <main className="relative z-10 py-6 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 backdrop-blur-sm bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-black/30">
          {/* Categoría seleccionada */}
          {selectedCategory && (
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 shadow-lg transition-all duration-300 hover:border-orange-500/30 hover:shadow-orange-500/10">
              <div className="flex items-center">
                <div 
                  className={`p-3 rounded-xl ${
                    selectedCategory?.color 
                      ? selectedCategory.color.replace('from-', 'bg-gradient-to-br from-').replace('to-', 'to-') 
                      : 'bg-gray-700'
                  } shadow-md`}
                >
                  {selectedCategory?.icon || <AlertCircle className="h-6 w-6 text-white" />}
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Categoría seleccionada</p>
                  <p className="text-lg font-bold text-white">{selectedCategory.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción del incidente
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                rows={4}
                placeholder="Describe el incidente en detalle..."
                required
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ubicación
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-orange-400" />
              <input
                type="text"
                className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                placeholder="Ubicación del incidente"
                value={location.state?.position ? 'Ubicación actual' : 'Cargando ubicación...'}
                readOnly
              />
            </div>
          </div>

          {/* Fecha y Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha y hora
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 h-5 w-5 text-orange-400" />
              <input
                type="datetime-local"
                className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                required
              />
            </div>
          </div>

          {/* Subir archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adjuntar foto o video (opcional)
            </label>
            
            {filePreview ? (
              <div className="relative group">
                <img 
                  src={filePreview} 
                  alt="Vista previa" 
                  className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-orange-500/50"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Eliminar archivo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500/50 transition-colors group">
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400 group-hover:text-orange-400 transition-colors" />
                  <p className="mt-2 text-sm text-gray-300 group-hover:text-white">
                    <span className="font-medium text-orange-400">Sube una foto</span> o arrástrala aquí
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF (máx. 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Nota importante */}
          <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-orange-100">
                Por favor, verifica que la información sea precisa antes de enviar el reporte. 
                Los reportes falsos pueden tener consecuencias legales.
              </p>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg ${
                isSubmitting 
                  ? 'bg-gray-700/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-500 hover:to-amber-600 hover:shadow-orange-500/30 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-white/90">Enviando...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Enviar reporte</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50 py-3 relative z-10 mt-12">
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

export default ReportForm;
