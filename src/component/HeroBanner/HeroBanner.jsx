"use client";

import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = () => {
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
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center select-none">
                
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
                    className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mb-6 dropping-shadow-md drop-shadow-sm antialiased"
                >
                    Find Your Dream Plot, Wherever You Go.
                </motion.h1>

                {/* Subtitle Description text */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-10 text-shadow"
                >
                    Premium rentals and seamless bookings for owners and tenants. Experience 
                    architectural precision in every search.
                </motion.p>

                {/* Fancy Interactive Call-to-Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                >
                    <button className="btn btn-lg w-full sm:w-auto px-8 font-semibold rounded-xl border-none bg-[#319795] text-white hover:bg-[#277a78] shadow-lg shadow-[#319795]/20 hover:scale-105 transition-all duration-300 normal-case">
                        Explore Properties
                    </button>
                    
                    <button className="btn btn-lg btn-outline w-full sm:w-auto px-8 font-semibold rounded-xl border-white/60 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 normal-case backdrop-blur-sm">
                        Learn More
                    </button>
                </motion.div>

            </div>

            {/* 3. Subtle bottom divider edge fade to blend with standard page contents seamlessly */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-[#F7F9FC] to-transparent pointer-events-none" />

        </div>
    );
};

export default HeroBanner;