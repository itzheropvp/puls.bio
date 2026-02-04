'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [username, setUsername] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '2,100,000+', label: 'Profile Views', icon: '👁️' },
    { value: '850,000+', label: 'Users', icon: '👥' },
    { value: '420,000+', label: 'Bio Pages', icon: '📄' },
    { value: '25,000+', label: 'Premium Users', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Image
              src="/logo_all_white.png"
              alt="puls.pw logo"
              width={130}
              height={45}
              className="h-auto"
              priority
            />
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Discord
            </a>
            {session ? (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                <Link href="/account">Dashboard</Link>
              </Button>
            ) : (
              <>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </a>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                  <Link href="/register">Sign up for free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Everything you want,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                right here.
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            puls.pw is your go-to for modern, feature-rich link-in-bio pages and lightning-fast,
            customizable short links. Join over 850,000 creators growing their online presence with us.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 rounded-xl border-0 shadow-lg shadow-purple-500/25"
            >
              Sign Up for Free
            </Button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl" />
            <img
              src="/dashboard-preview.png"
              alt="Dashboard with profile examples"
              className="relative w-full rounded-3xl border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Over{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                850,000
              </span>{' '}
              people use puls.pw
            </h2>
            <p className="text-xl text-gray-400">What are you waiting for?</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 p-8 text-center backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-white/10 p-12 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Everything you want, right here.
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join over 850,000+ people using puls.pw and become part of our large community.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    puls.pw/
                  </span>
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-24 bg-black/40 border-white/10 h-14 rounded-xl text-lg backdrop-blur-sm"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-14 px-8 rounded-xl border-0 shadow-lg shadow-purple-500/25 w-full sm:w-auto"
                >
                  Claim Now
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo_all_white.png"
                  alt="puls.pw logo"
                  width={120}
                  height={35}
                  className="h-auto"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Create feature-rich, customizable and modern link-in-bio pages with puls.pw.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">System Status</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">General</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Website Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Copyright Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              Copyright © 2026 puls.pw - All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-lg">💬</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-lg">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-lg">📱</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}