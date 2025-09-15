'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step of the application
    router.push('/apply/personal');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to application...</p>
      </div>
    </div>
  );
}