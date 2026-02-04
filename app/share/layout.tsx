import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share - puls.pw',
  description: 'Share your puls.pw profile',
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
