'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

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
    url: string;
    visible: boolean;
  }>;
  connections: Array<{
    id: string;
    provider: string;
  }>;
  alias?: string | null;
};

export default function CustomizePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<UserMeResponse | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [bio, setBio] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
          setBio(data.bio || '');
        }
      } catch (error) {
        console.error(error);
        toast.error('Unable to load profile data');
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

  const handleSaveBio = async () => {
    try {
      setSavingBio(true);
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio }),
      });

      if (!res.ok) throw new Error('Failed to update bio');
      toast.success('Bio updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          const res = await fetch('/api/user/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarData: base64 }),
          });

          if (!res.ok) throw new Error('Failed to upload avatar');
          
          const data = await res.json();
          setUserData((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : null);
          setAvatarPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          toast.success('Avatar updated successfully');
        } catch (error) {
          console.error(error);
          toast.error('Failed to upload avatar');
        } finally {
          setUploadingAvatar(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload avatar');
      setUploadingAvatar(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error('Please fill in both fields');
      return;
    }

    try {
      setAddingLink(true);
      const res = await fetch('/api/user/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLinkTitle,
          url: newLinkUrl,
          visible: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to add link');
      
      const newLink = await res.json();
      setUserData((prev) =>
        prev ? { ...prev, links: [...prev.links, newLink] } : null
      );
      setNewLinkTitle('');
      setNewLinkUrl('');
      setShowLinkForm(false);
      toast.success('Link added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add link');
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const res = await fetch(`/api/user/links/${linkId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete link');
      
      setUserData((prev) =>
        prev ? { ...prev, links: prev.links.filter((l) => l.id !== linkId) } : null
      );
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete link');
    }
  };

  const handleToggleLinkVisibility = async (linkId: string, currentVisibility: boolean) => {
    try {
      const res = await fetch(`/api/user/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisibility }),
      });

      if (!res.ok) throw new Error('Failed to update link visibility');
      
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              links: prev.links.map((l) =>
                l.id === linkId ? { ...l, visible: !currentVisibility } : l
              ),
            }
          : null
      );
      toast.success('Link visibility updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update link visibility');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0a2e] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Account
          </button>
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Customize your profile
            </h1>
            <p className="text-gray-400 text-lg">Make your profile unique and tell your story to the world</p>
          </div>
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1a1a24]/90 to-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Profile Picture</h3>
                <p className="text-gray-400">Stand out with a unique avatar</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative w-40 h-40 mx-auto">
                  {avatarPreview || userData?.avatarUrl ? (
                    <Image
                      src={avatarPreview || userData?.avatarUrl || ''}
                      alt="Avatar"
                      fill
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center">Current Avatar</p>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    isDragOver
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5'
                  }`}
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-white font-bold mb-1">Click or drag to upload</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF (max. 5MB)</p>
                </motion.button>

                {avatarPreview && (
                  <Button
                    onClick={() => {
                      const file = fileInputRef.current?.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                    disabled={uploadingAvatar}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold disabled:opacity-50"
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </Button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1a1a24]/90 to-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Bio</h3>
                <p className="text-gray-400">Tell visitors about yourself</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 160))}
                placeholder="Add a bio to your profile... (e.g., Developer, Designer, Content Creator)"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    bio.length > 140 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {bio.length}/160
                  </span>
                </div>
                <Button
                  onClick={handleSaveBio}
                  disabled={savingBio || bio === (userData?.bio || '')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50 font-bold"
                >
                  {savingBio ? 'Saving...' : 'Save Bio'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Social Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1a1a24]/90 to-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Social Links</h3>
                <p className="text-gray-400">Showcase your online presence</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>

            {userData?.links && userData.links.length > 0 ? (
              <div className="space-y-3 mb-8">
                {userData.links.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:border-pink-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white">{link.title}</p>
                      <p className="text-sm text-gray-400 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => handleToggleLinkVisibility(link.id, link.visible)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        link.visible
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                    >
                      {link.visible ? '👁 Public' : '🔒 Hidden'}
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 border border-dashed border-white/20 rounded-2xl mb-8">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <p className="text-gray-400 font-bold text-lg">No social links yet</p>
                <p className="text-sm text-gray-500 mt-1">Add links to showcase your presence across the web</p>
              </div>
            )}

            {showLinkForm ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4"
              >
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block">Link Title</label>
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="e.g., Portfolio, GitHub, Twitter"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block">URL</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleAddLink}
                    disabled={addingLink}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white disabled:opacity-50 font-bold"
                  >
                    {addingLink ? 'Adding...' : 'Add Link'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowLinkForm(false);
                      setNewLinkTitle('');
                      setNewLinkUrl('');
                    }}
                    className="flex-1 border border-white/10 text-gray-400 hover:bg-white/5 font-bold"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                onClick={() => setShowLinkForm(true)}
                className="w-full border-2 border-dashed border-pink-500/50 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold py-6 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Social Link
              </Button>
            )}
          </Card>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1a1a24]/90 to-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Connected Accounts</h3>
                <p className="text-gray-400">Link your social accounts</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Discord', color: '#5865F2', icon: 'discord' },
                { name: 'GitHub', color: '#ffffff', icon: 'github' },
                { name: 'Twitch', color: '#9146FF', icon: 'twitch' },
                { name: 'Twitter', color: '#1DA1F2', icon: 'twitter' },
              ].map((platform, idx) => {
                const isConnected = userData?.connections?.some(
                  (conn) => conn.provider.toLowerCase() === platform.name.toLowerCase()
                );

                return (
                  <motion.button
                    key={platform.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-bold ${
                      isConnected
                        ? 'bg-green-500/15 border-green-500/40 hover:border-green-500/60'
                        : 'bg-white/5 border-white/10 hover:border-cyan-500/50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ backgroundColor: `${platform.color}30` }}
                    >
                      {platform.icon === 'discord' && (
                        <svg className="w-6 h-6" fill={platform.color} viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106c-.659-.249-1.29-.578-1.897-.953a.077.077 0 00-.009-.128c.127-.095.255-.195.379-.298a.074.074 0 00.076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 00.075.009c.124.103.252.203.38.298a.077.077 0 00-.007.127c-.608.375-1.239.704-1.897.954a.077.077 0 00-.041.107c.359.698.77 1.363 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.031.077.077 0 00.032-.057c.5-4.717-.838-8.855-3.549-12.515a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.193 0 2.156.964 2.157 2.157c0 1.19-.964 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.192 0 2.156.964 2.157 2.157c0 1.19-.965 2.156-2.157 2.156z" />
                        </svg>
                      )}
                      {platform.icon === 'github' && (
                        <svg className="w-6 h-6" fill={platform.color} viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                      {platform.icon === 'twitch' && (
                        <svg className="w-6 h-6" fill={platform.color} viewBox="0 0 24 24">
                          <path d="M11.571 4.714h1.429v4.286h-1.429V4.714zM15.571 4.714h1.429v4.286h-1.429V4.714zM6 0L1.429 4.571v15.429h4.285V24h3.572l3.571-3.571h5.715L22.571 12V0H6zm14.286 11.429l-3.571 3.571h-5.714l-3.572 3.571v-3.571H6.857V1.429h13.429v10z" />
                        </svg>
                      )}
                      {platform.icon === 'twitter' && (
                        <svg className="w-6 h-6" fill={platform.color} viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white">{platform.name}</p>
                      <p className="text-xs text-gray-400">
                        {isConnected ? '✓ Connected' : 'Not connected'}
                      </p>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isConnected ? 'M5 13l4 4L19 7' : 'M9 5l7 7-7 7'}
                      />
                    </svg>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
