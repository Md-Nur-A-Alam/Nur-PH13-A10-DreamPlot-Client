'use client';

import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SignUpPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Social SignUp Handler (Google OAuth integration pipeline placeholder)
    const handleGoogleSignUp = async () => {
        try {
            // Modify target callbacks or setup parameters based on your better-auth configurations
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/'
            });
        } catch (err) {
            console.error("Google OAuth Initialization failed:", err);
            alert("Could not initialize registration via Google.");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries());

        // 1. Name validation
        if (!user.name || user.name.trim().length < 2) {
            alert('Name must be at least 2 characters.');
            return;
        }

        // 2. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email || !emailRegex.test(user.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // 3. Date of Birth validation
        if (!user.dob) {
            alert('Date of Birth is required.');
            return;
        }
        const dobDate = new Date(user.dob);
        const today = new Date();
        if (dobDate >= today) {
            alert('Date of Birth must be in the past.');
            return;
        }

        // Calculate age
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        if (age < 13) {
            alert('You must be at least 13 years old to register.');
            return;
        }

        // 4. Phone validation
        const phoneRegex = /^[0-9\-\+\s\(\)]{7,20}$/;
        if (!user.phone || !phoneRegex.test(user.phone)) {
            alert('Please enter a valid phone number.');
            return;
        }

        // 5. Image URL validation
        if (user.image && user.image.trim() !== '') {
            try {
                new URL(user.image);
            } catch (_) {
                alert('Profile Image must be a valid URL.');
                return;
            }
        }

        // 6. Address validation
        if (!user.address || user.address.trim().length < 5) {
            alert('Address must be at least 5 characters long.');
            return;
        }

        // 7. Password validation
        if (!user.password || user.password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(user.password)) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }

        // 8. Confirm Password validation
        if (user.password !== user.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const { data, error } = await authClient.signUp.email({
            email: user.email,
            password: user.password,
            name: user.name,
            image: user.image || undefined,
            dob: user.dob,
            role: user.role, // "Tenant" or "Owner"
            isActive: true,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
            profession: user.profession,
            callbackURL: "/"
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                setLoading(false);
                alert("Account created successfully!");
                router.push('/signIn');
            },
            onError: (ctx) => {
                setLoading(false);
                alert(ctx.error.message || "An error occurred during sign up.");
            },
        });

        console.log('data', data);
        console.log('error', error);
    };

    return (
        <main className="min-h-screen w-full bg-[#F7F9FC] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none text-[#2D3748]">
            <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 min-h-[700px] border border-slate-100">
                
                {/* LEFT SIDE: HERO BRAND BLOCK (4-Columns) */}
                <div className="relative hidden lg:flex lg:col-span-4 flex-col justify-between p-10 overflow-hidden bg-[#0A192F]">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <Image 
                            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                            alt="Luxury asset architecture"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/90 via-[#0A192F]/60 to-[#0A192F]/95 z-10" />

                    <div className="relative z-20 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#319795] flex items-center justify-center text-white font-black text-lg shadow-sm">
                            D
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">DreamPlot</span>
                    </div>

                    <div className="relative z-20 space-y-3 mt-auto">
                        <h2 className="text-2xl font-black text-white tracking-tight leading-tight antialiased">
                            Join the Elite Ecosystem.
                        </h2>
                        <p className="text-slate-300 text-xs leading-relaxed font-normal">
                            Create your optimized account configuration parameters to effortlessly scale your real estate operations.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: COMPLEX MULTI-INPUT FORM PANEL (8-Columns) */}
                <div className="p-6 sm:p-10 md:p-12 lg:col-span-8 flex flex-col justify-between bg-white z-20 overflow-y-auto">
                    <div className="w-full space-y-6 my-auto">
                        
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-[#0A192F] tracking-tight antialiased">
                                Create Your Account
                            </h1>
                            <p className="text-slate-400 text-xs font-medium">
                                Provide accurate parameter entries to initiate authentication credentials.
                            </p>
                        </div>

                        {/* Registration Input Form */}
                        <form onSubmit={onSubmit} className="space-y-4">
                            
                            {/* Row 1: Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="name"><span className="label-text text-xs font-bold text-slate-500 uppercase">Full Name</span></label>
                                    <input type="text" id="name" name="name" required placeholder="John Doe" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="email"><span className="label-text text-xs font-bold text-slate-500 uppercase">Email Address</span></label>
                                    <input type="email" id="email" name="email" required placeholder="name@company.com" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                            </div>

                            {/* Row 2: Phone & DOB */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="phone"><span className="label-text text-xs font-bold text-slate-500 uppercase">Phone Number</span></label>
                                    <input type="tel" id="phone" name="phone" required placeholder="+880 17XX-XXXXXX" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="dob"><span className="label-text text-xs font-bold text-slate-500 uppercase">Date of Birth</span></label>
                                    <input type="date" id="dob" name="dob" required disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-600 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                            </div>

                            {/* Row 3: Gender & Role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="gender"><span className="label-text text-xs font-bold text-slate-500 uppercase">Gender</span></label>
                                    <select id="gender" name="gender" required defaultValue="" disabled={loading} className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#319795] rounded-xl">
                                        <option value="" disabled>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="role"><span className="label-text text-xs font-bold text-slate-500 uppercase">Account Role</span></label>
                                    <select id="role" name="role" required defaultValue="Tenant" disabled={loading} className="select select-bordered w-full h-11 min-h-0 bg-slate-50 border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#319795] rounded-xl">
                                        <option value="Tenant">Tenant</option>
                                        <option value="Owner">Owner</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Image & Profession */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="image"><span className="label-text text-xs font-bold text-slate-500 uppercase">Profile Image URL</span></label>
                                    <input type="url" id="image" name="image" placeholder="https://example.com/avatar.jpg" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="profession"><span className="label-text text-xs font-bold text-slate-500 uppercase">Profession</span></label>
                                    <input type="text" id="profession" name="profession" required placeholder="Software Engineer" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                            </div>

                            {/* Row 5: Full Address */}
                            <div className="form-control w-full space-y-1">
                                <label className="label py-0" htmlFor="address"><span className="label-text text-xs font-bold text-slate-500 uppercase">Full Address</span></label>
                                <input type="text" id="address" name="address" required placeholder="123 Luxury Avenue, Financial District" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                            </div>

                            {/* Row 6: Password Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="password"><span className="label-text text-xs font-bold text-slate-500 uppercase">Password</span></label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} id="password" name="password" required placeholder="••••••••" disabled={loading} className="input input-bordered w-full pl-4 pr-10 h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs font-bold focus:outline-none">{showPassword ? "Hide" : "Show"}</button>
                                    </div>
                                </div>
                                <div className="form-control w-full space-y-1">
                                    <label className="label py-0" htmlFor="confirmPassword"><span className="label-text text-xs font-bold text-slate-500 uppercase">Confirm Password</span></label>
                                    <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" required placeholder="••••••••" disabled={loading} className="input input-bordered w-full h-11 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all" />
                                </div>
                            </div>

                            {/* Traditional Sign Up Submission Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn w-full h-11 min-h-[44px] mt-4 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm text-slate-500"></span>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </button>

                        </form>

                        {/* ==================== SOCIAL CONTINUATION LAYER ==================== */}
                        <div className="space-y-4 pt-2">
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Or Continue With</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            {/* Full width Google Sign Up button option */}
                            <button 
                                type="button" 
                                onClick={handleGoogleSignUp}
                                disabled={loading}
                                className="btn btn-outline border-slate-200 bg-white hover:bg-slate-50 text-slate-700 w-full h-11 min-h-[44px] rounded-xl font-bold text-xs normal-case shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="text-base">🌐</span> Sign Up with Google
                            </button>

                            <div className="text-center text-xs text-slate-500 pt-2">
                                Already have an operating account?{' '}
                                <Link href="/signIn" className="font-bold text-[#319795] hover:underline">
                                    Sign In here
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default SignUpPage;