"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  primaryAction: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
}

const slides: CarouselSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop",
    title: "Premium RC Cars",
    subtitle: "Experience the thrill of high-performance remote control vehicles",
    primaryAction: {
      text: "Shop Now",
      href: "/shop",
    },
    secondaryAction: {
      text: "Learn More",
      href: "/about",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop",
    title: "High-Performance RC Vehicles",
    subtitle: "From crawlers to drift cars, find the perfect RC car for your style",
    primaryAction: {
      text: "Browse Collection",
      href: "/shop",
    },
    secondaryAction: {
      text: "View Categories",
      href: "/shop",
    },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop",
    title: "Ready-to-Run RC Cars",
    subtitle: "Premium quality RC cars ready to hit the track or trail",
    primaryAction: {
      text: "Explore Now",
      href: "/shop",
    },
    secondaryAction: {
      text: "View All",
      href: "/shop",
    },
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-8 lg:px-12 z-20">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                      {slide.title}
                    </h2>
                    <p className="text-base md:text-lg text-white/90 mb-6 font-light">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={slide.primaryAction.href}
                        className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm"
                        onClick={() => setIsAutoPlaying(false)}
                      >
                        {slide.primaryAction.text}
                      </Link>
                      {slide.secondaryAction && (
                        <Link
                          href={slide.secondaryAction.href}
                          className="px-5 py-2.5 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-slate-900 transition-all duration-300 text-center text-sm"
                          onClick={() => setIsAutoPlaying(false)}
                        >
                          {slide.secondaryAction.text}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

