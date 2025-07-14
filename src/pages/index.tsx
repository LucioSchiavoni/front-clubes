import MouseMoveEffect from "@/components/mouse-move-effect"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const index = () => {
  return (
          <div className="flex items-center justify-center bg-background text-foreground antialiased">
        <MouseMoveEffect />
     <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-green-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-green-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
         <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Innovate Faster with
          <br />
          Amane Soft
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Empowering businesses with cutting-edge software solutions. From AI-driven analytics to seamless cloud
          integrations, we're shaping the future of technology.
        </p>
      </div>
      <div className="flex gap-4">
        <Button size="lg">
          Explore Solutions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg">
          Schedule a Demo
        </Button>
      </div>
    </section>
      </div>
    </div>
    </div>
  )
}

export default index