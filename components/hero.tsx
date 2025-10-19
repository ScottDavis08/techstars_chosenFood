import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/warm-kitchen-scene-with-fresh-vegetables-and-ingre.jpg"
          alt="Fresh ingredients"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance">
            Transforming foodbank baskets into delicious meals
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto text-pretty">
            We create simple, nutritious recipes designed specifically for common foodbank items—helping families make
            the most of every ingredient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Browse Recipes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
