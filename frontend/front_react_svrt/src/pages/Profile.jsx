// src/pages/Profile.jsx
import React from 'react';
import ProfileView from '../components/profile/ProfileView';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
        <ProfileView />
      </div>
    </div>
  );
};

export default Profile;
