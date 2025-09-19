import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: scenarios, error: scenariosError } = await supabase
    .from("scenarios")
    .select("*")
    .order("created_at", { ascending: false })

  if (scenariosError) {
    console.error("Error fetching scenarios:", scenariosError)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardClient initialScenarios={scenarios || []} userEmail={data.user.email || ""} />
    </div>
  )
}
