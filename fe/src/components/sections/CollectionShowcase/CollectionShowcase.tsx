import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/data/mockData';
import AnimatedLuxuryLine from '@/components/ui/AnimatedLuxuryLine/AnimatedLuxuryLine';
import styles from './CollectionShowcase.module.css';

export default function CollectionShowcase() {
  return (
    <section className={styles.section} aria-label="Bộ sưu tập nổi bật">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>BỘ SƯU TẬP NỔI BẬT</h2>
            <AnimatedLuxuryLine />
          </div>
          <Link href="/collections" className={styles.viewAll}>
            Xem tất cả
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className={styles.card}
              aria-label={`Bộ sưu tập ${col.name}: ${col.description}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={col.image}
                  alt={`Bộ sưu tập ${col.name} - ${col.description}`}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className={styles.image}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{col.name}</h3>
                <p className={styles.cardDesc}>{col.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
