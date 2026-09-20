import type { Metadata } from 'next';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'Profile | Metricores',
  description: 'View and manage your Metricores account profile.',
  keywords: ['profile', 'account', 'user settings'],
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
