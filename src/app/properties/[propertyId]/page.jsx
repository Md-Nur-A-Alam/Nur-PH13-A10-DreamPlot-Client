"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { 
    PinTopIcon, 
    HeartIcon, 
    HeartFilledIcon, 
    InfoCircledIcon, 
    MixIcon, 
    Cross1Icon,
    CalendarIcon
} from '@radix-ui/react-icons';

export default function PropertyDetailsPage({ params: promiseParams }) {
    const params = React.use(promiseParams);
    const propertyId = params.propertyId;
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    
    // Auth Redirect Guard
    useEffect(() => {
        if (!isPending && !session) {
            toast.warning("Please sign in to view property details.");
            router.push(`/signIn?callbackUrl=/properties/${propertyId}`);
        }
    }, [session, isPending, router, propertyId]);

    const [propertyDetails, setPropertyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    
    // Booking Form State
    const [moveInDate, setMoveInDate] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingSubmit, setBookingSubmit] = useState(false);

    // Fetch property details and check if bookmarked
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${propertyId}`);
                const data = await res.json();
                if (data && !data.error) {
                    setPropertyDetails(data);
                } else {
                    toast.error("Property not found.");
                }
            } catch (err) {
                console.error("Error loading property:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [propertyId]);

    // Sync bookmark state when session is active
    useEffect(() => {
        const checkBookmark = async () => {
            if (!session?.user?.email) return;
            try {
                const token = localStorage.getItem('jwt-token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites/${session.user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const favoritesList = await res.json();
                if (Array.isArray(favoritesList)) {
                    const match = favoritesList.some(item => item._id === propertyId);
                    setIsBookmarked(match);
                }
            } catch (err) {
                console.error("Error syncing bookmark state:", err);
            }
        };
        checkBookmark();
    }, [session, propertyId]);

    const handleBookmarkToggle = async () => {
        if (!session) {
            toast.warning("Please sign in to save favorites.");
            router.push('/signIn');
            return;
        }

        try {
            const token = localStorage.getItem('jwt-token');
            if (isBookmarked) {
                // Delete favorite
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites/${session.user.email}/${propertyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.deletedCount > 0) {
                    setIsBookmarked(false);
                    toast.success("Removed from favorites!");
                }
            } else {
                // Create favorite
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tenantEmail: session.user.email,
                        propertyId: propertyDetails._id,
                        title: propertyDetails.title,
                        location: propertyDetails.location,
                        imageURL: propertyDetails.imageURL,
                        rent: propertyDetails.rent,
                        rentType: propertyDetails.rentType,
                        propertyType: propertyDetails.propertyType
                    })
                });
                const data = await res.json();
                if (data.insertedId) {
                    setIsBookmarked(true);
                    toast.success("Added to favorites!");
                }
            }
        } catch (err) {
            console.error("Bookmark toggle failed:", err);
            toast.error("Could not process bookmarks request.");
        }
    };

    const handleOpenBooking = () => {
        if (!session) {
            toast.warning("Please log in to book this property.");
            router.push('/signIn');
            return;
        }
        
        // Owner checks
        if (session.user.email === propertyDetails.ownerEmail) {
            toast.error("You cannot book your own property listing!");
            return;
        }

        // Check if user has Owner or Admin role and warn/disable
        if (session.user.role === 'Owner' || session.user.role === 'Admin') {
            toast.error(`Logged in as an ${session.user.role}. Only Tenants can request bookings.`);
            return;
        }

        setBookingModalOpen(true);
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        if (!moveInDate) {
            toast.warning("Please pick a move-in reservation date.");
            return;
        }

        setBookingSubmit(true);
        try {
            const token = localStorage.getItem('jwt-token');
            const bookingPayload = {
                propertyId: propertyDetails._id,
                propertyTitle: propertyDetails.title,
                propertyLocation: propertyDetails.location,
                propertyImage: propertyDetails.imageURL,
                rent: Number(propertyDetails.rent),
                rentType: propertyDetails.rentType,
                ownerEmail: propertyDetails.ownerEmail,
                tenantName: session.user.name,
                tenantEmail: session.user.email,
                tenantPhone: phone || session.user.phone || '',
                moveInDate: moveInDate
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingPayload)
            });
            const data = await res.json();
            
            if (data.insertedId) {
                toast.success("Booking request created! Redirecting to checkout...");
                setBookingModalOpen(false);
                router.push(`/payment/${data.insertedId}`);
            } else {
                toast.error("Failed to register booking.");
            }
        } catch (err) {
            console.error("Error creating booking:", err);
            toast.error("An error occurred.");
        } finally {
            setBookingSubmit(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-[#319795]"></span>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Loading property catalog details...</p>
            </div>
        );
    }

    if (!propertyDetails) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#F2F5FA]">
                <p className="text-slate-500 font-semibold text-lg">Property details not found.</p>
            </div>
        );
    }

    const monthlyRent = propertyDetails.rent || 0;
    const serviceFee = 150.00; 
    const securityDeposit = monthlyRent; 
    const totalDue = monthlyRent + serviceFee + securityDeposit;

    const galleryImages = propertyDetails.images || [];
    const mainImage = propertyDetails.imageURL || galleryImages[0];
    const sideImage1 = galleryImages[1] || galleryImages[0];
    const sideImage2 = galleryImages[2] || galleryImages[0];
    const hiddenPhotosCount = galleryImages.length > 3 ? galleryImages.length - 3 : 0;

    return (
        <main className="w-full bg-[#F7F9FC] text-[#2D3748] py-10 px-4 sm:px-6 lg:px-8 xl:px-12 select-none">
            <div className="max-w-7xl mx-auto">

                {/* 1. MEDIA GALLERY GRID SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    <div className="relative lg:col-span-2 aspect-16/10 sm:aspect-video lg:h-120 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                        {mainImage && (
                            <img 
                                src={mainImage} 
                                alt={propertyDetails.title}
                                className="object-cover w-full h-full"
                            />
                        )}
                        <span className="absolute top-4 left-4 bg-[#319795] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                            Premium
                        </span>
                    </div>

                    <div className="hidden sm:grid grid-cols-2 lg:grid-cols-1 gap-4 lg:h-120">
                        <div className="relative h-full min-h-35 lg:h-58 rounded-2xl overflow-hidden bg-slate-100">
                            {sideImage1 && (
                                <img src={sideImage1} alt="Interior view" className="object-cover w-full h-full" />
                            )}
                        </div>
                        <div className="relative h-full min-h-35 lg:h-58 rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer">
                            {sideImage2 && (
                                <img src={sideImage2} alt="Additional view" className="object-cover w-full h-full brightness-75 group-hover:brightness-50 transition-all" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                {hiddenPhotosCount > 0 ? `+${hiddenPhotosCount} Photos` : 'View Gallery'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DUAL COLUMN CORE DETAILS CONTAINER */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT ROW WRAPPER: CONTENT & SPECS */}
                    <div className="xl:col-span-2 space-y-8">
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 border-b border-slate-200">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                                    {propertyDetails.title}
                                </h1>
                                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1.5 font-medium">
                                    <PinTopIcon className="w-4 h-4 rotate-180 transform" />
                                    <span>{propertyDetails.location}</span>
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-2xl sm:text-3xl font-black text-[#319795]">
                                    ${monthlyRent.toLocaleString()}
                                    <span className="text-sm text-slate-400 font-medium font-sans">/{propertyDetails.rentType === 'monthly' ? 'mo' : 'day'}</span>
                                </p>
                                <span className="inline-block mt-1 bg-[#EBF8FF] text-[#2B6CB0] font-bold text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-md">
                                    {propertyDetails.rentType} Rent
                                </span>
                            </div>
                        </div>

                        {/* Metric Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Bedrooms", value: propertyDetails.bedrooms, icon: "🛏️" },
                                { label: "Bathrooms", value: propertyDetails.bathrooms, icon: "🛁" },
                                { label: "Size", value: propertyDetails.propertySize, icon: "📐" },
                                { label: "Type", value: propertyDetails.propertyType, icon: "🏢" }
                            ].map((spec, i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 text-center shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                                    <span className="text-xl block mb-1">{spec.icon}</span>
                                    <p className="text-lg font-extrabold text-[#0A192F] tracking-tight capitalize">{spec.value}</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{spec.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-extrabold text-[#0A192F] tracking-tight">About this Property</h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                                {propertyDetails.description}
                            </p>
                            {propertyDetails.extraFeatures && (
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal pt-2">
                                    <strong>Additional Features:</strong> {propertyDetails.extraFeatures}
                                </p>
                            )}
                        </div>

                        {/* Amenities */}
                        {propertyDetails.amenities && propertyDetails.amenities.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                                <h3 className="text-lg font-extrabold text-[#0A192F] tracking-tight">Included Amenities</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {propertyDetails.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-xs sm:text-sm font-semibold text-[#2D3748]">
                                            <div className="w-6 h-6 rounded-lg bg-[#A2EAE7]/40 flex items-center justify-center text-[#2c8886]">
                                                <MixIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: BOOKING STICKY SUMMARY PANEL */}
                    <div className="xl:col-span-1 xl:sticky xl:top-28">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/40 space-y-6">
                            <h3 className="text-lg font-black text-[#0A192F] tracking-tight">Booking Summary</h3>
                            
                            <div className="space-y-3.5 text-xs sm:text-sm font-medium text-slate-500 border-b border-slate-100 pb-5">
                                <div className="flex justify-between">
                                    <span className="capitalize">{propertyDetails.rentType} Rent</span>
                                    <span className="font-bold text-[#0A192F]">${monthlyRent.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fee</span>
                                    <span className="font-bold text-[#0A192F]">${serviceFee.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Security Deposit</span>
                                    <span className="font-bold text-[#0A192F]">${securityDeposit.toLocaleString()}.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-extrabold text-[#0A192F]">Total Due</span>
                                <span className="text-xl sm:text-2xl font-black text-[#319795]">${totalDue.toLocaleString()}.00</span>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                <button 
                                    onClick={handleOpenBooking}
                                    className="btn w-full bg-[#319795] hover:bg-[#277a78] text-white border-none rounded-xl normal-case font-bold h-12"
                                >
                                    📅 Book Property
                                </button>
                                <button 
                                    onClick={handleBookmarkToggle}
                                    className={`btn btn-outline w-full rounded-xl normal-case font-bold gap-2 h-12 ${
                                        isBookmarked 
                                            ? 'border-[#319795] bg-[#319795]/5 text-[#319795] hover:bg-[#319795]/10' 
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    {isBookmarked ? (
                                        <>
                                            <HeartFilledIcon className="w-4 h-4 text-[#319795]" />
                                            <span>Bookmarked</span>
                                        </>
                                    ) : (
                                        <>
                                            <HeartIcon className="w-4 h-4 text-slate-400" />
                                            <span>Add to Favorites</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-[11px] sm:text-xs text-slate-500 leading-normal">
                                <InfoCircledIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <p>By clicking &quot;Book Property&quot;, you agree to our terms of service and initiate verification processes associated with this property listing.</p>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* Modal dialog block: reservation form */}
            {bookingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-[#0A192F]">Reserve Property</h3>
                            <button onClick={() => setBookingModalOpen(false)} className="btn btn-ghost btn-circle btn-xs text-slate-400">
                                <Cross1Icon className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateBooking} className="space-y-4">
                            
                            {/* Move in Date selection */}
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="moveInDate">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                        <CalendarIcon className="w-3.5 h-3.5" /> Move-In / Start Date
                                    </span>
                                </label>
                                <input 
                                    type="date"
                                    id="moveInDate"
                                    required
                                    value={moveInDate}
                                    onChange={(e) => setMoveInDate(e.target.value)}
                                    className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl focus:border-[#319795]"
                                />
                            </div>

                            {/* Phone number */}
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="phone-input">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase">Tenant Contact Phone</span>
                                </label>
                                <input 
                                    type="tel"
                                    id="phone-input"
                                    placeholder="e.g. +880 1711-223344"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input input-bordered w-full h-11 text-sm bg-slate-50 focus:bg-white rounded-xl focus:border-[#319795]"
                                />
                            </div>

                            {/* Briefing summary invoice info */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5 text-xs text-slate-500 font-semibold">
                                <div className="flex justify-between">
                                    <span>Rent Deposit:</span>
                                    <span className="text-slate-800">${monthlyRent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#319795] font-extrabold border-t border-slate-200/80 pt-2 mt-2 text-sm">
                                    <span>Total Due Checkout:</span>
                                    <span>${totalDue.toLocaleString()}</span>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={bookingSubmit}
                                className="btn w-full h-12 bg-[#319795] border-none text-white font-bold rounded-xl normal-case flex items-center justify-center gap-2 mt-4 shadow-sm"
                            >
                                {bookingSubmit ? (
                                    <span className="loading loading-spinner loading-sm text-slate-400"></span>
                                ) : (
                                    <span>Confirm Booking & Pay</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}