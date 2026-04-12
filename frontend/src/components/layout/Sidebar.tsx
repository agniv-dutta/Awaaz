import { NavLink } from "react-router-dom"
import { BarChart3, LayoutDashboard, Map, FileText, Users, Truck } from "lucide-react"
import { cn } from "../../utils/cn"

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Needs Map', path: '/map', icon: Map },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Volunteers', path: '/volunteers', icon: Users },
  { name: 'Dispatch', path: '/dispatch', icon: Truck },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="w-16 lg:w-60 h-screen shrink-0 border-r border-charcoal-border bg-charcoal-light flex flex-col items-center lg:items-stretch py-6 transition-all duration-300">
      <div className="flex items-center justify-center lg:justify-start px-2 lg:px-6 mb-8">
        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shrink-0">
          <span className="font-bold text-charcoal text-lg leading-none">A</span>
        </div>
        <span className="ml-3 font-bold text-xl text-silver tracking-tight hidden lg:block">
          Awaaz
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-2 lg:px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-center lg:justify-start px-3 py-3 rounded-lg transition-colors group",
                isActive 
                  ? "bg-[#FF9E0010] text-orange" 
                  : "text-silver-muted hover:bg-[#D9D9D908] hover:text-silver"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="ml-3 font-medium hidden lg:block">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
