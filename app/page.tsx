'use client'

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4" style={{ backgroundImage: 'url(/common-page-background.webp)' }}>
      <main className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Agnos Health Assignment
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Real-Time Patient Input Form & Staff View System
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Real-time Synchronization Active
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                P
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Patient Portal</h2>
                <p className="text-gray-600">Fill out your information in real-time</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Complete patient information form
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Real-time validation and feedback
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Instant updates to staff dashboard
              </li>
            </ul>
            <Link 
              href="/patient"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
            >
              Enter Patient Form
            </Link>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                S
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Staff Dashboard</h2>
                <p className="text-gray-600">Monitor patient progress in real-time</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                View all active patients
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Real-time form data display
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Patient status indicators
              </li>
            </ul>
            <Link 
              href="/staff"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
            >
              Open Staff Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium text-gray-900">Real-time Sync</div>
              <div className="text-xs text-gray-600">WebSocket powered</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium text-gray-900">Responsive</div>
              <div className="text-xs text-gray-600">Mobile-first design</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm font-medium text-gray-900">Validated</div>
              <div className="text-xs text-gray-600">Form validation</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm font-medium text-gray-900">Cross-browser</div>
              <div className="text-xs text-gray-600">Universal support</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with Next.js, Socket.IO, and TailwindCSS</p>
          <p className="mt-1"> 2024 Agnos Health Assignment</p>
        </div>
      </main>
    </div>
  );
}
