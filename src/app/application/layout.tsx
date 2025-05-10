import Header from '@/components/header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}