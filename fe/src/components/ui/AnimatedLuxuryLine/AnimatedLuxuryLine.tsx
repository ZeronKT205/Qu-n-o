'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AnimatedLuxuryLine.module.css';

export default function AnimatedLuxuryLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: If you want it to trigger only once, uncomment below:
          // if (lineRef.current) observer.unobserve(lineRef.current);
        } else {
          // Reset when scrolling out of view so it animates again when scrolling back
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => {
      if (lineRef.current) {
        observer.unobserve(lineRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container} ref={lineRef} aria-hidden="true">
      <div className={`${styles.lineWrapper} ${isVisible ? styles.animate : ''}`}>
        <div className={styles.dot}></div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
}
