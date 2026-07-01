"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DashboardHome() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.push('/signIn');
            } else {
                const role = session.user?.role || 'Tenant';
                if (role === 'Admin') {
                    router.push('/dashboard/admin/users');
                } else if (role === 'Owner') {
                    router.push('/dashboard/owner');
                } else {
                    router.push('/dashboard/bookings');
                }
            }
        }
    }, [session, isPending, router]);

    return (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center bg-[#F7F9FC]">
            <span className="loading loading-spinner loading-md text-[#319795]"></span>
            <p className="text-slate-500 font-bold mt-4 animate-pulse">Redirecting to your workspace...</p>
        </div>
    );
}
