import React from 'react';

export default function NavBar() {
  return (
    <nav className="navbar bg-white fixed-top">
      <div className='container'>
        <a className="navbar-brand">PathPal</a>
        <form className="d-flex" role="search">
          <input className="form-control me-2 search-field" type="search" placeholder="Search for paths with places" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#">About Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}