"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PinTopIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@radix-ui/react-icons';

const AdvanceSearch = ({ initialData }) => {
    // 1. Core State Hooks
    const [properties, setProperties] = useState(initialData?.properties || []);
    const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
    const [loading, setLoading] = useState(false);

    const [searchLocation, setSearchLocation] = useState('');
    const [propertyType, setPropertyType] = useState('All Types');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(15000);
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);

    // 2. Fetch properties from backend based on filter parameters
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties?search=${encodeURIComponent(searchLocation)}&type=${encodeURIComponent(propertyType)}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sortBy}&page=${currentPage}&limit=6`);
                const data = await res.json();
                if (data && data.properties) {
                    setProperties(data.properties);
                    setTotalPages(data.totalPages || 1);
                }
            } catch (err) {
                console.error("Error fetching properties:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [searchLocation, propertyType, minPrice, maxPrice, sortBy, currentPage]);

    const handleApplyFilters = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    return (
        <div className="space-y-10">
            
            {/* ==================== A. ADVANCED SEARCH & BUDGET FILTER CONSOLE ==================== */}
            <form onSubmit={handleApplyFilters} className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.01)] space-y-6">
                
                {/* Responsive Filter Grid Layout Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                    
                    {/* Filter: Location Query */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Location</label>
                        <div className="relative">
                            <PinTopIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 rotate-180 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Enter city or neighborhood"
                                value={searchLocation}
                                onChange={(e) => { setSearchLocation(e.target.value); setCurrentPage(1); }}
                                className="input input-bordered w-full pl-10 h-12 bg-slate-50 border-slate-200 text-sm focus:outline-none focus:border-[#319795] rounded-xl text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Filter: Property Structural Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Property Type</label>
                        <select 
                            value={propertyType}
                            onChange={(e) => { setPropertyType(e.target.value); setCurrentPage(1); }}
                            className="select select-bordered w-full h-12 bg-slate-50 border-slate-200 text-sm focus:outline-none focus:border-[#319795] rounded-xl text-slate-700 font-medium"
                        >
                            <option>All Types</option>
                            <option>Studio</option>
                            <option>Villa</option>
                            <option>Office</option>
                            <option>Land</option>
                        </select>
                    </div>

                    {/* Filter: Dynamic Sort Configurations Matrix */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Sort By</label>
                        <select 
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                            className="select select-bordered w-full h-12 bg-slate-50 border-slate-200 text-sm focus:outline-none focus:border-[#319795] rounded-xl text-slate-700 font-medium"
                        >
                            <option value="latest">Latest Properties</option>
                            <option value="low-high">Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Filter Button Action Trigger */}
                    <button type="submit" className="btn h-12 min-h-12 border-none bg-[#319795] hover:bg-[#277a78] text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 shadow-sm transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <span>Apply Search</span>
                    </button>

                </div>

                {/* Comprehensive Dual Range Budget Selector Row Block */}
                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>Minimum Rent Range</span>
                            <span className="text-[#319795] font-extrabold">${Number(minPrice).toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="5000" 
                            step="50"
                            value={minPrice} 
                            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                            className="range range-xs [--range-shdw:#319795]" 
                        />
                    </div>

                    <div className="w-full md:w-1/2 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>Maximum Budget Boundary</span>
                            <span className="text-[#319795] font-extrabold">${Number(maxPrice).toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" 
                            min="500" 
                            max="15000" 
                            step="100"
                            value={maxPrice} 
                            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                            className="range range-xs [--range-shdw:#319795]" 
                        />
                    </div>
                </div>

            </form>

            {/* ==================== B. FILTERED PROPERTY CARD DISPLAY LISTINGS ==================== */}
            {properties.length === 0 ? (
                <div className="w-full text-center py-20 bg-white border border-slate-200 rounded-2xl">
                    <p className="text-slate-400 font-medium">No real estate listings matched your active filter rules.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <div 
                            key={property._id}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.045)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Graphic Thumbnail Display Frame Component */}
                            <div className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden">
                                <Image 
                                    src={property.imageURL || property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"} 
                                    alt={property.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0A192F] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm border border-slate-100">
                                    {property.isFeatured ? '★ Featured' : 'New Listing'}
                                </span>

                                <button type="button" className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm">
                                    <HeartIcon className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Descriptions Card Core Text Engine Section */}
                            <div className="p-6 grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-3 mb-3">
                                        <h3 className="text-lg font-bold text-[#0A192F] tracking-tight antialiased line-clamp-1 group-hover:text-[#319795] transition-colors duration-200">
                                            {property.title}
                                        </h3>
                                        <div className="shrink-0 text-right">
                                            <span className="text-lg font-bold text-[#319795]">
                                                ${property.rent.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium lowercase block">
                                                /{property.rentType === 'monthly' ? 'mo' : 'day'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-5">
                                        <PinTopIcon className="w-4 h-4 rotate-180 transform text-slate-400" />
                                        <span className="line-clamp-1">{property.location}</span>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-slate-500 text-xs font-semibold">
                                        <span className="flex items-center gap-1">
                                            🛏️ {property.bedrooms || 0} Beds
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🛁 {property.bathrooms || 1} Baths
                                        </span>
                                        <span className="text-slate-400 ml-auto font-medium">
                                            {property.propertySize || '450 sqft'}
                                        </span>
                                    </div>

                                    <Link 
                                        href={`/properties/${property._id}`}
                                        className="block w-full py-3 text-center border border-slate-200 hover:border-[#319795] bg-white text-slate-700 hover:text-[#319795] text-sm font-bold rounded-xl transition-all duration-200 shadow-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* ==================== C. ITERATIVE PAGINATION BUTTON INTERFACE MATRIX ==================== */}
            {totalPages > 1 && (
                <div className="w-full flex justify-center items-center gap-2 pt-6">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="btn btn-square btn-outline border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-xl text-slate-600 h-10 w-10 min-h-0"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`btn btn-square border-none text-xs font-bold rounded-xl h-10 w-10 min-h-0 transition-colors ${
                                    isCurrent 
                                        ? 'bg-[#319795] text-white' 
                                        : 'bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="btn btn-square btn-outline border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-xl text-slate-600 h-10 w-10 min-h-0"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

        </div>
    );
};

export default AdvanceSearch;