import React, { useState } from 'react';
import { Photo } from '@/types';
import Image from 'next/image';

// Image Carousel Component
interface ImageCarouselProps {
  photos: Photo[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="carousel w-full bg-base-300 rounded-lg h-96 flex items-center justify-center">
        <p className="text-base-content opacity-50">No photos available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="carousel w-full h-96 md:h-[500px] rounded-lg overflow-hidden bg-base-300">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`carousel-item w-full ${
              index === currentIndex ? 'block' : 'hidden'
            }`}
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button 
                onClick={goToPrevious}
                className="btn btn-circle btn-sm md:btn-md glass"
              >
                ❮
              </button>
              <button 
                onClick={goToNext}
                className="btn btn-circle btn-sm md:btn-md glass"
              >
                ❯
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Caption overlay */}
      {photos[currentIndex]?.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-white text-sm md:text-base">
            {photos[currentIndex].caption}
          </p>
        </div>
      )}

      {/* Thumbnail navigation */}
      <div className="flex justify-center w-full py-4 gap-2 overflow-x-auto">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded ${
              index === currentIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={photo.thumbnail || photo.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Photo counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};
export default ImageCarousel;