import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function SubscribePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
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
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Get Lifetime Access
              </h1>
              <p className="mt-4 text-gray-600">
                Join hundreds of event professionals who use Eventiqo to streamline their workflow.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E88E5] shrink-0 mt-0.5" />
                <span><span className="font-semibold">Unlimited Events</span> - Manage as many events as you want without limits.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E88E5] shrink-0 mt-0.5" />
                <span><span className="font-semibold">Vendor Database</span> - Keep track of all your vendors and their contracts.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E88E5] shrink-0 mt-0.5" />
                <span><span className="font-semibold">Budget Planner</span> - Real-time budget tracking and profit calculation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E88E5] shrink-0 mt-0.5" />
                <span><span className="font-semibold">Document Generator</span> - Create proposals and contracts instantly.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1E88E5] shrink-0 mt-0.5" />
                <span><span className="font-semibold">Team Access</span> - Collaborate with your team members.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 flex flex-col justify-center border-l">
            <div className="text-center">
              <span className="text-sm font-semibold text-[#1E88E5] uppercase tracking-wider">One-time payment</span>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">Rp 149.000</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Lifetime access, no monthly fees.</p>

              <Button size="lg" className="w-full mt-8 bg-[#1E88E5] hover:bg-[#1565C0] h-12 text-lg">
                Buy Now
              </Button>
              
              <p className="mt-4 text-xs text-gray-500">
                Secure payment via Midtrans / Xendit (Placeholder)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
