import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const amount = location.state?.amount || 50000;
  const phone = location.state?.phone || '771234567';

  const formatCurrency = (val: number) => `ZWG ${val.toLocaleString()}`;

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, #0b40c4 0%, #1e5ce6 100%)', padding: '20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'white', color: '#0b40c4', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', fontStyle: 'italic' }}>ECONET <span style={{fontSize: '7px', display: 'block'}}>Wireless</span></div>
          <div style={{ color: '#e53935', fontWeight: 800, fontSize: '14px', background: 'white', padding: '4px 8px', borderRadius: '6px' }}>EcoCash</div>
        </div>
      </div>

      <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0, 200, 83, 0.15)' }}>
          <CheckCircle2 size={48} color="#00c853" />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#003B73', margin: '0 0 12px 0', textAlign: 'center' }}>Application Successful!</h1>
        <p style={{ fontSize: '15px', color: '#666', textAlign: 'center', lineHeight: 1.6, marginBottom: '32px' }}>
          Your loan request has been approved. The funds will be disbursed to your EcoCash wallet shortly.
        </p>

        <div style={{ backgroundColor: 'white', width: '100%', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e0e0e0', paddingBottom: '16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>Approved Amount</span>
            <span style={{ fontSize: '20px', color: '#00c853', fontWeight: 800 }}>{formatCurrency(amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>Disbursed To</span>
            <span style={{ fontSize: '15px', color: '#111', fontWeight: 600 }}>+263 {phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>Status</span>
            <span style={{ fontSize: '12px', backgroundColor: '#e8f5e9', color: '#00c853', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>APPROVED</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          style={{ width: '100%', padding: '18px', backgroundColor: '#1e5ce6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(30, 92, 230, 0.3)', marginTop: 'auto', transition: 'transform 0.1s' }}
        >
          <Home size={20} /> Return to Home
        </button>

        <p style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginTop: '24px', fontWeight: 600, letterSpacing: '0.5px' }}>POWERED BY ECONET WIRELESS · ECOCASH</p>
      </div>
    </div>
  );
}