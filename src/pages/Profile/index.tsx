import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Edit, Save, X } from 'lucide-react';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  reportsCount: number;
  verified: boolean;
};

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    phone: '+54 9 11 1234-5678',
    address: 'Buenos Aires, Argentina',
    joinDate: '01/01/2023',
    reportsCount: 15,
    verified: true,
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
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
      <header className="bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-30 relative">
        <div className="max-w-6xl mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors mr-2"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Mi Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-3xl mx-auto w-full relative z-10">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-600/30 to-orange-400/30 p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-2xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                )}
                <div className="flex items-center text-sm text-gray-300">
                  <span>Usuario desde {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Correo electrónico</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Teléfono</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Dirección</p>
                {isEditing ? (
                  <textarea
                    value={tempProfile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[60px]"
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">{profile.reportsCount}</p>
                  <p className="text-sm text-gray-300">Reportes</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">
                    {Math.floor(profile.reportsCount * 1.5)}
                  </p>
                  <p className="text-sm text-gray-300">Puntos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar cambios
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Al Tanto. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
