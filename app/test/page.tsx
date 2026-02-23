'use client'

import { useState } from 'react'

export default function TestPage() {
  const [value, setValue] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Input</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Field
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type here to test..."
          />
          <p className="mt-2 text-sm text-gray-600">
            Current value: {value}
          </p>
        </div>

        <div className="mb-4">
          <a href="/patient" className="text-blue-600 hover:text-blue-800 underline">
            Back to Patient Form
          </a>
        </div>
      </div>
    </div>
  )
}
