'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './MixStyles.module.css';

type StyleSet = {
  id: string;
  title: string;
  coverImage: string;
  images: string[];
};

const MIX_STYLES: StyleSet[] = [
  {
    id: 'mix-1',
    title: 'Minimalist Chic',
    coverImage: '/images/mix-styles/set1/1.png',
    images: [
      '/images/mix-styles/set1/1.png',
      '/images/mix-styles/set1/2.png',
      '/images/mix-styles/set1/3.png',
    ],
  },
  {
    id: 'mix-2',
    title: 'Street Casual',
    coverImage: '/images/mix-styles/Set2/1.png',
    images: [
      '/images/mix-styles/Set2/1.png',
      '/images/mix-styles/Set2/2.png',
      '/images/mix-styles/Set2/3.png',
    ],
  },
  {
    id: 'mix-3',
    title: 'Office Elegance',
    coverImage: '/images/mix-styles/Set3/1.png',
    images: [
      '/images/mix-styles/Set3/1.png',
      '/images/mix-styles/Set3/2.png',
      '/images/mix-styles/Set3/3.png',
    ],
  },
  {
    id: 'mix-4',
    title: 'Summer Ready',
    coverImage: '/images/mix-styles/Set4/1.png',
    images: [
      '/images/mix-styles/Set4/1.png',
      '/images/mix-styles/Set4/2.png',
      '/images/mix-styles/Set4/3.png',
    ],
  },
];

export default function MixStyles() {
  const [activeSet, setActiveSet] = useState<StyleSet | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openGallery = (item: StyleSet) => {
    setActiveSet(item);
    // Use a tiny timeout to allow display:block to apply before animating opacity
    setTimeout(() => setIsModalVisible(true), 10);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeGallery = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setActiveSet(null);
      document.body.style.overflow = '';
    }, 400); // Matches transition duration
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSet) {
        closeGallery();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSet]);

  return (
    <section className={styles.section} aria-labelledby="mix-styles-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="mix-styles-title" className={styles.title}>Mix Phong Cách</h2>
          <p className={styles.subtitle}>Gợi ý phối đồ từ các Stylist hàng đầu</p>
        </div>

        <div className={styles.grid}>
          {MIX_STYLES.map((item) => (
            <div 
              key={item.id} 
              className={styles.card}
              onClick={() => openGallery(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openGallery(item);
                }
              }}
              aria-label={`Xem bộ sưu tập ${item.title}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                  quality={100}
                />
                <div className={styles.overlay}>
                  <span className={styles.exploreBtn}>Khám Phá</span>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {activeSet && (
        <div 
          className={`${styles.modal} ${isModalVisible ? styles.modalVisible : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Bộ sưu tập ${activeSet.title}`}
        >
          {/* Blurred Backdrop */}
          <div className={styles.modalBackdrop} onClick={closeGallery} aria-hidden="true" />
          
          <div className={styles.modalContent}>
            <button 
              className={styles.closeBtn} 
              onClick={closeGallery}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <h3 className={styles.modalTitle}>{activeSet.title}</h3>
            
            <div className={styles.galleryScroll}>
              {activeSet.images.map((imgSrc, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image
                    src={imgSrc}
                    alt={`${activeSet.title} - Ảnh ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.galleryImage}
                    quality={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
