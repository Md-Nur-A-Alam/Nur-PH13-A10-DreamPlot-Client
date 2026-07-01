"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { InfoCircledIcon, LockClosedIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';

export default function BookingPayment({ params: promiseParams }) {
    const params = React.use(promiseParams);
    const bookingId = params.bookingId;
    const router = useRouter();
    const { data: session } = authClient.useSession();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    // Custom simulated card inputs
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data && !data.error) {
                    setBooking(data);
                } else {
                    toast.error("Failed to load booking information.");
                }
            } catch (err) {
                console.error("Error loading booking details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, session]);

    const handleSimulatedPayment = async (e) => {
        e.preventDefault();
        
        // Simple input validation
        if (cardNumber.replace(/\s/g, '').length < 16) {
            toast.warning("Please enter a valid card number.");
            return;
        }
        if (expiry.length < 5) {
            toast.warning("Please enter a valid card expiry date.");
            return;
        }
        if (cvc.length < 3) {
            toast.warning("Please enter a valid security CVC.");
            return;
        }

        setProcessing(true);
        
        // Simulate API network latency
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('jwt-token');
                const mockTxId = 'ch_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_DREAM';
                const totalDue = (booking.rent || 0) + 150 + (booking.rent || 0);

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/confirm-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bookingId: bookingId,
                        transactionId: mockTxId,
                        amountPaid: totalDue
                    })
                });
                const data = await res.json();
                
                if (data.success) {
                    toast.success("Payment confirmed successfully via Simulated Gateway!");
                    router.push(`/payment/success?transactionId=${mockTxId}`);
                } else {
                    toast.error("Payment confirmation failed on server.");
                }
            } catch (err) {
                console.error("Error in simulated payment:", err);
                toast.error("Could not complete checkout.");
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Preparing invoice parameters...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <p className="text-slate-500 font-bold">Booking request not found.</p>
            </div>
        );
    }

    const rent = booking.rent || 0;
    const serviceFee = 150.00;
    const securityDeposit = rent;
    const totalDue = rent + serviceFee + securityDeposit;

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-4 bg">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    Checkout & Payment
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Process deposit for booking reference ID: #{bookingId.slice(-8)}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Invoicing breakdown (5 columns) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.015)] space-y-6">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                            <img src={booking.propertyImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100"} alt="Property" className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 line-clamp-1 text-sm">{booking.propertyTitle}</h3>
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{booking.propertyLocation}</span>
                            <span className="inline-block mt-2 bg-[#EBF8FF] text-[#2B6CB0] font-bold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-md">
                                {booking.rentType} rent
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 space-y-3.5 text-xs text-slate-500 font-medium">
                        <div className="flex justify-between">
                            <span>Initial Rent Fee</span>
                            <span className="font-bold text-[#0A192F]">${rent.toLocaleString()}.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Service Charge</span>
                            <span className="font-bold text-[#0A192F]">${serviceFee.toLocaleString()}.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Refundable Security Deposit</span>
                            <span className="font-bold text-[#0A192F]">${securityDeposit.toLocaleString()}.00</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex justify-between items-baseline">
                        <span className="text-sm font-extrabold text-[#0A192F]">Total Due</span>
                        <span className="text-xl sm:text-2xl font-black text-[#319795]">${totalDue.toLocaleString()}.00</span>
                    </div>

                    <div className="flex gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-[11px] text-slate-500 leading-normal">
                        <InfoCircledIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p>This deposit acts as a reservation hold. If the property owner rejects your booking request, the deposit amount will be returned to your account details.</p>
                    </div>
                </div>

                {/* 2. Simulated Card details (7 columns) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.015)] space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                            <LockClosedIcon className="w-4 h-4 text-[#319795]" />
                            <span>Credit Card Processing</span>
                        </h2>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                            Secure payment portal connected via simulated sandbox
                        </p>
                    </div>

                    <form onSubmit={handleSimulatedPayment} className="space-y-4">
                        
                        {/* Name on Card */}
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="card-name">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Name on Card</span>
                            </label>
                            <input 
                                type="text" 
                                id="card-name"
                                required
                                placeholder="e.g. John Doe"
                                defaultValue={session?.user?.name || ''}
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>

                        {/* Card Number */}
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="card-number">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Card Number</span>
                            </label>
                            <input 
                                type="text" 
                                id="card-number"
                                required
                                maxLength="19"
                                value={cardNumber}
                                onChange={(e) => {
                                    // Auto format card spacing
                                    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                    const matches = value.match(/\d{4,16}/g);
                                    const match = matches && matches[0] || '';
                                    const parts = [];
                                    for (let i = 0, len = match.length; i < len; i += 4) {
                                        parts.push(match.substring(i, i + 4));
                                    }
                                    if (parts.length > 0) {
                                        setCardNumber(parts.join(' '));
                                    } else {
                                        setCardNumber(value);
                                    }
                                }}
                                placeholder="4242 4242 4242 4242"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all font-mono tracking-widest"
                            />
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="expiry">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Expiration Date</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="expiry"
                                    required
                                    maxLength="5"
                                    value={expiry}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        if (value.length > 2) {
                                            setExpiry(value.substring(0, 2) + '/' + value.substring(2, 4));
                                        } else {
                                            setExpiry(value);
                                        }
                                    }}
                                    placeholder="MM/YY"
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all font-mono tracking-widest text-center"
                                />
                            </div>
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="cvc">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Security Code (CVC)</span>
                                </label>
                                <input 
                                    type="password" 
                                    id="cvc"
                                    required
                                    maxLength="4"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="•••"
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all font-mono tracking-widest text-center"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="btn w-full h-12 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 mt-6 shadow-sm transition-all"
                        >
                            {processing ? (
                                <>
                                    <span className="loading loading-spinner loading-sm text-slate-400"></span>
                                    <span>Processing Transaction...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Deposit Payment</span>
                                    <DoubleArrowRightIcon className="w-4 h-4" />
                                </>
                            )}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
