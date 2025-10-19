import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-balance">
            Get recipes delivered to your inbox
          </h2>
          <p className="text-xl text-primary-foreground/90 leading-relaxed text-pretty">
            Join our community and receive new recipes, cooking tips, and nutrition advice every week—completely free.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-foreground border-0 h-12 text-lg"
            />
            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-semibold">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-primary-foreground/70">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
