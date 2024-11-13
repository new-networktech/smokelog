// Path: Frontend/src/pages/Profile.js
import React from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
}

export default Profile;
