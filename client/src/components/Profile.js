import React, { useState } from 'react';

function Profile({ userInfo }) {
  const [bio, setBio] = useState(userInfo?.bio || '');

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSaveBio = () => {
    console.log('Bio saved:', bio);
  };

  return userInfo ? (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Name:</h5>
              <p className="card-text">{userInfo.name}</p>
              <h5 className="card-title">Email:</h5>
              <p className="card-text">{userInfo.username}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Bio:</h5>
              <textarea
                className="form-control mb-3"
                rows="4"
                value={bio}
                onChange={handleBioChange}
              />
              <button className="btn btn-primary" onClick={handleSaveBio}>
                Save Bio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Profile;
