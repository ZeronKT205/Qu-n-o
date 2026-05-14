'use client';

import { useEffect, useState } from 'react';
import { ANNOUNCEMENT_ITEMS } from '@/data/mockData';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ANNOUNCEMENT_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.bar} role="marquee" aria-label="Thông báo khuyến mãi">
      <div className={styles.inner}>
        {ANNOUNCEMENT_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.item} ${index === activeIndex ? styles.active : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <span className={styles.icon} aria-hidden="true">{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
            {item.highlight && (
              <span className={styles.highlight}> · {item.highlight}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
