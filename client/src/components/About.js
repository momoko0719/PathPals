import React from "react";

export default function Detail() {
  return (
    <div>
      <div className="card p-3">
        <div className="card-body">
          <h3>Our Mission</h3>
          <h5 className="text-primary pt-3">
            Empowering Student Adventures: Simplify. Explore. Connect.
          </h5>
          <p>
            Welcome to PathPals, where our passion is to revolutionize the
            travel experiences of college students. Our app is the perfect
            companion for those planning weekend escapades, immersive cultural
            experiences, or extended vacations during academic breaks.
          </p>

          <h5 className="text-primary">Why PathPals?</h5>
          <ul>
            <li>
              Seamless Travel Planning: PathPals offers a user-friendly
              interface for effortless creation and exploration of travel
              itineraries.
            </li>
            <li>
              Building a Community: PathPals isn’t just about travel planning;
              it’s a vibrant social platform. Here, students can share their
              travel tales, connect over common interests, and inspire each
              other, creating a robust community of young adventurers.
            </li>
          </ul>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <div className="card-body">
          <h3>Meet Our Team</h3>

          <p className="mt-3">INFO 441 autumn 2023 Group 12</p>
          <div className="d-inline bg-white text-dark">Allison Ho</div>
          <div className="d-inline p-3 bg-white text-dark">Sam You</div>
          <div className="d-inline p-3 bg-white text-dark">Ella Tao</div>
          <div className="d-inline p-3 bg-white text-dark">Leul Demelie</div>
        </div>
      </div>
    </div>
  );
}
