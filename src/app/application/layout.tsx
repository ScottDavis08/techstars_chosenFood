import Sidebar from '@/components/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main>
        {children}
      </main>
    </div>
  )
}