"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Icons using clean SVG path design tailored to match the mockup visuals
const ShieldIcon = () => (
    <svg className="w-6 h-6 text-[#2c8886]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const KeyIcon = () => (
    <svg className="w-6 h-6 text-[#2c8886]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-6 h-6 text-[#2c8886]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const Specialty = () => {
    // Exact cards data content matching image_aab646.png
    const specialities = [
        {
            icon: <ShieldIcon />,
            title: "Trusted Security",
            description: "Advanced verification systems ensuring institutional trust for every property and user."
        },
        {
            icon: <KeyIcon />,
            title: "Easy Accessibility",
            description: "Seamless booking and management tools designed for high-end concierge experiences."
        },
        {
            icon: <SparklesIcon />,
            title: "Premium Quality",
            description: "Architectural precision in every listing, verified for quality and hospitality standards."
        }
    ];

    // Framer Motion Animation Variants
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="w-full bg-[#F2F5FA] py-20 px-4 sm:px-6 lg:px-8 xl:px-12 select-none">
            <div className="max-w-7xl mx-auto">
                
                {/* Main Heading Text */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight antialiased"
                    >
                        Why Choose DreamPlot
                    </motion.h2>
                </div>

                {/* Grid Container for Feature Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {specialities.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300"
                        >
                            {/* Circular Icon Wrapper (Matching the light cyan circle from image_aab646.png) */}
                            <div className="w-14 h-14 rounded-full bg-[#A2EAE7]/60 flex items-center justify-center mb-6">
                                {item.icon}
                            </div>

                            {/* Feature Card Title */}
                            <h3 className="text-xl font-bold text-[#0A192F] tracking-tight mb-4">
                                {item.title}
                            </h3>

                            {/* Feature Card Description */}
                            <p className="text-slate-500 text-sm leading-relaxed max-w-70">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Specialty;