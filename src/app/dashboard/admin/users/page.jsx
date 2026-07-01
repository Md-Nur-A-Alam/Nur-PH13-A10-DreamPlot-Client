"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { PersonIcon, Cross1Icon } from '@radix-ui/react-icons';

export default function ManageUsers() {
    const { data: session } = authClient.useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Create user modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin'
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [session]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("User created successfully!");
                setIsModalOpen(false);
                setFormData({ name: '', email: '', password: '', role: 'Admin' });
                fetchUsers();
            } else {
                toast.error(data.error || "Failed to create user.");
            }
        } catch (err) {
            console.error("Error creating user:", err);
            toast.error("An error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("User role updated successfully!");
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            } else {
                toast.error("Failed to update user role.");
            }
        } catch (err) {
            console.error("Error updating user role:", err);
            toast.error("An error occurred.");
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading user directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                        All Users
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                        Manage accounts, permissions, and system access levels
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-md border-none bg-[#319795] text-white hover:bg-[#277a78] font-bold rounded-xl shadow-md transition-all duration-200"
                >
                    + Add New Admin / User
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                <div className="overflow-x-auto">
                    <table className="table table-lg w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">User Identity</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Profession</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Account Role</th>
                                <th className="text-xs font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((item) => {
                                const roleColors = {
                                    Admin: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                                    Owner: 'bg-teal-50 text-teal-700 border-teal-100',
                                    Tenant: 'bg-slate-50 text-slate-700 border-slate-100'
                                };

                                return (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 h-10 rounded-full ring-2 ring-slate-100">
                                                        <img src={item.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt={item.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 block leading-tight">{item.name}</span>
                                                    <span className="text-[11px] text-slate-400 font-semibold select-text">{item.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-slate-600 text-sm font-semibold capitalize">{item.profession || 'Not Specified'}</td>
                                        <td>
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${roleColors[item.role || 'Tenant']}`}>
                                                {item.role || 'Tenant'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2 h-16">
                                                <select 
                                                    value={item.role || 'Tenant'}
                                                    onChange={(e) => handleRoleChange(item._id, e.target.value)}
                                                    className="select select-bordered select-xs text-xs h-8 min-h-0 bg-slate-50 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-[#319795] pr-7"
                                                >
                                                    <option value="Tenant">Tenant</option>
                                                    <option value="Owner">Owner</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                            <Cross1Icon className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-black text-[#0A192F] tracking-tight">Create User Account</h2>
                            <p className="text-slate-400 text-xs mt-1">Register a new profile directly into the system database.</p>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="form-control space-y-1">
                                <label className="label py-0"><span className="label-text text-xs font-bold text-slate-500 uppercase">Full Name</span></label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Jane Doe" 
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl"
                                />
                            </div>

                            <div className="form-control space-y-1">
                                <label className="label py-0"><span className="label-text text-xs font-bold text-slate-500 uppercase">Email Address</span></label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="jane@company.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl"
                                />
                            </div>

                            <div className="form-control space-y-1">
                                <label className="label py-0"><span className="label-text text-xs font-bold text-slate-500 uppercase">Password</span></label>
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl"
                                />
                            </div>

                            <div className="form-control space-y-1">
                                <label className="label py-0"><span className="label-text text-xs font-bold text-slate-500 uppercase">Account Role</span></label>
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl font-semibold text-slate-700"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Owner">Owner</option>
                                    <option value="Tenant">Tenant</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="btn w-full h-11 min-h-0 mt-4 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {submitting ? (
                                    <span className="loading loading-spinner loading-sm text-slate-400"></span>
                                ) : (
                                    <span>Create User</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
