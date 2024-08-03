"use client"
import { useUser } from '@/app/UserContext/page.js';

const Profile = () => {
  const user = useUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.displayName || 'User'}</p>
      <p>ID: {user.uid}</p>
    </div>
  );
};

export default Profile;

