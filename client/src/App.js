import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';
import PageAccess from './pageAccess';
import { msalInstance } from './index';
import NavBar from './components/NavBar';
import Create from './components/Create';
import Profile from './components/Profile';
import Discover from './components/Discover';
import About from './components/About';

function App() {
  const isAuthenticated = useIsAuthenticated();
  console.log(isAuthenticated);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <header>
        <NavBar onSearch={handleSearch} />
      </header>
      <main>
        <div className='container'>
          <div className='row'>
            <div className='side-panel col-2 d-flex flex-column'>
              {/* link routes to correspond buttons */}
              <Link to='/discover' className='btn btn-light'>Discover</Link>
              {isAuthenticated && <Link to='/create' className='btn btn-light'>Create</Link>}
              {isAuthenticated && <Link to='/profile' className='btn btn-light'>My Profile</Link>}
              <PageAccess />
            </div>
            <div className='main-content col-10'>
              <Routes>
                {/* default page */}
                <Route index element={<Discover searchTerm={searchTerm} />} />
                <Route path='discover' element={<Discover searchTerm={searchTerm} />} />
                <Route path='create' element={<Create />} />
                <Route path='profile' element={<Profile />} />
                <Route path='about' element={<About />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>
      <footer>

      </footer>
    </div>
  );
}

const AppWithMsalProvider = () => (
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);

export default AppWithMsalProvider;
