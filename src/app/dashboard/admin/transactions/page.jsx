"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { format } from 'date-fns';
import { FileTextIcon } from '@radix-ui/react-icons';

export default function ManageTransactions() {
    const { data: session } = authClient.useSession();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/transactions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTransactions(data);
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [session]);

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading transaction logs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    Financial Transactions
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    System-wide ledger of successful reservation deposits
                </p>
            </div>

            {transactions.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <FileTextIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No transaction records found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <div className="overflow-x-auto">
                        <table className="table table-lg w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Transaction ID</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Tenant</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Owner</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Amount</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="text-slate-500 text-xs font-bold font-mono select-text">{tx.transactionId}</td>
                                        <td>
                                            <span className="font-bold text-slate-800 line-clamp-1">{tx.propertyName}</span>
                                        </td>
                                        <td>
                                            <div className="text-sm font-semibold text-slate-800">{tx.tenantName}</div>
                                            <div className="text-[10px] text-slate-400 truncate select-text">{tx.tenantEmail}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm font-semibold text-slate-800">{tx.ownerName || 'Sarah Rahman'}</div>
                                            <div className="text-[10px] text-slate-400 truncate select-text">{tx.ownerEmail}</div>
                                        </td>
                                        <td className="font-extrabold text-[#319795] text-sm">
                                            ${(tx.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="text-slate-600 text-sm font-semibold text-right">
                                            {tx.date ? format(new Date(tx.date), 'MMM dd, yyyy') : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
