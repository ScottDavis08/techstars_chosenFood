// src/components/tabs/CustomerInformationTab.tsx
import React from 'react';
import { Address } from '@/types';


export interface CustomerFormState {
    name: string;
    email: string;
    phone: string;
    address: Address;
    policyNumber: string;
    insuranceCompany: string;
  }

interface CustomerInformationTabProps {
  customer: CustomerFormState;
  handleCustomerChange: (field: string, value: string) => void;
}

export default function CustomerInformationTab({ customer, handleCustomerChange }: CustomerInformationTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter full name" 
            className="input input-bordered"
            value={customer.name}
            onChange={(e) => handleCustomerChange('name', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email *</span>
          </label>
          <input 
            type="email" 
            placeholder="Enter email" 
            className="input input-bordered"
            value={customer.email}
            onChange={(e) => handleCustomerChange('email', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number *</span>
          </label>
          <input 
            type="tel" 
            placeholder="Enter phone number" 
            className="input input-bordered"
            value={customer.phone}
            onChange={(e) => handleCustomerChange('phone', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Policy Number *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter policy number" 
            className="input input-bordered"
            value={customer.policyNumber}
            onChange={(e) => handleCustomerChange('policyNumber', e.target.value)}
          />
        </div>
        
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Insurance Company *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter insurance company name" 
            className="input input-bordered"
            value={customer.insuranceCompany}
            onChange={(e) => handleCustomerChange('insuranceCompany', e.target.value)}
          />
        </div>
      </div>
      
      <div className="divider">Address Information</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Street Address *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter street address" 
            className="input input-bordered"
            value={customer.address.street}
            onChange={(e) => handleCustomerChange('address.street', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">City *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter city" 
            className="input input-bordered"
            value={customer.address.city}
            onChange={(e) => handleCustomerChange('address.city', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">State *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter state" 
            className="input input-bordered"
            value={customer.address.state}
            onChange={(e) => handleCustomerChange('address.state', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">ZIP Code *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter ZIP code" 
            className="input input-bordered"
            value={customer.address.zipCode}
            onChange={(e) => handleCustomerChange('address.zipCode', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Country *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter country" 
            className="input input-bordered"
            value={customer.address.country}
            onChange={(e) => handleCustomerChange('address.country', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}