import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { verifyPasscode } from '../utils/cryptoUtils';

export default function AuthModal({ onAuthenticate }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const isValid = await verifyPasscode(passcode);
      if (isValid) {
        onAuthenticate();
      } else {
        setErrorMsg('Incorrect passcode. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Authentication error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        {/* Calendar Box Monogram Logo Frame */}
        <div className="auth-calendar-logo-frame">
          <img 
            src="/ar_logo.png" 
            alt="AR Monogram Logo" 
            className="auth-logo-img"
          />
        </div>

        <div className="auth-title-group">
          <h2>AR To Do</h2>
          <p>Secure Task Management & Weekly Planner</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-input-group">
          <input
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
            required
          />

          {errorMsg && <div className="auth-error-msg">{errorMsg}</div>}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Unlock Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
