export function Impact() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-balance">Making every ingredient count</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Food insecurity affects millions of families. Our mission is to ensure that when someone receives a
              foodbank basket, they also receive the knowledge and confidence to turn those ingredients into nourishing
              meals.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              We partner with nutritionists, chefs, and community members to create recipes that are not just practical,
              but genuinely delicious—because everyone deserves to enjoy their food.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Recipes shared</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Partner foodbanks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15K+</div>
                <div className="text-sm text-muted-foreground">Families helped</div>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-2xl">
            <img
              src="/diverse-family-cooking-together-in-bright-kitchen-.jpg"
              alt="Family cooking together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
