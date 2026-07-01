"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { 
    CalendarIcon, 
    HeartIcon, 
    PersonIcon, 
    HomeIcon, 
    PlusIcon, 
    FileTextIcon, 
    HamburgerMenuIcon,
    Cross1Icon,
    ExitIcon,
    BarChartIcon
} from '@radix-ui/react-icons';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Fetch user session
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const role = user?.role || 'Tenant'; // Fallback to Tenant

    // Security Gate: Redirect to sign-in if not authenticated
    useEffect(() => {
        if (!isPending && !session) {
            router.push('/signIn');
        }
    }, [session, isPending, router]);

    // Sync JWT token with backend database session if it is missing (essential for Google logins)
    useEffect(() => {
        const syncJwt = async () => {
            if (session?.user?.email && !localStorage.getItem('jwt-token')) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: session.user.email })
                    });
                    const resData = await res.json();
                    if (resData.token) {
                        localStorage.setItem('jwt-token', resData.token);
                    }
                } catch (jwtErr) {
                    console.error("JWT sync failure:", jwtErr);
                }
            }
        };
        syncJwt();
    }, [session]);

    if (isPending) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F7F9FC]">
                <span className="loading loading-spinner loading-lg text-[#319795]"></span>
                <p className="text-slate-500 font-bold mt-4 animate-pulse">Loading secure workspace...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // Role-based sidebar menu items definition
    const getMenu = () => {
        switch (role) {
            case 'Admin':
                return [
                    { name: 'All Users', path: '/dashboard/admin/users', icon: <PersonIcon className="w-4 h-4" /> },
                    { name: 'All Properties', path: '/dashboard/admin/properties', icon: <HomeIcon className="w-4 h-4" /> },
                    { name: 'All Bookings', path: '/dashboard/admin/bookings', icon: <CalendarIcon className="w-4 h-4" /> },
                    { name: 'Transactions', path: '/dashboard/admin/transactions', icon: <FileTextIcon className="w-4 h-4" /> },
                    { name: 'My Profile', path: '/dashboard/profile', icon: <PersonIcon className="w-4 h-4" /> },
                ];
            case 'Owner':
                return [
                    { name: 'Dashboard Home', path: '/dashboard/owner', icon: <BarChartIcon className="w-4 h-4" /> },
                    { name: 'Add Property', path: '/dashboard/owner/add-property', icon: <PlusIcon className="w-4 h-4" /> },
                    { name: 'My Properties', path: '/dashboard/owner/my-properties', icon: <HomeIcon className="w-4 h-4" /> },
                    { name: 'Booking Requests', path: '/dashboard/owner/booking-requests', icon: <CalendarIcon className="w-4 h-4" /> },
                    { name: 'My Profile', path: '/dashboard/profile', icon: <PersonIcon className="w-4 h-4" /> },
                ];
            case 'Tenant':
            default:
                return [
                    { name: 'My Bookings', path: '/dashboard/bookings', icon: <CalendarIcon className="w-4 h-4" /> },
                    { name: 'Favorites', path: '/dashboard/favorites', icon: <HeartIcon className="w-4 h-4" /> },
                    { name: 'My Profile', path: '/dashboard/profile', icon: <PersonIcon className="w-4 h-4" /> },
                ];
        }
    };

    const menuItems = getMenu();

    const handleLogout = async () => {
        await authClient.signOut();
        localStorage.removeItem('jwt-token');
        router.push('/signIn');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#2D3748] flex flex-col md:flex-row select-none">
            
            {/* 1. MOBILE RESPONSIVE DASHBOARD NAV BAR */}
            <div className="md:hidden w-full bg-[#0A192F] text-white px-5 h-16 flex items-center justify-between shadow-md">
                <Link href="/" className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded bg-[#319795] flex items-center justify-center font-extrabold text-xs">D</span>
                    DreamPlot
                </Link>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-white"
                >
                    {isSidebarOpen ? <Cross1Icon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
                </button>
            </div>

            {/* 2. DYNAMIC WORKSPACE SIDEBAR SHELL CONTAINER */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-[#0A192F] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-xl
                md:relative md:transform-none md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6">
                    {/* Brand Banner */}
                    <div className="mb-10 hidden md:block">
                        <Link href="/" className="font-black text-2xl tracking-tight text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#319795] flex items-center justify-center font-extrabold text-sm shadow-sm">D</div>
                            DreamPlot
                        </Link>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#319795] block mt-2 ml-1">
                            {role} Workspace
                        </span>
                    </div>

                    {/* Navigation Menu Grid */}
                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isLinkActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        isLinkActive 
                                            ? 'bg-[#319795] text-white shadow-md shadow-[#319795]/20' 
                                            : 'text-slate-400 hover:bg-[#1A2E46]/60 hover:text-white'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar User Footer Profile Metadata Block */}
                <div className="p-4 border-t border-slate-800/80 bg-[#061122]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="avatar">
                            <div className="w-9 h-9 rounded-full ring-2 ring-[#319795]/30">
                                <img src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt="User profile" />
                            </div>
                        </div>
                        <div className="truncate text-left">
                            <p className="text-xs font-bold text-white leading-none mb-1">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 truncate leading-none">{user?.email}</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="btn btn-sm btn-outline border-slate-700 text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500 w-full h-10 min-h-0 rounded-xl normal-case font-bold flex items-center justify-center gap-2"
                    >
                        <ExitIcon className="w-4 h-4" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Background overlay click trap for mobile view dismissals */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/45 md:hidden"
                />
            )}

            {/* 3. DYNAMIC CONTENT MAIN FRAME COMPONENT */}
            <main className="flex-1 overflow-x-hidden p-6 sm:p-10 lg:p-12 min-h-screen flex flex-col justify-between">
                <div className="max-w-7xl w-full mx-auto">
                    {children}
                </div>
                
                {/* Dashboard Tiny Footer */}
                <div className="mt-20 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
                    © 2026 DreamPlot Property Rental & Booking Platform. All rights reserved.
                </div>
            </main>

        </div>
    );
}
