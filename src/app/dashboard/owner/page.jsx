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
    HomeIcon, 
    CalendarIcon, 
    DownloadIcon 
} from '@radix-ui/react-icons';

export default function OwnerAnalytics() {
    const { data: session } = authClient.useSession();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!session?.user?.email) return;
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/owner/analytics/${session.user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data && !data.error) {
                    setAnalytics(data);
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [session]);

    const handleDownloadPDF = () => {
        // Trigger clean page print styling for report downloading
        window.print();
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Compiling analytics data...</p>
            </div>
        );
    }

    const { totalEarnings, totalProperties, totalBookings, chartData } = analytics || {
        totalEarnings: 0,
        totalProperties: 0,
        totalBookings: 0,
        chartData: []
    };

    return (
        <div className="space-y-10 print:bg-white print:p-8">
            
            {/* Header Title with Print Download Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                        Owner Dashboard Home
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                        Analytics overview of your listed real estate assets
                    </p>
                </div>
                <button 
                    onClick={handleDownloadPDF}
                    className="btn btn-md bg-[#319795] hover:bg-[#277a78] border-none text-white font-bold rounded-xl normal-case flex items-center gap-2 shadow-sm shrink-0"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download Earnings Report</span>
                </button>
            </div>

            {/* Printable Header - only visible during print window */}
            <div className="hidden print:block border-b-2 border-slate-800 pb-6 mb-8">
                <h1 className="text-3xl font-black text-[#0A192F]">DreamPlot Portfolio Earnings Report</h1>
                <p className="text-slate-500 text-sm mt-1">Generated for: {session?.user?.name} ({session?.user?.email})</p>
                <p className="text-slate-400 text-xs mt-1">Date generated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* A. THREE SUMMARY METRIC CARD HOVERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Metric Card 1: Total Earnings */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF8FF] flex items-center justify-center text-[#2B6CB0]">
                        <BarChartIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">
                            ${totalEarnings.toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Metric Card 2: Total Properties */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#319795]">
                        <HomeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Properties</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">
                            {totalProperties}
                        </h2>
                    </div>
                </div>

                {/* Metric Card 3: Confirmed Bookings */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEFCBF] flex items-center justify-center text-[#B7791F]">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                        <h2 className="text-2xl font-black text-[#0A192F] mt-1">
                            {totalBookings}
                        </h2>
                    </div>
                </div>

            </div>

            {/* B. RECHARTS LINE GRAPH CONTAINER FRAME */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.01)] space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-[#0A192F]">Monthly Earnings History</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        Tracked successful monthly payments across all properties (Last 12 Months)
                    </p>
                </div>

                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="month" 
                                stroke="#A0AEC0" 
                                fontSize={11} 
                                fontWeight="bold" 
                                tickLine={false} 
                            />
                            <YAxis 
                                stroke="#A0AEC0" 
                                fontSize={11} 
                                fontWeight="bold" 
                                tickFormatter={(val) => `$${val}`} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#FFFFFF', 
                                    borderColor: '#E2E8F0', 
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: '#0A192F'
                                }}
                                formatter={(val) => [`$${val.toLocaleString()}`, "Earnings"]}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="earnings" 
                                stroke="#319795" 
                                strokeWidth={3.5} 
                                activeDot={{ r: 6, fill: '#319795', strokeWidth: 0 }} 
                                dot={{ fill: '#319795', strokeWidth: 0, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Hidden Print metadata footer */}
            <div className="hidden print:block pt-12 text-center text-xs text-slate-400 border-t border-slate-200 mt-20">
                DreamPlot Platform Analytics. Thank you for your continued partnership.
            </div>

        </div>
    );
}
