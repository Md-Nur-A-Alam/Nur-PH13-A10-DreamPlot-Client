import React from 'react';
import { getAllProperties } from '../lib/data';
import AdvanceSearch from '@/component/AdvanceSearch/AdvanceSearch';

export const metadata = {
    title: 'Explore Available Properties | DreamPlot',
    description: 'Discover curated listings that match your lifestyle and architectural taste.',
};

const propertiesPage = async () => {
    // Fetch initial data object containing properties and pages
    const initialData = await getAllProperties() || { properties: [], totalPages: 1 };

    return (
        <main className="w-full bg-[#F7F9FC] min-h-screen py-12 px-4 sm:px-6 lg:px-8 xl:px-12 select-none text-[#2D3748]">
            <div className="max-w-7xl mx-auto">
                
                {/* Dynamic Content Main Heading Block */}
                <div className="mb-10 space-y-1">
                    <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight antialiased">
                        Explore Available Properties
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Discover curated listings that match your lifestyle and architectural taste.
                    </p>
                </div>

                {/* Hand off data array to the Client component for backend searching & paging filtering */}
                <AdvanceSearch initialData={initialData} />

            </div>
        </main>
    );
};

export default propertiesPage;