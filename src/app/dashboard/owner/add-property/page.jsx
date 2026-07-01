"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { PlusIcon } from '@radix-ui/react-icons';

export default function AddProperty() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [loading, setLoading] = useState(false);

    // Initial state for property fields
    const [property, setProperty] = useState({
        title: '',
        description: '',
        location: '',
        propertyType: 'Studio',
        rent: '',
        rentType: 'monthly',
        bedrooms: '',
        bathrooms: '',
        propertySize: '',
        imageURL: '',
        extraFeatures: '',
        amenities: []
    });

    const amenitiesList = [
        "WiFi", "AC", "Pool", "Gym", "Parking", "Backyard", "Elevator", "24/7 Security", "Private Terrace", "Beach Access"
    ];

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setProperty(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityCheck = (amenity) => {
        setProperty(prev => {
            const current = [...prev.amenities];
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('jwt-token');

            // Format data payload with owner metadata from session
            const payload = {
                ...property,
                rent: Number(property.rent),
                bedrooms: Number(property.bedrooms) || 0,
                bathrooms: Number(property.bathrooms) || 0,
                images: property.imageURL ? [property.imageURL] : [],
                ownerEmail: session.user.email,
                ownerName: session.user.name,
                ownerImage: session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                isFeatured: false,
                status: 'pending'
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.insertedId) {
                toast.success("Property listed successfully! Sent for moderation.");
                router.push('/dashboard/owner/my-properties');
            } else {
                toast.error("Failed to add property listing.");
            }
        } catch (err) {
            console.error("Error creating listing:", err);
            toast.error("An error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                    Add New Property
                </h1>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Fill out the parameters to submit a new real estate listing
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Title */}
                    <div className="form-control w-full space-y-1">
                        <label className="label py-0" htmlFor="title">
                            <span className="label-text text-xs font-bold text-slate-500 uppercase">Property Title</span>
                        </label>
                        <input 
                            type="text" 
                            id="title"
                            name="title"
                            value={property.title}
                            onChange={handleTextChange}
                            required
                            placeholder="e.g. Modern High-Rise Penthouse with Skyline View"
                            className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                        />
                    </div>

                    {/* Location & Property Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="location">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Location Address</span>
                            </label>
                            <input 
                                type="text" 
                                id="location"
                                name="location"
                                value={property.location}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. Gulshan, Dhaka"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="propertyType">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Property Type</span>
                            </label>
                            <select 
                                id="propertyType"
                                name="propertyType"
                                value={property.propertyType}
                                onChange={handleTextChange}
                                className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#319795] rounded-xl"
                            >
                                <option value="Studio">Studio</option>
                                <option value="Villa">Villa</option>
                                <option value="Office">Office</option>
                                <option value="Land">Land</option>
                            </select>
                        </div>
                    </div>

                    {/* Rent Price & Rent Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="rent">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Rent Rate (USD)</span>
                            </label>
                            <input 
                                type="number" 
                                id="rent"
                                name="rent"
                                value={property.rent}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. 2500"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="rentType">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Billing Frequency</span>
                            </label>
                            <select 
                                id="rentType"
                                name="rentType"
                                value={property.rentType}
                                onChange={handleTextChange}
                                className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#319795] rounded-xl"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>

                    {/* Bedrooms, Bathrooms, and Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="bedrooms">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Bedrooms</span>
                            </label>
                            <input 
                                type="number" 
                                id="bedrooms"
                                name="bedrooms"
                                value={property.bedrooms}
                                onChange={handleTextChange}
                                placeholder="e.g. 3 (0 for Land)"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="bathrooms">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Bathrooms</span>
                            </label>
                            <input 
                                type="number" 
                                id="bathrooms"
                                name="bathrooms"
                                value={property.bathrooms}
                                onChange={handleTextChange}
                                placeholder="e.g. 2"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>
                        <div className="form-control w-full space-y-1">
                            <label className="label py-0" htmlFor="propertySize">
                                <span className="label-text text-xs font-bold text-slate-500 uppercase">Property Size</span>
                            </label>
                            <input 
                                type="text" 
                                id="propertySize"
                                name="propertySize"
                                value={property.propertySize}
                                onChange={handleTextChange}
                                required
                                placeholder="e.g. 1850 sqft"
                                className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    {/* Image URL & Description */}
                    <div className="form-control w-full space-y-1">
                        <label className="label py-0" htmlFor="imageURL">
                            <span className="label-text text-xs font-bold text-slate-500 uppercase">Main Image URL</span>
                        </label>
                        <input 
                            type="url" 
                            id="imageURL"
                            name="imageURL"
                            value={property.imageURL}
                            onChange={handleTextChange}
                            required
                            placeholder="https://images.unsplash.com/photo-..."
                            className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                        />
                    </div>

                    <div className="form-control w-full space-y-1">
                        <label className="label py-0" htmlFor="description">
                            <span className="label-text text-xs font-bold text-slate-500 uppercase">Description</span>
                        </label>
                        <textarea 
                            id="description"
                            name="description"
                            value={property.description}
                            onChange={handleTextChange}
                            required
                            rows={4}
                            placeholder="Write an engaging overview highlighting key details of your property..."
                            className="textarea textarea-bordered w-full bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all p-4"
                        />
                    </div>

                    {/* Extra Features */}
                    <div className="form-control w-full space-y-1">
                        <label className="label py-0" htmlFor="extraFeatures">
                            <span className="label-text text-xs font-bold text-slate-500 uppercase">Extra Features / Notes</span>
                        </label>
                        <input 
                            type="text" 
                            id="extraFeatures"
                            name="extraFeatures"
                            value={property.extraFeatures}
                            onChange={handleTextChange}
                            placeholder="e.g. Includes rooftop pool access, parking spot A2, backup power generator"
                            className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all"
                        />
                    </div>

                    {/* Amenities Checkboxes */}
                    <div className="space-y-2">
                        <label className="label py-0">
                            <span className="label-text text-xs font-bold text-slate-500 uppercase">Amenities Included</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                            {amenitiesList.map((amenity) => {
                                const isChecked = property.amenities.includes(amenity);
                                return (
                                    <label 
                                        key={amenity}
                                        className="flex items-center gap-2.5 cursor-pointer bg-slate-50 border border-slate-100 hover:bg-slate-100/50 p-3 rounded-xl transition-all text-xs font-semibold text-slate-600"
                                    >
                                        <input 
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleAmenityCheck(amenity)}
                                            className="checkbox checkbox-xs rounded [--chkbg:#319795] [--chkfg:white] border-slate-300"
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn w-full h-12 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 mt-4 shadow-sm transition-all"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm text-slate-400"></span>
                        ) : (
                            <>
                                <PlusIcon className="w-4 h-4" />
                                <span>Create Property Listing</span>
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
