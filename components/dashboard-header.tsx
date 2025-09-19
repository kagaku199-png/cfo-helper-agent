"use client"

import { Button } from "@/components/ui/button"
import { Settings, LogOut, User } from "lucide-react"
import { PdfExport } from "@/components/pdf-export"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Scenario } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  scenarios: Scenario[]
  selectedScenario: Scenario | null
  userEmail?: string
}

export function DashboardHeader({ scenarios, selectedScenario, userEmail }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CFO Helper Agent - India</h1>
            <p className="text-muted-foreground">Financial scenario planning and analysis for Indian businesses</p>
          </div>
          <div className="flex items-center gap-3">
            <PdfExport scenarios={scenarios} selectedScenario={selectedScenario} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {userEmail ? userEmail.split("@")[0] : "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="h-4 w-4 mr-2" />
                  {userEmail}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
