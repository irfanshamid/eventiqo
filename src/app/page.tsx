import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, Zap, Shield, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-24">
            <Image 
              src="/logo.png" 
              alt="Eventiqo" 
              fill 
              className="object-contain object-left"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
          <Button asChild className="bg-[#1E88E5] hover:bg-[#1565C0]">
            <Link href="/subscribe">Get Access</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-blue-50 to-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto">
            The All-in-One Platform for <span className="text-[#1E88E5]">Event Professionals</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your event management workflow from proposal to invoice. Manage vendors, budget, and tasks in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-[#1E88E5] hover:bg-[#1565C0]" asChild>
              <Link href="/subscribe">Buy Lifetime Access - Rp 149.000</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Member Login</Link>
            </Button>
          </div>
          <div className="mt-12 relative h-[400px] w-full max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden border bg-white">
            {/* Placeholder for dashboard screenshot */}
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
              Dashboard Preview Image
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-[#1E88E5]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Fast & Efficient</h3>
              <p className="text-gray-600">Create proposals and contracts in seconds using our templates system.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Data</h3>
              <p className="text-gray-600">Your client and vendor data is encrypted and safe with us.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Team Collaboration</h3>
              <p className="text-gray-600">Invite your team members and assign tasks seamlessly.</p>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="py-24 px-6 bg-gray-50 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to upgrade your workflow?</h2>
          <div className="inline-flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg border max-w-md mx-auto">
            <span className="text-sm font-semibold text-[#1E88E5] uppercase tracking-wider">Lifetime Deal</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">Rp 149rb</span>
              <span className="text-gray-500 line-through">Rp 1.5jt</span>
            </div>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Unlimited Events</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Unlimited Vendors</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Budget Management</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Lifetime Updates</span>
              </li>
            </ul>
            <Button className="w-full mt-8 bg-[#1E88E5] hover:bg-[#1565C0]" asChild>
              <Link href="/subscribe">Get Lifetime Access Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Eventiqo. All rights reserved.
      </footer>
    </div>
  );
}
