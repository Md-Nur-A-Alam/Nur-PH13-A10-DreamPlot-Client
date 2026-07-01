"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { format } from 'date-fns';
import { CalendarIcon, ShadowIcon } from '@radix-ui/react-icons';

export default function MyBookings() {
    const { data: session } = authClient.useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!session?.user?.email) return;
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/tenant/${session.user.email}`, {
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
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                        My Bookings
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                        Track your rental reservations and payment statuses
                    </p>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No reservations found.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Explore listings on the properties page and book your next dream plot!</p>
                    <Link href="/properties" className="btn btn-sm bg-[#319795] border-none text-white font-bold rounded-lg normal-case mt-5 px-6">
                        Explore Properties
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <div className="overflow-x-auto">
                        <table className="table table-lg w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property Details</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Booking Date</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Amount Paid</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Booking Status</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Payment Status</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((booking) => {
                                    const rent = booking.rent || 0;
                                    const dateString = booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM dd, yyyy') : "N/A";
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
                                                        <Link href={`/properties/${booking.propertyId}`} className="font-bold text-slate-800 hover:text-[#319795] transition-colors block leading-snug line-clamp-1">
                                                            {booking.propertyTitle}
                                                        </Link>
                                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{booking.propertyLocation}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-slate-600 text-sm font-semibold">{dateString}</td>
                                            <td className="font-bold text-slate-800 text-sm">
                                                {booking.paymentStatus === 'paid' ? `$${(booking.amountPaid || 0).toLocaleString()}` : '$0'}
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${statusColors[booking.bookingStatus || 'pending']}`}>
                                                    {booking.bookingStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${
                                                    booking.paymentStatus === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {booking.paymentStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {booking.paymentStatus !== 'paid' && booking.bookingStatus !== 'rejected' ? (
                                                    <Link href={`/payment/${booking._id}`} className="btn btn-xs bg-[#319795] hover:bg-[#277a78] border-none text-white font-extrabold rounded-lg normal-case px-3 py-1.5 h-auto min-h-0">
                                                        💳 Pay Now
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No Action</span>
                                                )}
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
