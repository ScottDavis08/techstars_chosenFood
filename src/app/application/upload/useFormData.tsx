// src/components/hooks/useFormData.ts
import { useState } from 'react';
import {
  ClaimPriority,
  PropertyType,
  RoofingMaterial,
  DocumentType,
  CreateClaimInput,
  CreateCustomerInput,
  Property
} from '@/types';
import {  ClaimFormState} from './claim_details_tab';
import { UploadedFile } from './file_uploads_tab';
import {CustomerFormState} from './customer_information_tab';

export function useFormData() {
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
      if (parent === 'address') {
        setCustomer(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
      // Add other specific parent handlers here if needed
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
      if (parent === 'property') {
        setClaim(prev => ({
          ...prev,
          property: {
            ...prev.property,
            [child]: value
          }
        }));
      }
      // Add other specific parent handlers here if needed
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

  return {
    customer,
    claim,
    files: { photos, videos, documents },
    handleCustomerChange,
    handleClaimChange,
    handleFileUpload,
    removeFile,
    handleSubmit
  };
}