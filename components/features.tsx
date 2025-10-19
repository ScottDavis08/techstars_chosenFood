import { Utensils, Heart, Users } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "Practical Recipes",
    description:
      "Every recipe uses ingredients commonly found in foodbank baskets—no special equipment or hard-to-find items required.",
  },
  {
    icon: Heart,
    title: "Nutrition Focused",
    description:
      "Designed by nutritionists to maximize health benefits and create balanced, satisfying meals for families.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built in partnership with foodbanks and the communities they serve to ensure real-world relevance.",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Recipes that make a difference</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            We believe everyone deserves access to delicious, nutritious meals—no matter their circumstances.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
