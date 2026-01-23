'use client';

import { resetState } from '@/lib/referralState';
import { useRouter } from 'next/navigation';

export default function DemoBanner() {
  const router = useRouter();

  const handleReset = () => {
    if (confirm('Reset the demo? This will clear all referral progress.')) {
      resetState();
      router.push('/freed');
      router.refresh();
    }
  };

  return (
    <div className="demo-banner">
      <span>
        <strong>Demo Mode</strong> — This is a prototype demonstrating the Freed referral packet feature
      </span>
      <button onClick={handleReset}>
        Reset Demo
      </button>
    </div>
  );
}
