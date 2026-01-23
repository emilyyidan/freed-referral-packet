'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeftRight } from 'lucide-react';

export default function NavigationButton() {
  const router = useRouter();
  const pathname = usePathname();

  const isEHR = pathname.startsWith('/ehr');

  const handleNavigate = () => {
    if (isEHR) {
      router.push('/freed');
    } else {
      router.push('/ehr');
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleNavigate}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isEHR
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
      >
        <ArrowLeftRight size={16} />
        {isEHR ? 'Return to Freed' : 'See EHR for patient'}
      </button>
      {!isEHR && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg max-w-[220px]">
          For this demo we are mocking an EHR that contains the necessary info for referral
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
