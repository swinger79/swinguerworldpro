import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Premium() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchPlans();
  }, [router]);

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:3001/plans');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUpgrade = async (planName) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planName })
      });

      const data = await res.json();

      if (data.sessionId) {
        // En producción, usar Stripe checkout
        alert(`✅ En desarrollo: Plan ${planName} activado\n\nEn producción usarías Stripe Checkout.\n\nSession ID: ${data.sessionId}`);

        // Simular pago completado
        const verifyRes = await fetch('http://localhost:3001/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sessionId: data.sessionId,
            plan: planName
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          localStorage.setItem('user', JSON.stringify(verifyData.user));
          alert(`✅ ¡Bienvenido al plan ${planName}!`);
          router.push('/dashboard');
        }
      }
    } catch (err) {
      alert('Error al procesar el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>⏳ Cargando...</p>;

  const planOrder = ['FREE', 'PRO', 'ADVANCED', 'ELITE', 'DIAMOND'];

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'Arial', background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>💎 Planes Premium</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Tu plan actual: <strong>{user.plan}</strong>
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {planOrder.map(planKey => {
            const plan = plans[planKey];
            if (!plan) return null;

            const isCurrentPlan = user.plan === planKey;
            const price = plan.price === 0 ? 'Gratis' : `$${(plan.price / 100).toFixed(2)}/mes`;

            return (
              <div key={planKey} style={{
                border: isCurrentPlan ? '3px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: isCurrentPlan ? '#e7f3ff' : 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ marginTop: 0 }}>{plan.name}</h2>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>
                  {price}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      ✅ {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'default',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Plan actual
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: loading ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: loading ? 'default' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Procesando...' : 'Actualizar'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 30px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
