"use client"

import React, { useState } from 'react';
import { Camera, Upload, Trash2, Plus, FileText, Image, Video } from 'lucide-react';
import { 
  ClaimPriority,
  PropertyType,
  RoofingMaterial,
  DocumentType,
  CreateClaimInput,
  CreateCustomerInput,
  Property,
  Customer,
  Address
} from '@/types';

// Type for file uploads with UI-specific properties
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'photos' | 'videos' | 'documents';
  documentType?: DocumentType;
  preview: string;
}

// Type for form state
interface ClaimFormState {
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

interface CustomerFormState {
  name: string;
  email: string;
  phone: string;
  address: Address;
  policyNumber: string;
  insuranceCompany: string;
}

export default function CustomerClaimForm() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'customer' | 'claim' | 'uploads'>('customer');
  
  // Customer form state
  const [customer, setCustomer] = useState<CustomerFormState>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    policyNumber: '',
    insuranceCompany: ''
  });

  // Claim form state
  const [claim, setClaim] = useState<ClaimFormState>({
    claimNumber: '',
    dateOfLoss: '',
    dateReported: new Date().toISOString().split('T')[0],
    description: '',
    priority: ClaimPriority.MEDIUM,
    property: {
      propertyType: PropertyType.SINGLE_FAMILY,
      yearBuilt: '',
      roofingMaterial: RoofingMaterial.ASPHALT_SHINGLE,
      roofAge: '',
      roofArea: '',
      stories: '1',
      lastInspectionDate: ''
    }
  });

  // File upload states
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [videos, setVideos] = useState<UploadedFile[]>([]);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);

  // Handlers
  const handleCustomerChange = (field: string, value: string): void => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomer(prev => ({
        ...prev,
        [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleClaimChange = (field: string, value: string): void => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setClaim(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ClaimFormState] as any),
          [child]: value
        }
      }));
    } else {
      setClaim(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'videos' | 'documents'): void => {
    const files = Array.from(event.target.files || []);
    const processedFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: type,
      documentType: type === 'documents' ? DocumentType.OTHER : undefined,
      preview: URL.createObjectURL(file)
    }));

    switch (type) {
      case 'photos':
        setPhotos(prev => [...prev, ...processedFiles]);
        break;
      case 'videos':
        setVideos(prev => [...prev, ...processedFiles]);
        break;
      case 'documents':
        setDocuments(prev => [...prev, ...processedFiles]);
        break;
    }
  };

  const removeFile = (id: string, type: 'photos' | 'videos' | 'documents'): void => {
    switch (type) {
      case 'photos':
        setPhotos(prev => prev.filter(file => file.id !== id));
        break;
      case 'videos':
        setVideos(prev => prev.filter(file => file.id !== id));
        break;
      case 'documents':
        setDocuments(prev => prev.filter(file => file.id !== id));
        break;
    }
  };

  const handleSubmit = (): void => {
    // Transform form data to match API types
    const customerData: CreateCustomerInput = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      policyNumber: customer.policyNumber,
      insuranceCompany: customer.insuranceCompany
    };

    // Transform property data to match Property type
    const propertyData: Partial<Property> = {
      propertyType: claim.property.propertyType,
      yearBuilt: parseInt(claim.property.yearBuilt),
      roofingMaterial: claim.property.roofingMaterial,
      roofAge: parseInt(claim.property.roofAge),
      roofArea: parseFloat(claim.property.roofArea),
      stories: parseInt(claim.property.stories),
      lastInspectionDate: claim.property.lastInspectionDate || undefined
    };

    // Transform claim data
    const claimData: Partial<CreateClaimInput> = {
      claimNumber: claim.claimNumber,
      dateOfLoss: claim.dateOfLoss,
      dateReported: claim.dateReported,
      description: claim.description,
      priority: claim.priority,
      property: propertyData as Property, // You'll need to add address and id for full Property
      photos: photos.map(photo => ({
        id: photo.id,
        claimId: '', // This will be set by the server
        url: '', // This will be set after upload
        storageKey: '', // This will be set after upload
        caption: photo.name,
        takenAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        uploadedBy: customer.email, // Assuming current user
        metadata: {
          fileName: photo.file.name,
          fileSize: photo.file.size,
          width: 0, // These would come from actual image metadata
          height: 0,
          format: photo.file.type.split('/')[1] || 'jpeg'
        }
      })),
      videos: videos.map(video => ({
        id: video.id,
        claimId: '', // This will be set by the server
        url: '', // This will be set after upload
        storageKey: '', // This will be set after upload
        duration: 0, // This would come from actual video metadata
        uploadedAt: new Date().toISOString(),
        uploadedBy: customer.email,
        metadata: {
          fileName: video.file.name,
          fileSize: video.file.size,
          width: 0,
          height: 0,
          format: video.file.type.split('/')[1] || 'mp4',
          bitrate: 0
        }
      })),
      documents: documents.map(doc => ({
        id: doc.id,
        claimId: '', // This will be set by the server
        url: '', // This will be set after upload
        storageKey: '', // This will be set after upload
        documentType: doc.documentType || DocumentType.OTHER,
        fileName: doc.file.name,
        fileSize: doc.file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: customer.email
      }))
    };

    const formData = {
      customer: customerData,
      claim: claimData,
      files: {
        photos,
        videos,
        documents
      }
    };
    
    console.log('Form submission:', formData);
    // Add your submission logic here
    alert('Form submitted successfully! Check console for data.');
  };

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

          {/* Customer Information Tab */}
          {activeTab === 'customer' && (
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
          )}

          {/* Claim Details Tab */}
          {activeTab === 'claim' && (
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
          )}

          {/* File Uploads Tab */}
          {activeTab === 'uploads' && (
            <div className="space-y-8">
              {/* Photos Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos
                  </h3>
                  <label className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Photos
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'photos')}
                    />
                  </label>
                </div>
                
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={photo.preview} 
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button 
                          onClick={() => removeFile(photo.id, 'photos')}
                          className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-xs mt-1 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No photos uploaded</p>
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Videos
                  </h3>
                  <label className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Videos
                    <input 
                      type="file" 
                      accept="video/*" 
                      multiple 
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'videos')}
                    />
                  </label>
                </div>
                
                {videos.length > 0 ? (
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{video.name}</p>
                            <p className="text-sm text-gray-500">
                              {(video.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(video.id, 'videos')}
                          className="btn btn-sm btn-circle btn-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No videos uploaded</p>
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </h3>
                  <label className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Documents
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                      multiple 
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'documents')}
                    />
                  </label>
                </div>
                
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <div className="flex items-center gap-4">
                              <p className="text-sm text-gray-500">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <select 
                                className="select select-xs select-bordered"
                                value={doc.documentType}
                                onChange={(e) => {
                                  const updatedDocs = documents.map(d => 
                                    d.id === doc.id ? { ...d, documentType: e.target.value as DocumentType } : d
                                  );
                                  setDocuments(updatedDocs);
                                }}
                              >
                                {Object.values(DocumentType).map(type => (
                                  <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(doc.id, 'documents')}
                          className="btn btn-sm btn-circle btn-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
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