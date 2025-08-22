import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  ArrowRight,
  Star,
  Shield,
  Zap,
  MessageSquare,
  FileText,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TechForge
              </h1>
              <p className="text-xs text-gray-500">Client Request Management</p>
            </div>
          </div>
          <div className="space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="https://thecodeend.vercel.app/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 pb-20 md:pb-24 lg:pb-28 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge className="mb-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-100 transition-colors">
            Where Ideas Come to Life.
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Freelancers When You Need.
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Partners When You Stay.
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A focused platform that is built on trust and craft, we help you turn your tech needs into tailored applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="https://thecodeend.vercel.app/">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Start Managing Requests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 hover:bg-blue-50 bg-transparent"
              >
                Access Your Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Added stats section to fill space better */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-3xl font-bold text-indigo-600">98%</p>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
            <div className="hidden md:block bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* What This App Does */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What TechForge Does</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            TechForge is your complete solution for managing development projects from initial client request to final
            delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Client Request Submission</CardTitle>
              <CardDescription className="text-gray-600">
                Clients can easily submit detailed project requests with specifications, budget, timeline, and priority
                levels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Real-Time Progress Tracking</CardTitle>
              <CardDescription className="text-gray-600">
                Track project status in real-time with pending, in-progress, completed, and rejected states for full
                transparency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Role-Based Access Control</CardTitle>
              <CardDescription className="text-gray-600">
                Separate dashboards and permissions for clients, employees, and administrators with appropriate access
                levels.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white/70 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to manage your development projects efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Client Registers</h4>
              <p className="text-gray-600">Clients create an account and access their personalized dashboard</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Submit Request</h4>
              <p className="text-gray-600">Detailed project requirements with budget, timeline, and specifications</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Team Assignment</h4>
              <p className="text-gray-600">Admin assigns the project to the most suitable team member</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Track Progress</h4>
              <p className="text-gray-600">Real-time updates and communication throughout the development process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage development projects efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Secure & Reliable</CardTitle>
                  <CardDescription>Enterprise-grade security with role-based permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:from-green-200 group-hover:to-green-300 transition-all">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>Optimized performance for seamless user experience</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:from-purple-200 group-hover:to-purple-300 transition-all">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Clear Communication</CardTitle>
                  <CardDescription>Built-in messaging and comment system for projects</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle>Time Tracking</CardTitle>
                  <CardDescription>Monitor project timelines and delivery schedules</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Comprehensive insights and project analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl group-hover:from-red-200 group-hover:to-red-300 transition-all">
                  <CheckCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Quality Assurance</CardTitle>
                  <CardDescription>Built-in review and approval workflows</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Trusted by freelancers and development teams worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-blue-100">
                  "TechForge transformed how I manage client projects. The role-based access and real-time tracking have
                  made my freelance business so much more professional."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-blue-200">Freelance Developer</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-blue-100">
                  "As a client, I love being able to track my project's progress in real-time. The communication
                  features keep me informed every step of the way."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-blue-200">Startup Founder</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-blue-100">
                  "Our development team's productivity increased by 40% after implementing TechForge. The admin
                  dashboard gives us complete oversight of all projects."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold">Alex Rodriguez</p>
                  <p className="text-sm text-blue-200">Development Team Lead</p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Streamline Your Development Workflow?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of freelancers and development teams who trust TechForge to manage their client projects
            efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://thecodeend.vercel.app/">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 hover:bg-blue-50 bg-transparent"
              >
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TechForge
                </h4>
              </div>
              <p className="text-gray-600">
                Streamline your development workflow with our powerful client request management platform.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Product</h5>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Support</h5>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Company</h5>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 TechForge. All rights reserved. Built for freelancers and development teams.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
