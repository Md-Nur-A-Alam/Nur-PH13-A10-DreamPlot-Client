"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, HeartIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Theme Switcher State Engine
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    };
    
    // Fetch user session dynamically
    const { data: session, isPending } = authClient.useSession();

    // Exact structural routes from layout configuration
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'All Properties', path: '/properties' },
        { name: 'Services', path: '/services' },
        { name: 'Blog', path: '/blogs' },
    ];

    // Append Dashboard link if user is logged in
    if (session) {
        // We will direct to /dashboard, which will dynamically redirect based on role
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    }

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            localStorage.removeItem('jwt-token');
            router.push('/signIn');
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#F7F9FC] border-b border-slate-200/80 text-[#2D3748] shadow-sm transition-all duration-300">
            {/* Main responsive grid block matching cross-device constraints */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex justify-between items-center h-20">
                    
                    {/* 1. BRANDING / LOGO */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-[#0A192F] tracking-tight antialiased">
                            DreamPlot
                        </Link>
                    </div>

                    {/* 2. DESKTOP LINKS (Exact alignment matching image_a9ce1f.png) */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path || (link.path === '/dashboard' && pathname.startsWith('/dashboard'));
                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`relative text-[15px] font-medium transition-colors duration-200 py-2 px-1 focus:outline-none ${
                                        isActive ? 'text-[#319795]' : 'text-slate-600 hover:text-[#0A192F]'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {/* Flat Teal active underline element matching image placement */}
                                    {isActive && (
                                        <motion.span 
                                            layoutId="exactActiveLine"
                                            className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#319795]"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* 3. UTILITY ICONS & LIGHT AUTH BUTTONS */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                        {/* Notification Button */}
                        <button className="btn btn-ghost btn-circle text-slate-700 hover:bg-slate-200/50 hover:text-[#319795] transition-colors duration-200">
                            <BellIcon className="w-5 h-5" />
                        </button>

                        {/* Favorites Button */}
                        <Link href="/dashboard/favorites" className="btn btn-ghost btn-circle text-slate-700 hover:bg-slate-200/50 hover:text-red-500 transition-colors duration-200 flex items-center justify-center">
                            <HeartIcon className="w-5 h-5" />
                        </Link>

                        {/* Theme Toggle Button */}
                        <button 
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle text-slate-700 hover:bg-slate-200/50 hover:text-[#319795] transition-colors duration-200"
                            title="Toggle Light/Dark Theme"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            )}
                        </button>

                        {isPending ? (
                            <span className="loading loading-spinner loading-sm text-slate-400"></span>
                        ) : session ? (
                            <div className="flex items-center gap-3">
                                {/* Profile image or default avatar */}
                                <div className="avatar tooltip tooltip-bottom" data-tip={session.user.name}>
                                    <div className="w-10 h-10 rounded-full ring-2 ring-[#319795]/20 hover:ring-[#319795] transition-all">
                                        <img 
                                            src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                                            alt={session.user.name} 
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-md normal-case font-bold px-5 border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-800 rounded-lg transition-all"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Exact Outline Style "Sign In" Button */}
                                <Link 
                                    href="/signIn"
                                    className={`btn btn-md normal-case font-medium px-6 border border-slate-400 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-800 rounded-lg transition-all duration-200 ${
                                        pathname === '/signIn' ? 'border-[#319795]! text-[#319795]!' : ''
                                    }`}
                                >
                                    Sign In
                                </Link>

                                {/* Solid Deep Teal "Register" Button */}
                                <Link 
                                    href="/signUp"
                                    className={`btn btn-md normal-case font-medium px-6 border-none bg-[#319795] text-white hover:bg-[#277a78] rounded-lg transition-all duration-200 ${
                                        pathname === '/signUp' ? 'bg-[#F6AD55] hover:bg-[#e09b45]' : ''
                                    }`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 4. MOBILE HAMBURGER STRIP (sm, xs screens) */}
                    <div className="md:hidden flex items-center gap-2">
                        <button className="btn btn-ghost btn-circle text-slate-700">
                            <BellIcon className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="btn btn-square btn-ghost text-slate-700 hover:bg-slate-200/50"
                            aria-label="Menu Toggle"
                        >
                            {isMobileMenuOpen ? <Cross1Icon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* 5. RESPONSIVE MOBILE ACCORDION DRAWER */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="md:hidden w-full bg-white border-t border-slate-200 overflow-hidden shadow-inner"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.path || (link.path === '/dashboard' && pathname.startsWith('/dashboard'));
                                return (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 ${
                                            isActive 
                                                ? 'bg-slate-100 text-[#319795] font-semibold' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            
                            {/* Mobile Auth Container Breakdown */}
                            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
                                {isPending ? (
                                    <span className="loading loading-spinner loading-sm text-slate-400 mx-auto"></span>
                                ) : session ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                                            <img 
                                                src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                                                alt={session.user.name} 
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">{session.user.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                            className="btn btn-outline border-slate-300 text-slate-700 w-full rounded-lg normal-case font-medium bg-white hover:bg-slate-50"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link 
                                            href="/signIn" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="btn btn-outline border-slate-300 text-slate-700 w-full rounded-lg normal-case font-medium bg-white hover:bg-slate-50"
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            href="/signUp" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="btn bg-[#319795] hover:bg-[#277a78] text-white border-none w-full rounded-lg normal-case font-medium"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;