import Providers from '@/components/Providers';

export default function DoctorRootLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}