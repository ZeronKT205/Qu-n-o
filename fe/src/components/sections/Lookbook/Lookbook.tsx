'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Lookbook.module.css';

/* ============================================
   Lookbook Data
   ============================================ */
interface LookbookItem {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  link: string;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'lb-1',
    image: '/images/lookbook/lookbook-1.png',
    tag: 'EDITORIAL',
    title: 'Sống Chất Mặc Chất',
    description: 'Bộ sưu tập định nghĩa phong cách đường phố hiện đại, kết hợp giữa sự tối giản và cá tính.',
    link: '/collections/song-chat-mac-chat',
  },
  {
    id: 'lb-2',
    image: '/images/lookbook/lookbook-2.png',
    tag: 'LOOKBOOK',
    title: 'Minimal Essentials',
    description: 'Những item cốt lõi mà mỗi tủ đồ đều cần — sạch sẽ, thanh lịch, bền vững.',
    link: '/collections/minimal-essentials',
  },
  {
    id: 'lb-3',
    image: '/images/lookbook/lookbook-3.png',
    tag: 'SEASON SS26',
    title: 'Urban Explorer',
    description: 'Khám phá thành phố với tinh thần tự do — streetwear kết hợp chất liệu cao cấp.',
    link: '/collections/urban-explorer',
  },
];

/* ============================================
   Intersection Observer Hook
   ============================================ */
function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

/* ============================================
   Parallax Effect Hook
   ============================================ */
function useParallax(speed = 0.08): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId: number;
    const node = ref.current;
    if (!node) return;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (progress - 0.5) * speed * rect.height;
        const imageEl = node.querySelector('img');
        if (imageEl) {
          imageEl.style.transform = `translateY(${translateY}px) scale(1.08)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return ref;
}

/* ============================================
   Lookbook Component
   ============================================ */
export default function Lookbook() {
  const [headerRef, headerVisible] = useInView(0.2);
  const [gridRef, gridVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.3);

  return (
    <section className={styles.section} aria-label="Lookbook thời trang">
      {/* Ambient glow decorations */}
      <div
        className={`${styles.ambientGlow} ${styles.glowLeft} ${gridVisible ? styles.visible : ''}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.ambientGlow} ${styles.glowRight} ${gridVisible ? styles.visible : ''}`}
        aria-hidden="true"
      />

      <div className={styles.container}>
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`${styles.header} ${headerVisible ? styles.visible : ''}`}
        >
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            Lookbook
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </p>
          <h2 className={styles.title}>
            <span className={styles.titleAccent}>Behind The Lens</span>
          </h2>
          <p className={styles.subtitle}>
            Khám phá câu chuyện thời trang qua những khoảnh khắc editorial — nơi phong cách gặp gỡ nghệ thuật.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div
          ref={gridRef}
          className={styles.grid}
        >
          {LOOKBOOK_ITEMS.map((item) => (
            <LookbookCard key={item.id} item={item} isGridVisible={gridVisible} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef}
          className={`${styles.bottomCta} ${ctaVisible ? styles.visible : ''}`}
        >
          <Link href="/lookbook" className={styles.ctaButton}>
            <span>Xem toàn bộ Lookbook</span>
            <span aria-hidden="true">→</span>
          </Link>
          <div className={styles.separator} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LookbookCard Sub-component
   ============================================ */
interface LookbookCardProps {
  item: LookbookItem;
  isGridVisible: boolean;
}

function LookbookCard({ item, isGridVisible }: LookbookCardProps) {
  const parallaxRef = useParallax(0.06);

  return (
    <article
      className={`${styles.card} ${isGridVisible ? styles.visible : ''}`}
    >
      <div className={styles.cardImageWrapper} ref={parallaxRef}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 33vw, 400px"
          className={styles.cardImage}
          quality={85}
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.cardOverlay} aria-hidden="true" />

      {/* Shimmer border effect */}
      <div className={styles.cardShimmer} aria-hidden="true" />

      {/* Content */}
      <div className={styles.cardContent}>
        <span className={styles.cardTag}>{item.tag}</span>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDescription}>{item.description}</p>
        <Link href={item.link} className={styles.cardCta}>
          Khám phá ngay
          <span className={styles.ctaArrow}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}
