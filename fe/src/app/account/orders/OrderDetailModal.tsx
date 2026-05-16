import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './OrderDetailModal.module.css';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

// Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"></path>
    <line x1="16" y1="8" x2="8" y2="8"></line>
    <line x1="16" y1="12" x2="8" y2="12"></line>
    <line x1="10" y1="16" x2="8" y2="16"></line>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Enhanced Mock Data specific to the modal design
  const products = [
    { name: 'Tên sản phẩm minh họa dài 2 dòng', sku: 'SP123456', category: 'Đen / M', price: '450.000đ', qty: 1, total: '450.000đ', img: '/images/products/product-1.png' },
    { name: 'Tên sản phẩm minh họa dài 2 dòng', sku: 'SP123456', category: 'Trắng / L', price: '450.000đ', qty: 2, total: '900.000đ', img: '/images/products/product-2.png' },
    { name: 'Tên sản phẩm minh họa dài 2 dòng', sku: 'SP123456', category: 'Xanh / XL', price: '490.000đ', qty: 1, total: '490.000đ', img: '/images/products/product-3.png' },
    { name: 'Tên sản phẩm minh họa dài 2 dòng', sku: 'SP123456', category: 'Be / M', price: '390.000đ', qty: 1, total: '390.000đ', img: '/images/products/product-4.png' }
  ].slice(0, order.productsCount || 4); // Limit to order's actual count

  // Calculate filled height of timeline
  const getTimelineFillHeight = () => {
    if (!order.events || order.events.length === 0) return '0%';
    
    // We only have 3 steps in logic: Chưa đặt hàng (0), Đã đặt hàng (1), Đã gửi hàng (2)
    // Distance from center of Node 0 to Node 1 is 50%
    // Distance from Node 0 to Node 2 is 100%
    const totalSteps = order.events.length;
    let completedSteps = 0;
    
    for (let i = 0; i < totalSteps; i++) {
      if (order.events[i].isCompleted) completedSteps = i + 1;
      if (order.events[i].status === order.status) {
        completedSteps = i; // The active step means previous steps are completed
        break;
      }
    }
    
    if (completedSteps === 0) return '0%';
    if (completedSteps === 1) return '50%';
    return '100%';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Chi tiết đơn hàng {order.id}</h2>
          <div className={styles.subtitle}>
            <div className={`${styles.statusBadge} ${styles['badge_' + order.statusColor]}`}>
              <div className={styles.statusDot}></div>
              {order.status}
            </div>
            <span className={styles.dateText}>Đặt lúc: {order.date.replace(' - ', ' • ')}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          
          {/* LEFT COL */}
          <div className={styles.leftCol}>
            
            {/* Products Block */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Sản phẩm ({order.productsCount})</h3>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th style={{textAlign: 'center'}}>Phân loại</th>
                    <th style={{textAlign: 'center'}}>Đơn giá</th>
                    <th style={{textAlign: 'center'}}>Số lượng</th>
                    <th style={{textAlign: 'right'}}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <div className={styles.productCell}>
                          <Image src={p.img} alt="Product" width={48} height={48} className={styles.productImg} />
                          <div className={styles.productInfo}>
                            <h4>{p.name}</h4>
                            <p>{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tdCenter}>{p.category}</td>
                      <td className={styles.tdCenter}>{p.price}</td>
                      <td className={styles.tdCenter}>{p.qty}</td>
                      <td className={styles.tdRight}>{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles.noteBtn}>
                <MessageSquareIcon />
                Xem ghi chú sản phẩm
              </button>
            </div>

            {/* Customer Info Block */}
            <div className={styles.infoBlocks}>
              {/* Customer Info */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Thông tin khách hàng</h3>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><UserIcon /> Họ tên</div>
                  <div className={styles.infoValue}>Nguyễn Văn A</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><PhoneIcon /> Số điện thoại</div>
                  <div className={styles.infoValue}>0123 456 789</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><MapPinIcon /> Địa chỉ giao hàng</div>
                  <div className={styles.infoValue}>123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><WalletIcon /> Phương thức thanh toán</div>
                  <div className={order.paymentMethod.includes('ZaloPay') || order.paymentMethod.includes('MoMo') ? styles.infoValueBlue : styles.infoValue}>
                     {order.paymentMethod}
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><CheckCircleIcon /> Trạng thái</div>
                  <div className={order.status === 'Chưa đặt hàng' ? styles.infoValueOrange : styles.infoValueGreen}>
                     {order.status}
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}><NoteIcon /> Ghi chú khách hàng</div>
                  <div className={styles.infoValue}>Giao giờ hành chính giúp mình nhé!</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COL */}
          <div className={styles.rightCol}>
            
            {/* Total Block */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Tổng tiền đơn hàng</h3>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tạm tính ({order.productsCount} sản phẩm)</span>
                <span className={styles.summaryValue}>2.230.000đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Phí vận chuyển</span>
                <span className={styles.summaryValue}>30.000đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Giảm giá sản phẩm</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueRed}`}>-100.000đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Voucher</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueRed}`}>-50.000đ</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Thành tiền</span>
                <span className={styles.totalValue}>{order.totalAmount}</span>
              </div>
              <div className={styles.paidRow}>
                <span>Đã thanh toán</span>
                <span>{order.status === 'Chưa đặt hàng' || order.paymentMethod.includes('nhận hàng') ? '0đ' : order.totalAmount}</span>
              </div>
            </div>

            {/* Timeline Block */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Lịch sử đơn hàng</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineLine}>
                   <div className={styles.timelineLineFill} style={{ height: getTimelineFillHeight() }}></div>
                </div>
                
                {order.events.map((event: any, index: number) => {
                  let nodeState = 'future';
                  if (event.status === order.status) {
                    nodeState = 'active';
                  } else if (event.isCompleted) {
                    nodeState = 'completed';
                  }

                  return (
                    <div key={index} className={`${styles.timelineItem} ${styles['item_' + nodeState]}`}>
                      <div className={styles.timelineNodeWrapper}>
                         {nodeState === 'completed' && (
                           <div className={`${styles.timelineNode} ${styles.nodeCompleted}`}>
                             <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                               <polyline points="20 6 9 17 4 12"></polyline>
                             </svg>
                           </div>
                         )}
                         {nodeState === 'active' && (
                           <div className={`${styles.timelineNode} ${styles.nodeActive}`}>
                             <div className={styles.nodeActiveInner}></div>
                           </div>
                         )}
                         {nodeState === 'future' && (
                           <div className={styles.timelineNode}></div>
                         )}
                      </div>
                      <div className={styles.timelineContent}>
                        <p className={styles.timelineTitle}>{event.status}</p>
                        {event.date && <p className={styles.timelineDate}>{event.date.replace(' - ', ' • ')}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Đóng</button>
          <button className={styles.btnPrint}>
            <PrintIcon />
            In đơn hàng
          </button>
        </div>

      </div>
    </div>
  );
}
