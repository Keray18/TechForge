import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Smartphone, Globe, Star } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Web Applications",
    description: "Custom web solutions built with modern technologies",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications",
  },
  {
    icon: Code,
    title: "API Development",
    description: "Robust backend systems and API integrations",
  },
]

const reviews = [
  {
    name: "Sarah Johnson",
    company: "TechCorp Solutions",
    rating: 5,
    review:
      "Exceptional work on our e-commerce platform. The team delivered exactly what we needed on time and within budget.",
  },
  {
    name: "Michael Chen",
    company: "DataFlow Inc",
    rating: 5,
    review:
      "Professional service and excellent communication throughout the project. Highly recommend for any technical development needs.",
  },
  {
    name: "Emily Rodriguez",
    company: "StartupHub",
    rating: 5,
    review:
      "They transformed our idea into a beautiful, functional application. The attention to detail was impressive.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">TechForge</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-4 text-gray-600 border-gray-200">
            Professional Development Services
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            We Build Your
            <span className="block text-gray-600">Technical Vision</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From concept to deployment, we create custom applications that drive your business forward. Professional,
            reliable, and tailored to your needs.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We specialize in creating high-quality technical solutions for businesses of all sizes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <service.icon className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Reviews</h2>
            <p className="text-gray-600">What our clients say about working with us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{review.review}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join hundreds of satisfied clients who trust us with their technical needs
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-6 w-6 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">TechForge</span>
          </div>
          <p className="text-gray-500">© 2024 TechForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
