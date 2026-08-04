import React, { useState } from 'react';
import { hashPasscode, PASSCODE_HASH } from '../utils/cryptoUtils';

export default function AuthModal({ onAuthenticate }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (!cleanPass) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const lowerPass = cleanPass.toLowerCase();
      const inputHash = await hashPasscode(cleanPass);
      
      // Accepts 'ar786' (case-insensitive & trimmed) OR SHA-256 hash match
      if (lowerPass === 'ar786' || inputHash === PASSCODE_HASH) {
        onAuthenticate();
      } else {
        setErrorMsg('Incorrect passcode');
      }
    } catch (err) {
      setErrorMsg('Error verifying passcode');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div 
        className="auth-card"
        style={{
          maxWidth: '320px',
          width: '88%',
          borderRadius: '16px',
          padding: '2.5rem 1.8rem 2rem',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Direct AR Monogram Logo (No Calendar Frame) */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/ar_logo.png" 
            alt="AR Logo" 
            style={{ 
              height: '48px', 
              width: 'auto',
              display: 'block',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Clean, Simple Form with Two Equal Empty Boxes (Matching AR Schedule) */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Empty Password Input Box */}
          <input
            type="password"
            className="auth-input"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            autoFocus
            required
            style={{
              width: '100%',
              height: '44px',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
              padding: '0 1rem',
              borderRadius: '10px',
              textAlign: 'center',
              outline: 'none'
            }}
          />

          {/* Empty Submit Button Box */}
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isSubmitting}
            aria-label="Submit Password"
            style={{
              width: '100%',
              height: '44px',
              boxSizing: 'border-box',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          />

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.76rem', textAlign: 'center', marginTop: '0.25rem' }}>
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
