"use client"
import React, { useState, useEffect } from 'react';
import { Eye, Calendar, MapPin, AlertCircle, CheckCircle, XCircle, MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';
import api from '@/app/api/hard_code_for build';
import { HailDamageClaim, Customer, ClaimStatus, ClaimPriority } from '@/types';
import ImageCarousel from '@/components/image_carousel';


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

const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<ClaimCardData[]>([]);
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardTransform, setCardTransform] = useState({ x: 0, y: 0, rotate: 0, opacity: 1 });
  const [isDragging, setIsDragging] = useState(false);

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

  const goToNextClaim = () => {
    if (currentClaimIndex < claims.length - 1) {
      setCurrentClaimIndex(currentClaimIndex + 1);
    }
    setCardTransform({ x: 0, y: 0, rotate: 0, opacity: 1 });
  };

  const goToPreviousClaim = () => {
    if (currentClaimIndex > 0) {
      setCurrentClaimIndex(currentClaimIndex - 1);
    }
    setCardTransform({ x: 0, y: 0, rotate: 0, opacity: 1 });
  };

  const handleViewClaim = () => {
    const claimId = claims[currentClaimIndex]?.claim.id;
    if (claimId) {
      window.location.href = `/application/claims/${claimId}`;
    }
  };
  const handleApprove = () => {
    setCardTransform({ x: window.innerWidth, y: 0, rotate: 30, opacity: 0 });
    setTimeout(() => {
      goToNextClaim();
    }, 300);
  };

  const handleDeny = () => {
    setCardTransform({ x: -window.innerWidth, y: 0, rotate: -30, opacity: 0 });
    setTimeout(() => {
      goToNextClaim();
    }, 300);
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

  const currentClaim = claims[currentClaimIndex];
  const { claim, customer } = currentClaim;
  const statusConfig = getStatusConfig(claim.status);
  const priorityConfig = getPriorityConfig(claim.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Claims Review</h1>
          <p className="text-sm opacity-70 mt-1">
            {currentClaimIndex + 1} of {claims.length} claims
          </p>
        </div>

        {/* Single Card */}
        <div 
          className="relative"
          style={{
            transform: `translateX(${cardTransform.x}px) translateY(${cardTransform.y}px) rotate(${cardTransform.rotate}deg)`,
            opacity: cardTransform.opacity,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        >
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            {/* Image Carousel */}
            <ImageCarousel photos={claim.photos} />
            
            {/* Card Content */}
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

              <p className="text-sm opacity-70">
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
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-6">
          <button 
            onClick={handleDeny}
            className="btn btn-circle btn-lg btn-error"
          >
            <ThumbsDown className="h-7 w-7" />
          </button>
          
          <button 
            onClick={handleViewClaim}
            className="btn btn-circle btn-lg btn-primary">
            <Eye className="h-7 w-7" />
          </button>
          
          <button 
            onClick={handleApprove}
            className="btn btn-circle btn-lg btn-success"
          >
            <ThumbsUp className="h-7 w-7" />
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={goToPreviousClaim}
            disabled={currentClaimIndex === 0}
            className="btn btn-ghost btn-sm"
          >
            ← Previous
          </button>
          
          <div className="text-center text-sm opacity-70">
            Claim {currentClaimIndex + 1} of {claims.length}
          </div>
          
          <button 
            onClick={goToNextClaim}
            disabled={currentClaimIndex === claims.length - 1}
            className="btn btn-ghost btn-sm"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsPage;