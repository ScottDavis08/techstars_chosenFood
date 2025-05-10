// src/components/CustomerClaimForm.tsx
"use client"

import React, { useState } from 'react';
import CustomerInformationTab from './customer_information_tab';
import ClaimDetailsTab from './claim_details_tab';
import FileUploadsTab from './file_uploads_tab';
import { useFormData } from './useFormData';

export default function CustomerClaimForm() {
  const [activeTab, setActiveTab] = useState<'customer' | 'claim' | 'uploads'>('customer');
  const { customer, claim, files, handleCustomerChange, handleClaimChange, handleFileUpload, removeFile, handleSubmit } = useFormData();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Customer & Claim Setup</h2>
          
          {/* Tabs */}
          <div className="tabs tabs-boxed mb-6 w-full">
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'customer' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('customer')}
            >
              Customer Information
            </a>
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'claim' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('claim')}
            >
              Claim Details
            </a>
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'uploads' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('uploads')}
            >
              File Uploads
            </a>
          </div>

          {/* Tab Content */}
          {activeTab === 'customer' && (
            <CustomerInformationTab 
              customer={customer}
              handleCustomerChange={handleCustomerChange}
            />
          )}

          {activeTab === 'claim' && (
            <ClaimDetailsTab 
              claim={claim}
              handleClaimChange={handleClaimChange}
            />
          )}

          {activeTab === 'uploads' && (
            <FileUploadsTab 
              files={files}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
            />
          )}
          
          {/* Form Actions */}
          <div className="card-actions justify-end mt-8">
            <button className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Claim</button>
          </div>
        </div>
      </div>
    </div>
  );
}