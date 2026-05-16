'use client';

import { useState, useCallback } from 'react';
import AnimatedLuxuryLine from '@/components/ui/AnimatedLuxuryLine/AnimatedLuxuryLine';
import styles from './FaqSection.module.css';

/* ============================================
   Icons
   ============================================ */
function PlusIcon() {
  return (
    <svg className={styles.accordionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className={styles.accordionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

/* ============================================
   FAQ Data
   ============================================ */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Tôi có thể đổi trả sản phẩm không?',
    answer: 'Có. Bạn có thể đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên nhãn mác, chưa qua sử dụng và không thuộc danh mục sản phẩm cuối cùng (final sale). Vui lòng liên hệ đội ngũ hỗ trợ để được hướng dẫn chi tiết.',
  },
  {
    id: 'faq-2',
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Đối với khu vực nội thành TP.HCM và Hà Nội, đơn hàng sẽ được giao trong 1-2 ngày làm việc. Các tỉnh thành khác từ 3-5 ngày làm việc. Đơn hàng trên 499.000đ được miễn phí vận chuyển toàn quốc.',
  },
  {
    id: 'faq-3',
    question: 'LEVENTS có những phương thức thanh toán nào?',
    answer: 'LEVENTS hỗ trợ đa dạng phương thức thanh toán: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), và thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard). Mọi giao dịch đều được bảo mật tuyệt đối.',
  },
  {
    id: 'faq-4',
    question: 'Làm thế nào để chọn size phù hợp?',
    answer: 'Mỗi sản phẩm đều có bảng size chi tiết kèm hướng dẫn đo. Bạn có thể tham khảo bảng size trên trang sản phẩm hoặc liên hệ hotline 1900 1234 để được tư vấn trực tiếp. Chúng tôi khuyên bạn nên đo số đo cơ thể và so sánh với bảng size để có lựa chọn chính xác nhất.',
  },
  {
    id: 'faq-5',
    question: 'Tôi muốn theo dõi đơn hàng thì làm thế nào?',
    answer: 'Sau khi đặt hàng thành công, bạn sẽ nhận được email và SMS xác nhận kèm mã đơn hàng. Bạn có thể theo dõi trạng thái đơn hàng tại mục "Kiểm tra đơn hàng" trên website hoặc liên hệ hotline để được hỗ trợ.',
  },
  {
    id: 'faq-6',
    question: 'LEVENTS có cửa hàng offline không?',
    answer: 'Có, LEVENTS hiện có hệ thống cửa hàng tại TP.HCM và Hà Nội. Bạn có thể ghé thăm trực tiếp để trải nghiệm sản phẩm và được tư vấn bởi đội ngũ nhân viên chuyên nghiệp. Xem danh sách cửa hàng tại mục "Hệ thống cửa hàng" trên website.',
  },
];

/* ============================================
   FaqSection Component
   ============================================ */
export default function FaqSection() {
  const [activeId, setActiveId] = useState<string>('faq-1'); // First item open by default

  const toggleAccordion = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? '' : id));
  }, []);

  return (
    <section className={styles.section} aria-label="Câu hỏi thường gặp">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>CÂU HỎI THƯỜNG GẶP</h2>
            <AnimatedLuxuryLine />
          </div>
        </div>

        <div className={styles.contentWrapper}>
          {/* Accordion */}
          <div className={styles.accordionWrapper}>
          {FAQ_DATA.map((faq) => {
            const isActive = activeId === faq.id;
            return (
              <div
                key={faq.id}
                className={`${styles.accordionItem} ${isActive ? styles.active : ''}`}
              >
                <button
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isActive}
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-trigger`}
                >
                  <div className={styles.questionWrapper}>
                    <div className={styles.qCircle}>Q</div>
                    <span className={styles.accordionQuestion}>{faq.question}</span>
                  </div>
                  {isActive ? <MinusIcon /> : <PlusIcon />}
                </button>
                <div
                  className={styles.accordionContent}
                  id={`${faq.id}-content`}
                  role="region"
                  aria-labelledby={`${faq.id}-trigger`}
                >
                  <div className={styles.accordionInner}>
                    <div className={styles.answerWrapper}>
                      <div className={styles.aCircle}>A</div>
                      <p className={styles.accordionAnswer}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
