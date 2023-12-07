import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
    navigate('/');
  };

  return (
    <nav className="navbar bg-white fixed-top">
      <div className='container'>
        <a className="navbar-brand">PathPal</a>
        <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
          <input
            className="form-control me-2 search-field"
            type="search"
            placeholder="Search for paths with places"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/about">About Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}