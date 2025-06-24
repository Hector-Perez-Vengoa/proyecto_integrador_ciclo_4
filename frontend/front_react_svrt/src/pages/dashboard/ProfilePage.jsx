// src/pages/dashboard/ProfilePage.jsx
import { ProfileView } from '../../components/profile';

const ProfilePage = () => {
  return (
    <div className="flex-1 page-transition-elegant">
      <ProfileView autoEdit={false} />
    </div>
  );
};

export default ProfilePage;
