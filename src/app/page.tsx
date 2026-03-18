'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redireccionando...</p>
      </div>
  )
}
