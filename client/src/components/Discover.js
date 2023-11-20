import React from 'react';

export default function Discover() {
  let paths = [];
  for (let i = 0; i < 6; i++) {
    paths.push(
      <div className='col' key={i}>
        <PathCard />
      </div>
    );
  }

  return (
    <div className='content-container'>
      <div className='content-controllers'>
        <Controllers />
      </div>
      <div className='content-cards row row-cols-3'>
        {paths}
      </div>
    </div>
  );
}

function Controllers() {
  return (
    <div className='row'>
      <div className='col-2'>
        Controller 1
      </div>
      <div className='col-2'>
        Controller 2
      </div>
      <div className='col-2'>
        Controller 3
      </div>
    </div>
  )
}

function PathCard() {
  return (
    <div className="card">
      <img src="" className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  );
}