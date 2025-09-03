import Layout from '@/components/Layout.jsx'

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] grid place-items-center p-8">
        <div className="text-center reveal">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-muted-foreground">Page not found</p>
        </div>
      </div>
    </Layout>
  )
}
