import React, { Suspense } from 'react';
import { getAllProperties } from '../lib/data';
import AdvanceSearch from '@/component/AdvanceSearch/AdvanceSearch';

export const metadata = {
    title: 'Explore Available Properties | DreamPlot',
    description: 'Discover curated listings that match your lifestyle and architectural taste.',
};

const propertiesPage = async (props) => {
    const searchParams = await props.searchParams;
    
    // Fetch initial data object containing properties and pages
    const initialData = await getAllProperties() || { properties: [], totalPages: 1 };

    // Generate a unique key based on search values so the client component completely remounts on route change
    const searchKey = `${searchParams.search || ''}-${searchParams.type || ''}-${searchParams.minPrice || ''}-${searchParams.maxPrice || ''}`;

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
                <Suspense fallback={
                    <div className="w-full flex justify-center py-20 bg-white border border-slate-200 rounded-2xl">
                        <span className="loading loading-spinner loading-md text-[#319795]"></span>
                    </div>
                }>
                    <AdvanceSearch 
                        key={searchKey} 
                        initialData={initialData} 
                        urlParams={{
                            search: searchParams.search || '',
                            type: searchParams.type || 'All Types',
                            minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : 0,
                            maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : 15000,
                        }}
                    />
                </Suspense>

            </div>
        </main>
    );
};

export default propertiesPage;