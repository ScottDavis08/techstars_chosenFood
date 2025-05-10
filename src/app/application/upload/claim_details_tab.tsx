// src/components/tabs/ClaimDetailsTab.tsx
import React from 'react';
import { ClaimPriority, PropertyType, RoofingMaterial } from '@/types';


export interface ClaimFormState {
    claimNumber: string;
    dateOfLoss: string;
    dateReported: string;
    description: string;
    priority: ClaimPriority;
    property: {
      propertyType: PropertyType;
      yearBuilt: string;
      roofingMaterial: RoofingMaterial;
      roofAge: string;
      roofArea: string;
      stories: string;
      lastInspectionDate: string;
    };
  }


interface ClaimDetailsTabProps {
  claim: ClaimFormState;
  handleClaimChange: (field: string, value: string) => void;
}

export default function ClaimDetailsTab({ claim, handleClaimChange }: ClaimDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Claim Number *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter claim number" 
            className="input input-bordered"
            value={claim.claimNumber}
            onChange={(e) => handleClaimChange('claimNumber', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <select 
            className="select select-bordered"
            value={claim.priority}
            onChange={(e) => handleClaimChange('priority', e.target.value as ClaimPriority)}
          >
            {Object.values(ClaimPriority).map(priority => (
              <option key={priority} value={priority}>
                {priority.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date of Loss *</span>
          </label>
          <input 
            type="date" 
            className="input input-bordered"
            value={claim.dateOfLoss}
            onChange={(e) => handleClaimChange('dateOfLoss', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date Reported *</span>
          </label>
          <input 
            type="date" 
            className="input input-bordered"
            value={claim.dateReported}
            onChange={(e) => handleClaimChange('dateReported', e.target.value)}
          />
        </div>
        
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24" 
            placeholder="Describe the hail damage"
            value={claim.description}
            onChange={(e) => handleClaimChange('description', e.target.value)}
          ></textarea>
        </div>
      </div>
      
      <div className="divider">Property Information</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Property Type *</span>
          </label>
          <select 
            className="select select-bordered"
            value={claim.property.propertyType}
            onChange={(e) => handleClaimChange('property.propertyType', e.target.value as PropertyType)}
          >
            {Object.values(PropertyType).map(type => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Year Built *</span>
          </label>
          <input 
            type="number" 
            placeholder="Enter year built" 
            className="input input-bordered"
            value={claim.property.yearBuilt}
            onChange={(e) => handleClaimChange('property.yearBuilt', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Roofing Material *</span>
          </label>
          <select 
            className="select select-bordered"
            value={claim.property.roofingMaterial}
            onChange={(e) => handleClaimChange('property.roofingMaterial', e.target.value as RoofingMaterial)}
          >
            {Object.values(RoofingMaterial).map(material => (
              <option key={material} value={material}>
                {material.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Roof Age (years) *</span>
          </label>
          <input 
            type="number" 
            placeholder="Enter roof age" 
            className="input input-bordered"
            value={claim.property.roofAge}
            onChange={(e) => handleClaimChange('property.roofAge', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Roof Area (sq ft) *</span>
          </label>
          <input 
            type="number" 
            placeholder="Enter roof area" 
            className="input input-bordered"
            value={claim.property.roofArea}
            onChange={(e) => handleClaimChange('property.roofArea', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Stories *</span>
          </label>
          <input 
            type="number" 
            placeholder="Number of stories" 
            className="input input-bordered"
            value={claim.property.stories}
            onChange={(e) => handleClaimChange('property.stories', e.target.value)}
          />
        </div>
        
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Last Inspection Date</span>
          </label>
          <input 
            type="date" 
            className="input input-bordered"
            value={claim.property.lastInspectionDate}
            onChange={(e) => handleClaimChange('property.lastInspectionDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}