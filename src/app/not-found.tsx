import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="space-y-6 max-w-md p-8 bg-white rounded-xl shadow-lg border">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-gray-500">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button className="bg-[#1E88E5] hover:bg-[#1565C0]" asChild>
            <Link href="/dashboard/panel">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
