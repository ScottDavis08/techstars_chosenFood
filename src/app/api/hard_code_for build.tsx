// api.tsx - Mock API with hardcoded data for testing UI

import {
    HailDamageClaim,
    ClaimStatus,
    ClaimPriority,
    PropertyType,
    RoofingMaterial,
    DamageSeverity,
    DamageType,
    RoofArea,
    Customer,
    ApiResponse
  } from '@/types/types';
  
  // Mock data for testing UI
  const mockClaims: HailDamageClaim[] = [
    {
      id: 'claim-001',
      claimNumber: 'HC-2024-1001',
      customerId: 'customer-001',
      dateOfLoss: '2024-03-15',
      dateReported: '2024-03-16',
      description: 'Severe hail damage to roof after March 15th storm',
      status: ClaimStatus.UNDER_REVIEW,
      priority: ClaimPriority.HIGH,
      property: {
        id: 'property-001',
        address: {
          street: '123 Oak Street',
          city: 'Denver',
          state: 'Colorado',
          zipCode: '80202',
          country: 'USA',
          latitude: 39.7392,
          longitude: -104.9903
        },
        propertyType: PropertyType.SINGLE_FAMILY,
        yearBuilt: 2015,
        roofingMaterial: RoofingMaterial.ASPHALT_SHINGLE,
        roofAge: 9,
        roofArea: 1800,
        stories: 2,
        lastInspectionDate: '2023-05-01'
      },
      photos: [
        {
          id: 'photo-001',
          claimId: 'claim-001',
          url: '/roofs_test/1.jpg',
          storageKey: '1.jpg',
          thumbnail: '/roofs_test/1.jpg',
          caption: 'North side roof damage',
          takenAt: '2024-03-16T10:30:00Z',
          uploadedAt: '2024-03-16T14:22:00Z',
          uploadedBy: 'customer-001',
          metadata: {
            fileName: '1.jpg',
            fileSize: 2048000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        },
        {
          id: 'photo-002',
          claimId: 'claim-001',
          url: '/roofs_test/2.jpg',
          storageKey: '2.jpg',
          thumbnail: '/roofs_test/2.jpg',
          caption: 'Gutter damage closeup',
          takenAt: '2024-03-16T10:45:00Z',
          uploadedAt: '2024-03-16T14:25:00Z',
          uploadedBy: 'customer-001',
          metadata: {
            fileName: '2.jpg',
            fileSize: 1892000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        }
      ],
      estimatedCost: 8500,
      adjuster: {
        id: 'adjuster-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@insurance.com',
        phone: '(555) 123-4567',
        licenseNumber: 'ADJ-12345',
        company: 'Denver Insurance Adjusters',
        specializations: ['Roofing', 'Hail Damage'],
        activeRegions: ['Colorado', 'Wyoming']
      },
      createdAt: '2024-03-16T09:00:00Z',
      updatedAt: '2024-03-16T15:30:00Z'
    },
    {
      id: 'claim-002',
      claimNumber: 'HC-2024-1002',
      customerId: 'customer-002',
      dateOfLoss: '2024-03-15',
      dateReported: '2024-03-17',
      description: 'Minor hail damage to shingles and gutters',
      status: ClaimStatus.PENDING,
      priority: ClaimPriority.MEDIUM,
      property: {
        id: 'property-002',
        address: {
          street: '456 Maple Avenue',
          city: 'Aurora',
          state: 'Colorado',
          zipCode: '80012',
          country: 'USA'
        },
        propertyType: PropertyType.SINGLE_FAMILY,
        yearBuilt: 2008,
        roofingMaterial: RoofingMaterial.ASPHALT_SHINGLE,
        roofAge: 16,
        roofArea: 2200,
        stories: 2
      },
      photos: [
        {
          id: 'photo-003',
          claimId: 'claim-002',
          url: '/roofs_test/3.jpg',
          storageKey: '3.jpg',
          thumbnail: '/roofs_test/3.jpg',
          caption: 'Shingle granule loss',
          takenAt: '2024-03-17T09:15:00Z',
          uploadedAt: '2024-03-17T11:00:00Z',
          uploadedBy: 'customer-002',
          metadata: {
            fileName: '3.jpg',
            fileSize: 1750000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        }
      ],
      estimatedCost: 3200,
      createdAt: '2024-03-17T08:30:00Z',
      updatedAt: '2024-03-17T12:00:00Z'
    },
    {
      id: 'claim-003',
      claimNumber: 'HC-2024-1003',
      customerId: 'customer-003',
      dateOfLoss: '2024-03-14',
      dateReported: '2024-03-15',
      description: 'Extensive hail damage requiring full roof replacement',
      status: ClaimStatus.APPROVED,
      priority: ClaimPriority.URGENT,
      property: {
        id: 'property-003',
        address: {
          street: '789 Pine Road',
          city: 'Lakewood',
          state: 'Colorado',
          zipCode: '80226',
          country: 'USA'
        },
        propertyType: PropertyType.SINGLE_FAMILY,
        yearBuilt: 1998,
        roofingMaterial: RoofingMaterial.ASPHALT_SHINGLE,
        roofAge: 26,
        roofArea: 2800,
        stories: 2
      },
      photos: [
        {
          id: 'photo-004',
          claimId: 'claim-003',
          url: '/roofs_test/4.jpg',
          storageKey: '4.jpg',
          thumbnail: '/roofs_test/4.jpg',
          caption: 'Severe shingle damage',
          takenAt: '2024-03-15T08:00:00Z',
          uploadedAt: '2024-03-15T10:30:00Z',
          uploadedBy: 'customer-003',
          metadata: {
            fileName: '4.jpg',
            fileSize: 2250000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        },
        {
          id: 'photo-005',
          claimId: 'claim-003',
          url: '/roofs_test/3.jpg',
          storageKey: '3.jpg',
          thumbnail: '/roofs_test/3.jpg',
          caption: 'Damaged flashing and vents',
          takenAt: '2024-03-15T08:15:00Z',
          uploadedAt: '2024-03-15T10:45:00Z',
          uploadedBy: 'customer-003',
          metadata: {
            fileName: '5.jpg',
            fileSize: 1980000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        }
      ],
      estimatedCost: 18500,
      approvedAmount: 17800,
      adjuster: {
        id: 'adjuster-002',
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@insurance.com',
        phone: '(555) 987-6543',
        licenseNumber: 'ADJ-67890',
        company: 'Colorado Claims Services',
        specializations: ['Roofing', 'Total Loss'],
        activeRegions: ['Colorado', 'New Mexico']
      },
      createdAt: '2024-03-15T07:45:00Z',
      updatedAt: '2024-03-18T16:00:00Z'
    },
    {
      id: 'claim-004',
      claimNumber: 'HC-2024-1004',
      customerId: 'customer-004',
      dateOfLoss: '2024-03-16',
      dateReported: '2024-03-17',
      description: 'Hail damage to metal roof and skylights',
      status: ClaimStatus.UNDER_REVIEW,
      priority: ClaimPriority.MEDIUM,
      property: {
        id: 'property-004',
        address: {
          street: '321 Elm Street',
          city: 'Thornton',
          state: 'Colorado',
          zipCode: '80241',
          country: 'USA'
        },
        propertyType: PropertyType.COMMERCIAL,
        yearBuilt: 2020,
        roofingMaterial: RoofingMaterial.METAL,
        roofAge: 4,
        roofArea: 5500,
        stories: 1
      },
      photos: [
        {
          id: 'photo-006',
          claimId: 'claim-004',
          url: '/roofs_test/2.jpg',
          storageKey: '2.jpg',
          thumbnail: '/roofs_test/6.jpg',
          caption: 'Metal roof denting',
          takenAt: '2024-03-17T14:30:00Z',
          uploadedAt: '2024-03-17T16:00:00Z',
          uploadedBy: 'customer-004',
          metadata: {
            fileName: '6.jpg',
            fileSize: 1850000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        },
        {
          id: 'photo-007',
          claimId: 'claim-004',
          url: '/roofs_test/2.jpg',
          storageKey: '2.jpg',
          thumbnail: '/roofs_test/7.jpg',
          caption: 'Skylight damage',
          takenAt: '2024-03-17T14:45:00Z',
          uploadedAt: '2024-03-17T16:15:00Z',
          uploadedBy: 'customer-004',
          metadata: {
            fileName: '7.jpg',
            fileSize: 2100000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        }
      ],
      estimatedCost: 12000,
      createdAt: '2024-03-17T15:00:00Z',
      updatedAt: '2024-03-17T17:30:00Z'
    },
    {
      id: 'claim-005',
      claimNumber: 'HC-2024-1005',
      customerId: 'customer-005',
      dateOfLoss: '2024-03-15',
      dateReported: '2024-03-16',
      description: 'Tile roof hail damage with broken tiles',
      status: ClaimStatus.DENIED,
      priority: ClaimPriority.LOW,
      property: {
        id: 'property-005',
        address: {
          street: '654 Birch Lane',
          city: 'Westminster',
          state: 'Colorado',
          zipCode: '80031',
          country: 'USA'
        },
        propertyType: PropertyType.SINGLE_FAMILY,
        yearBuilt: 1985,
        roofingMaterial: RoofingMaterial.TILE,
        roofAge: 39,
        roofArea: 3200,
        stories: 1
      },
      photos: [
        {
          id: 'photo-008',
          claimId: 'claim-005',
          url: '/roofs_test/8.jpg',
          storageKey: '2.jpg',
          thumbnail: '/roofs_test/8.jpg',
          caption: 'Pre-existing tile damage',
          takenAt: '2024-03-16T11:00:00Z',
          uploadedAt: '2024-03-16T13:30:00Z',
          uploadedBy: 'customer-005',
          metadata: {
            fileName: '8.jpg',
            fileSize: 1920000,
            width: 1920,
            height: 1080,
            format: 'jpg'
          }
        }
      ],
      estimatedCost: 0,
      createdAt: '2024-03-16T10:30:00Z',
      updatedAt: '2024-03-19T09:00:00Z'
    }
  ];
  
  // Mock customers
  const mockCustomers: Customer[] = [
    {
      id: 'customer-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 246-1357',
      address: {
        street: '123 Oak Street',
        city: 'Denver',
        state: 'Colorado',
        zipCode: '80202',
        country: 'USA'
      },
      policyNumber: 'POL-001234',
      insuranceCompany: 'State Farm Insurance'
    },
    {
      id: 'customer-002',
      name: 'Emma Johnson',
      email: 'emma.j@email.com',
      phone: '(555) 369-2580',
      address: {
        street: '456 Maple Avenue',
        city: 'Aurora',
        state: 'Colorado',
        zipCode: '80012',
        country: 'USA'
      },
      policyNumber: 'POL-002345',
      insuranceCompany: 'Allstate Insurance'
    },
    {
      id: 'customer-003',
      name: 'Michael Davis',
      email: 'mdavis@email.com',
      phone: '(555) 159-7530',
      address: {
        street: '789 Pine Road',
        city: 'Lakewood',
        state: 'Colorado',
        zipCode: '80226',
        country: 'USA'
      },
      policyNumber: 'POL-003456',
      insuranceCompany: 'Progressive Insurance'
    },
    {
      id: 'customer-004',
      name: 'Sarah Wilson',
      email: 'swilson@email.com',
      phone: '(555) 789-1234',
      address: {
        street: '321 Elm Street',
        city: 'Thornton',
        state: 'Colorado',
        zipCode: '80241',
        country: 'USA'
      },
      policyNumber: 'POL-004567',
      insuranceCompany: 'GEICO Insurance'
    },
    {
      id: 'customer-005',
      name: 'David Brown',
      email: 'dbrown@email.com',
      phone: '(555) 456-7890',
      address: {
        street: '654 Birch Lane',
        city: 'Westminster',
        state: 'Colorado',
        zipCode: '80031',
        country: 'USA'
      },
      policyNumber: 'POL-005678',
      insuranceCompany: 'Liberty Mutual'
    }
  ];
  
  // API Functions
  export const api = {
    // Get all claims
    async getClaims(): Promise<ApiResponse<HailDamageClaim[]>> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockClaims,
        pagination: {
          page: 1,
          pageSize: 5,
          total: mockClaims.length,
          totalPages: 1
        }
      };
    },
  
    // Get specific claim by ID
    async getClaim(id: string): Promise<ApiResponse<HailDamageClaim>> {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const claim = mockClaims.find(c => c.id === id);
      
      if (!claim) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Claim with ID ${id} not found`
          }
        };
      }
      
      return {
        success: true,
        data: claim
      };
    },
  
    // Get customer by ID
    async getCustomer(id: string): Promise<ApiResponse<Customer>> {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const customer = mockCustomers.find(c => c.id === id);
      
      if (!customer) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Customer with ID ${id} not found`
          }
        };
      }
      
      return {
        success: true,
        data: customer
      };
    },
  
    // Get claims by status
    async getClaimsByStatus(status: ClaimStatus): Promise<ApiResponse<HailDamageClaim[]>> {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredClaims = mockClaims.filter(c => c.status === status);
      
      return {
        success: true,
        data: filteredClaims,
        pagination: {
          page: 1,
          pageSize: filteredClaims.length,
          total: filteredClaims.length,
          totalPages: 1
        }
      };
    },
  
    // Create new claim (mock)
    async createClaim(claim: Partial<HailDamageClaim>): Promise<ApiResponse<HailDamageClaim>> {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const newClaim: HailDamageClaim = {
        id: `claim-${Date.now()}`,
        claimNumber: `HC-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        status: ClaimStatus.PENDING,
        priority: ClaimPriority.MEDIUM,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photos: [],
        ...claim
      } as HailDamageClaim;
      
      return {
        success: true,
        data: newClaim
      };
    },
  
    // Update claim status (mock)
    async updateClaimStatus(id: string, status: ClaimStatus): Promise<ApiResponse<HailDamageClaim>> {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const claim = mockClaims.find(c => c.id === id);
      
      if (!claim) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Claim with ID ${id} not found`
          }
        };
      }
      
      const updatedClaim = {
        ...claim,
        status,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedClaim
      };
    }
  };
  
  // Export for easier importing
  export default api;