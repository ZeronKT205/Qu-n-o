'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AuthClient.module.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthClient() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Image
          src="/images/login/login.png"
          alt="Levents Style"
          fill
          priority
          className={styles.leftPanelImage}
        />
      </div>

      {/* Right Panel - Auth Forms */}
      <div className={styles.rightPanel}>
        <div className={styles.topRightAction}>
          <span>{isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}</span>
          <button onClick={toggleForm}>
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>

        <div className={styles.flipContainer}>
          <div className={`${styles.flipper} ${!isLogin ? styles.isFlipped : ''}`}>
            <div className={styles.frontFace}>
              <LoginForm />
            </div>
            <div className={styles.backFace}>
              <RegisterForm />
            </div>
          </div>
        </div>

        {/* Footer Features */}
        <div className={styles.footerFeatures}>
          <div className={styles.feature}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <div className={styles.featureText}>
              <h4>Miễn phí giao hàng</h4>
              <p>Cho đơn từ 499K</p>
            </div>
          </div>

          <div className={styles.feature}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div className={styles.featureText}>
              <h4>Thanh toán an toàn</h4>
              <p>Bảo mật tuyệt đối</p>
            </div>
          </div>

          <div className={styles.feature}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
            <div className={styles.featureText}>
              <h4>Hỗ trợ 24/7</h4>
              <p>1900 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
