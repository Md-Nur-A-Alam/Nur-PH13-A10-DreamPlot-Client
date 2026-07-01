import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProperties } from '@/app/lib/data';
import { PinTopIcon, ArrowRightIcon } from '@radix-ui/react-icons';

const FeaturedProperties = async () => {
    // Fetch directly optimized array payload (exactly 6 items)
    const featuredProperties = await getFeaturedProperties() || [];

    return (
        <section className="w-full bg-[#F2F5FA] py-20 px-4 sm:px-6 lg:px-8 xl:px-12 select-none">
            <div className="max-w-7xl mx-auto">
                
                {/* 1. SECTION COMPONENT HEADER BLOCK */}
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight antialiased">
                            Featured Properties
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Handpicked premium listings for you.
                        </p>
                    </div>
                    
                    <Link 
                        href="/properties" 
                        className="group flex items-center gap-1.5 text-sm font-bold text-[#319795] hover:text-[#277a78] transition-colors duration-200"
                    >
                        <span>Explore All</span>
                        <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 2. RESPONSIVE PROPERTY CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map((property) => (
                        <Link 
                            key={property._id}
                            href={`/properties/${property._id}`}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.045)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Card Media Wrapper */}
                            <div className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden">
                                <Image 
                                    src={property.imageURL || property.images?.[0]} 
                                    alt={property.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                
                                {/* Absolute Badge Tag Pill Component */}
                                <span className="absolute top-4 right-4 bg-[#319795] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                                    {property.propertyType}
                                </span>
                            </div>

                            {/* Card Details Text Content Block */}
                            <div className="p-6 grow flex flex-col justify-between">
                                <div>
                                    {/* Title & Price Container */}
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

                                    {/* Geo Location Map Tag Module */}
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-4">
                                        <PinTopIcon className="w-4 h-4 rotate-180 transform text-slate-400" />
                                        <span className="line-clamp-1">{property.location}</span>
                                    </div>
                                </div>

                                {/* Structural Specs & Action Button Strip */}
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-slate-500 text-xs font-semibold">
                                        <span className="flex items-center gap-1">
                                            🛏️ {property.bedrooms} Bed
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🛁 {property.bathrooms} Bath
                                        </span>
                                        <span className="text-slate-400 ml-auto font-medium">
                                            {property.propertySize}
                                        </span>
                                    </div>

                                    {/* Primary Action Button */}
                                    <div className="w-full py-3 text-center bg-[#EBF8FF] hover:bg-[#319795] text-[#2B6CB0] hover:text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm">
                                        View Details
                                    </div>
                                </div>
                            </div>

                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedProperties;