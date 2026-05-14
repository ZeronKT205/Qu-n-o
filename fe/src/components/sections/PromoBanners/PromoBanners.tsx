'use client';

import { useState } from 'react';
import { PROMO_BANNERS } from '@/data/mockData';
import VoucherModal from '@/components/ui/VoucherModal/VoucherModal';
import styles from './PromoBanners.module.css';

export default function PromoBanners() {
  const [selectedVoucher, setSelectedVoucher] = useState<{ title: string; subtitle: string } | null>(null);

  return (
    <section className={styles.section} aria-label="Chương trình khuyến mãi">
      <div className={styles.container}>
        <div className={styles.grid}>
          {PROMO_BANNERS.map((banner) => (
            <button
              key={banner.id}
              onClick={() => setSelectedVoucher({ title: banner.title, subtitle: banner.subtitle })}
              className={styles.banner}
              style={{
                backgroundColor: banner.bgColor,
                color: banner.textColor,
              }}
              aria-label={`${banner.title} - ${banner.subtitle}`}
            >
              <div className={styles.bannerContent}>
                <span className={styles.bannerLabel}>{banner.id === 'promo-1' ? 'NEW IN' : banner.id === 'promo-2' ? 'SALE' : 'VOUCHER'}</span>
                <h3 className={styles.bannerTitle}>{banner.title}</h3>
                <p className={styles.bannerSubtitle}>{banner.subtitle}</p>
                <span className={styles.bannerCta}>{banner.cta}</span>
              </div>
              {banner.accentColor && (
                <div className={styles.bannerAccent} aria-hidden="true">%</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <VoucherModal
        isOpen={selectedVoucher !== null}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
      />
    </section>
  );
}
