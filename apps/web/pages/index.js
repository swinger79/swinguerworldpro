import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>🎉 SwinguerWorldPro - Frontend</h1>
      <h2>Usuarios en la BD:</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email} - Plan: {user.plan}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
