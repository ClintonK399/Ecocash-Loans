import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ApplyPage from './ApplyPage';
import OTPPage from './OTPPage';
import SuccessPage from './SuccessPage'; // <-- Import this

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/success" element={<SuccessPage />} /> {/* <-- Add this route */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;