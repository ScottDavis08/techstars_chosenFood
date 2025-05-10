"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Calendar, MapPin, AlertCircle, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import api  from '@/api/hard_code_for build';
import { HailDamageClaim, Customer, ClaimStatus, ClaimPriority } from '@/types';

// Card stack data type
interface ClaimCardData {
  claim: HailDamageClaim;
  customer: Customer;
}

// Claim status styling
const getStatusConfig = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.PENDING:
      return { class: 'badge-warning', icon: AlertCircle };
    case ClaimStatus.UNDER_REVIEW:
      return { class: 'badge-info', icon: MoreHorizontal };
    case ClaimStatus.APPROVED:
      return { class: 'badge-success', icon: CheckCircle };
    case ClaimStatus.DENIED:
      return { class: 'badge-error', icon: XCircle };
    case ClaimStatus.PAID:
      return { class: 'badge-success', icon: CheckCircle };
    case ClaimStatus.CLOSED:
      return { class: 'badge-neutral', icon: CheckCircle };
    default:
      return { class: 'badge-neutral', icon: AlertCircle };
  }
};

// Priority styling
const getPriorityConfig = (priority: ClaimPriority) => {
  switch (priority) {
    case ClaimPriority.URGENT:
      return { class: 'badge-error badge-outline', label: 'URGENT' };
    case ClaimPriority.HIGH:
      return { class: 'badge-warning badge-outline', label: 'HIGH' };
    case ClaimPriority.MEDIUM:
      return { class: 'badge-info badge-outline', label: 'MEDIUM' };
    case ClaimPriority.LOW:
      return { class: 'badge-neutral badge-outline', label: 'LOW' };
    default:
      return { class: 'badge-neutral badge-outline', label: priority };
  }
};

// Image Carousel Component
const ImageCarousel: React.FC<{ photos: any[] }> = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos.length) return null;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-96 bg-base-300 rounded-t-lg overflow-hidden">
      <figure className="h-full">
        <img
          src={photos[currentPhotoIndex].url}
          alt={photos[currentPhotoIndex].caption || 'Damage photo'}
          className="w-full h-full object-cover"
        />
      </figure>
      
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="btn btn-circle btn-sm absolute left-4 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-75 hover:bg-opacity-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="btn btn-circle btn-sm absolute right-4 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-75 hover:bg-opacity-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Photo indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Claim Card Component
const ClaimCard: React.FC<{
  claimData: ClaimCardData;
  onClick: () => void;
}> = ({ claimData, onClick }) => {
  const { claim, customer } = claimData;
  const statusConfig = getStatusConfig(claim.status);
  const priorityConfig = getPriorityConfig(claim.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
    >
      <ImageCarousel photos={claim.photos} />
      
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title">{claim.claimNumber}</h2>
            <p className="text-sm opacity-70">{customer.name}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`badge gap-2 ${statusConfig.class}`}>
              <StatusIcon className="h-3 w-3" />
              {claim.status.replace('_', ' ')}
            </div>
            <div className={`badge ${priorityConfig.class}`}>
              {priorityConfig.label}
            </div>
          </div>
        </div>

        <p className="text-sm opacity-70 line-clamp-2">
          {claim.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm opacity-70">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Loss: {new Date(claim.dateOfLoss).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{claim.property.address.city}, {claim.property.address.state}</span>
          </div>
        </div>

        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <span className="text-sm opacity-70">
            {claim.property.roofingMaterial.replace('_', ' ')}
          </span>
          <span className="font-bold">
            ${claim.estimatedCost?.toLocaleString() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Claims Page Component
const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<ClaimCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const claimsResponse = await api.getClaims();
        
        if (!claimsResponse.success) {
          throw new Error(claimsResponse.error?.message || 'Failed to fetch claims');
        }

        // Fetch customer data for each claim
        const claimDataPromises = claimsResponse.data?.map(async (claim) => {
          const customerResponse = await api.getCustomer(claim.customerId);
          if (!customerResponse.success) {
            throw new Error(`Failed to fetch customer data for claim ${claim.id}`);
          }
          return {
            claim,
            customer: customerResponse.data!
          };
        }) || [];

        const claimData = await Promise.all(claimDataPromises);
        setClaims(claimData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleClaimClick = (claimId: string) => {
    // Simulate navigation to claim detail page
    console.log(`Navigate to /claims/${claimId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!claims.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-base-content/50 mb-4">
            <Eye className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold">No Claims Available</h2>
          <p className="text-sm opacity-70 mt-2">Check back later for new claims.</p>
        </div>
      </div>
    );
  }

  // Display the top claim in Tinder-style format
  const topClaim = claims[0];

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Claims Review</h1>
          <p className="text-sm opacity-70 mt-1">
            {claims.length} claim{claims.length !== 1 ? 's' : ''} pending review
          </p>
        </div>

        <ClaimCard
          claimData={topClaim}
          onClick={() => handleClaimClick(topClaim.claim.id)}
        />

        {/* Show stack of remaining cards behind */}
        {claims.slice(1, 3).map((claimData, index) => (
          <div
            key={claimData.claim.id}
            className="relative -mt-4 transition-transform"
            style={{
              transform: `translateY(${(index + 1) * -8}px) scale(${1 - (index + 1) * 0.02})`,
              zIndex: -index - 1,
            }}
          >
            <div className="opacity-40 pointer-events-none">
              <ClaimCard
                claimData={claimData}
                onClick={() => {}}
              />
            </div>
          </div>
        ))}

        {/* Action buttons - for future implementation */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="btn btn-circle btn-error">
            <XCircle className="h-6 w-6" />
          </button>
          <button className="btn btn-circle btn-success">
            <CheckCircle className="h-6 w-6" />
          </button>
          <button className="btn btn-circle btn-primary">
            <Eye className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsPage;