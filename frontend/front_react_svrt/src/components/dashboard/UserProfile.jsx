// src/components/dashboard/UserProfile.jsx
import { getUserInitials, getUserFullName } from '../../utils/dashboardUtils';
import { getImageUrl, getInitials } from '../../utils/profileUtils';
import { useProfile } from '../../logic/useProfile';
import Button from '../ui/Button';

const UserProfile = ({ user, onLogout }) => {
  const { profile, loading } = useProfile();
  
  // Usar la imagen del perfil si está disponible
  const imageUrl = getImageUrl(profile, null);
  const initials = getInitials(profile) || getUserInitials(user);
  
  return (
    <div className="flex flex-col gap-2 px-6 mb-2 w-full group relative transition-all duration-500"> 
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Perfil"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all duration-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
            {initials}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
            {getUserFullName(user)}
          </span>
          <span className="text-xs text-gray-500 leading-tight group-hover:text-blue-500 transition-colors">
            {user?.email}
          </span>
        </div>
      </div>
      <Button
        onClick={onLogout}
        variant="danger"
        size="sm"
        className="mt-2 w-full text-sm"
      >
        Cerrar sesión
      </Button>
    </div>
  );
};

export default UserProfile;