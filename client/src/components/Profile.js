import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import Popup from "./Popup";
import PathCard from './PathCard';

export default function Profile({ userInfo }) {
  // make sure the user is logged in
  if (!userInfo) {
    window.location.href = '/';
  }

  const [paths, setPaths] = useState([]);
  const [currentTab, setCurrentTab] = useState('Mine'); // ['Mine', 'Liked']
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [bio, setBio] = useState(userInfo?.bio || '');

  useEffect(() => {
    if (currentTab === 'Mine') {
      fetch(`/api/paths?username=${userInfo.username}`)
        .then(res => res.json())
        .then(data => {
          setPaths(data);
        })
        .catch(err => console.log(err));
    } else if (currentTab === 'Liked') {
      fetch(`/api/paths?liked=${userInfo.username}`)
        .then(res => res.json())
        .then(data => {
          setPaths(data);
        })
        .catch(err => console.log(err));
    }
  }, [currentTab]);

  const openModal = (path) => {
    setSelectedPath(path);
    setModalIsOpen(true);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSaveBio = () => {
    console.log('Bio saved:', bio);
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
      <div className="mt-4">
        <button className="btn btn-primary me-2" onClick={() => setCurrentTab('Mine')}>Mine</button>
        <button className="btn btn-primary" onClick={() => setCurrentTab('Liked')}>Liked</button>
      </div>
      <div className="content-cards row row-cols-3">
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
        {selectedPath && <Popup path={selectedPath} />}
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