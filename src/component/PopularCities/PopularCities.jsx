"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PinTopIcon } from '@radix-ui/react-icons';

const PopularCities = () => {
    // Structural layout context array with premium architectural city images
    const cities = [
    {
        name: "Dhaka",
        propertiesCount: 142,
        image: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=600&q=80"
    },
    {
        name: "Khulna",
        propertiesCount: 64,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
    },
    {
        name: "Chattogram",
        propertiesCount: 98,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80"
    },
    {
        name: "Rajshahi",
        propertiesCount: 45,
        image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
    },
    {
        name: "Sylhet",
        propertiesCount: 52,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    },
    {
        name: "Barishal",
        propertiesCount: 31,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
    }
];

    const gridContainerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardEntranceVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 260, damping: 25 }
        }
    };

    return (
        <section className="relative w-full bg-[#F2F5FA] py-24 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden select-none">
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header Title Section */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-[#0A192F] tracking-tight antialiased"
                    >
                        Popular Cities
                    </motion.h2>
                    <div className="h-0.75 w-12 bg-[#319795] mx-auto mt-3 rounded-full" />
                </div>

                {/* 3-Column Responsive Grid */}
                <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {cities.map((city, index) => (
                        <motion.div
                            key={index}
                            variants={cardEntranceVariants}
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            className="group relative rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer shadow-md min-h-45 overflow-hidden"
                        >
                            {/* Next.js Optimized Background Image with Premium Zoom-on-Hover Effect */}
                            <motion.div
                                variants={{
                                    hover: { scale: 1.1 }
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute inset-0 z-0"
                            >
                                <Image
                                    src={city.image}
                                    alt={`Real estate in ${city.name}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                    priority={index < 3}
                                />
                            </motion.div>

                            {/* Tint Overlay: Gradient filter ensuring white text pop, morphing into a brand Teal glow on hover */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20 group-hover:from-[#0A192F]/80 group-hover:via-[#319795]/40 group-hover:to-black/20 transition-all duration-500 z-10" />

                            {/* Content Wrapper */}
                            <div className="relative z-20 flex flex-col items-center justify-center text-center">

                                {/* City Header Block */}
                                <div className="flex items-center gap-2">
                                    <motion.span
                                        variants={{
                                            hover: { y: -4, scale: 1.15, color: "#F6AD55" }
                                        }}
                                        transition={{ type: "spring", stiffness: 350, damping: 12 }}
                                        className="text-white transition-colors duration-200"
                                    >
                                        <PinTopIcon className="w-6 h-6 rotate-180 transform stroke-[1.8]" />
                                    </motion.span>

                                    <h3 className="text-2xl font-bold text-white tracking-tight antialiased drop-shadow-sm">
                                        {city.name}
                                    </h3>
                                </div>

                                {/* Active Listings Subtitle Metric */}
                                <div className="overflow-hidden h-5 mt-2">
                                    <motion.span
                                        variants={{
                                            hover: { y: 0, opacity: 1 }
                                        }}
                                        initial={{ y: 15, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="block text-xs font-semibold text-[#A2EAE7] tracking-wide drop-shadow-sm"
                                    >
                                        {city.propertiesCount} Active Listings →
                                    </motion.span>
                                </div>
                            </div>

                            {/* Outer Solid Hover Border Ring */}
                            <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-transparent group-hover:border-[#319795]/50 transition-all duration-300 pointer-events-none z-30" />

                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default PopularCities;