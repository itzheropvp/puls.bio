'use client';

import Link from 'next/link';
import { useState } from 'react';

interface LoggedInBannerProps {
  username: string;
}

export default function LoggedInBanner({ username }: LoggedInBannerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-white/10 z-50">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400">
              Currently logged in as <span className="text-white font-medium">@{username}</span>
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/account`}
              className="inline-flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Modify
            </Link>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy Profile URL'}
            </button>
            <Link
              href="/help"
              className="inline-flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}