import { BottomNav } from "@/components/bottom-nav";

export default function TechLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background animate-in fade-in-0 duration-500">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
