import React from 'react';
import Link from 'next/link';
import { TwitterLogoIcon, LinkedInLogoIcon, InstagramLogoIcon } from '@radix-ui/react-icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#F7F9FC] text-[#2D3748] border-t border-slate-200/80 tracking-wide font-normal antialiased">
            
            {/* Main Content Links Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    
                    {/* Left Column: Brand Description & Social Links */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="text-2xl font-bold text-[#0A192F] tracking-tight block">
                            DreamPlot
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            &copy; 2024 DreamPlot. Architectural precision in every search. 
                            Delivering institutional trust and premium real estate experiences worldwide.
                        </p>
                        {/* Interactive Social Media Icons Block */}
                        <div className="flex items-center space-x-4 pt-2 text-slate-500">
                            <a href="#" className="hover:text-[#319795] p-2 hover:bg-slate-200/50 rounded-lg transition-colors duration-200" aria-label="Twitter Profile">
                                <TwitterLogoIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-[#319795] p-2 hover:bg-slate-200/50 rounded-lg transition-colors duration-200" aria-label="LinkedIn Profile">
                                <LinkedInLogoIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-[#319795] p-2 hover:bg-slate-200/50 rounded-lg transition-colors duration-200" aria-label="Instagram Profile">
                                <InstagramLogoIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">Navigation</h4>
                        <ul className="space-y-2.5 text-sm font-medium text-slate-600">
                            <li><Link href="/properties" className="hover:text-[#319795] transition-colors duration-200">Properties</Link></li>
                            <li><Link href="/rent" className="hover:text-[#319795] transition-colors duration-200">Rent</Link></li>
                            <li><Link href="/buy" className="hover:text-[#319795] transition-colors duration-200">Buy</Link></li>
                            <li><Link href="/about" className="hover:text-[#319795] transition-colors duration-200">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company Policies */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">Company</h4>
                        <ul className="space-y-2.5 text-sm font-medium text-slate-600">
                            <li><Link href="/terms" className="hover:text-[#319795] transition-colors duration-200">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#319795] transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link href="/cookie-settings" className="hover:text-[#319795] transition-colors duration-200">Cookie Settings</Link></li>
                            <li><Link href="/careers" className="hover:text-[#319795] transition-colors duration-200">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Engagement */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">Contact</h4>
                        <ul className="space-y-2.5 text-sm font-medium text-slate-600">
                            <li><Link href="/contact" className="hover:text-[#319795] transition-colors duration-200">Contact Us</Link></li>
                            <li><Link href="/support" className="hover:text-[#319795] transition-colors duration-200">Support Center</Link></li>
                            <li><Link href="/partner" className="hover:text-[#319795] transition-colors duration-200">Partner With Us</Link></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Credit & Fine Print Bar */}
            <div className="w-full border-t border-slate-200/60 bg-slate-50 py-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p>Designed for modern high-intent real estate professionals and residents.</p>
                    <p className="font-medium text-slate-600">
                        Developed by <span className="text-[#319795] font-semibold">Md. Nur A Alam</span> &copy; {currentYear}
                    </p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;