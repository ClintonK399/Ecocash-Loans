import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ApplyPage from './ApplyPage';
import OTPPage from './OTPPage';
import ConfirmPinPage from './ConfirmPinPage'; // <-- IMPORT THIS
import SuccessPage from './SuccessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/confirm-pin" element={<ConfirmPinPage />} /> {/* <-- ADD THIS */}
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;