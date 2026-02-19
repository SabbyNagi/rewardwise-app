import React, { useState } from 'react'
import { Plane, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showVerdict, setShowVerdict] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-200 via-cyan-200 to-cyan-400 relative">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Plane className="w-6 h-6" />
            <span className="font-bold text-lg">RewardWise</span>
          </div>
          <button className="text-emerald-400 hover:text-emerald-300 font-medium">
            Log In
          </button>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center px-6 pt-16 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-2 drop-shadow-lg">
            We optimize your wallet.
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 text-center mb-6 drop-shadow-lg">
            You just travel.
          </h2>
          
          <p className="text-gray-200 text-center max-w-xl mb-8 text-lg">
            RewardWise sees your entire rewards portfolio and makes the smartest 
            booking decision for you — use points, pay cash, or save for a better 
            redemption down the road.
          </p>

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors mb-4">
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-gray-300 text-sm">
            Free to use. No credit card required.
          </p>
        </main>

        {/* Demo Card */}
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 w-full max-w-lg shadow-2xl">
            {/* Zoe Header */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Zoe, your wallet optimizer</span>
            </div>

            {/* Search Input */}
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-gray-300">"SFO to Tokyo, March, 2 people"</p>
            </div>

            {/* Verdict */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">THE VERDICT: Use Points</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">
                Transfer 70,000 Chase UR → United MileagePlus
              </p>

              {/* Price Comparison */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-gray-400 text-sm mb-2">
                  <span>Cash price</span>
                  <span className="text-white font-medium">$974 /person</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm mb-3">
                  <span>Points cost</span>
                  <span className="text-white font-medium">70,000 pts</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-3">
                  <span className="text-emerald-400 font-medium">You save</span>
                  <span className="text-emerald-400 font-bold text-xl">$624</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  1.4¢ per point — above the 1.0¢ baseline. We found the best move for your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-300 text-sm">
          <p>© 2026 RewardWise. One verdict, not 47 options.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
