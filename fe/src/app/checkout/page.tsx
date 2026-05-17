'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CheckoutPage.module.css';
import { useCartStore } from '@/store/useCartStore';
import { getSiteConfig } from '@/utils/siteConfig';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shipConfig, setShipConfig] = useState({ shipFee: 30000, freeShipThreshold: 499000 });

  useEffect(() => {
    const cfg = getSiteConfig();
    setShipConfig({ shipFee: cfg.shipFee, freeShipThreshold: cfg.freeShipThreshold });
  }, []);

  // SePay QR Payment Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // SePay configurations from Env
  const sepayAcc = process.env.NEXT_PUBLIC_SEPAY_ACC || '96247LEVENTSSTORAGE';
  const sepayBank = process.env.NEXT_PUBLIC_SEPAY_BANK || 'BIDV';

  // Timer Effect for QR Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTransferModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert('Mã thanh toán QR đã hết hạn. Vui lòng thử lại!');
      setIsTransferModalOpen(false);
    }
    return () => clearInterval(timer);
  }, [isTransferModalOpen, timeLeft]);

  // Format Time Left
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to copy to clipboard
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Mobile Accordion States for Forms
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'standard' ? 0
    : shippingMethod === 'fast' ? shipConfig.shipFee
    : shipConfig.shipFee * 2;
  const total = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>GIỎ HÀNG TRỐNG</h1>
          <p className={styles.pageSubtitle}>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Link href="/products" className={styles.backToCart}>← Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb & Header */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Trang chủ</Link>
          <span className={styles.separator}>›</span>
          <span className={styles.current}>Thanh toán</span>
          <span className={styles.separator}>›</span>
          <span className={styles.upcoming}>Hoàn tất</span>
        </div>
        <h1 className={styles.pageTitle}>THANH TOÁN</h1>
        <p className={styles.pageSubtitle}>Vui lòng kiểm tra thông tin và hoàn tất đơn hàng</p>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        
        {/* LEFT COLUMN - FORMS */}
        <div className={styles.leftCol}>
          
          {/* Section 1: Customer Info */}
          <section className={styles.section}>
            <div className={`${styles.sectionHeader} ${styles.clickableHeader}`} onClick={() => setIsInfoOpen(!isInfoOpen)}>
              <h2 className={styles.sectionTitle}>1. THÔNG TIN NHẬN HÀNG</h2>
              <div className={styles.headerRight}>
                <button className={styles.editBtn} onClick={(e) => e.stopPropagation()}>Chỉnh sửa</button>
                <svg className={`${styles.dropdownIcon} ${isInfoOpen ? styles.open : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            
            <div className={`${styles.sectionContent} ${isInfoOpen ? styles.contentOpen : styles.contentClosed}`}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Họ và tên</label>
                  <input type="text" className={styles.input} defaultValue="Nguyễn Văn A" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Số điện thoại</label>
                  <input type="tel" className={styles.input} defaultValue="0901 234 567" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input type="email" className={styles.input} defaultValue="nguyenvana@gmail.com" />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Địa chỉ nhận hàng</label>
                  <input type="text" className={styles.input} defaultValue="12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <input type="text" className={styles.input} placeholder="Ghi chú (không bắt buộc)" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Shipping */}
          <section className={styles.section}>
            <div className={`${styles.sectionHeader} ${styles.clickableHeader}`} onClick={() => setIsShippingOpen(!isShippingOpen)}>
              <h2 className={styles.sectionTitle}>2. PHƯƠNG THỨC VẬN CHUYỂN</h2>
              <svg className={`${styles.dropdownIcon} ${isShippingOpen ? styles.open : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className={`${styles.sectionContent} ${isShippingOpen ? styles.contentOpen : styles.contentClosed}`}>
              <div className={styles.radioGroup}>
                
                <label className={`${styles.radioOption} ${shippingMethod === 'standard' ? styles.active : ''}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Giao hàng tiêu chuẩn</div>
                    <div className={styles.radioDesc}>Nhận hàng từ 2 - 4 ngày</div>
                  </div>
                  <div className={styles.radioPrice}>Miễn phí</div>
                </label>

                <label className={`${styles.radioOption} ${shippingMethod === 'fast' ? styles.active : ''}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'fast'} onChange={() => setShippingMethod('fast')} />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Giao hàng nhanh</div>
                    <div className={styles.radioDesc}>Nhận hàng từ 1 - 2 ngày</div>
                  </div>
                  <div className={styles.radioPrice}>{shipConfig.shipFee.toLocaleString('vi-VN')}đ</div>
                </label>

                <label className={`${styles.radioOption} ${shippingMethod === 'express' ? styles.active : ''}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Giao hàng hỏa tốc</div>
                    <div className={styles.radioDesc}>Nhận hàng trong ngày</div>
                  </div>
                  <div className={styles.radioPrice}>{(shipConfig.shipFee * 2).toLocaleString('vi-VN')}đ</div>
                </label>

              </div>
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className={styles.section}>
            <div className={`${styles.sectionHeader} ${styles.clickableHeader}`} onClick={() => setIsPaymentOpen(!isPaymentOpen)}>
              <h2 className={styles.sectionTitle}>3. PHƯƠNG THỨC THANH TOÁN</h2>
              <svg className={`${styles.dropdownIcon} ${isPaymentOpen ? styles.open : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className={`${styles.sectionContent} ${isPaymentOpen ? styles.contentOpen : styles.contentClosed}`}>
              <div className={styles.radioGroup}>
                
                <label className={`${styles.radioOption} ${paymentMethod === 'cod' ? styles.active : ''}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Thanh toán khi nhận hàng (COD)</div>
                    <div className={styles.radioDesc}>Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>

                <label className={`${styles.radioOption} ${paymentMethod === 'transfer' ? styles.active : ''}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Chuyển khoản ngân hàng</div>
                    <div className={styles.radioDesc}>Bạn sẽ nhận được thông tin chuyển khoản sau khi đặt hàng</div>
                  </div>
                </label>

                <label className={`${styles.radioOption} ${styles.disabled}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="payment" disabled />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Thanh toán qua thẻ <span className={styles.maintenanceNote}>(Đang bảo trì)</span></div>
                  </div>
                  <div className={styles.paymentIcons}>
                    <div className={styles.payIcon} style={{color: '#1434CB', fontWeight: 800, fontStyle: 'italic'}}>VISA</div>
                    <div className={styles.payIconMastercard}>
                       <div className={styles.mcRed}></div><div className={styles.mcYellow}></div>
                    </div>
                    <div className={styles.payIconJCB}>JCB</div>
                  </div>
                </label>

                <label className={`${styles.radioOption} ${styles.disabled}`}>
                  <div className={styles.radioControl}>
                    <input type="radio" name="payment" disabled />
                    <span className={styles.radioCustom}></span>
                  </div>
                  <div className={styles.radioLabelWrap}>
                    <div className={styles.radioTitle}>Ví điện tử <span className={styles.maintenanceNote}>(Đang bảo trì)</span></div>
                  </div>
                  <div className={styles.paymentIcons}>
                    <div className={styles.payIconMomo}>MoMo</div>
                    <div className={styles.payIconZalo}>ZaloPay</div>
                  </div>
                </label>

              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>ĐƠN HÀNG ({items.length} SẢN PHẨM)</h2>

            <div className={styles.productList}>
              {items.map((item) => (
                <div key={item.id} className={styles.productItem}>
                  <div className={styles.productImgWrap}>
                    <Image src={item.image} alt={item.name} fill className={styles.productImg} />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <p className={styles.productVariant}>{item.colorName || item.color} / {item.size}</p>
                  </div>
                  <div className={styles.productQty}>x{item.quantity}</div>
                  <div className={styles.productPrice}>{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span className={styles.lineLabel}>Tạm tính</span>
                <span className={styles.lineValue}>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryLine}>
                <span className={styles.lineLabel}>Phí vận chuyển</span>
                <span className={styles.lineValue}>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
              </div>
            </div>

            <div className={styles.totalLine}>
              <span className={styles.totalLabel}>Tổng cộng</span>
              <div className={styles.totalValueWrap}>
                <span className={styles.totalValue}>{formatPrice(total)}</span>
                <span className={styles.vatNote}>(Đã bao gồm VAT)</span>
              </div>
            </div>

            <div className={styles.safeCheckoutBanner}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.safeIcon}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <h4 className={styles.safeTitle}>Thanh toán an toàn</h4>
                <p className={styles.safeDesc}>Thông tin của bạn được bảo mật và xử lý an toàn.</p>
              </div>
            </div>

            <button 
              className={styles.checkoutBtn} 
              onClick={() => {
                if (paymentMethod === 'transfer') {
                  const generatedId = `DH${Math.floor(100000 + Math.random() * 900000)}`;
                  setOrderId(generatedId);
                  setTimeLeft(900);
                  setIsTransferModalOpen(true);
                } else {
                  alert('Đặt hàng thành công! Đơn hàng thanh toán khi nhận hàng (COD) đang được xử lý.');
                }
              }}
            >
              HOÀN TẤT ĐƠN HÀNG
            </button>
            
            <Link href="/products" className={styles.backToCart}>
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>

      </div>

      {/* Footer Features */}
      <div className={styles.features}>
        <div className={styles.featureItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <div className={styles.featureText}>
            <h4>Miễn phí giao hàng</h4>
            <p>Cho đơn từ {Math.round(shipConfig.freeShipThreshold / 1000)}K</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <div className={styles.featureText}>
            <h4>Đổi trả dễ dàng</h4>
            <p>Trong 7 ngày</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <div className={styles.featureText}>
            <h4>Thanh toán an toàn</h4>
            <p>Bảo mật tuyệt đối</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div className={styles.featureText}>
            <h4>Hỗ trợ 24/7</h4>
            <p>1900 1234</p>
          </div>
        </div>
      </div>

      {/* ============================================
         SEPAY BANK TRANSFER MODAL
         ============================================ */}
      {isTransferModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsTransferModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              type="button" 
              className={styles.modalCloseX} 
              onClick={() => setIsTransferModalOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Chuyển khoản bằng mã QR</h3>
              <p className={styles.modalSubtitle}>Mở App Ngân hàng bất kỳ để quét mã VietQR bên dưới</p>
            </div>

            {/* VietQR Dynamic Code from SePay */}
            <div className={styles.qrWrapper}>
              <img 
                src={`https://qr.sepay.vn/img?acc=${sepayAcc}&bank=${sepayBank}&amount=${total}&des=${orderId}`} 
                alt="SePay VietQR Code"
                className={styles.qrImage}
                onLoad={() => {
                  const spinner = document.getElementById('qr-spinner');
                  if (spinner) spinner.style.display = 'none';
                }}
              />
              <div id="qr-spinner" className={styles.qrSpinner}></div>
            </div>

            {/* Countdown timer */}
            <div className={styles.timerWrapper}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Thời gian thanh toán còn lại: {formatTime(timeLeft)}</span>
            </div>

            {/* Bank Transfer Details Box */}
            <div className={styles.detailsBox}>
              <div className={styles.detailsRow}>
                <span className={styles.detailsLabel}>Ngân hàng</span>
                <span className={styles.detailsValue}>{sepayBank}</span>
              </div>
              <div className={styles.detailsRow}>
                <span className={styles.detailsLabel}>Chủ tài khoản</span>
                <span className={styles.detailsValue}>LEVENTS STORAGE</span>
              </div>
              <div className={styles.detailsRow}>
                <span className={styles.detailsLabel}>Số tài khoản</span>
                <div className={styles.detailsValueWrap}>
                  <span className={styles.detailsValue}>{sepayAcc}</span>
                  <button 
                    type="button" 
                    className={styles.copyBtn}
                    onClick={() => handleCopy(sepayAcc, 'acc')}
                  >
                    {copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
              <div className={styles.detailsRow}>
                <span className={styles.detailsLabel}>Số tiền</span>
                <div className={styles.detailsValueWrap}>
                  <span className={styles.detailsValue} style={{ color: '#111827', fontWeight: 700 }}>
                    {formatPrice(total)}
                  </span>
                  <button 
                    type="button" 
                    className={styles.copyBtn}
                    onClick={() => handleCopy(total.toString(), 'amount')}
                  >
                    {copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
              <div className={styles.detailsRow}>
                <span className={styles.detailsLabel}>Nội dung</span>
                <div className={styles.detailsValueWrap}>
                  <span className={styles.detailsValue} style={{ color: '#8F6A4E', fontWeight: 700 }}>
                    {orderId}
                  </span>
                  <button 
                    type="button" 
                    className={styles.copyBtn}
                    onClick={() => handleCopy(orderId, 'des')}
                  >
                    {copiedField === 'des' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnConfirm}
                onClick={() => {
                  alert(`Đã ghi nhận yêu cầu chuyển khoản cho đơn hàng ${orderId}! Hệ thống sẽ kiểm tra giao dịch tự động qua cổng SePay và thông báo cho bạn.`);
                  setIsTransferModalOpen(false);
                }}
              >
                Tôi đã chuyển khoản thành công
              </button>
              <button 
                type="button" 
                className={styles.btnBackToCart}
                onClick={() => setIsTransferModalOpen(false)}
              >
                Hủy & Chọn phương thức khác
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
