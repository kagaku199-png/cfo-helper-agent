import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error_description ? (
              <p className="text-sm text-gray-600">{params.error_description}</p>
            ) : params?.error ? (
              <p className="text-sm text-gray-600">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-gray-600">An authentication error occurred. Please try again.</p>
            )}
            <div className="pt-4 space-y-2">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/signup">Create New Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
