import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Create from './components/Create';
import Profile from './components/Profile';
import Discover from './components/Discover';

const SERVER_URL = 'http://localhost:3001';

function App() {
  const [identityInfo, setIdentityInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(SERVER_URL + '/api/users/myIdentity', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIdentityInfo(data);
      })
      .then(() => { console.log(identityInfo) })
      .catch(err => console.log(err));
  }, []);

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
              {
                identityInfo.status === 'loggedin' ?
                  <>
                    <Link to='/create' className='btn btn-light'>Create</Link>
                    <Link to='/profile' className='btn btn-light'>My Profile</Link>
                    <Link to={SERVER_URL + '/auth/signout'} className='btn btn-danger'>Sign Out</Link>
                  </>
                  :
                  <Link to={SERVER_URL + '/auth/signin'} className='btn btn-danger'>Sign In</Link>
              }
            </div>
            <div className='main-content col-10'>
              <Routes>
                {/* default page */}
                <Route index element={<Discover searchTerm={searchTerm} />} />
                <Route path='discover' element={<Discover searchTerm={searchTerm} />} />
                <Route path='create' element={<Create />} />
                <Route path='profile' element={<Profile />} />
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

export default App;