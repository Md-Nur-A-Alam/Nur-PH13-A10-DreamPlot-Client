"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { CheckIcon, Cross1Icon, TrashIcon, ShadowIcon } from '@radix-ui/react-icons';

export default function ManageProperties() {
    const { data: session } = authClient.useSession();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Rejection Modal State
    const [rejectingPropertyId, setRejectingPropertyId] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/admin`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setProperties(data);
            }
        } catch (err) {
            console.error("Error fetching properties:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [session]);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'approved', rejectionFeedback: '' })
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("Property approved successfully!");
                setProperties(prev => prev.map(p => p._id === id ? { ...p, status: 'approved', rejectionFeedback: '' } : p));
            } else {
                toast.error("Failed to approve property.");
            }
        } catch (err) {
            console.error("Error approving property:", err);
            toast.error("An error occurred.");
        }
    };

    const handleOpenReject = (id) => {
        setRejectingPropertyId(id);
        setFeedback('');
    };

    const handleConfirmReject = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast.warning("Please provide rejection feedback.");
            return;
        }

        setSubmittingFeedback(true);
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${rejectingPropertyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'rejected', rejectionFeedback: feedback })
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("Property rejected successfully.");
                setProperties(prev => prev.map(p => p._id === rejectingPropertyId ? { ...p, status: 'rejected', rejectionFeedback: feedback } : p));
                setRejectingPropertyId(null);
            } else {
                toast.error("Failed to reject property.");
            }
        } catch (err) {
            console.error("Error rejecting property:", err);
            toast.error("An error occurred.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property from the system?")) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.deletedCount > 0) {
                toast.success("Listing deleted successfully!");
                setProperties(prev => prev.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error("Error deleting property:", err);
            toast.error("Failed to delete property.");
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading system listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    All Properties
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Moderate property listings, review credentials, and approve public catalog items
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                <div className="overflow-x-auto">
                    <table className="table table-lg w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property Details</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Owner Details</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Pricing</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Status</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {properties.map((property) => {
                                const statusColors = {
                                    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
                                    approved: 'bg-green-50 text-green-700 border-green-100',
                                    rejected: 'bg-red-50 text-red-700 border-red-100'
                                };

                                return (
                                    <tr key={property._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                                                    <img src={property.imageURL || property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100"} alt="Property" className="object-cover w-full h-full" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 block line-clamp-1 leading-snug">
                                                        {property.title}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{property.location}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm font-semibold text-slate-800">{property.ownerName || 'Sarah Rahman'}</div>
                                            <div className="text-[11px] text-slate-400 font-medium select-text">{property.ownerEmail}</div>
                                        </td>
                                        <td className="font-extrabold text-[#319795] text-sm">
                                            ${(property.rent || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-400">/{property.rentType === 'monthly' ? 'mo' : 'day'}</span>
                                        </td>
                                        <td>
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${statusColors[property.status || 'pending']}`}>
                                                {property.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2 h-20">
                                                {property.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleApprove(property._id)}
                                                            className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 border-none text-white font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                        >
                                                            <CheckIcon className="w-4 h-4 mr-1" /> Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleOpenReject(property._id)}
                                                            className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                        >
                                                            <Cross1Icon className="w-3.5 h-3.5 mr-1" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(property._id)}
                                                    className="btn btn-xs btn-outline border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-red-500 rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                    title="Delete Property"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add Rejection Feedback */}
            {rejectingPropertyId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-800">Provide Rejection Feedback</h3>
                            <button onClick={() => setRejectingPropertyId(null)} className="btn btn-ghost btn-circle btn-xs text-slate-400">
                                <Cross1Icon className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleConfirmReject} className="space-y-4">
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="rejection-feedback">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Reason for Rejection</span>
                                </label>
                                <textarea 
                                    id="rejection-feedback"
                                    required
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    placeholder="Explain why this listing is being rejected (e.g. incorrect image formatting, pricing adjustments)..."
                                    className="textarea textarea-bordered w-full text-sm bg-slate-50 focus:bg-white rounded-xl p-3 focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setRejectingPropertyId(null)} className="btn w-1/2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold h-11 normal-case">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submittingFeedback} className="btn w-1/2 bg-black hover:bg-slate-900 border-none text-white rounded-xl font-bold h-11 normal-case">
                                    {submittingFeedback ? <span className="loading loading-spinner loading-sm text-slate-400"></span> : "Confirm Reject"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
