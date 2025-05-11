"use client"
import React, { useState, useEffect } from 'react';
import api from '@/app/api/hard_code_for build';
import { HailDamageClaim } from '@/types';
import PropertyDescription from '@/components/property_description';
import ImageCarousel from '@/components/image_carousel';
import Link from 'next/link';
import { use } from 'react';

// Page Component for Next.js App Router
interface PageProps {
  params: Promise<{ claimId: string }>;
}

const Page: React.FC<PageProps> = ({ params }) => {
  // Use React's use() hook to unwrap the Promise in client components
  const { claimId } = use(params);
  
  const [claim, setClaim] = useState<HailDamageClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClaim = async () => {
      try {
        const response = await api.getClaim(claimId);
        if (response.success && response.data) {
          setClaim(response.data);
        } else {
          setError(response.error?.message || 'Failed to load claim');
        }
      } catch {
        setError('Error loading claim data');
      } finally {
        setLoading(false);
      }
    };

    loadClaim();
  }, [claimId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><Link href="/application/">Dashboard</Link></li>
            <li><Link href="/application/claims">Claims</Link></li>
            <li>Claim {claim.claimNumber}</li>
          </ul>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Property Photos & Details</h1>
      </div>

      {/* Image Carousel */}
      <div className="mb-8">
        <ImageCarousel photos={claim.photos} />
      </div>

      {/* Property Description */}
      <PropertyDescription claim={claim} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2z" />
          </svg>
          Add Photos
        </button>
        
        <button className="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Update Claim
        </button>
        
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Page;