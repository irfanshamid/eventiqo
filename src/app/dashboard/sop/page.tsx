import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SOPPage() {
  const externalResources = [
    {
      category: "SOP & Guidelines",
      title: "Kumpulan SOP Event Organizer",
      description: "Akses lengkap ke Standar Operasional Prosedur untuk berbagai jenis event.",
      link: "https://drive.google.com/drive/folders/1eDnIpqzqoAT_UCP5uRA9eG1DSAVBmXCb?usp=drive_link",
      icon: BookOpen
    },
    {
      category: "Templates & Documents",
      title: "Template Dokumen Event",
      description: "Koleksi template proposal, kontrak, rundown, dan dokumen penting lainnya.",
      link: "https://drive.google.com/drive/folders/1MhjUSGWAXVRQXwVbKOyMqHA92TFWCdBa?usp=drive_link",
      icon: FileText
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">SOP & Templates</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {externalResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-[#1E88E5]">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1E88E5] bg-blue-50 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <CardTitle className="text-xl font-bold">{resource.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[#1E88E5] hover:bg-[#1565C0]" asChild>
                  <Link href={resource.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> 
                    Akses Google Drive
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
        <h3 className="text-yellow-800 font-semibold mb-2">💡 Info Penting</h3>
        <p className="text-yellow-700 text-sm">
          Dokumen-dokumen ini tersimpan di Google Drive eksternal. Pastikan Anda login ke akun Google Anda untuk mengaksesnya. 
          Jika Anda tidak memiliki akses, silakan hubungi administrator.
        </p>
      </div>
    </div>
  );
}
