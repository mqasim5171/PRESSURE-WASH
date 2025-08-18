import React, { useState } from 'react';
import { X, Camera, ArrowLeft, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import CTA from '../components/sections/CTA';
import { copy } from '../lib/copy';

const GalleryPage = () => {
  const { gallery } = copy;
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Results' },
    { id: 'solar', label: 'Solar Panel Cleaning' },
    { id: 'roof', label: 'Roof & Gutter Cleaning' },
    { id: 'window', label: 'Window Cleaning' },
    { id: 'pressure', label: 'Pressure Washing' }
  ];

  const openModal = (image, index) => {
    setSelectedImage({ ...image, index });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const currentIndex = selectedImage.index;
    const nextIndex = (currentIndex + 1) % gallery.images.length;
    setSelectedImage({ ...gallery.images[nextIndex], index: nextIndex });
  };

  const prevImage = () => {
    const currentIndex = selectedImage.index;
    const prevIndex = (currentIndex - 1 + gallery.images.length) % gallery.images.length;
    setSelectedImage({ ...gallery.images[prevIndex], index: prevIndex });
  };

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {gallery.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {gallery.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-medium">
              Real customer results • Before & after transformations
            </span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onClick={() => openModal(image, index)}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">View Full Size</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-bold text-lg mb-2">{image.caption}</h3>
                <p className="text-white/90 text-sm">Professional cleaning transformation</p>
              </div>

              {/* Corner Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                Before & After
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img 
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="text-center">
                <h3 className="text-white text-2xl font-bold mb-2">{selectedImage.caption}</h3>
                <p className="text-white/90">Professional cleaning by Arcturus Services</p>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {selectedImage.index + 1} of {gallery.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Results Stats */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            The Numbers Don't Lie
          </h2>
          <p className="text-xl text-slate-600">
            Real results from satisfied customers across Sydney
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-blue-600">30%</div>
            <div className="text-slate-600">Average efficiency boost from solar panel cleaning</div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-green-600">247+</div>
            <div className="text-slate-600">Before & after transformations completed</div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-purple-600">100%</div>
            <div className="text-slate-600">Customer satisfaction rate on visible results</div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-cyan-600">1000+</div>
            <div className="text-slate-600">Properties transformed this year</div>
          </div>
        </div>
      </Section>

      {/* Results Guarantee */}
      <Section className="bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Your Results Are Guaranteed
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Before & After Photos</h3>
              <p className="text-slate-600">We document every job with before and after photos so you can see the dramatic difference.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-2xl font-bold text-green-600">★</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Satisfaction Guarantee</h3>
              <p className="text-slate-600">Not happy with the results? We'll return at no charge until you're completely satisfied.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-xl font-bold text-purple-600">5★</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Proven Results</h3>
              <p className="text-slate-600">Join hundreds of 5-star customers who've experienced the Arcturus difference.</p>
            </div>
          </div>

          <div className="mt-12">
            <Button size="lg" href="/contact">
              Get Your Transformation Started
            </Button>
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
};

export default GalleryPage;