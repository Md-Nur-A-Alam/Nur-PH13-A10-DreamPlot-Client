"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckIcon, CalendarIcon, HomeIcon } from '@radix-ui/react-icons';

function SuccessContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId') || 'TX_UNKNOWN_DREAM';

    return (
        <main className="min-h-screen w-full bg-[#F7F9FC] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none text-[#2D3748]">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 p-8 text-center space-y-6">
                
                {/* Circular checkmark graphic */}
                <div className="w-20 h-20 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#319795] mx-auto border-4 border-[#319795]/10 animate-bounce">
                    <CheckIcon className="w-10 h-10 stroke-[3px]" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-[#0A192F] tracking-tight antialiased">
                        Deposit Received!
                    </h1>
                    <p className="text-slate-400 text-sm font-semibold leading-relaxed">
                        Your reservation payment hold has been processed and confirmed.
                    </p>
                </div>

                {/* Ledger box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 text-xs font-semibold text-slate-500">
                    <div className="flex justify-between">
                        <span className="uppercase text-[10px] tracking-wider text-slate-400">Transaction ID</span>
                        <span className="font-mono text-slate-800 select-text">{transactionId}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100/80 pt-2 mt-2">
                        <span className="uppercase text-[10px] tracking-wider text-slate-400">Payment status</span>
                        <span className="text-[#319795] uppercase">Success / Paid</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                    <Link href="/dashboard/bookings" className="btn w-full h-11 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 shadow-sm transition-all">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Go to My Bookings</span>
                    </Link>
                    <Link href="/properties" className="btn btn-outline w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl normal-case flex items-center justify-center gap-2 transition-all">
                        <HomeIcon className="w-4 h-4 text-slate-400" />
                        <span>Browse Properties</span>
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#F7F9FC]">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading verification details...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
