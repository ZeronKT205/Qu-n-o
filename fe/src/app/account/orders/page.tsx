'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './OrdersPage.module.css';
import OrderDetailModal from './OrderDetailModal';

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const BoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const TABS = ['Tất cả', 'Chưa đặt hàng', 'Đã đặt hàng', 'Đã gửi hàng'];

const MOCK_ORDERS = [
  {
    id: '#LEV25050123',
    date: '15/05/2025 - 14:30',
    status: 'Đã gửi hàng',
    statusColor: 'green',
    totalAmount: '1.890.000đ',
    paymentMethod: 'Thanh toán qua ZaloPay',
    productsCount: 4,
    thumbnails: [
      '/images/products/product-1.png',
      '/images/products/product-2.png',
      '/images/products/product-3.png',
    ],
    events: [
      { status: 'Chưa đặt hàng', date: '15/05/2025 - 14:00', isCompleted: true },
      { status: 'Đã đặt hàng', date: '15/05/2025 - 14:05', isCompleted: true },
      { status: 'Đã gửi hàng', date: '15/05/2025 - 14:30', isCompleted: true },
    ]
  },
  {
    id: '#LEV25042890',
    date: '28/04/2025 - 09:15',
    status: 'Đã đặt hàng',
    statusColor: 'teal',
    totalAmount: '1.290.000đ',
    paymentMethod: 'Thanh toán khi nhận hàng',
    productsCount: 3,
    thumbnails: [
      '/images/products/product-4.png',
      '/images/products/product-5.png',
      '/images/products/product-6.png',
    ],
    events: [
      { status: 'Chưa đặt hàng', date: '28/04/2025 - 09:00', isCompleted: true },
      { status: 'Đã đặt hàng', date: '28/04/2025 - 09:15', isCompleted: true },
      { status: 'Đã gửi hàng', date: '', isCompleted: false },
    ]
  },
  {
    id: '#LEV25041567',
    date: '15/04/2025 - 16:45',
    status: 'Đã đặt hàng',
    statusColor: 'teal',
    totalAmount: '1.590.000đ',
    paymentMethod: 'Chuyển khoản ngân hàng',
    productsCount: 3,
    thumbnails: [
      '/images/products/product-1.png',
      '/images/products/product-2.png',
      '/images/products/product-3.png',
    ],
    events: [
      { status: 'Chưa đặt hàng', date: '15/04/2025 - 16:40', isCompleted: true },
      { status: 'Đã đặt hàng', date: '15/04/2025 - 16:45', isCompleted: true },
      { status: 'Đã gửi hàng', date: '', isCompleted: false },
    ]
  },
  {
    id: '#LEV25033121',
    date: '31/03/2025 - 11:20',
    status: 'Chưa đặt hàng',
    statusColor: 'orange',
    totalAmount: '820.000đ',
    paymentMethod: 'Thanh toán qua MoMo',
    productsCount: 2,
    thumbnails: [
      '/images/products/product-4.png',
      '/images/products/product-5.png',
    ],
    events: [
      { status: 'Chưa đặt hàng', date: '31/03/2025 - 11:20', isCompleted: true },
      { status: 'Đã đặt hàng', date: '', isCompleted: false },
      { status: 'Đã gửi hàng', date: '', isCompleted: false },
    ]
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split(' - ');
    if (parts.length !== 2) return 0;
    const [datePart, timePart] = parts;
    const dateSplits = datePart.split('/');
    if (dateSplits.length !== 3) return 0;
    const [day, month, year] = dateSplits;
    const timeSplits = timePart.split(':');
    const hour = timeSplits[0] || '0';
    const minute = timeSplits[1] || '0';
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime();
  };

  const filteredOrders = activeTab === 'Tất cả'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(order => order.status === activeTab);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const timeA = parseDate(a.date);
    const timeB = parseDate(b.date);
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const getTimelineStyle = (color: string) => {
    switch (color) {
      case 'orange': return { '--timeline-color': '#f97316', '--timeline-bg': '#ffedd5' };
      case 'teal': return { '--timeline-color': '#14b8a6', '--timeline-bg': '#ccfbf1' };
      case 'blue': return { '--timeline-color': '#3b82f6', '--timeline-bg': '#dbeafe' };
      case 'gray': return { '--timeline-color': '#9ca3af', '--timeline-bg': '#f3f4f6' };
      case 'green':
      default: return { '--timeline-color': '#16a34a', '--timeline-bg': '#dcfce7' };
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>LỊCH SỬ MUA HÀNG</h1>
        <p className={styles.subtitle}>Quản lý và xem lại các đơn hàng bạn đã đặt</p>
      </header>

      {/* Tabs and Filters */}
      <div className={styles.filterRow}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.sortDropdownContainer}>
          <div className={styles.sortDropdown} onClick={() => setIsSortOpen(!isSortOpen)}>
            <span>{sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isSortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {isSortOpen && (
            <div className={styles.sortMenu}>
              <div 
                className={`${styles.sortItem} ${sortOrder === 'newest' ? styles.sortItemActive : ''}`} 
                onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }}
              >
                Mới nhất
              </div>
              <div 
                className={`${styles.sortItem} ${sortOrder === 'oldest' ? styles.sortItemActive : ''}`} 
                onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }}
              >
                Cũ nhất
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order List */}
      <div className={styles.orderList}>
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => {
            const extraCount = order.productsCount - 3;
          
          return (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderCardTop}>
                {/* Column 1: Info & Actions */}
                <div className={styles.orderInfoCol}>
                  <div className={styles.orderMeta}>
                    <div className={styles.orderIdRow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.orderIdIcon}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <h3 className={styles.orderId}>Đơn hàng {order.id}</h3>
                    </div>
                    <p className={styles.orderDate}>{order.date.replace(' - ', ' • ')}</p>
                    <div className={styles.orderStatus}>
                      <span className={`${styles.statusDot} ${styles[`status_${order.statusColor}`]}`}></span>
                      <span className={styles[`statusText_${order.statusColor}`]}>{order.status}</span>
                    </div>
                  </div>
                  <div className={styles.orderActions}>
                    <button className={styles.btnDetail} onClick={() => setSelectedOrder(order)}>Xem chi tiết</button>
                    <button className={styles.btnReorder} onClick={() => alert(`Thêm sản phẩm đơn ${order.id} vào giỏ hàng`)}>Mua lại</button>
                  </div>
                </div>

                {/* Column 2: Products Thumbnails */}
                <div className={styles.orderProductsCol}>
                  <div className={styles.thumbnailList}>
                    {order.thumbnails.map((img, i) => (
                      <div key={i} className={styles.thumbnailCol}>
                        <div className={styles.thumbnailWrap}>
                          <Image 
                            src={img} 
                            alt="Product thumbnail" 
                            fill 
                            className={styles.thumbnailImg} 
                          />
                        </div>
                        <p className={styles.thumbLabel}>Product thumb</p>
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div className={styles.thumbnailCol}>
                        <div className={styles.thumbnailExtra}>
                          +{extraCount}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={styles.productCountText}>{order.productsCount} sản phẩm</p>
                </div>

                {/* Column 3: Total & Payment */}
                <div className={styles.orderTotalCol}>
                  <div className={styles.totalInfo}>
                    <p className={styles.totalLabel}>Tổng tiền</p>
                    <div className={styles.totalAmountRow}>
                      <h3 className={styles.totalAmount}>{order.totalAmount}</h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                    <p className={styles.paymentMethod}>
                      {order.paymentMethod.includes('qua') ? (
                        <>Thanh toán qua <span style={{color: '#3b82f6'}}>{order.paymentMethod.split('qua ')[1]}</span></>
                      ) : (
                        <span style={{color: '#3b82f6'}}>{order.paymentMethod}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline row */}
              <div className={styles.timeline} style={getTimelineStyle(order.statusColor) as React.CSSProperties}>
                {order.events.map((event, index) => {
                  let nodeState = 'future';
                  if (event.status === order.status) {
                    nodeState = 'active';
                  } else if (event.isCompleted) {
                    nodeState = 'completed';
                  }

                  const getIcon = (status: string) => {
                    switch (status) {
                      case 'Chưa đặt hàng': return <DocumentIcon />;
                      case 'Đã đặt hàng': return <WalletIcon />;
                      case 'Đã gửi hàng': return <TruckIcon />;
                      default: return <BoxIcon />;
                    }
                  }

                  return (
                    <div key={index} className={`${styles.timelineEvent} ${styles['state_' + nodeState]}`}>
                      {index < order.events.length - 1 && (
                         <div className={`${styles.eventLine} ${nodeState === 'completed' ? styles.lineCompleted : ''}`}></div>
                      )}
                      <div className={styles.nodeWrapper}>
                        {nodeState === 'completed' && (
                          <div className={styles.nodeCompleted}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                        {nodeState === 'active' && (
                          <div className={styles.nodeActive}>
                            <div className={styles.nodeActiveInner}></div>
                          </div>
                        )}
                        {nodeState === 'future' && (
                          <div className={styles.nodeFuture}></div>
                        )}
                      </div>
                      
                      <div className={styles.iconWrapper}>
                        {getIcon(event.status)}
                      </div>

                      <div className={styles.eventInfo}>
                        <p className={styles.eventLabel}>{event.status}</p>
                        {event.date && <p className={styles.eventTime}>{event.date.replace(' - ', ' • ')}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A5F48' }}>
            Không có đơn hàng nào trong trạng thái này.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {[1, 2, 3, 4].map(page => (
          <button 
            key={page} 
            className={`${styles.pageBtn} ${currentPage === page ? styles.pageActive : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <span className={styles.pageEllipsis}>...</span>
        <button className={styles.pageBtn} onClick={() => setCurrentPage(10)}>10</button>
        <button className={styles.pageBtn} onClick={() => setCurrentPage(prev => Math.min(prev + 1, 10))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
