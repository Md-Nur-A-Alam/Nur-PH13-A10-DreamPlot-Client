import { getReviews } from '@/app/lib/data';
import React from 'react';
import Image from 'next/image';

// Reusable SVG star component matching the design color system
const StarIcon = () => (
    <svg className="w-5 h-5 text-[#319795]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Review = async () => {
    const allReviews = await getReviews();
    
    // Sort reviews by rating descending and slice the top 4
    const topRatedReviews = allReviews
        ? [...allReviews].sort((a, b) => b.rating - a.rating).slice(0, 4)
        : [];

    return (
        <section className="w-full bg-[#F2F5FA] py-20 px-4 sm:px-6 lg:px-8 xl:px-12 select-none">
            <div className="max-w-7xl mx-auto">
                
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight antialiased">
                        What Our Clients Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topRatedReviews.map((review, index) => (
                        <div 
                            key={review._id || index}
                            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.035)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center space-x-0.5 mb-4">
                                    {Array.from({ length: Math.min(Math.max(review.rating, 1), 5) }).map((_, i) => (
                                        <StarIcon key={i} />
                                    ))}
                                </div>

                                <p className="text-slate-600 text-[14px] leading-relaxed italic mb-6">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            </div>

                            {/* User Avatar Meta Stripe using next/image */}
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="relative w-10 h-10 overflow-hidden rounded-full border border-slate-100 bg-slate-50 shrink-0">
                                    <Image 
                                        src={review.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                                        alt={`${review.tenantName || review.name}'s profile avatar`}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-[#0A192F] tracking-tight leading-tight">
                                        {review.tenantName || review.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                                        Verified Tenant
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Review;