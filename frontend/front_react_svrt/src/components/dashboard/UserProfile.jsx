// src/components/dashboard/UserProfile.jsx
import { getUserInitials, getUserFullName } from '../../utils/dashboardUtils';
import Button from '../ui/Button';

const UserProfile = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col gap-2 px-6 mb-2 w-full group relative transition-all duration-500"> 
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-green-700 transition-all duration-200">
          {getUserInitials(user)}
        </div>
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