'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ReferralRedirectPage() {
  const router = useRouter();
  const params = useParams<{ code?: string }>();
  const code = params?.code || '';

  useEffect(() => {
    if (!code) {
      router.replace('/lister/connectors');
      return;
    }

    const target = `/lister/connectors?ref=${encodeURIComponent(code)}`;
    router.replace(target);
  }, [code, router]);

  return (
    <div className="min-h-screen bg-[#14171A] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-purple-400" />
        <p className="text-sm text-white/70">Redirecting to signup...</p>
      </div>
    </div>
  );
}
