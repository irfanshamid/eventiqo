import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SOPPage() {
  const sops = await prisma.sOP.findMany({
    orderBy: { category: 'asc' },
  });

  // Group by category
  const groupedSops = sops.reduce((acc, sop) => {
    if (!acc[sop.category]) {
      acc[sop.category] = [];
    }
    acc[sop.category].push(sop);
    return acc;
  }, {} as Record<string, typeof sops>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">SOP & Templates</h1>
        <Button className="bg-[#1E88E5]">Upload New SOP</Button>
      </div>

      {Object.keys(groupedSops).length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No SOPs available. Upload one to get started.
        </div>
      ) : (
        Object.entries(groupedSops).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#1E88E5]" />
              {category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((sop) => (
                <Card key={sop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {sop.title}
                    </CardTitle>
                    <CardDescription>Updated: {new Date(sop.updatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {sop.content || "No description provided."}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
