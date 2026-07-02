"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiSliders } from 'react-icons/fi';

const HeroBanner = () => {
    const router = useRouter();

    // Search state configurations
    const [searchLocation, setSearchLocation] = useState('');
    const [propertyType, setPropertyType] = useState('All Types');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(15000);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        const params = new URLSearchParams();
        if (searchLocation.trim()) params.set('search', searchLocation.trim());
        if (propertyType !== 'All Types') params.set('type', propertyType);
        if (minPrice > 0) params.set('minPrice', minPrice);
        if (maxPrice < 15005 && maxPrice !== 15000) params.set('maxPrice', maxPrice);

        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center bg-slate-900 overflow-hidden">
            
            {/* 1. Background Image Layer with Gradient Overlay to match the sunset color tone exactly */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80')` 
                }}
            >
                {/* Visual gradient filter to darken the base image for text readability while maintaining warm sky values */}
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-slate-950/40 to-[#0A192F]/60 backdrop-brightness-[0.85]" />
            </div>

            {/* 2. Hero Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center select-none w-full">
                
                {/* Fancy animated Pill Tag / Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white tracking-wide shadow-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-[#F6AD55] animate-pulse"></span>
                    <span>Discover Exclusivity</span>
                </motion.div>

                {/* Header Title Text - Exact content matching image_aa9bff.jpg */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mb-4 dropping-shadow-md drop-shadow-sm antialiased"
                >
                    Find Your Dream Plot, Wherever You Go.
                </motion.h1>

                {/* Subtitle Description text */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-6 text-shadow"
                >
                    Premium rentals and seamless bookings for owners and tenants. Experience 
                    architectural precision in every search.
                </motion.p>

                {/* Advanced Search Form Console */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl text-left"
                >
                    <form onSubmit={handleSearchSubmit} className="space-y-6">
                        {/* Core inputs grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Location Search Field */}
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                                    Location
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#319795] w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="City, neighborhood, or title..."
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        className="input input-bordered w-full pl-11 h-12 bg-white text-slate-800 text-sm focus:outline-none focus:border-[#319795] border-white/10 rounded-2xl shadow-inner font-medium placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Property Type Dropdown */}
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                                    Property Type
                                </label>
                                <select 
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="select select-bordered w-full h-12 bg-white text-slate-800 text-sm focus:outline-none focus:border-[#319795] border-white/10 rounded-2xl shadow-inner font-medium"
                                >
                                    <option>All Types</option>
                                    <option>Studio</option>
                                    <option>Villa</option>
                                    <option>Office</option>
                                    <option>Land</option>
                                </select>
                            </div>

                            {/* Action Buttons: Toggle Advanced + Search */}
                            <div className="md:col-span-4 flex items-center gap-3">
                                {/* Advanced Toggle */}
                                <button 
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`btn h-12 min-h-12 border border-white/20 hover:border-white/40 text-xs font-bold rounded-2xl normal-case flex items-center justify-center gap-2 grow transition-all duration-300 ${
                                        showAdvanced 
                                            ? 'bg-[#319795]/20 text-[#319795] border-[#319795]/40 hover:bg-[#319795]/30' 
                                            : 'bg-white/5 hover:bg-white/10 text-white'
                                    }`}
                                >
                                    <FiSliders className="w-4 h-4" />
                                    <span>{showAdvanced ? 'Simple' : 'Advanced'}</span>
                                </button>

                                {/* Search Button */}
                                <button 
                                    type="submit" 
                                    className="btn h-12 min-h-12 border-none bg-[#319795] hover:bg-[#277a78] hover:scale-102 active:scale-98 text-white font-extrabold text-sm rounded-2xl normal-case flex items-center justify-center gap-2 grow-[2] shadow-lg shadow-[#319795]/30 transition-all duration-300"
                                >
                                    <FiSearch className="w-4 h-4 stroke-[3px]" />
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Collapsible price sliders row */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
                                >
                                    <div className="w-full md:w-1/2 space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            <span>Min Monthly Rent</span>
                                            <span className="text-[#319795] font-extrabold">${Number(minPrice).toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="5000" 
                                            step="50"
                                            value={minPrice} 
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                            className="range range-xs [--range-shdw:#319795] accent-[#319795]" 
                                        />
                                    </div>

                                    <div className="w-full md:w-1/2 space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            <span>Max Monthly Budget</span>
                                            <span className="text-[#319795] font-extrabold">${Number(maxPrice).toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="500" 
                                            max="15000" 
                                            step="100"
                                            value={maxPrice} 
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="range range-xs [--range-shdw:#319795] accent-[#319795]" 
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>

            </div>

            {/* 3. Subtle bottom divider edge fade to blend with standard page contents seamlessly */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-[#F7F9FC] to-transparent pointer-events-none" />

        </div>
    );
};

export default HeroBanner;