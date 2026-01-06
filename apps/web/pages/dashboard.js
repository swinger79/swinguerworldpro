import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <p>⏳ Cargando...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📊 Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => router.push('/premium')}
            style={{
              padding: '10px 20px',
              background: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            💎 Premium
          </button>
          <button
            onClick={() => router.push('/chat')}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💬 Chat
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#e7f3ff',
        borderRadius: '5px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196F3'
      }}>
        <h2>👤 {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Plan:</strong> <span style={{ color: user.plan === 'FREE' ? '#666' : '#ffc107', fontWeight: 'bold' }}>{user.plan}</span></p>
      </div>

      <h2>👥 Usuarios ({users.length})</h2>
      {loading ? (
        <p>⏳ Cargando...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Plan</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{u.name}</td>
                <td style={{ padding: '10px' }}>{u.email}</td>
                <td style={{ padding: '10px' }}>{u.plan}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: u.online ? '#28a745' : '#ccc', marginRight: '5px' }} />
                  {u.online ? 'Online' : 'Offline'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
