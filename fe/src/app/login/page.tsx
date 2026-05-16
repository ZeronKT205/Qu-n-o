import { Metadata } from 'next';
import AuthClient from '@/components/sections/Auth/AuthClient';

export const metadata: Metadata = {
  title: 'Đăng Nhập / Đăng Ký | Levents Clone',
  description: 'Đăng nhập vào tài khoản Levents Clone để quản lý đơn hàng và nhận ưu đãi độc quyền.',
};

export default function LoginPage() {
  return (
    <main>
      <AuthClient />
    </main>
  );
}
