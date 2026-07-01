"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { PersonIcon } from '@radix-ui/react-icons';

export default function MyProfile() {
    const { data: session } = authClient.useSession();
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        profession: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.email) return;
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/profile/${session.user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data && !data.error) {
                    setProfile({
                        name: data.name || '',
                        phone: data.phone || '',
                        dob: data.dob || '',
                        gender: data.gender || '',
                        address: data.address || '',
                        profession: data.profession || '',
                        image: data.image || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/profile/${session.user.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("Profile updated successfully!");
                // Also trigger a Better Auth update if needed (or simply refresh the page)
                authClient.updateUser({
                    name: profile.name,
                    image: profile.image || undefined
                });
            } else {
                toast.info("No changes made.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    My Profile
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Manage your personal account profile details
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Avatar/Summary Card (4 columns) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.015)] text-center flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-28 h-28 rounded-full overflow-hidden relative mx-auto border-4 border-[#319795]/20 shadow-inner">
                            <img 
                                src={profile.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} 
                                alt="User avatar" 
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0A192F]">{profile.name || session?.user?.name}</h3>
                            <span className="inline-block bg-[#EBF8FF] text-[#2B6CB0] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md mt-1">
                                {session?.user?.role || 'Tenant'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 mt-6 text-left space-y-3.5 text-xs text-slate-500 font-semibold">
                        <div className="flex justify-between">
                            <span className="uppercase text-slate-400">Email Address</span>
                            <span className="text-[#0A192F] select-text">{session?.user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="uppercase text-slate-400">Member Since</span>
                            <span className="text-[#0A192F]">
                                {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "2026"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Account Form Editor (8 columns) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name & Profession */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="name">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Full Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                                />
                            </div>
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="profession">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Profession</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="profession"
                                    name="profession"
                                    value={profile.profession}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone & Date of Birth */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="phone">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Phone Number</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +880 1711-223344"
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                                />
                            </div>
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="dob">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Date of Birth</span>
                                </label>
                                <input 
                                    type="date" 
                                    id="dob"
                                    name="dob"
                                    value={profile.dob}
                                    onChange={handleChange}
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-600 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Gender & Image URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                            <div className="form-control w-full sm:col-span-4 space-y-1">
                                <label className="label py-0" htmlFor="gender">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Gender</span>
                                </label>
                                <select 
                                    id="gender"
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#319795] rounded-xl"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-control w-full sm:col-span-8 space-y-1">
                                <label className="label py-0" htmlFor="image">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Avatar Image URL</span>
                                </label>
                                <input 
                                    type="url" 
                                    id="image"
                                    name="image"
                                    value={profile.image}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="address">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Full Address</span>
                            </label>
                            <input 
                                type="text" 
                                id="address"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="123 Luxury Ave, Gulshan, Dhaka"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="btn w-full h-12 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 mt-4 shadow-sm transition-all"
                        >
                            {saving ? (
                                <span className="loading loading-spinner loading-sm text-slate-400"></span>
                            ) : (
                                <>
                                    <PersonIcon className="w-4 h-4" />
                                    <span>Save Profile Changes</span>
                                </>
                            )}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
