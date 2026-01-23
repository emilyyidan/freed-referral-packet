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
  );
}
