"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { EyeOpenIcon, TrashIcon, Pencil2Icon, Cross1Icon } from '@radix-ui/react-icons';

export default function MyProperties() {
    const { data: session } = authClient.useSession();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Feedback Modal State
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // Edit Modal State
    const [editingProperty, setEditingProperty] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingEditImage, setUploadingEditImage] = useState(false);

    const handleEditImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image file is too large. Please upload an image smaller than 5MB.");
            return;
        }

        setUploadingEditImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '2883ef57db2ff13247076d6ec555a6d5';
            const keyToUse = apiKey === 'placeholder_imgbb_api_key' ? 'ba7815cf1ad0ca02ec03df6a17b3f2df' : apiKey;

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${keyToUse}`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error("Failed to upload image to ImgBB.");
            }

            const data = await res.json();
            if (data?.data?.url) {
                setEditingProperty(prev => ({ ...prev, imageURL: data.data.url }));
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error("Invalid response from ImgBB.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Could not upload image directly. Please paste a URL manually or try again.");
        } finally {
            setUploadingEditImage(false);
        }
    };

    const fetchProperties = async () => {
        if (!session?.user?.email) return;
        try {
            const token = localStorage.getItem('jwt-token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/owner/${session.user.email}`, {
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property listing?")) return;
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

    const handleOpenEdit = (property) => {
        setEditingProperty({ ...property });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingProperty(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSavingEdit(true);
        try {
            const token = localStorage.getItem('jwt-token');
            const payload = {
                title: editingProperty.title,
                location: editingProperty.location,
                propertyType: editingProperty.propertyType,
                rent: Number(editingProperty.rent),
                rentType: editingProperty.rentType,
                bedrooms: Number(editingProperty.bedrooms) || 0,
                bathrooms: Number(editingProperty.bathrooms) || 0,
                propertySize: editingProperty.propertySize,
                imageURL: editingProperty.imageURL,
                extraFeatures: editingProperty.extraFeatures,
                description: editingProperty.description
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${editingProperty._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("Property updated successfully!");
                setEditingProperty(null);
                fetchProperties();
            } else {
                toast.info("No changes made.");
            }
        } catch (err) {
            console.error("Error updating property:", err);
            toast.error("Failed to update listing.");
        } finally {
            setSavingEdit(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    My Listed Properties
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Manage and edit the real estate properties you have published
                </p>
            </div>

            {properties.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <p className="text-slate-500 font-bold text-sm">No properties listed yet.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Start monetization by publishing your first property listing on our platform!</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                    <div className="overflow-x-auto">
                        <table className="table table-lg w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Property</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Type</th>
                                    <th className="text-xs font-black uppercase text-slate-400 tracking-wider">Price / Billing</th>
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
                                            <td className="text-slate-600 text-sm font-semibold capitalize">{property.propertyType}</td>
                                            <td className="font-extrabold text-[#319795] text-sm">
                                                ${(property.rent || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-400">/{property.rentType === 'monthly' ? 'mo' : 'day'}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${statusColors[property.status || 'pending']}`}>
                                                        {property.status || 'pending'}
                                                    </span>
                                                    {property.status === 'rejected' && property.rejectionFeedback && (
                                                        <button 
                                                            onClick={() => setSelectedFeedback(property.rejectionFeedback)}
                                                            className="btn btn-ghost btn-circle btn-xs text-slate-500 hover:text-[#319795]"
                                                            title="View Feedback"
                                                        >
                                                            <EyeOpenIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2 h-20">
                                                    <button 
                                                        onClick={() => handleOpenEdit(property)}
                                                        className="btn btn-xs btn-outline border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                    >
                                                        <Pencil2Icon className="w-3.5 h-3.5 mr-1" /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(property._id)}
                                                        className="btn btn-xs btn-outline border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 font-bold rounded-lg normal-case px-2.5 py-1.5 h-auto min-h-0"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5 mr-1" /> Delete
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
            )}

            {/* Modal: View Rejection Feedback */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-red-600">Rejection Feedback</h3>
                            <button onClick={() => setSelectedFeedback(null)} className="btn btn-ghost btn-circle btn-xs text-slate-400">
                                <Cross1Icon className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedFeedback}</p>
                        <button onClick={() => setSelectedFeedback(null)} className="btn w-full bg-black hover:bg-slate-900 text-white rounded-xl font-bold h-11 border-none normal-case">
                            Close Review Feedback
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Edit Property Form */}
            {editingProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-black text-[#0A192F]">Edit Property Details</h3>
                            <button onClick={() => setEditingProperty(null)} className="btn btn-ghost btn-circle btn-xs text-slate-400">
                                <Cross1Icon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="edit-title"><span className="label-text text-xs font-bold text-slate-500 uppercase">Property Title</span></label>
                                <input type="text" id="edit-title" name="title" value={editingProperty.title} onChange={handleEditChange} required className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl focus:border-[#319795]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-location"><span className="label-text text-xs font-bold text-slate-500 uppercase">Location</span></label>
                                    <input type="text" id="edit-location" name="location" value={editingProperty.location} onChange={handleEditChange} required className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-type"><span className="label-text text-xs font-bold text-slate-500 uppercase">Property Type</span></label>
                                    <select id="edit-type" name="propertyType" value={editingProperty.propertyType} onChange={handleEditChange} className="select select-bordered w-full h-11 min-h-0 bg-slate-50 text-sm rounded-xl">
                                        <option value="Studio">Studio</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Office">Office</option>
                                        <option value="Land">Land</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-rent"><span className="label-text text-xs font-bold text-slate-500 uppercase">Rent Price (USD)</span></label>
                                    <input type="number" id="edit-rent" name="rent" value={editingProperty.rent} onChange={handleEditChange} required className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-rentType"><span className="label-text text-xs font-bold text-slate-500 uppercase">Billing Frequency</span></label>
                                    <select id="edit-rentType" name="rentType" value={editingProperty.rentType} onChange={handleEditChange} className="select select-bordered w-full h-11 min-h-0 bg-slate-50 text-sm rounded-xl">
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-bedrooms"><span className="label-text text-xs font-bold text-slate-500 uppercase">Bedrooms</span></label>
                                    <input type="number" id="edit-bedrooms" name="bedrooms" value={editingProperty.bedrooms} onChange={handleEditChange} className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-bathrooms"><span className="label-text text-xs font-bold text-slate-500 uppercase">Bathrooms</span></label>
                                    <input type="number" id="edit-bathrooms" name="bathrooms" value={editingProperty.bathrooms} onChange={handleEditChange} className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="edit-size"><span className="label-text text-xs font-bold text-slate-500 uppercase">Size</span></label>
                                    <input type="text" id="edit-size" name="propertySize" value={editingProperty.propertySize} onChange={handleEditChange} required className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                                </div>
                            </div>

                            {/* Image URL & Direct Upload Option */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Property Image</span>
                                    <span className="text-[10px] text-slate-400 font-semibold">Upload directly or paste a web URL</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Drag and drop style file selector */}
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#319795] rounded-xl p-3 transition-all bg-white relative min-h-[90px]">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleEditImageUpload}
                                            disabled={uploadingEditImage}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                        />
                                        {uploadingEditImage ? (
                                            <div className="flex flex-col items-center gap-1.5 py-1">
                                                <span className="loading loading-spinner loading-sm text-[#319795]"></span>
                                                <p className="text-[11px] text-slate-500 font-bold">Uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 py-1 text-center">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-[#319795] font-bold">Click to Upload</p>
                                                <p className="text-[9px] text-slate-400">PNG, JPG or WEBP up to 5MB</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Main Image URL Input & Preview */}
                                    <div className="space-y-2">
                                        <div className="form-control w-full space-y-1">
                                            <label className="label py-0" htmlFor="edit-image">
                                                <span className="label-text text-[10px] font-bold text-slate-400 uppercase">Or Image URL Link</span>
                                            </label>
                                            <input 
                                                type="url" 
                                                id="edit-image" 
                                                name="imageURL" 
                                                value={editingProperty.imageURL} 
                                                onChange={handleEditChange} 
                                                required 
                                                className="input input-bordered w-full h-10 bg-white border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#319795] rounded-xl transition-all" 
                                            />
                                        </div>

                                        {editingProperty.imageURL && (
                                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200/80">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                                                    <img src={editingProperty.imageURL} alt="Preview" className="object-cover w-full h-full" />
                                                </div>
                                                <div className="grow min-w-0">
                                                    <p className="text-[9px] text-slate-500 truncate">{editingProperty.imageURL}</p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setEditingProperty(prev => ({ ...prev, imageURL: '' }))}
                                                    className="btn btn-ghost btn-circle btn-xs text-red-500 hover:bg-red-50"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {process.env.NEXT_PUBLIC_IMGBB_API_KEY === 'placeholder_imgbb_api_key' && (
                                    <p className="text-[9px] text-slate-400 leading-normal italic pt-1 border-t border-slate-200/50">
                                        Note: Direct upload is running in demo mode. To configure your own cloud storage, register for a free API key at <a href="https://api.imgbb.com" target="_blank" rel="noopener noreferrer" className="underline text-[#319795] hover:text-[#277a78]">api.imgbb.com</a> and replace <code>NEXT_PUBLIC_IMGBB_API_KEY</code> in client <code>.env</code>.
                                    </p>
                                )}
                            </div>

                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="edit-desc"><span className="label-text text-xs font-bold text-slate-500 uppercase">Description</span></label>
                                <textarea id="edit-desc" name="description" value={editingProperty.description} onChange={handleEditChange} required rows={3} className="textarea textarea-bordered w-full text-sm bg-slate-50 focus:bg-white rounded-xl p-3" />
                            </div>

                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="edit-extra"><span className="label-text text-xs font-bold text-slate-500 uppercase">Extra Features</span></label>
                                <input type="text" id="edit-extra" name="extraFeatures" value={editingProperty.extraFeatures || ''} onChange={handleEditChange} className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingProperty(null)} className="btn btn-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl normal-case font-bold px-6">
                                    Cancel
                                </button>
                                <button type="submit" disabled={savingEdit} className="btn btn-md bg-[#319795] hover:bg-[#277a78] border-none text-white rounded-xl normal-case font-bold px-6">
                                    {savingEdit ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
