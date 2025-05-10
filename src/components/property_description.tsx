import React, { useState, useEffect } from 'react';
import api from '@/app/api/hard_code_for build';
import { HailDamageClaim, Photo } from '@/types';


// Description Component
interface PropertyDescriptionProps {
    claim: HailDamageClaim;
  }
  
  const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ claim }) => {
    const formatCurrency = (amount: number | undefined) => {
      if (!amount) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-14 0H3m2 0h2M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 10h6m-6 4h6" />
              </svg>
              Property Details
            </h2>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-sm">
                  {claim.property.address.street}<br />
                  {claim.property.address.city}, {claim.property.address.state} {claim.property.address.zipCode}
                </p>
              </div>
              
              <div>
                <span className="font-medium">Property Type:</span>
                <span className="ml-2 text-sm">{claim.property.propertyType}</span>
              </div>
              
              <div>
                <span className="font-medium">Year Built:</span>
                <span className="ml-2 text-sm">{claim.property.yearBuilt}</span>
              </div>
              
              <div>
                <span className="font-medium">Roof Material:</span>
                <span className="ml-2 text-sm">{claim.property.roofingMaterial}</span>
              </div>
              
              <div>
                <span className="font-medium">Roof Age:</span>
                <span className="ml-2 text-sm">{claim.property.roofAge} years</span>
              </div>
              
              <div>
                <span className="font-medium">Roof Area:</span>
                <span className="ml-2 text-sm">{claim.property.roofArea} sq ft</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Claim Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Claim Information
            </h2>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium">Claim Number:</span>
                <span className="ml-2 text-sm">{claim.claimNumber}</span>
              </div>
              
              <div>
                <span className="font-medium">Date of Loss:</span>
                <span className="ml-2 text-sm">{formatDate(claim.dateOfLoss)}</span>
              </div>
              
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2">
                  <span className={`badge badge-sm ${
                    claim.status === 'PENDING' ? 'badge-warning' :
                    claim.status === 'APPROVED' ? 'badge-success' :
                    claim.status === 'DENIED' ? 'badge-error' :
                    'badge-info'
                  }`}>
                    {claim.status}
                  </span>
                </span>
              </div>
              
              <div>
                <span className="font-medium">Priority:</span>
                <span className="ml-2">
                  <span className={`badge badge-sm ${
                    claim.priority === 'LOW' ? 'badge-ghost' :
                    claim.priority === 'MEDIUM' ? 'badge-warning' :
                    claim.priority === 'HIGH' ? 'badge-error' :
                    'badge-error'
                  }`}>
                    {claim.priority}
                  </span>
                </span>
              </div>
              
              <div>
                <span className="font-medium">Estimated Cost:</span>
                <span className="ml-2 text-sm">{formatCurrency(claim.estimatedCost)}</span>
              </div>
              
              {claim.approvedAmount && (
                <div>
                  <span className="font-medium">Approved Amount:</span>
                  <span className="ml-2 text-sm">{formatCurrency(claim.approvedAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Damage Description */}
        <div className="card bg-base-100 shadow-md lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Damage Description
            </h2>
            
            <p className="text-sm leading-relaxed">{claim.description}</p>
            
            {claim.adjuster && (
              <div className="mt-4 pt-4 border-t border-base-300">
                <h3 className="font-medium text-sm mb-2">Assigned Adjuster:</h3>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span className="text-sm">{claim.adjuster.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{claim.adjuster.name}</p>
                    <p className="text-xs opacity-70">{claim.adjuster.company}</p>
                    <p className="text-xs opacity-70">{claim.adjuster.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default PropertyDescription;