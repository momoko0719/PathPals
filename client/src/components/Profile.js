import React, { useEffect, useId, useState } from 'react';
import Modal from "react-modal";
import Popup from "./Popup";
import PathCard from './PathCard';

export default function Profile() {
  // Check if the user is logged in
  const identityInfo = JSON.parse(sessionStorage.getItem('identityInfo'));

  const [userInfo, setUserInfo] = useState();
  const [paths, setPaths] = useState([]);
  const [currentTab, setCurrentTab] = useState('Mine'); // ['Mine', 'Liked', 'Shared With Me]
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [bio, setBio] = useState('');
  const [editBio, setEditBio] = useState(false);
  useEffect(() => {
    if (identityInfo) {
      fetch(`/api/users?user=${identityInfo.userInfo.username}`)
        .then(res => res.json())
        .then(data => {
          setUserInfo(data);
          console.log(data);
        })
        .catch(err => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.email) {
      let queryParam;
      if (currentTab === 'Mine') {
        queryParam = `username=${userInfo.email}`;
      } else if (currentTab === 'Liked') {
        queryParam = `liked=${userInfo.email}`;
      } else {
        queryParam = `shared=${userInfo.email}`;
      }

      // Fetch paths based on the current tab
      fetch(`/api/paths?${queryParam}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => {
          setPaths(data);
        })
        .catch(err => {
          console.error('Error fetching paths:', err);
        });
    }
  }, [currentTab, userInfo]); // Include userInfo in the dependency array


  const openModal = (path) => {
    setSelectedPath(path);
    setModalIsOpen(true);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSaveBio = () => {
    fetch('/api/users/updateBio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: bio, username: userInfo.username })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setEditBio(false);
        } else {
          console.error('Error saving bio:', data.error);
        }
      })
      .catch(err => console.log(err));
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      height: "80%",
    },
  };

  return userInfo ? (
    <div className="profile container">
      <h2>User Profile</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Name:</h5>
              <p className="card-text">{userInfo.username}</p>
              <h5 className="card-title">Email:</h5>
              <p className="card-text">{userInfo.email}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Bio:</h5>
              {editBio ? (
                <>
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    value={bio}
                    onChange={handleBioChange}
                  />
                  <button className="btn btn-primary" onClick={handleSaveBio}>
                    Save Bio
                  </button>
                </>
              ) : (
                <>
                  <p className="card-text">{userInfo.bio}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditBio(true)}
                  >
                    Edit Bio
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ul className="nav nav-tabs">
        <li className="nav-item" onClick={() => setCurrentTab('Mine')}>
          <button className={`nav-link ${currentTab === 'Mine' ? 'active' : ''}`}>Mine</button>
        </li>
        <li className="nav-item" onClick={() => setCurrentTab('Liked')}>
          <button className={`nav-link ${currentTab === 'Liked' ? 'active' : ''}`}>Liked</button>
        </li>
        <li className="nav-item" onClick={() => setCurrentTab('Shared')}>
          <button className={`nav-link ${currentTab === 'Shared' ? 'active' : ''}`}>Shared with me</button>
        </li>
      </ul>
      <div className="content-cards row row-cols-3">
        {paths.length === 0 && <p>No paths to show</p>}
        {paths.map((path, index) => (
          <div className="col" key={index}>
            <PathCard path={path} onPathClick={openModal} />
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Path Details"
      >
        {selectedPath && <Popup path={selectedPath} user={userInfo} />}
        <button
          onClick={() => setModalIsOpen(false)}
          className="btn-close"
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
          }}
        >
        </button>
      </Modal>
    </div>
  ) : null;
}
