import { UserCircle } from "lucide-react"

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-charcoal-border bg-charcoal-light shrink-0">
      <h1 className="text-xl font-medium text-silver">{title}</h1>
      <div className="flex items-center gap-4">
        {/* User menu placeholder */}
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-charcoal hover:bg-charcoal-border transition-colors text-silver focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange">
          <UserCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
