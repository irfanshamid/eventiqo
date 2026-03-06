'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Tutorial
        </h1>
        <div className="text-sm text-gray-500">
          Panduan Penggunaan Eventiqo
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Pengenalan Eventiqo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-sm border bg-black/5">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/qnVYx_14Flw"
                title="Eventiqo Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                Video ini menjelaskan fitur-fitur utama Eventiqo dan bagaimana
                cara menggunakannya untuk mengelola bisnis Event Organizer Anda.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Manajemen Event & Budgeting</li>
                <li>Pembuatan Proposal & Kontrak</li>
                <li>Kolaborasi Tim & Tugas</li>
                <li>Laporan Keuangan & Analitik</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
