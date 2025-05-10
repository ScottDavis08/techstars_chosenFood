"use client"
import React, { useState, useEffect } from 'react';
import api from '@/app/api/hard_code_for build';
import { HailDamageClaim, ClaimStatus, ClaimPriority } from '@/types';

const Dashboard: React.FC = () => {
  const [allClaims, setAllClaims] = useState<HailDamageClaim[]>([]);
  const [pendingClaims, setPendingClaims] = useState<HailDamageClaim[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<HailDamageClaim | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.getClaims();
        if (response.success && response.data) {
          setAllClaims(response.data);
          const pending = response.data.filter(claim => 
            claim.status === ClaimStatus.PENDING || 
            claim.status === ClaimStatus.UNDER_REVIEW
          );
          setPendingClaims(pending);
        }
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter claims based on search term
  const filteredClaims = pendingClaims.filter(claim =>
    claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.property.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusBadgeColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.PENDING: return 'badge-warning';
      case ClaimStatus.UNDER_REVIEW: return 'badge-info';
      case ClaimStatus.APPROVED: return 'badge-success';
      case ClaimStatus.DENIED: return 'badge-error';
      case ClaimStatus.PAID: return 'badge-primary';
      case ClaimStatus.CLOSED: return 'badge-neutral';
      default: return 'badge-ghost';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: ClaimPriority) => {
    switch (priority) {
      case ClaimPriority.LOW: return 'badge-ghost';
      case ClaimPriority.MEDIUM: return 'badge-warning';
      case ClaimPriority.HIGH: return 'badge-error';
      case ClaimPriority.URGENT: return 'badge-error badge-lg';
      default: return 'badge-ghost';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header with Action Buttons */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hail Damage Claims Dashboard</h1>
            <div className="text-sm breadcrumbs">
              <ul>
                <li><a href="/">Home</a></li>
                <li>Claims Dashboard</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons moved to top */}
          <div className="flex gap-4">
            <a href="/claims" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Pending
            </a>
            
            <a href="/upload" className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2z" />
              </svg>
              New Claim
            </a>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base">Total Claims</h2>
            <div className="stat-value text-3xl">{allClaims.length}</div>
            <div className="text-sm text-base-content opacity-70">All time</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base">Pending Review</h2>
            <div className="stat-value text-3xl text-warning">{pendingClaims.length}</div>
            <div className="text-sm text-base-content opacity-70">Needs attention</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base">Avg. Processing Time</h2>
            <div className="stat-value text-3xl">3.2</div>
            <div className="text-sm text-base-content opacity-70">Days</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base">Total Claim Value</h2>
            <div className="stat-value text-3xl">$127K</div>
            <div className="text-sm text-base-content opacity-70">This month</div>
          </div>
        </div>
      </div>


      {/* Pending Review Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Pending Reviews</h2>
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder="Search claims..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="text-center py-8 text-base-content opacity-70">
              No pending claims found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Claim #</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Est. Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map(claim => (
                    <tr key={claim.id} className="hover">
                      <td>
                        <div className="font-medium">{claim.claimNumber}</div>
                      </td>
                      <td>
                        <div className="font-medium">{claim.customerId}</div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {claim.property.address.street}<br />
                          {claim.property.address.city}, {claim.property.address.state}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{claim.dateOfLoss}</div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPriorityBadgeColor(claim.priority)}`}>
                          {claim.priority}
                        </span>
                      </td>
                      <td>
                        <div className="font-medium">
                          ${claim.estimatedCost?.toLocaleString() || '—'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            View
                          </button>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-sm btn-ghost">⋮</label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li><a>Assign Adjuster</a></li>
                              <li><a>Update Status</a></li>
                              <li><a>Add Photos</a></li>
                              <li><a>Generate Report</a></li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


      {/* Modal for Selected Claim */}
      {selectedClaim && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Claim Details - {selectedClaim.claimNumber}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Property Info</h4>
                <p className="text-sm">{selectedClaim.property.address.street}</p>
                <p className="text-sm">{selectedClaim.property.address.city}, {selectedClaim.property.address.state}</p>
                <p className="text-sm mt-2">{selectedClaim.property.propertyType} - {selectedClaim.property.roofingMaterial}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Claim Info</h4>
                <p className="text-sm">Status: <span className={`badge ${getStatusBadgeColor(selectedClaim.status)}`}>{selectedClaim.status}</span></p>
                <p className="text-sm">Priority: <span className={`badge ${getPriorityBadgeColor(selectedClaim.priority)}`}>{selectedClaim.priority}</span></p>
                <p className="text-sm">Date of Loss: {selectedClaim.dateOfLoss}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm">{selectedClaim.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Photos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedClaim.photos.map(photo => (
                  <div key={photo.id} className="relative">
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b">
                      {photo.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedClaim(null)}>Close</button>
              <button className="btn btn-primary">Update Status</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedClaim(null)}>close</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;