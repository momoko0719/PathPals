import React, { useState } from 'react';

import NavBar from './components/NavBar';
import Create from './components/Create';
import Profile from './components/Profile';
import Discover from './components/Discover';

function App() {
  const [activeTab, setActiveTab] = useState('Discover');
  const [isSignedIn, setIsSignedIn] = useState(true);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <div className='container'>
          <div className='row'>
            <div className='side-panel col-2 d-flex flex-column'>
              <button className={`btn btn-light ${activeTab === 'Discover' ? 'active' : ''}`} onClick={() => handleTabChange('Discover')}>
                Discover
              </button>
              <button className={`btn btn-light ${activeTab === 'Create' ? 'active' : ''}`} onClick={() => handleTabChange('Create')}>
                Create
              </button>
              <button className={`btn btn-light ${activeTab === 'My Profile' ? 'active' : ''}`} onClick={() => handleTabChange('My Profile')}>
                {isSignedIn ? 'My Profile' : 'Sign In'}
              </button>
            </div>
            <div className='main-content col-10'>
              {activeTab === 'Discover' && <Discover />}
              {activeTab === 'Create' && <Create />}
              {activeTab === 'My Profile' && <Profile />}
            </div>
          </div>
        </div>
      </main>
      <footer>

      </footer>
    </div>
  );
}

export default App;
