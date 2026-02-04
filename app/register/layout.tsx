import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - puls.pw',
  description: 'Create a new puls.pw account',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
