'use client';

import { resetState } from '@/lib/referralState';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type ResetStatus = 'idle' | 'resetting' | 'success';

export default function DemoBanner() {
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>('idle');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleReset = async () => {
    if (status !== 'idle') return;

    if (confirm('Reset the demo? This will clear all referral progress.')) {
      setStatus('resetting');

      // Small delay to show the resetting state
      await new Promise(resolve => setTimeout(resolve, 500));

      resetState();

      // Dispatch custom event so components can reset their state
      window.dispatchEvent(new CustomEvent('demo-reset'));

      setStatus('success');

      // Navigate after showing success briefly
      setTimeout(() => {
        router.push('/freed');
      }, 800);
    }
  };

  return (
    <div className={`demo-banner ${status !== 'idle' ? 'demo-banner--active' : ''}`}>
      <span>
        <strong>Demo Mode</strong> — This is a prototype demonstrating the Freed referral packet feature
      </span>
      <button
        onClick={handleReset}
        disabled={status !== 'idle'}
        className={status !== 'idle' ? 'demo-banner__button--active' : ''}
      >
        {status === 'idle' && 'Reset Demo'}
        {status === 'resetting' && (
          <>
            <span className="demo-spinner" />
            Resetting...
          </>
        )}
        {status === 'success' && (
          <>
            <span className="demo-checkmark">✓</span>
            Reset Complete
          </>
        )}
      </button>
    </div>
  );
}
