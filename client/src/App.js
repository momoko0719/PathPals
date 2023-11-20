import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Create from './components/Create';
import Profile from './components/Profile';
import Discover from './components/Discover';

function App() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <div className='container'>
          <div className='row'>
            <div className='side-panel col-2 d-flex flex-column'>
              {/* link routes to correspond buttons */}
              <Link to='/discover' className='btn btn-light'>Discover</Link>
              <Link to='/create' className='btn btn-light'>Create</Link>
              <Link to='/profile' className='btn btn-light'>My Profile</Link>
            </div>
            <div className='main-content col-10'>
              <Routes>
                {/* default page */}
                <Route index element={<Discover />} />
                <Route path='discover' element={<Discover />} />
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
