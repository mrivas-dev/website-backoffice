'use client';

import { env } from '@/lib/env';
import type { LoginScreenProps } from '@/components/Login/types';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: '#090912',
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  animation: 'fadeUp 0.3s ease',
};

const heroStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 24px 24px',
};

const terminalCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 320,
  background: '#0d0d1a',
  border: '1px solid #1a1a2e',
  borderRadius: 8,
  overflow: 'hidden',
};

const titleBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: '10px 12px',
  borderBottom: '1px solid #1a1a2e',
};

const dotStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: '#1e1e32',
};

const titleBarLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#1e1e32',
};

const terminalBodyStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: 11,
  lineHeight: 1.9,
  color: '#252540',
};

const cursorStyle: React.CSSProperties = {
  animation: 'blink 1s step-end infinite',
  color: '#4ade80',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#4ade80',
  marginTop: 20,
  marginBottom: 4,
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#252540',
};

const sheetStyle: React.CSSProperties = {
  background: '#0d0d1a',
  borderTop: '1px solid #1a1a2e',
  borderRadius: '18px 18px 0 0',
  padding: '28px 24px 40px',
};

const handleStyle: React.CSSProperties = {
  width: 36,
  height: 3,
  background: '#1a1a2e',
  borderRadius: 2,
  margin: '0 auto 20px',
};

const errorBannerStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#f87171',
  background: 'rgba(248,113,113,0.07)',
  border: '1px solid rgba(248,113,113,0.25)',
  borderRadius: 4,
  padding: '10px 13px',
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: '#3a3a5c',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 14,
  color: '#e0e0e8',
  background: '#060610',
  border: '1px solid #1a1a2e',
  borderRadius: 6,
  padding: '14px 16px',
  outline: 'none',
  marginBottom: 16,
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 13,
  fontWeight: 700,
  color: '#050510',
  background: '#4ade80',
  border: 'none',
  borderRadius: 6,
  padding: '15px 16px',
  cursor: 'pointer',
};

const footnoteStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#1e1e32',
  textAlign: 'center',
  marginTop: 16,
};

export function LoginScreenMobile({
  email,
  password,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onKeyDown,
  onSubmit,
  buttonText,
}: LoginScreenProps) {
  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={terminalCardStyle}>
          <div style={titleBarStyle}>
            <div style={{ position: 'absolute', left: 12, display: 'flex', gap: 6 }}>
              <span style={dotStyle} />
              <span style={dotStyle} />
              <span style={dotStyle} />
            </div>
            <span style={titleBarLabelStyle}>analytics</span>
          </div>
          <div style={terminalBodyStyle}>
            <div>~ node server.js</div>
            <div>listening on :3000</div>
            <div>db connected</div>
            <div>~ curl /api/analytics</div>
            <div>{'{"status":"auth required"}'}</div>
            <div>
              ~ <span style={cursorStyle}>▋</span>
            </div>
          </div>
        </div>
        <h1 style={heroTitleStyle}>Portfolio Analytics</h1>
        <p style={heroSubtitleStyle}>sign in to continue</p>
      </div>

      <div style={sheetStyle}>
        <div style={handleStyle} />

        {error && <div style={errorBannerStyle}>{error}</div>}

        <label style={labelStyle} htmlFor="login-email-mobile">
          Email
        </label>
        <input
          id="login-email-mobile"
          type="email"
          value={email}
          placeholder="admin@portfolio.dev"
          style={inputStyle}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <label style={labelStyle} htmlFor="login-password-mobile">
          Password
        </label>
        <input
          id="login-password-mobile"
          type="password"
          value={password}
          placeholder="••••••••"
          autoComplete="current-password"
          style={inputStyle}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          type="button"
          style={{
            ...buttonStyle,
            opacity: submitting ? 0.7 : 1,
          }}
          disabled={submitting}
          onClick={onSubmit}
        >
          {buttonText}
        </button>

        {env.allowDemoLogin && (
          <p style={footnoteStyle}>API offline? Any credentials grant demo access.</p>
        )}
      </div>
    </div>
  );
}
