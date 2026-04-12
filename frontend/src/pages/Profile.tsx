import { PageWrapper } from "../components/layout/PageWrapper"
import { Card } from "../components/ui/Card"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/Button"
import { Avatar } from "../components/ui/Avatar"

export function Profile() {
  const { user, logout } = useAuthStore()

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
        <h1 className="text-2xl font-medium text-silver">Profile</h1>
        <Card className="p-6 flex flex-col items-center gap-4">
          <Avatar initials={user?.name || "AD"} className="w-20 h-20 text-2xl" />
          <h2 className="text-xl text-silver">{user?.name}</h2>
          <span className="px-3 py-1 bg-charcoal-border rounded-full text-xs text-silver-muted uppercase font-medium tracking-wider">
            {user?.role}
          </span>
          <div className="w-full border-t border-charcoal-border mt-4 pt-4 flex flex-col gap-3">
             <div className="flex justify-between">
                <span className="text-silver-muted text-sm">Email</span>
                <span className="text-silver text-sm">{user?.email}</span>
             </div>
          </div>
          <Button variant="secondary" className="w-full mt-4" onClick={logout}>Sign Out</Button>
        </Card>
      </div>
    </PageWrapper>
  )
}
