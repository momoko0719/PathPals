import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(users => setUsers(users))
  }, [])

  return (
    <div>
      <ul>
        {
          users.map((user, index) => {
            return (
              <li key={index}>Place Name: {user.place_name}</li>
            )
          })
        }
      </ul>
    </div>
  )
}