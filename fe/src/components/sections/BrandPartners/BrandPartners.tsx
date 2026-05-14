import styles from './BrandPartners.module.css';

const PARTNERS = [
  { id: 'bp-1', name: 'LEVENTS®' },
  { id: 'bp-2', name: 'ZARA' },
  { id: 'bp-3', name: 'H&M' },
  { id: 'bp-4', name: 'UNIQLO' },
  { id: 'bp-5', name: 'MANGO' },
  { id: 'bp-6', name: 'COOLMATE' },
  { id: 'bp-7', name: 'D+' },
];

export default function BrandPartners() {
  return (
    <section className={styles.section} aria-label="Đối tác thương hiệu">
      <div className={styles.container}>
        <div className={styles.list}>
          {PARTNERS.map((partner) => (
            <span key={partner.id} className={styles.brand}>
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
