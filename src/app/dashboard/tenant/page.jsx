"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { 
    BarChartIcon, 
    HeartIcon, 
    CalendarIcon, 
    DownloadIcon,
    DoubleArrowRightIcon,
    InfoCircledIcon
} from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function TenantOverview() {
    const { data: session } = authClient.useSession();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!session?.user?.email) return;
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tenant/analytics/${session.user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data && !data.error) {
                    setAnalytics(data);
                } else {
                    toast.error("Failed to load tenant analytics.");
                }
            } catch (err) {
                console.error("Error fetching tenant analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [session]);

    const handleDownloadReport = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading your overview dashboard...</p>
            </div>
        );
    }

    const {
        totalBookings,
        totalPaidBookings,
        totalPendingBookings,
        totalFavorites,
        totalSpent,
        chartData
    } = analytics || {
        totalBookings: 0,
        totalPaidBookings: 0,
        totalPendingBookings: 0,
        totalFavorites: 0,
        totalSpent: 0,
        chartData: []
    };

    return (
        <div className="space-y-8 print:bg-white print:p-8">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                        Tenant Overview
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                        Track your rental applications, bookings expenses, and saved properties
                    </p>
                </div>
                <button 
                    onClick={handleDownloadReport}
                    className="btn btn-md bg-[#319795] hover:bg-[#277a78] border-none text-white font-bold rounded-xl normal-case flex items-center gap-2 shadow-sm shrink-0"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download Bookings Report</span>
                </button>
            </div>

            {/* Printable Header */}
            <div className="hidden print:block border-b-2 border-slate-800 pb-6 mb-8">
                <h1 className="text-3xl font-black text-[#0A192F]">DreamPlot Tenant Activity & Expenses Report</h1>
                <p className="text-slate-500 text-sm mt-1">Generated for: {session?.user?.name} ({session?.user?.email})</p>
                <p className="text-slate-400 text-xs mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Spent card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BarChartIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">${totalSpent.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Favorites card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                        <HeartIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved Favorites</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">{totalFavorites}</h2>
                    </div>
                </div>

                {/* Total Bookings card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#319795]">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">{totalBookings}</h2>
                    </div>
                </div>

                {/* Pending Bookings card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <InfoCircledIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Bookings</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">{totalPendingBookings}</h2>
                    </div>
                </div>
            </div>

            {/* Recharts chart and activities shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expenses chart */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-[#0A192F]">Rental Expenses History</h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tracked successful reservation fee payments (Last 12 months)</p>
                    </div>

                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#A0AEC0" fontSize={10} fontWeight="bold" tickLine={false} />
                                <YAxis stroke="#A0AEC0" fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(v) => [`$${v.toLocaleString()}`, "Paid"]}
                                />
                                <Line type="monotone" dataKey="expenses" stroke="#319795" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activities summary panel */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-[#0A192F]">Rental Status Analysis</h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Breakdown of reservation applications</p>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center bg-teal-50 border border-teal-100/50 p-4 rounded-2xl">
                            <div>
                                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Paid Bookings</span>
                                <span className="text-slate-500 text-xs">Successfully completed reservations</span>
                            </div>
                            <span className="text-xl font-black text-teal-700">{totalPaidBookings}</span>
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Favorites Saved</span>
                                <span className="text-slate-500 text-xs">Saved lists for future search</span>
                            </div>
                            <span className="text-xl font-black text-slate-700">{totalFavorites}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 text-center">
                        <Link href="/properties" className="btn btn-sm w-full bg-black hover:bg-slate-900 border-none text-white rounded-xl normal-case font-bold h-10 min-h-0 flex items-center justify-center gap-1.5">
                            <span>Browse Properties</span>
                            <DoubleArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick shortcuts banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-slate-700">Looking to review your bookings or manage favorites?</h3>
                    <p className="text-xs text-slate-400 font-medium">Use operations shortcuts to quickly reach favorites list and transactions panel.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/bookings" className="btn btn-sm btn-outline border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 normal-case font-bold flex items-center gap-1.5 h-10 min-h-0">
                        <span>My Bookings</span>
                        <DoubleArrowRightIcon className="w-3 h-3" />
                    </Link>
                    <Link href="/dashboard/favorites" className="btn btn-sm bg-[#319795] hover:bg-[#277a78] border-none text-white rounded-xl normal-case font-bold flex items-center gap-1.5 h-10 min-h-0">
                        <span>Favorites</span>
                        <DoubleArrowRightIcon className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block pt-12 text-center text-xs text-slate-400 border-t border-slate-200 mt-20">
                DreamPlot Tenant Dashboard Report.
            </div>
        </div>
    );
}
