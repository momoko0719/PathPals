import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Create from './components/Create';
import Profile from './components/Profile';
import Discover from './components/Discover';
import About from './components/About';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [identityInfo, setIdentityInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formInfo, fillForm] = useState(null);

  // get the current user info from the server
  useEffect(() => {
    fetch('/api/users/myIdentity', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIdentityInfo(data);
        sessionStorage.setItem('identityInfo', JSON.stringify(data));
      })
      .catch(err => console.log(err));
  }, []);

  // if identityInfo changes, send the current user info to the server
  useEffect(() => {
    if (identityInfo.status === 'loggedin') {
      fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: identityInfo.userInfo.name, // e.g. Sam
          username: identityInfo.userInfo.username // e.g. sam123@example.com
        })
      })
        .then(res => res.json())
        .catch(err => console.log(err));
    }
  }, [identityInfo]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <header>
        <NavBar onSearch={handleSearch} />
      </header>
      <main>
        <div className='home container'>
          <div className='row'>
            <div className='side-panel col-2 d-flex flex-column'>
              {/* link routes to correspond buttons */}
              <Link to='/' className='btn btn-light'>Discover</Link>
              {
                identityInfo.status === 'loggedin' ?
                  <>
                    <Link to='/create' className='btn btn-light'>Create</Link>
                    <Link to='/profile' className='btn btn-light'>User: {identityInfo.userInfo.name}</Link>
                    <Link to={SERVER_URL + '/auth/signout'} className='btn btn-danger'>Sign Out</Link>
                  </>
                  :
                  <Link to={SERVER_URL + '/auth/signin'} className='btn btn-danger'>Sign In</Link>
              }
            </div>
            <div className='main-content col-10'>
              <Routes>
                {/* default page */}
                <Route index element={<Discover searchTerm={searchTerm} userInfo={identityInfo.userInfo} fillForm={fillForm} />} />
                <Route path='/' element={<Discover searchTerm={searchTerm} userInfo={identityInfo.userInfo} fillForm={fillForm} />} />
                <Route path='create' element={<Create formInfo={formInfo} />} />
                <Route path='profile' element={<Profile fillForm={fillForm} />} />
                <Route path='about' element={<About />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;