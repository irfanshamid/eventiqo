import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  CheckCircle,
  Zap,
  Shield,
  Users,
  DollarSign,
  FileText,
  BookOpen,
  BarChart3,
  Briefcase,
  Instagram,
  Facebook,
  Mail,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-32">
            <Image
              src="/logo.png"
              alt="Eventiqo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild className="bg-[#1E88E5] hover:bg-[#1565C0]">
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-blue-50 to-white">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-blue-800 uppercase bg-blue-100 rounded-full">
            🚀 Operating System untuk Event Organizer Profesional
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-5xl mx-auto leading-tight">
            Kelola Event. Kontrol Profit. <br className="hidden md:block" />
            <span className="text-[#1E88E5]">
              Jalankan EO Seperti Perusahaan.
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistem kerja lengkap untuk mengendalikan bisnis event Anda. Dari
            budgeting, proposal, hingga laporan keuangan dalam satu platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* <Button
              size="lg"
              className="bg-[#1E88E5] hover:bg-[#1565C0] px-8 h-12 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/register">Mulai Sekarang</Link>
            </Button> */}
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-black px-8 h-12 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all border-none"
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Masalah EO Hari Ini
            </h2>
            <p className="text-gray-600">
              Apakah Anda sering mengalami hal-hal ini?
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              'Budget bocor tanpa sadar',
              'Proposal dan kontrak manual',
              'Timeline berantakan',
              'Vendor tidak terkontrol',
              'Tidak tahu event untung atau rugi',
            ].map((item, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-red-100 flex items-start gap-4"
              >
                <div className="mt-1 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                  <span className="text-red-600 font-bold text-lg">!</span>
                </div>
                <p className="text-gray-700 font-medium text-lg pt-0.5">
                  {item}
                </p>
              </div>
            ))}
            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:-translate-y-1">
              <p className="text-white font-bold text-xl text-center">
                Eventiqo hadir untuk mengubah itu ✨
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                🎯 Semua yang Dibutuhkan EO, Dalam Satu Sistem
              </h2>
              <p className="text-xl text-gray-600">
                Bukan hanya task manager. Ini sistem kerja lengkap.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm">
                  <DollarSign className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Budgeting & Profit Control
                </h3>
                <p className="text-xs font-bold text-green-600 mb-4 uppercase tracking-widest">
                  Kontrol Uang. Kontrol Bisnis.
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>{' '}
                    Budget planner per event
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>{' '}
                    Breakdown biaya per kategori
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>{' '}
                    Real cost tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>{' '}
                    Auto kalkulasi profit
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Tahu untung/rugi lebih
                    awal
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Proposal & Kontrak Otomatis
                </h3>
                <p className="text-xs font-bold text-blue-600 mb-4 uppercase tracking-widest">
                  Dari Deal ke Kontrak dalam 10 Menit
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>{' '}
                    Proposal generator
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>{' '}
                    Template kontrak wedding
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>{' '}
                    Auto isi data klien
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>{' '}
                    Export PDF
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-blue-700 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Lebih cepat closing
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  SOP & Template Library
                </h3>
                <p className="text-xs font-bold text-purple-600 mb-4 uppercase tracking-widest">
                  Standar Profesional
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>{' '}
                    SOP Meeting Klien
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>{' '}
                    SOP H-30 sampai Hari H
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>{' '}
                    Template Rundown
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>{' '}
                    Template Invoice & BAST
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-purple-700 flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Operasional terkontrol
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shadow-sm">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Dashboard Real-Time
                </h3>
                <p className="text-xs font-bold text-orange-600 mb-4 uppercase tracking-widest">
                  Lihat Semua dalam Sekejap
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>{' '}
                    Event aktif & status progress
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>{' '}
                    Ringkasan revenue & profit
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400"></div>{' '}
                    Laporan performa
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-orange-700 flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Keputusan lebih cepat
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Manajemen Tim
                </h3>
                <p className="text-xs font-bold text-indigo-600 mb-4 uppercase tracking-widest">
                  Kolaborasi Tanpa Batas
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>{' '}
                    Assign tugas & deadline
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>{' '}
                    Tracking progress
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>{' '}
                    Role management
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-indigo-700 flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Tim lebih disiplin
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-14 w-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 shadow-sm">
                  <Briefcase className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Vendor Management
                </h3>
                <p className="text-xs font-bold text-teal-600 mb-4 uppercase tracking-widest">
                  Database Terpusat
                </p>
                <ul className="space-y-3 text-gray-600 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>{' '}
                    Database vendor
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>{' '}
                    Riwayat penggunaan
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>{' '}
                    Analisa biaya rata-rata
                  </li>
                </ul>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <p className="text-sm font-semibold text-teal-700 flex items-center gap-2 bg-teal-50 px-3 py-2 rounded-lg w-fit">
                    <CheckCircle className="h-4 w-4" /> Mudah bandingkan harga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Flow */}
        <section className="py-24 px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              🔐 Semua Terhubung dalam Satu Sistem
            </h2>
            <div className="flex flex-wrap justify-center gap-4 items-center text-lg font-medium text-gray-600">
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Event</span>
              <span>→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Budget</span>
              <span>→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Proposal</span>
              <span>→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Kontrak</span>
              <span>→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Tugas</span>
              <span>→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-lg">Laporan</span>
            </div>
            <p className="mt-8 text-xl font-semibold text-[#1E88E5]">
              Satu alur kerja. Satu kontrol. Satu platform.
            </p>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-24 px-6 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">
              Siapa yang Cocok Menggunakan Eventiqo?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              {[
                'Wedding Organizer',
                'Corporate Event Organizer',
                'Agency Event',
                'EO skala kecil - menengah',
                'EO yang ingin naik kelas',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-6 bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              💎 Jalankan EO Anda Seperti Perusahaan
            </h2>
            <p className="text-xl text-blue-100">
              Berhenti kerja manual. Berhenti tebak-tebakan profit. <br />
              Mulai gunakan sistem yang benar.
            </p>
            <p className="text-sm opacity-80 pt-8">
              Eventiqo — Smart System for Smart Event Organizer.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <span className="text-xl font-bold tracking-tight text-[#1E88E5]">
              EVENTIQO
            </span>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Eventiqo. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/mudakayaraya.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-[#E1306C] transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="font-medium">Mudakayaraya.id</span>
              </a>
              <a
                href="https://facebook.com/mudakayaraya.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-[#1877F2] transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Mudakayaraya.id</span>
              </a>
            </div>
            <a
              href="mailto:info.indonesiapintar@gmail.com"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1E88E5] transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">
                info.indonesiapintar@gmail.com
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
