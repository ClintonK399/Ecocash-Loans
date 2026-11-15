import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ShieldCheck, Smartphone, CreditCard, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Reference for the "How it works" section
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Function to smoothly scroll to that section
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    { q: "Who can apply for an EcoCash loan?", a: "You need to be 18 years or older, a Zimbabwean resident, and have a valid National ID, an active EcoCash number, and a regular source of income." },
    { q: "How much can I borrow in ZWG?", a: "You can borrow from ZWG 5,000 up to ZWG 800,000." },
    { q: "How fast will I get the money?", a: "Most applications get a decision within 10 minutes, and funds are usually disbursed to your EcoCash wallet within 24 hours." },
    { q: "What does it cost?", a: "We charge a flat rate of 3% per month on the principal amount. There are no hidden fees." },
  ];

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #003B73 0%, #005A9C 100%)', padding: '40px 20px', color: 'white', textAlign: 'center', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
          🇿🇼 Built for Zimbabwe · ZWG 5,000 – ZWG 800,000
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>
          ZWG loans,<br/><span style={{ color: '#FFCC00' }}>made simple.</span>
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.9, marginBottom: '24px' }}>
          Borrow from ZWG 5,000 to ZWG 800,000 and repay over 1 to 24 months. Apply online in minutes — no paperwork, no branch queues, no collateral.
        </p>
        
        <button 
          onClick={() => navigate('/apply')} 
          style={{ width: '100%', padding: '16px', backgroundColor: '#FFCC00', color: '#003B73', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', transition: 'transform 0.1s', boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)' }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Get started →
        </button>
        
        <button 
          onClick={scrollToHowItWorks}
          style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '30px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '24px', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        >
          How it works
        </button>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFCC00"/> No collateral</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFCC00"/> Payout to EcoCash</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#FFCC00"/> Decision in ~10 min</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '30px 20px', borderBottom: '1px solid #eee' }}>
        <div><h2 style={{ fontSize: '24px', fontWeight: 800, color: '#005A9C', margin: 0 }}>ZWG 25M+</h2><p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Disbursed (EcoCash data)</p></div>
        <div><h2 style={{ fontSize: '24px', fontWeight: 800, color: '#005A9C', margin: 0 }}>10 min</h2><p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Average decision time</p></div>
        <div><h2 style={{ fontSize: '24px', fontWeight: 800, color: '#005A9C', margin: 0 }}>24 hrs</h2><p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Payout to EcoCash</p></div>
        <div><h2 style={{ fontSize: '24px', fontWeight: 800, color: '#005A9C', margin: 0 }}>4.7 / 5</h2><p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Customer rating</p></div>
      </div>

      {/* How it Works */}
      <div ref={howItWorksRef} style={{ padding: '40px 20px', backgroundColor: '#f8f9fc', scrollMarginTop: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(0,90,156,0.1)', color: '#005A9C', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#003B73', margin: '0 0 10px 0' }}>From application to cash in 4 steps</h2>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>The whole process happens on your phone.</p>
        </div>

        {[
          { num: 1, title: 'Apply online', desc: 'Fill in the short form — your name, phone number and how much you need.' },
          { num: 2, title: 'Get a decision', desc: 'Our system reviews your application and comes back with an answer in about 10 minutes.' },
          { num: 3, title: 'Verify & sign', desc: 'Confirm your identity with a one-time PIN sent to your phone. No printing, no queues.' },
          { num: 4, title: 'Get your Cash', desc: 'Money lands in your EcoCash wallet — usually within 24 hours.' }
        ].map((step) => (
          <div key={step.num} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#003B73', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '12px' }}>{step.num}</div>
            <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', color: '#333' }}>{step.title}</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '40px 20px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(0,90,156,0.1)', color: '#005A9C', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>WHY ECOCASH LOANS</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#003B73', margin: '0 0 10px 0' }}>Borrowing that respects your time and your wallet</h2>
        </div>
        
        {[
          { icon: <Clock size={24}/>, title: 'Fast decisions', desc: 'Most applications get a yes or no within 10 minutes, any day of the week.' },
          { icon: <ShieldCheck size={24}/>, title: 'Safe and private', desc: 'Your National ID and personal details are encrypted and never sold.' },
          { icon: <Smartphone size={24}/>, title: 'Mobile money first', desc: 'Disbursements and repayments work directly with EcoCash.' },
          { icon: <CreditCard size={24}/>, title: 'No hidden fees', desc: 'What you agree to is what you repay. No mystery deductions.' },
          { icon: <Calendar size={24}/>, title: 'Flexible terms', desc: 'Choose 1 to 24 months. Settle early at any time.' }
        ].map((feat, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '16px', display: 'flex', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', transition: 'transform 0.2s' }}>
            <div style={{ backgroundColor: '#FFF8E1', padding: '10px', borderRadius: '12px', color: '#FFCC00', height: 'fit-content' }}>{feat.icon}</div>
            <div>
              <h3 style={{ fontSize: '15px', margin: '0 0 4px 0', color: '#333' }}>{feat.title}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{ padding: '40px 20px', backgroundColor: '#f8f9fc' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(0,90,156,0.1)', color: '#005A9C', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>CUSTOMERS</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#003B73', margin: 0 }}>What Zimbabweans are saying</h2>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
          <div style={{ color: '#FFCC00', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
          <p style={{ fontSize: '14px', color: '#444', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>"I applied on a Sunday evening and the money was in my EcoCash by Monday morning. Paid my daughter's school fees without stressing."</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#005A9C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>TM</div>
            <div><h4 style={{ margin: 0, fontSize: '14px', color: '#111' }}>Tendai M.</h4><p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Harare</p></div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
          <div style={{ color: '#FFCC00', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
          <p style={{ fontSize: '14px', color: '#444', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>"What I liked is that there were no surprise charges. The repayment I was quoted was exactly what I paid back."</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#005A9C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>CK</div>
            <div><h4 style={{ margin: 0, fontSize: '14px', color: '#111' }}>Chipo K.</h4><p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Bulawayo</p></div>
          </div>
        </div>
      </div>

      {/* FAQs & CTA */}
      <div style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(0,90,156,0.1)', color: '#005A9C', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>FAQ</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#003B73', margin: 0 }}>Questions Zimbabweans ask us</h2>
        </div>
        
        {faqs.map((faq, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #eee', transition: 'all 0.2s' }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600, color: '#333' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {faq.q}
              {openFaq === i ? <ChevronUp size={18} color="#005A9C" /> : <ChevronDown size={18} color="#005A9C" />}
            </div>
            {openFaq === i && <div style={{ padding: '0 16px 16px 16px', fontSize: '14px', color: '#666', lineHeight: 1.5 }}>{faq.a}</div>}
          </div>
        ))}

        <div style={{ background: 'linear-gradient(135deg, #003B73 0%, #005A9C 100%)', padding: '30px 20px', borderRadius: '20px', textAlign: 'center', color: 'white', marginTop: '20px', boxShadow: '0 8px 24px rgba(0, 59, 115, 0.2)' }}>
          <h2 style={{ fontSize: '22px', margin: '0 0 10px 0' }}>Ready to get your ZWG?</h2>
          <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '20px' }}>Apply in under three minutes. You'll need your phone number and your EcoCash wallet.</p>
          <button 
            onClick={() => navigate('/apply')} 
            style={{ width: '100%', padding: '16px', backgroundColor: '#FFCC00', color: '#003B73', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get started →
          </button>
        </div>
      </div>
    </div>
  );
}