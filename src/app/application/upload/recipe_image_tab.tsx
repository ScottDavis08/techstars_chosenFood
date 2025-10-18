import React from 'react';
import { Camera, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { UploadedFile } from './useFormData';

interface RecipeImageTabProps {
  image: UploadedFile | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export default function RecipeImageTab({ 
  image, 
  handleImageUpload, 
  removeImage 
}: RecipeImageTabProps) {
  return (
    <div className="space-y-8">
      {/* Recipe Image Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Recipe Image
          </h3>
        </div>
        
        {image ? (
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image 
                src={image.preview} 
                alt={image.name}
                className="w-full h-full object-cover"
                width={800}
                height={450}
              />
            </div>
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{image.name}</p>
              <p className="text-xs text-base-content/60">
                {(image.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <label className="w-full max-w-2xl mx-auto block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Click to upload recipe image</p>
              <p className="text-sm text-gray-500">PNG, JPG, or WEBP (max 10MB)</p>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </label>
        )}
      </div>

      {/* Tips Section */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Photo Tips</h3>
          <div className="text-sm">
            <ul className="list-disc list-inside">
              <li>Use natural lighting for best results</li>
              <li>Show the finished dish from an appealing angle</li>
              <li>Include garnishes or ingredients for context</li>
              <li>Ensure the image is clear and in focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}