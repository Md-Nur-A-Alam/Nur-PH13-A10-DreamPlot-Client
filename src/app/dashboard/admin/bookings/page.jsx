"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';

export default function ManageBookings() {
    const { data: session } = authClient.useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBookings(data);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [session]);

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading reservation catalog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    All Bookings
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Monitor tenant reservations and scheduling metrics
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No reservations listed in database.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <div className="overflow-x-auto">
                        <table className="table table-lg w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property Details</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Tenant Info</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Booking Date</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Status</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((booking) => {
                                    const statusColors = {
                                        pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
                                        approved: 'bg-green-50 text-green-700 border-green-100',
                                        rejected: 'bg-red-50 text-red-700 border-red-100'
                                    };

                                    return (
                                        <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                                                        <img src={booking.propertyImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100"} alt="Property" className="object-cover w-full h-full" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-800 block line-clamp-1 leading-snug">
                                                            {booking.propertyTitle}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{booking.propertyLocation}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm font-bold text-slate-800">{booking.tenantName}</div>
                                                <div className="text-[11px] text-slate-400 font-semibold select-text">{booking.tenantEmail}</div>
                                            </td>
                                            <td className="text-slate-600 text-sm font-semibold">
                                                {booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM dd, yyyy') : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${statusColors[booking.bookingStatus || 'pending']}`}>
                                                    {booking.bookingStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="inline-block text-right">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${
                                                        booking.paymentStatus === 'paid' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                            : 'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {booking.paymentStatus || 'pending'}
                                                    </span>
                                                    {booking.paymentStatus === 'paid' && (
                                                        <div className="text-[10px] text-[#319795] font-extrabold mt-1">
                                                            Paid: ${(booking.amountPaid || 0).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
