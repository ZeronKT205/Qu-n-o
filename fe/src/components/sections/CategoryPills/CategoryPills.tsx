'use client';

import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';
import styles from './CategoryPills.module.css';

export default function CategoryPills() {
  const handleCategorySelect = (categorySlug: string) => {
    // Dispatch event for ProductGrid to catch
    const event = new CustomEvent('categoryChange', { detail: categorySlug });
    window.dispatchEvent(event);
    
    // Scroll down to products section
    const element = document.getElementById('products');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section} aria-label="Danh mục sản phẩm">
      <div className={styles.container}>
        <ul className={styles.list} role="list">
          {CATEGORIES.map((cat) => (
            <li key={cat.id} className={styles.item}>
              <button 
                className={styles.pill}
                onClick={() => handleCategorySelect(cat.slug)}
                aria-label={`Xem danh mục ${cat.name}`}
              >
                <span className={styles.iconWrapper} aria-hidden="true">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className={styles.iconImage}
                    loading="lazy"
                  />
                </span>
                <span className={styles.label}>{cat.name}</span>
                <span className={styles.arrow} aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.luxurySeparator} aria-hidden="true">
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
    </section>
  );
}

