import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - puls.pw',
  description: 'Sign in to your puls.pw account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
