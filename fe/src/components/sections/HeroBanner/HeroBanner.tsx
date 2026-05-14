'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './HeroBanner.module.css';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/images/hero/hero-banner.png',
    alt: 'BST Sống Chất Mặc Chất - New Collection 2024 - Levents Clone',
  },
  {
    id: 'slide-2',
    image: '/images/hero/hero-banner2.png',
    alt: 'Summer Vibes 2024 - Phong cách mùa hè - Levents Clone',
  },
];

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  const goNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className={styles.hero} aria-label="Bộ sưu tập mới Sống Chất Mặc Chất">
      {/* Image Slider — text is baked into images, scales perfectly */}
      <div className={styles.sliderViewport}>
        <div
          className={styles.sliderTrack}
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div key={slide.id} className={styles.slide} aria-hidden={index !== activeSlide}>
              <Image
                src={slide.image}
                alt={slide.alt}
                width={1920}
                height={800}
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : undefined}
                sizes="100vw"
                className={styles.slideImage}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={goPrev}
        aria-label="Slide trước"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={goNext}
        aria-label="Slide tiếp theo"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
      </button>

      {/* Dot Indicators */}
      <div className={styles.dots} role="tablist" aria-label="Chọn slide">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`${styles.dot} ${index === activeSlide ? styles.dotActive : ''}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
