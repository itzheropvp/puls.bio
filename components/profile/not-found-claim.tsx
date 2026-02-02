import Link from 'next/link';
import LoggedInBanner from './logged-in-banner';

interface NotFoundClaimPageProps {
  username: string;
  currentUser?: { 
    username?: string;
  } | null;
}

export default function NotFoundClaimPage({ username, currentUser }: NotFoundClaimPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Logged in banner if user is logged in */}
      {currentUser?.username && (
        <LoggedInBanner 
          username={username} 
        />
      )}

      <div className="bg-zinc-900/50 border border-white/10 backdrop-blur-sm max-w-md w-full rounded-2xl p-8">
        <div className="text-center">
          {/* Exclamation Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Username not found</h1>
          <p className="text-gray-400 text-sm mb-8">
            Claim this username by clicking on the button below!
          </p>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition-colors font-medium"
            >
              Go Home
            </Link>
            <Link
              href={`/register?claim=${username}`}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-center transition-all font-medium"
            >
              Claim Now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}