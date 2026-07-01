"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { HeartIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';

export default function MyFavorites() {
    const { data: session } = authClient.useSession();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        if (!session?.user?.email) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites/${session.user.email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setFavorites(data);
            }
        } catch (err) {
            console.error("Error fetching favorites:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [session]);

    const handleRemoveFavorite = async (propertyId) => {
        if (!session?.user?.email) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites/${session.user.email}/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.deletedCount > 0) {
                toast.success("Removed from favorites!");
                setFavorites(prev => prev.filter(item => item._id !== propertyId));
            }
        } catch (err) {
            console.error("Error removing favorite:", err);
            toast.error("Failed to remove favorite.");
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading favorites...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    My Favorites
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Bookmarked properties you are interested in renting
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <HeartIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No bookmarked properties.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click the heart icon on any listing to save it to your bookmarks!</p>
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
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property Type</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Rent Rate</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {favorites.map((property) => (
                                    <tr key={property._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                                                    <img src={property.imageURL || property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100"} alt={property.title} className="object-cover w-full h-full" />
                                                </div>
                                                <div>
                                                    <Link href={`/properties/${property._id}`} className="font-bold text-slate-800 hover:text-[#319795] transition-colors block leading-snug line-clamp-1">
                                                        {property.title}
                                                    </Link>
                                                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">{property.location}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-slate-600 text-sm font-semibold capitalize">{property.propertyType}</td>
                                        <td className="font-extrabold text-[#319795] text-sm">
                                            ${(property.rent || 0).toLocaleString()}/{property.rentType === 'monthly' ? 'mo' : 'day'}
                                        </td>
                                        <td className="text-right flex items-center justify-end gap-2 h-20">
                                            <Link href={`/properties/${property._id}`} className="btn btn-xs btn-outline border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg normal-case px-3 py-1.5 h-auto min-h-0">
                                                Details
                                            </Link>
                                            <button 
                                                onClick={() => handleRemoveFavorite(property._id)}
                                                className="btn btn-xs btn-outline border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 font-bold rounded-lg normal-case px-3 py-1.5 h-auto min-h-0"
                                            >
                                                Remove
                                            </button>
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
