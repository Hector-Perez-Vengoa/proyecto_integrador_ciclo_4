// src/pages/dashboard/ProfileEditPage.jsx
import { ProfileView } from '../../components/profile';

const ProfileEditPage = () => {
  return (
    <div className="flex-1">
      <ProfileView autoEdit={true} />
    </div>
  );
};

export default ProfileEditPage;
