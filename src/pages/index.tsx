import LoginForm from "@/components/forms/LoginForm"

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-950 via-amber-900 to-black text-amber-50">
    <div className="flex items-center justify-center flex-col gap-4">
    <h1 className="text-4xl font-bold text-white" >Social Club</h1>
    <LoginForm />
    </div>

    </div>
  )
}
