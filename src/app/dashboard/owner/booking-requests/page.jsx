"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';

export default function BookingRequests() {
    const { data: session } = authClient.useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        if (!session?.user?.email) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/owner/${session.user.email}`, {
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

    useEffect(() => {
        fetchBookings();
    }, [session]);

    const handleModerate = async (bookingId, action) => {
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookingStatus: action }) // 'approved' or 'rejected'
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success(`Booking request successfully ${action}!`);
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: action } : b));
            } else {
                toast.error("Failed to update booking status.");
            }
        } catch (err) {
            console.error("Error moderating booking:", err);
            toast.error("An error occurred.");
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading reservation requests...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    Booking Requests
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Manage reservation requests on your properties
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <p className="text-slate-500 font-bold text-sm">No booking requests found.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Once a tenant reserves and pays for one of your listed properties, it will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <div className="overflow-x-auto">
                        <table className="table table-lg w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property Details</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Tenant Info</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Move-In / Paid</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Status</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
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
                                                <div className="text-sm font-semibold text-slate-800">{booking.tenantName}</div>
                                                <div className="text-[11px] text-slate-400 font-medium select-text">{booking.tenantEmail}</div>
                                                {booking.tenantPhone && (
                                                    <div className="text-[10px] text-slate-500 mt-0.5 select-text">📞 {booking.tenantPhone}</div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="text-sm font-semibold text-slate-800">
                                                    {booking.moveInDate ? format(new Date(booking.moveInDate), 'MMM dd, yyyy') : 'N/A'}
                                                </div>
                                                <div className="text-[11px] text-[#319795] font-extrabold mt-0.5">
                                                    Paid: ${(booking.amountPaid || 0).toLocaleString()}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${statusColors[booking.bookingStatus || 'pending']}`}>
                                                    {booking.bookingStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {booking.bookingStatus === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2 h-20">
                                                        <button 
                                                            onClick={() => handleModerate(booking._id, 'approved')}
                                                            className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 border-none text-white font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                        >
                                                            <CheckIcon className="w-4 h-4 mr-1" /> Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleModerate(booking._id, 'rejected')}
                                                            className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                        >
                                                            <Cross1Icon className="w-3.5 h-3.5 mr-1" /> Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Moderated</span>
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
