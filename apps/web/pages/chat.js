import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    // Conectar WebSocket
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('✅ WebSocket conectado');
      // Notificar que el usuario se unió
      ws.current.send(JSON.stringify({
        type: 'join',
        userId: currentUser.id,
        userName: currentUser.name
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.data]);
      }

      if (data.type === 'user_joined') {
        console.log(`${data.userName} se conectó`);
      }

      if (data.type === 'user_left') {
        console.log('Un usuario se desconectó');
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [router]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    ws.current.send(JSON.stringify({
      type: 'message',
      userId: user.id,
      userName: user.name,
      text: newMessage
    }));

    setNewMessage('');
  };

  if (!user) return <p>⏳ Cargando...</p>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        background: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>💬 Chat Global</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          style={{
            padding: '8px 16px',
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

      {/* Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Sé el primero en enviar un mensaje 👋
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              marginBottom: '15px',
              display: 'flex',
              gap: '10px',
              animation: 'slideIn 0.3s ease'
            }}>
              <img
                src={msg.avatar}
                alt={msg.userName}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%'
                }}
              />
              <div>
                <strong>{msg.userName}</strong>
                <br />
                <div style={{
                  background: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  marginTop: '5px',
                  maxWidth: '500px'
                }}>
                  {msg.text}
                </div>
                <small style={{ color: '#999' }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '20px',
        background: 'white',
        borderTop: '1px solid #ddd',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Enviar
        </button>
      </form>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
