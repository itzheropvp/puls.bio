'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type UserMeResponse = {
  id: string;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  percentile?: number;
  page: {
    views: number;
  } | null;
  links: Array<{
    id: string;
    title: string;
    visible: boolean;
  }>;
  connections: Array<{
    id: string;
    provider: string;
  }>;
  alias?: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState<UserMeResponse | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      try {
        setLoadingUserData(true);
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = (await res.json()) as UserMeResponse;
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Unable to load account data');
      } finally {
        if (isMounted) {
          setLoadingUserData(false);
        }
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const res = await fetch('/api/user/analytics');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAnalyticsData(data);
          }
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        if (isMounted) {
          setLoadingAnalytics(false);
        }
      }
    };

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const username = userData?.username || (session?.user as any)?.username || 'user';
    const hasAvatar = Boolean(userData?.avatarUrl || (session?.user as any)?.image);
    const hasBio = Boolean(userData?.bio && userData.bio.trim().length > 0);
    const hasDiscord = userData?.connections?.some((c) => c.provider === 'discord') || false;
    const hasSocials = (userData?.links?.filter((l) => l.visible).length || 0) > 0;
    const currentAlias = userData?.alias || 'Unavailable';

    const completedTasks = [
      { id: 1, label: 'Upload An Avatar', completed: hasAvatar },
      { id: 2, label: 'Add A Description', completed: hasBio },
      { id: 3, label: 'Link Discord Account', completed: hasDiscord },
      { id: 4, label: 'Add Socials', completed: hasSocials },
    ];

    const completedCount = completedTasks.filter((task) => task.completed).length;
    const profileCompletion = Math.round((completedCount / completedTasks.length) * 100);

    const pageViews = userData?.page?.views ?? 0;
    const percentile = userData?.percentile ?? 0;
    const percentileMessage = percentile === 0 
      ? 'Calculating...' 
      : `Joined in the ${percentile}th percentile`;

    return {
      username,
      alias: currentAlias,
      uid: userData?.id || '—',
      profileViews: pageViews,
      viewsChange: `${pageViews} total views`,
      profileCompletion,
      completedTasks,
      percentile,
      percentileMessage,
    };
  }, [userData, session?.user]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    await signOut({ redirect: false });
    toast.dismiss(loadingToast);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full bg-[#0f0f14]/95 backdrop-blur-xl border-r border-white/5 z-40 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            {sidebarCollapsed ? (
              <Image
                src="/logo.png"
                alt="puls.pw logo"
                width={40}
                height={40}
                className="rounded-lg shrink-0"
              />
            ) : (
              <Image
                src="/logo_all_white.png"
                alt="puls.pw logo"
                width={100}
                height={32}
                className="h-auto"
              />
            )}
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              label="Account"
              active
              collapsed={sidebarCollapsed}
              subItems={!sidebarCollapsed ? ['Overview', 'Analytics', 'Badges', 'Settings'] : []}
            />

            <NavItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              }
              label="Customize"
              collapsed={sidebarCollapsed}
              onClick={() => router.push('/account/customize')}
            />

            <NavItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              }
              label="Links"
              collapsed={sidebarCollapsed}
              onClick={() => router.push('/account/links')}
            />

            <NavItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              }
              label="Templates"
              collapsed={sidebarCollapsed}
              onClick={() => router.push('/account/templates')}
            />
          </nav>

          <div className="space-y-2 pt-4 border-t border-white/5">
            {!sidebarCollapsed && (
              <p className="text-xs text-gray-500 px-4 mb-2">
                Have a question or need support?
              </p>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => window.open('https://help.puls.pw', '_blank')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {!sidebarCollapsed && 'Help Center'}
            </Button>

            {!sidebarCollapsed && (
              <p className="text-xs text-gray-500 px-4 mb-2">Check out your page</p>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => window.open(`https://puls.pw/${stats.username}`, '_blank')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {!sidebarCollapsed && 'My Page'}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/5 mt-4"
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_APP_URL}/share`, '_blank')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {!sidebarCollapsed && 'Share Profile'}
            </Button>

            {!sidebarCollapsed && (
              <div className="pt-4 border-t border-white/5 relative">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  {userData?.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={stats.username}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold shrink-0">
                      {stats.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{stats.username}</p>
                    <p className="text-xs text-gray-500 truncate">UID {stats.uid}</p>
                  </div>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-500 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/account/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </button>
                    <div className="h-px bg-white/10" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      <main
        className={`flex-1 relative transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black mb-2">Account Overview</h1>
            {loadingUserData && (
              <p className="text-sm text-gray-500">Loading account data...</p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">Username</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{stats.username}</p>
                <p className="text-xs text-purple-400">Change available now</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">Alias</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{stats.alias}</p>
                <p className="text-xs text-purple-400">Change available now</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">UID</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{stats.uid}</p>
                <p className="text-xs text-gray-500">{stats.percentileMessage}</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">Profile Views</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{stats.profileViews}</p>
                <p className="text-xs text-gray-500">{stats.viewsChange}</p>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6">
                <h2 className="text-xl font-bold mb-6">Account Statistics</h2>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Profile Completion</h3>
                    <span className="text-sm text-gray-400">{stats.profileCompletion}% completed</span>
                  </div>
                  <div className="w-full h-3 bg-[#2a2a3e] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.profileCompletion}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-400 mb-1">
                      Your profile isn't complete yet!
                    </p>
                    <p className="text-xs text-gray-400">
                      Complete your profile to make it more discoverable and appealing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {stats.completedTasks.map((task, index) => (
                    <motion.button
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                        task.completed
                          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                          : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                      }`}
                    >
                      {task.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-white/10 rounded-full shrink-0" />
                      )}
                      <span className="text-sm">{task.label}</span>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6">
                <h2 className="text-xl font-bold mb-2">Manage your account</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Change your email, username and more.
                </p>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30"
                    onClick={() => router.push('/account/username')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Change Username
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30"
                    onClick={() => router.push('/account/display-name')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Change Display Name
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30"
                    onClick={() => router.push('/account/settings')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Account Settings
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium mb-3">Connections</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Link your Discord account to puls.pw
                  </p>
                  <Button
                    className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    disabled
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Coming Soon..
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-[#1a1a24]/80 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Account Analytics</h2>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                  View More
                </Button>
              </div>

              {loadingAnalytics ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Loading chart...</p>
                  </div>
                  <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Loading chart...</p>
                  </div>
                </div>
              ) : analyticsData ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-4">
                      Profile Views in the last 7 days
                    </p>
                    <div className="h-48 bg-white/5 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.profileViews || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="day" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a24',
                              border: '1px solid #ffffff10',
                              borderRadius: '8px',
                            }}
                            formatter={(value) => [value, 'Views']}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#a855f7"
                            strokeWidth={2}
                            dot={{ fill: '#a855f7', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-4">
                      Visitor Devices in the last 7 days
                    </p>
                    <div className="h-48 bg-white/5 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.deviceTypes || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="device" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a24',
                              border: '1px solid #ffffff10',
                              borderRadius: '8px',
                            }}
                            formatter={(value) => [value, 'Count']}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">No data available yet</p>
                  </div>
                  <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">No data available yet</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  subItems = [],
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  subItems?: string[];
  badge?: string;
  onClick?: () => void;
}) {
  const [expanded, setExpanded] = useState(active);

  return (
    <div>
      <button
        onClick={() => {
          if (onClick) onClick();
          if (subItems.length > 0) setExpanded(!expanded);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? 'bg-purple-600/20 text-purple-400'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon}
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium">{label}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                {badge}
              </span>
            )}
            {subItems.length > 0 && (
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </>
        )}
      </button>

      {!collapsed && expanded && subItems.length > 0 && (
        <div className="ml-12 mt-2 space-y-1">
          {subItems.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
