'use client';

import { env } from '@/lib/env';
import type { LoginScreenProps } from '@/components/Login/types';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#090912',
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  padding: '24px',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 360,
  background: '#0d0d1a',
  border: '1px solid #1a1a2e',
  borderRadius: 6,
  padding: 40,
  animation: 'fadeUp 0.35s ease',
};

const headingStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#4ade80',
  letterSpacing: '-0.02em',
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#252540',
  margin: '6px 0 24px',
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
  fontSize: 13,
  color: '#e0e0e8',
  background: '#060610',
  border: '1px solid #1a1a2e',
  borderRadius: 4,
  padding: '10px 13px',
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
  borderRadius: 4,
  padding: '12px 16px',
  cursor: 'pointer',
};

const footnoteStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#1e1e32',
  textAlign: 'center',
  marginTop: 16,
};

export function LoginScreenDesktop({
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
      <div style={cardStyle}>
        <h1 style={headingStyle}>$ analytics --login</h1>
        <p style={subheadingStyle}>Portfolio Dashboard</p>

        {error && <div style={errorBannerStyle}>{error}</div>}

        <label style={labelStyle} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          placeholder="admin@portfolio.dev"
          style={inputStyle}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <label style={labelStyle} htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
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
