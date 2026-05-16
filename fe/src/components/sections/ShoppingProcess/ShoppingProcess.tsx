'use client';

import AnimatedLuxuryLine from '@/components/ui/AnimatedLuxuryLine/AnimatedLuxuryLine';
import styles from './ShoppingProcess.module.css';

/* ============================================
   Step Icons (SVG line-art)
   ============================================ */
function TShirtIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.38 3.46 16 2 13.25 4.75a3.18 3.18 0 0 1-2.5 0L8 2 3.62 3.46a2 2 0 0 0-1.34 1.68l-.54 4.36L5 10.6V21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-10.4l3.26-1.1-.54-4.36a2 2 0 0 0-1.34-1.68Z" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <circle cx="17" cy="15" r="3" />
      <path d="m16 15 1 1 1.5-1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="m2 10 3-3" />
      <path d="m6 10 3-3" />
    </svg>
  );
}

/* Arrow connector icon */
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* Benefit icons */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function HeadphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

/* ============================================
   Steps Data
   ============================================ */
const STEPS = [
  {
    number: '01',
    title: 'CHỌN SẢN PHẨM',
    description: 'Khám phá các bộ sưu tập phù hợp phong cách của bạn',
    Icon: TShirtIcon,
  },
  {
    number: '02',
    title: 'THÊM VÀO GIỎ HÀNG',
    description: 'Lựa chọn size, màu sắc và số lượng mong muốn',
    Icon: ShoppingBagIcon,
  },
  {
    number: '03',
    title: 'THANH TOÁN',
    description: 'Hỗ trợ nhiều phương thức thanh toán an toàn, tiện lợi',
    Icon: CreditCardIcon,
  },
  {
    number: '04',
    title: 'GIAO HÀNG',
    description: 'Đơn hàng được đóng gói và vận chuyển nhanh chóng tới tay bạn',
    Icon: TruckIcon,
  },
];

const BENEFITS = [
  { title: 'AN TOÀN & BẢO MẬT', text: 'Thông tin của bạn luôn được bảo mật tuyệt đối', Icon: ShieldIcon },
  { title: 'ĐỔI TRẢ DỄ DÀNG', text: 'Hỗ trợ đổi trả trong 7 ngày nếu sản phẩm có lỗi', Icon: RefreshIcon },
  { title: 'HỖ TRỢ 24/7', text: 'Đội ngũ CSKH luôn sẵn sàng giải đáp mọi thắc mắc', Icon: HeadphoneIcon },
  { title: 'GIAO HÀNG NHANH', text: 'Giao hàng toàn quốc 1 - 3 ngày làm việc', Icon: BoxIcon },
];

/* ============================================
   ShoppingProcess Component
   ============================================ */
export default function ShoppingProcess() {
  return (
    <section className={styles.section} aria-label="Quy trình mua hàng">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>QUY TRÌNH MUA HÀNG</h2>
            <AnimatedLuxuryLine />
          </div>
        </div>

        <div className={styles.contentWrapper}>
          {/* Timeline */}
          <div className={styles.timelineWrapper}>
            <div className={styles.timeline}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepIconWrapper}>
                  <step.Icon />
                </div>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.stepDivider} />
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Arrow Connectors */}
          <div className={`${styles.arrowConnector} ${styles.arrow1}`} aria-hidden="true">
            <ArrowRight />
          </div>
          <div className={`${styles.arrowConnector} ${styles.arrow2}`} aria-hidden="true">
            <ArrowRight />
          </div>
          <div className={`${styles.arrowConnector} ${styles.arrow3}`} aria-hidden="true">
            <ArrowRight />
          </div>
        </div>

        {/* Benefits Bar */}
        <div className={styles.benefitsBar}>
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <benefit.Icon />
              </div>
              <h4 className={styles.benefitTitle}>{benefit.title}</h4>
              <p className={styles.benefitText}>{benefit.text}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
