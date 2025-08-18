import React, { useState } from 'react';
import { X } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const Gallery = () => {
  const { gallery } = copy;
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image, index) => {
    setSelectedImage({ ...image, index });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <Section id="gallery" className="bg-slate-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {gallery.title}
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          {gallery.subtitle}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            onClick={() => openModal(image, index)}
          >
            <div className="aspect-[4/3] relative">
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  View Full Size
                </div>
              </div>
            </div>
            
            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg font-medium text-center">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready for These Results?
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who've transformed their properties with our professional cleaning services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Your Free Quote
            </a>
            <a 
              href="tel:0414203262"
              className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Call for Same-Day Service
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Gallery;