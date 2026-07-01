'use client';

import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SignInPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/dashboard'
            });
        } catch (err) {
            console.error("Google OAuth Initialization failed:", err);
            alert("Could not initialize authentication via Google.");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries());

        const { data, error } = await authClient.signIn.email({
            email: user.email,
            password: user.password,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                    });
                    const resData = await res.json();
                    if (resData.token) {
                        localStorage.setItem('jwt-token', resData.token);
                    }
                } catch (jwtErr) {
                    console.error("JWT fetch failed:", jwtErr);
                }
                setLoading(false);
                router.push('/dashboard');
                router.refresh();
            },
            onError: (ctx) => {
                setLoading(false);
                alert(ctx.error.message || "Failed to authenticate.");
            }
        });

        console.log('data', data);
        console.log('error', error);
    };

    return (
        <main className="min-h-screen w-full bg-[#F7F9FC] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none text-[#2D3748]">
            {/* Split Screen Master Outer Container Card matching image_df625c.jpg layout */}
            <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border border-slate-100">
                
                {/* ==================== LEFT SIDE: ARTISTIC HERO IMAGE PANEL ==================== */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#0A192F]">
                    <div className="absolute inset-0 z-0 opacity-50">
                        <Image 
                             src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                             alt="Modern architecture visualization"
                             fill
                             priority
                             className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/80 via-[#0A192F]/50 to-[#0A192F]/90 z-10" />

                    {/* Branding Identity */}
                    <div className="relative z-20 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#319795] flex items-center justify-center text-white font-black text-lg shadow-sm">
                            D
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">DreamPlot</span>
                    </div>

                    {/* Text Assets Copy Block */}
                    <div className="relative z-20 space-y-4 max-w-sm mt-auto">
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight antialiased leading-tight">
                            Architectural Precision in Property Management.
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed font-normal">
                            Experience the worlds most sophisticated platform for high-intent property investors and managers.
                        </p>
                    </div>
                </div>

                {/* ==================== RIGHT SIDE: AUTH FORM LAYER ==================== */}
                <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white z-20">
                    <div className="w-full space-y-8 my-auto">
                        
                        {/* Header Context */}
                        <div className="space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight antialiased">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">
                                Enter your credentials to access your portfolio dashboard.
                            </p>
                        </div>

                        {/* Interactive Form Engine */}
                        <form onSubmit={onSubmit} className="space-y-4">
                            
                            {/* Input Field: Email Address using DaisyUI structures */}
                            <div className="form-control w-full space-y-1.5">
                                <label className="label py-0" htmlFor="email">
                                    <span className="label-text text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</span>
                                </label>
                                <input 
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="name@company.com"
                                    disabled={loading}
                                    className="input input-bordered w-full px-4 h-12 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all disabled:opacity-50"
                                />
                            </div>

                            {/* Input Field: Password Controls with recovery routing */}
                            <div className="form-control w-full space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="label py-0" htmlFor="password">
                                        <span className="label-text text-xs font-bold text-slate-500 uppercase tracking-wide">Password</span>
                                    </label>
                                    <Link href="/forgotPassword" className="text-xs font-bold text-[#319795] hover:text-[#277a78] hover:underline transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="input input-bordered w-full pl-4 pr-12 h-12 bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#319795] focus:bg-white rounded-xl transition-all disabled:opacity-50"
                                    />
                                    {/* Visibility Password reveal Toggle inside input */}
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Option Box: Remember Me Toggle using DaisyUI checkbox */}
                            <div className="form-control pt-1">
                                <label className="label cursor-pointer justify-start gap-2.5 py-1" htmlFor="rememberMe">
                                    <input 
                                        type="checkbox"
                                        id="rememberMe"
                                        className="checkbox checkbox-xs border-slate-300 rounded [--chkbg:#319795] [--chkfg:white] checked:border-[#319795]"
                                    />
                                    <span className="label-text text-xs font-semibold text-slate-500">Remember Me</span>
                                </label>
                            </div>

                            {/* Main Button Submission Trigger Component */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn w-full h-12 min-h-[48px] mt-4 border-none bg-black hover:bg-slate-900 text-white font-bold text-sm rounded-xl normal-case flex items-center justify-center gap-2 transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm text-slate-500"></span>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </button>

                        </form>

                        {/* ==================== SOCIAL PROVIDER DIVIDER CONTROLS ==================== */}
                        <div className="space-y-4">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Or Continue With</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    onClick={handleGoogleSignIn}
                                    className="btn btn-outline border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-11 min-h-[44px] rounded-xl font-bold text-xs normal-case shadow-sm"
                                >
                                    <span className="text-base mr-1">🌐</span> Google
                                </button>
                                <button type="button" className="btn btn-outline border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-11 min-h-[44px] rounded-xl font-bold text-xs normal-case shadow-sm">
                                    <span className="text-base mr-1">🐙</span> GitHub
                                </button>
                            </div>

                            <div className="text-center pt-4 text-sm text-slate-500">
                                Dont have an account?{' '}
                                <Link href="/signUp" className="font-bold text-black hover:underline">
                                    Create one
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Footer Branding Trademark Stamp */}
                    <div className="text-center text-[11px] text-slate-400 mt-8">
                        © 2026 DreamPlot. Trusted by 12,000+ Property Professionals.
                    </div>
                </div>

            </div>
        </main>
    );
};

export default SignInPage;