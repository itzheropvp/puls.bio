"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy, Share2, Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

export default function SharedPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch("/api/user/me")
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <p className="text-lg text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <h1 className="text-2xl font-bold text-white">Please log in to view this page.</h1>
            </div>
        );
    }

    const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${user.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnTwitter = () => {
        const text = `Check out my profile on puls.pw!`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
        window.open(url, "_blank");
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        window.open(url, "_blank");
    };

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        window.open(url, "_blank");
    };

    const shareViaEmail = () => {
        const subject = "Check out my puls.pw profile";
        const body = `Hey! Check out my profile: ${profileUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
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
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <Share2 className="w-12 h-12 mx-auto text-purple-400" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white">Share Your Profile</h1>
                        <p className="text-gray-400">Share your puls.pw profile with the world</p>
                    </div>

                    {/* QR Code */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center p-6 rounded-lg"
                    >
                        <QRCodeSVG
                            value={profileUrl}
                            size={200}
                            level="H"
                            marginSize={3}
                        />
                    </motion.div>

                    {/* Profile Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <label className="text-sm font-medium text-gray-300">Your Profile Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                size="icon"
                                className="shrink-0 border-white/10 hover:bg-white/10 hover:text-white"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Social Share Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        <label className="text-sm font-medium text-gray-300">Share on Social Media</label>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={shareOnTwitter}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                                Twitter
                            </Button>
                            <Button
                                onClick={shareOnFacebook}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-blue-600/10 hover:border-blue-600/30 hover:text-blue-500 transition-all"
                            >
                                <Facebook className="w-4 h-4" />
                                Facebook
                            </Button>
                            <Button
                                onClick={shareOnLinkedIn}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-blue-700/10 hover:border-blue-700/30 hover:text-blue-400 transition-all"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </Button>
                            <Button
                                onClick={shareViaEmail}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                Email
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
}