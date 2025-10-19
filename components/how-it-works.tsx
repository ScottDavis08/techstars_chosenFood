import { Card } from "@/components/ui/card"

const steps = [
  {
    number: "01",
    title: "Partner with foodbanks",
    description: "We work directly with foodbanks to understand what items are most commonly distributed.",
  },
  {
    number: "02",
    title: "Create tailored recipes",
    description: "Our team develops simple, nutritious recipes using those specific ingredients.",
  },
  {
    number: "03",
    title: "Share with communities",
    description: "Recipes are distributed through foodbanks, online, and community centers—free for everyone.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            A simple approach to solving a complex problem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 space-y-4 bg-card hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-primary/20">{step.number}</div>
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
