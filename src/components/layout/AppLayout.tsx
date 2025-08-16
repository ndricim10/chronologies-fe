import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">{children}</main>
    </div>
  );
}
