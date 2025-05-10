import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Calendar,
  Upload,
  CheckCircle,
  Clock,
  BarChart,
  DrillIcon as Drone,
  CloudSun,
  Users,
} from "lucide-react"

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RoofClaim AI</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary">
              Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/application/login" className="text-sm font-medium hover:underline underline-offset-4">
              Log in
            </Link>
            <Link href="/application/dashboard" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Revolutionizing Roof Inspections with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline hail damage claims with drone technology and AI. Upload, view, and approve claims faster
                    and safer than ever before.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/application/dashboard" className="btn btn-primary btn-lg px-8">
                    Start Free Trial
                  </Link>
                  <button className="btn btn-outline btn-lg px-8">
                    Watch Demo
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=800"
                    alt="Drone inspecting roof damage"
                    width={800}
                    height={500}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Industry Challenge</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Traditional roof inspections are time-consuming, dangerous, and inefficient.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">High Volume</h3>
                <p className="text-center text-muted-foreground">
                  Adjusters handle 50-100 hail damage inspections monthly
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Safety Risks</h3>
                <p className="text-center text-muted-foreground">
                  1 in 4 adjusters report injuries from roof inspections annually
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CloudSun className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Seasonal Limitations</h3>
                <p className="text-center text-muted-foreground">
                  Winter conditions reduce inspection capacity by up to 60%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform transforms how you handle hail damage claims
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Drone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Drone Inspections</h3>
                <p className="text-muted-foreground">
                  Automated drone technology captures detailed roof imagery without climbing
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Uploads</h3>
                <p className="text-muted-foreground">Seamlessly upload inspection data and images for AI analysis</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Damage Assessment</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms detect and quantify hail damage with 95% accuracy
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Rapid Processing</h3>
                <p className="text-muted-foreground">
                  Complete claims in hours instead of days with automated workflows
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Year-Round Operation</h3>
                <p className="text-muted-foreground">Process claims regardless of weather conditions or season</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">One-Click Approval</h3>
                <p className="text-muted-foreground">
                  Streamlined approval process with digital signatures and documentation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  A simple three-step process that transforms roof inspections
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Schedule</h3>
                <p className="text-center text-muted-foreground">
                  Book a drone inspection through our platform in seconds
                </p>
                <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-primary md:block md:w-1/2"></div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Analyze</h3>
                <p className="text-center text-muted-foreground">
                  Our AI processes the imagery and generates a detailed damage report
                </p>
                <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-primary md:block"></div>
                <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-primary md:block"></div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Approve</h3>
                <p className="text-center text-muted-foreground">
                  Review and approve claims with one click, accelerating payouts
                </p>
                <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-primary md:block"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=800"
                    alt="Insurance adjuster using tablet with RoofClaim AI"
                    width={800}
                    height={500}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose RoofClaim AI?</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our platform delivers measurable improvements to your inspection process
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Increase Safety</p>
                      <p className="text-sm text-muted-foreground">Eliminate the need for dangerous roof climbs</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Process 3x More Claims</p>
                      <p className="text-sm text-muted-foreground">Handle more inspections with the same team size</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Year-Round Operations</p>
                      <p className="text-sm text-muted-foreground">
                        Continue processing claims even during winter months
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Reduce Claim Processing Time by 70%</p>
                      <p className="text-sm text-muted-foreground">Close claims in days instead of weeks</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Improve Accuracy</p>
                      <p className="text-sm text-muted-foreground">
                        AI detection is more consistent than human inspection
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Insurance professionals are transforming their workflow with RoofClaim AI
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Michael Johnson</h3>
                    <p className="text-sm text-muted-foreground">Senior Claims Adjuster</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I used to inspect 40 roofs per month. With RoofClaim AI, I can process over 120 without the physical
                  strain or safety concerns."
                </p>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Sarah Williams</h3>
                    <p className="text-sm text-muted-foreground">Insurance Agency Owner</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Winter used to mean a 60% drop in our inspection capacity. RoofClaim AI has eliminated seasonal
                  slowdowns completely."
                </p>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">David Chen</h3>
                    <p className="text-sm text-muted-foreground">Claims Department Manager</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Our claim approval rate has increased by 35% since implementing RoofClaim AI, with faster payouts and
                  higher customer satisfaction."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Roof Inspection Process?
                </h2>
                <p className="max-w-[900px] md:text-xl">
                  Join hundreds of insurance professionals already using RoofClaim AI
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard" className="btn btn-secondary btn-lg px-8">
                  Start Free Trial
                </Link>
                <button className="btn btn-outline btn-lg px-8 border-primary-foreground">
                  Schedule Demo
                </button>
              </div>
              <p className="text-sm">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">RoofClaim AI</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RoofClaim AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage