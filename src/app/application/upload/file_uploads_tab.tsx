// src/components/tabs/FileUploadsTab.tsx
import React from 'react';
import { Camera,  Trash2, Plus, FileText,  Video } from 'lucide-react';
import { DocumentType } from '@/types';
import Image from 'next/image';

export interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: 'photos' | 'videos' | 'documents';
    documentType?: DocumentType;
    preview: string;
  }

interface FileUploadsTabProps {
  files: {
    photos: UploadedFile[];
    videos: UploadedFile[];
    documents: UploadedFile[];
  };
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'videos' | 'documents') => void;
  removeFile: (id: string, type: 'photos' | 'videos' | 'documents') => void;
}

export default function FileUploadsTab({ files, handleFileUpload, removeFile }: FileUploadsTabProps) {
  const { photos, videos, documents } = files;

  const [documentTypes, setDocumentTypes] = React.useState<{[key: string]: DocumentType}>({});

  const updateDocumentType = (id: string, type: DocumentType) => {
    setDocumentTypes(prev => ({ ...prev, [id]: type }));
  };

  return (
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
                  <Image 
                    src={photo.preview ||''} 
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
        )
         : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No photos uploaded</p>
          </div>
        )
        }
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
                        value={documentTypes[doc.id] || doc.documentType || DocumentType.OTHER}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value as DocumentType)}
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
  );
}