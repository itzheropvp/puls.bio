import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account - puls.pw',
  description: 'Manage your puls.pw account',
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
