import { useState, createContext, useContext, useEffect, useRef } from "react"
import { Plane, CheckCircle, ArrowRight, Sparkles, Eye, EyeOff, CreditCard, Plus, Search, Bell, User, LogOut, ChevronDown, ChevronUp, X, Send, Loader2, AlertCircle, TrendingUp, DollarSign, Award, MessageCircle, Home, Wallet, Settings, ArrowLeft, Mail, Lock, Check, AlertTriangle, Star, ThumbsUp, ThumbsDown, MapPin, Calendar, Clock, Shield, Zap, BarChart3, RefreshCw, ChevronRight, Globe, Heart, Map, FileText, Crown, Gift, Repeat, ArrowUpRight, Info, XCircle, Coffee, Mic, MicOff, Maximize2, Minimize2 } from "lucide-react"

// Search fill context — lets Zoe auto-fill the landing page search form
const SearchFillContext = createContext()

// ==================== ACCESSIBILITY ====================
const SkipLink = () => (
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-emerald-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
    Skip to main content
  </a>
)

const LiveRegion = ({ message }) => (
  <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{message}</div>
)

// Shared background component - EXACT original styling
const TropicalBackground = () => (
  <div 
    className="absolute inset-0 bg-cover bg-center opacity-30"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
    }}
  />
)

// Auth Context
const AuthContext = createContext()
const useAuth = () => useContext(AuthContext)

// A/B Test Context
const ABTestContext = createContext()
const useABTest = () => useContext(ABTestContext)

// Mock data
const AVAILABLE_CARDS = [
  { id: 'csr', name: 'Chase Sapphire Reserve', program: 'Chase Ultimate Rewards', logo: '💳' },
  { id: 'csp', name: 'Chase Sapphire Preferred', program: 'Chase Ultimate Rewards', logo: '💳' },
  { id: 'amex_gold', name: 'Amex Gold Card', program: 'Amex Membership Rewards', logo: '💳' },
  { id: 'amex_plat', name: 'Amex Platinum', program: 'Amex Membership Rewards', logo: '💳' },
  { id: 'citi_premier', name: 'Citi Premier', program: 'Citi ThankYou Points', logo: '💳' },
  { id: 'capital_one', name: 'Capital One Venture X', program: 'Capital One Miles', logo: '💳' },
  { id: 'united', name: 'United Explorer', program: 'United MileagePlus', logo: '✈️' },
  { id: 'delta', name: 'Delta SkyMiles Gold', program: 'Delta SkyMiles', logo: '✈️' },
  { id: 'marriott', name: 'Marriott Bonvoy Boundless', program: 'Marriott Bonvoy', logo: '🏨' },
  { id: 'hyatt', name: 'World of Hyatt', program: 'World of Hyatt', logo: '🏨' },
]

const useFocusOnMount = () => {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.focus() }, [])
  return ref
}

// ==================== APP ====================
function App() {
  // URL-based navigation
  const getPageFromURL = () => {
    const path = window.location.pathname.replace(/^\//, '') || 'landing'
    const validPages = ['landing','signup','login','forgot-password','wallet-setup','home','search','trips','circle','profile','concierge','concierge-standard','concierge-premium','health-check','transfer-optimizer','history','subscription','about']
    return validPages.includes(path) ? path : 'landing'
  }
  const [currentPage, setCurrentPage] = useState(getPageFromURL)
  const [user, setUser] = useState(null)
  const [userCards, setUserCards] = useState([])
  const [watchlist, setWatchlist] = useState([
    { id: 1, origin: 'SFO', destination: 'Tokyo', departDate: '2026-04-10', cabin: 'business', addedAt: '2 days ago', priceChange: -12, lastPrice: 132000, currentPrice: 120000 },
    { id: 2, origin: 'LAX', destination: 'London', departDate: '2026-06-15', cabin: 'first', addedAt: '5 days ago', priceChange: 8, lastPrice: 166000, currentPrice: 180000 },
    { id: 3, origin: 'JFK', destination: 'Paris', departDate: '2026-05-20', cabin: 'business', addedAt: '1 week ago', priceChange: -5, lastPrice: 115000, currentPrice: 110000 },
  ])
  const [showZoe, setShowZoe] = useState(false)
  const [zoeMessages, setZoeMessages] = useState([
    { role: 'assistant', content: `Hey Sarabjit! I'm Zoe, your RewardWise travel assistant. Tell me where you want to fly and I'll find the best deal.\n\nJust say a destination and I'll handle everything — or use the search form above.` }
  ])
  const [announcement, setAnnouncement] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [subscription, setSubscription] = useState('free')
  const [tripHistory, setTripHistory] = useState([])
  const [feedbackGiven, setFeedbackGiven] = useState([])
  const [conciergeRequests, setConciergeRequests] = useState([])

  // Search fill state — Zoe writes here, Landing page reads
  const [searchFill, setSearchFill] = useState(null)
  // Pending search — persists across page navigation (landing → signup → search)
  const [pendingSearch, setPendingSearch] = useState(null)
  // Trigger search — Zoe sets to true, dashboard/search reads and auto-clicks
  const [triggerSearch, setTriggerSearch] = useState(false)
  // A/B Test flags
  const [abTests] = useState(() => ({
    delayedSignup: Math.random() > 0.5,
    showAlternatives: Math.random() > 0.5,
  }))

  const authValue = {
    user, login: (email) => { setUser({ email, name: email.split('@')[0] }); setAnnouncement('Successfully logged in') },
    logout: () => { setUser(null); setCurrentPage('landing'); window.history.pushState({page:'landing'}, '', '/'); setUserCards([]); setAnnouncement('Successfully logged out') },
    isAuthenticated: !!user, subscription, setSubscription, searchCount,
    incrementSearch: () => {
      const newCount = searchCount + 1
      setSearchCount(newCount)
      if (subscription === 'free' && newCount >= 3 && !user) setShowUpsell(true)
    }
  }

  const navigate = (page) => { setCurrentPage(page); window.history.pushState({page}, '', '/' + (page === 'landing' ? '' : page)); setAnnouncement('Navigated to ' + page + ' page') }
  useEffect(() => {
    const onPop = () => setCurrentPage(getPageFromURL())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const renderPage = () => {
    // Auth-protected pages — redirect to landing if not logged in
    const protectedPages = ['home', 'search', 'trips', 'circle', 'profile', 'concierge', 'concierge-standard', 'concierge-premium', 'health-check', 'transfer-optimizer', 'history', 'subscription']
    if (protectedPages.includes(currentPage) && !user) {
      return <LandingPage navigate={navigate} />
    }

    switch(currentPage) {
      case 'landing': return <LandingPage navigate={navigate} />
      case 'signup': return <SignUpPage navigate={navigate} />
      case 'login': return <LoginPage navigate={navigate} />
      case 'forgot-password': return <ForgotPasswordPage navigate={navigate} />
      case 'wallet-setup': return <WalletSetupPage navigate={navigate} userCards={userCards} setUserCards={setUserCards} />
      case 'home': return <DashboardPage navigate={navigate} userCards={userCards} watchlist={watchlist} setShowZoe={setShowZoe} conciergeRequests={conciergeRequests} />
      case 'search': return <SearchPage navigate={navigate} userCards={userCards} setWatchlist={setWatchlist} />
      case 'trips': return <TripsPage navigate={navigate} />
      case 'circle': return <WatchlistPage navigate={navigate} watchlist={watchlist} setWatchlist={setWatchlist} />
      case 'profile': return <SettingsPage navigate={navigate} />
      case 'concierge': return <ConciergeHubPage navigate={navigate} setConciergeRequests={setConciergeRequests} />
      case 'concierge-standard': return <ConciergePage navigate={navigate} setConciergeRequests={setConciergeRequests} />
      case 'concierge-premium': return <ConciergePremiumPage navigate={navigate} setConciergeRequests={setConciergeRequests} />
      case 'health-check': return <HealthCheckPage navigate={navigate} userCards={userCards} />
      case 'transfer-optimizer': return <TransferOptimizerPage navigate={navigate} userCards={userCards} />
      case 'history': return <TripFeedbackPage navigate={navigate} feedbackGiven={feedbackGiven} setFeedbackGiven={setFeedbackGiven} />
      case 'subscription': return <SubscriptionPage navigate={navigate} />
      case 'about': return <AboutPage navigate={navigate} />
      default: return <LandingPage navigate={navigate} />
    }
  }

  return (
    <AuthContext.Provider value={authValue}>
      <ABTestContext.Provider value={abTests}>
        <SearchFillContext.Provider value={{ searchFill, setSearchFill, pendingSearch, setPendingSearch, triggerSearch, setTriggerSearch }}>
          <SkipLink />
          <LiveRegion message={announcement} />
          {renderPage()}
          {!['signup', 'login'].includes(currentPage) && <ZoeChat isOpen={showZoe} setIsOpen={setShowZoe} onFillSearch={setSearchFill} onTriggerSearch={() => { if (!user) { return } if (currentPage !== 'home') { setCurrentPage('home'); window.history.pushState({page:'home'}, '', '/home'); setTimeout(() => setTriggerSearch(true), 800) } else { setTriggerSearch(true) } }} currentPage={currentPage} messages={zoeMessages} setMessages={setZoeMessages} isAuthenticated={!!user} />}
          {showUpsell && <FreeUpsellModal onClose={() => setShowUpsell(false)} navigate={navigate} />}
        </SearchFillContext.Provider>
      </ABTestContext.Provider>
    </AuthContext.Provider>
  )
}

// ==================== BOOKING INTERSTITIAL ====================
function BookingInterstitial({ verdict, origin, destination, cabin, onClose, url }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900/98 backdrop-blur rounded-2xl max-w-md w-full shadow-2xl border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4"><h3 className="text-white font-bold text-lg">How to book this flight</h3><button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button></div>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <p className="text-emerald-400 font-semibold text-sm mb-2">✈️ {verdict?.airline} {verdict?.flightNumber}</p>
          <p className="text-gray-300 text-sm">{origin} → {destination} • {cabin}</p>
        </div>
        <div className="space-y-3 mb-5">
          <div className="flex gap-3"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-emerald-400 text-xs font-bold">1</span></div><div><p className="text-white text-sm font-medium">Transfer your points</p><p className="text-gray-400 text-xs">{verdict?.transferPath}</p></div></div>
          <div className="flex gap-3"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-emerald-400 text-xs font-bold">2</span></div><div><p className="text-white text-sm font-medium">Search on {verdict?.airline}'s website</p><p className="text-gray-400 text-xs">Select "{origin} → {destination}" and choose award/points booking</p></div></div>
          <div className="flex gap-3"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-emerald-400 text-xs font-bold">3</span></div><div><p className="text-white text-sm font-medium">Book flight {verdict?.flightNumber}</p><p className="text-gray-400 text-xs">{verdict?.pointsCost?.toLocaleString()} pts + ~${verdict?.taxes} taxes/fees per person</p></div></div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-2">Go to {verdict?.airline} <ArrowUpRight className="w-4 h-4" /></a>
        <button onClick={onClose} className="w-full text-gray-400 hover:text-white text-sm py-2">Close</button>
      </div>
    </div>
  )
}

// ==================== ROUTE DATABASE & VERDICT GENERATOR ====================
const ROUTE_DB = {
  tokyo: { code: 'NRT', airlines: [{ name: 'ANA', flight: 'NH105', path: 'Chase UR → Virgin Atlantic → ANA', hub: 'YVR', depart: '11:35 AM', arrive: '3:20 PM +1', duration: '11h 45m' }, { name: 'ANA', flight: 'NH7', path: 'Amex MR → ANA Direct', hub: null, depart: '5:10 PM', arrive: '9:45 PM +1', duration: '12h 35m' }] },
  paris: { code: 'CDG', airlines: [{ name: 'Air France', flight: 'AF65', path: 'Chase UR → Air France/KLM', hub: null, depart: '6:30 PM', arrive: '9:15 AM +1', duration: '9h 45m' }, { name: 'Delta', flight: 'DL264', path: 'Amex MR → Delta SkyMiles', hub: null, depart: '10:15 PM', arrive: '12:45 PM +1', duration: '8h 30m' }] },
  london: { code: 'LHR', airlines: [{ name: 'British Airways', flight: 'BA178', path: 'Chase UR → British Airways Avios', hub: null, depart: '9:40 PM', arrive: '10:15 AM +1', duration: '7h 35m' }, { name: 'Virgin Atlantic', flight: 'VS4', path: 'Chase UR → Virgin Atlantic', hub: null, depart: '8:00 PM', arrive: '8:30 AM +1', duration: '7h 30m' }] },
  bali: { code: 'DPS', airlines: [{ name: 'Singapore Airlines', flight: 'SQ35', path: 'Chase UR → Singapore KrisFlyer', hub: 'SIN', depart: '12:05 AM', arrive: '11:30 PM +1', duration: '20h 25m' }, { name: 'Cathay Pacific', flight: 'CX873', path: 'Amex MR → Cathay Pacific', hub: 'HKG', depart: '1:30 AM', arrive: '2:15 PM +1', duration: '18h 45m' }] },
  maldives: { code: 'MLE', airlines: [{ name: 'Emirates', flight: 'EK225', path: 'Chase UR → Emirates Skywards', hub: 'DXB', depart: '11:55 PM', arrive: '6:30 AM +2', duration: '22h 35m' }, { name: 'Singapore Airlines', flight: 'SQ423', path: 'Chase UR → Singapore KrisFlyer', hub: 'SIN', depart: '1:00 AM', arrive: '8:45 PM +1', duration: '19h 45m' }] },
  dubai: { code: 'DXB', airlines: [{ name: 'Emirates', flight: 'EK226', path: 'Chase UR → Emirates Skywards', hub: null, depart: '10:30 AM', arrive: '8:15 AM +1', duration: '14h 45m' }, { name: 'Etihad', flight: 'EY130', path: 'Amex MR → Etihad Guest', hub: 'AUH', depart: '2:50 PM', arrive: '1:30 PM +1', duration: '15h 40m' }] },
  rome: { code: 'FCO', airlines: [{ name: 'ITA Airways', flight: 'AZ609', path: 'Chase UR → United → ITA Airways', hub: null, depart: '5:45 PM', arrive: '9:30 AM +1', duration: '10h 45m' }, { name: 'Delta', flight: 'DL170', path: 'Amex MR → Delta SkyMiles', hub: null, depart: '7:00 PM', arrive: '11:10 AM +1', duration: '11h 10m' }] },
  sydney: { code: 'SYD', airlines: [{ name: 'Qantas', flight: 'QF12', path: 'Amex MR → Qantas Frequent Flyer', hub: null, depart: '10:30 PM', arrive: '7:10 AM +2', duration: '15h 40m' }, { name: 'United', flight: 'UA863', path: 'Chase UR → United MileagePlus', hub: null, depart: '11:15 PM', arrive: '8:45 AM +2', duration: '16h 30m' }] },
  hawaii: { code: 'HNL', airlines: [{ name: 'Hawaiian', flight: 'HA1', path: 'Amex MR → Hawaiian Airlines', hub: null, depart: '8:00 AM', arrive: '11:15 AM', duration: '5h 15m' }, { name: 'United', flight: 'UA1175', path: 'Chase UR → United MileagePlus', hub: null, depart: '9:30 AM', arrive: '12:50 PM', duration: '5h 20m' }] },
  cancun: { code: 'CUN', airlines: [{ name: 'United', flight: 'UA1287', path: 'Chase UR → United MileagePlus', hub: null, depart: '7:45 AM', arrive: '1:30 PM', duration: '4h 45m' }, { name: 'Delta', flight: 'DL953', path: 'Amex MR → Delta SkyMiles', hub: null, depart: '10:00 AM', arrive: '3:20 PM', duration: '4h 20m' }] },
}
const DOMESTIC_DESTS = ['miami', 'austin', 'denver', 'chicago', 'new york', 'nyc', 'los angeles', 'lax', 'seattle', 'boston', 'atlanta', 'dallas', 'portland', 'phoenix', 'las vegas', 'san diego', 'orlando']

function generateVerdict(origin, destination, cabin, abTests, tripType) {
  const dest = destination.toLowerCase()
  const isDomestic = DOMESTIC_DESTS.some(d => dest.includes(d) || origin.toLowerCase().includes(d))
  const isEconomy = cabin === 'economy' || cabin === 'premium'

  // Find matching route or use a generic international route
  let route = null
  for (const [key, val] of Object.entries(ROUTE_DB)) {
    if (dest.includes(key)) { route = val; break }
  }
  if (!route) route = { code: destination.toUpperCase().slice(0, 3), airlines: [{ name: 'United', flight: 'UA' + (100 + Math.floor(Math.random() * 900)), path: 'Chase UR → United MileagePlus', hub: null, depart: '9:15 AM', arrive: '4:30 PM +1', duration: '12h 15m' }, { name: 'Delta', flight: 'DL' + (100 + Math.floor(Math.random() * 900)), path: 'Amex MR → Delta SkyMiles', hub: null, depart: '2:30 PM', arrive: '8:45 AM +1', duration: '11h 15m' }] }

  if (isDomestic && isEconomy) {
    const al = route.airlines[0]
    const cashReturnFlight = tripType === 'roundtrip' ? { airline: al.name, flightNumber: al.name.slice(0,2).toUpperCase() + (200 + Math.floor(Math.random() * 800)), departTime: ['9:00 AM','11:30 AM','2:15 PM','4:45 PM'][Math.floor(Math.random()*4)], arriveTime: ['1:30 PM','4:45 PM','7:00 PM','9:15 PM'][Math.floor(Math.random()*4)], duration: al.duration, origin: route.code, destination: origin.toUpperCase() } : null
    const cashRtMult = tripType === 'roundtrip' ? 2 : 1
    const baseCash = 287 + Math.floor(Math.random() * 200)
    return { type: 'cash', cashPrice: baseCash * cashRtMult, pointsCost: (25000 + Math.floor(Math.random() * 20000)) * cashRtMult, cpp: +(0.8 + Math.random() * 0.5).toFixed(1), cppRating: 'below', transferPath: al.path, airline: al.name, flightNumber: al.flight, departTime: al.depart, arriveTime: al.arrive, duration: al.duration, confidence: 85 + Math.floor(Math.random() * 10), returnFlight: cashReturnFlight, isRoundTrip: tripType === 'roundtrip', reason: 'Domestic economy rarely exceeds 1.5 cpp. Your points are worth 3-5 cpp on international business/first class. Save them.', options: [
      { path: route.airlines[0].path, cost: 25000 + Math.floor(Math.random() * 15000), cpp: +(0.8 + Math.random() * 0.4).toFixed(1), rating: 'Below Average ❌' },
      { path: route.airlines[1]?.path || 'Amex MR → Delta', cost: 30000 + Math.floor(Math.random() * 20000), cpp: +(0.7 + Math.random() * 0.4).toFixed(1), rating: 'Below Average ❌' },
      { path: 'Pay Cash', cost: 287 + Math.floor(Math.random() * 200), cpp: null, rating: 'Best Option ✅' },
    ] }
  }

  const al = route.airlines[0]
  const al2 = route.airlines[1] || al
  const pts = cabin === 'business' ? 100000 + Math.floor(Math.random() * 40000) : cabin === 'first' ? 160000 + Math.floor(Math.random() * 40000) : 60000 + Math.floor(Math.random() * 20000)
  const cash = cabin === 'business' ? 3500 + Math.floor(Math.random() * 2000) : cabin === 'first' ? 7000 + Math.floor(Math.random() * 3000) : 800 + Math.floor(Math.random() * 400)
  const sav = cabin === 'business' ? 7000 + Math.floor(Math.random() * 3000) : cabin === 'first' ? 10000 + Math.floor(Math.random() * 4000) : 400 + Math.floor(Math.random() * 400)
  const c = cabin === 'business' ? +(3 + Math.random() * 1.5).toFixed(1) : cabin === 'first' ? +(5 + Math.random() * 2).toFixed(1) : +(1.2 + Math.random() * 0.5).toFixed(1)
  const routeLegs = al.hub ? `${origin.toUpperCase()} → ${al.hub} → ${route.code}` : `${origin.toUpperCase()} → ${route.code}`

  const returnFlight = tripType === 'roundtrip' ? { airline: al.name, flightNumber: al.name.slice(0,2).toUpperCase() + (200 + Math.floor(Math.random() * 800)), departTime: ['8:00 AM','10:30 AM','1:15 PM','3:45 PM','6:00 PM'][Math.floor(Math.random()*5)], arriveTime: ['2:30 PM +1','5:45 PM +1','8:00 PM +1','11:15 PM +1'][Math.floor(Math.random()*4)], duration: al.duration.replace(/\d+h/, (m) => (parseInt(m)+Math.floor(Math.random()*2))+'h'), origin: route.code, destination: origin.toUpperCase(), pointsCost: Math.round(pts * (0.9 + Math.random() * 0.2)) } : null
  const rtMult = tripType === 'roundtrip' ? 2 : 1
  const totalPts = tripType === 'roundtrip' ? pts + (returnFlight?.pointsCost || pts) : pts
  const totalCash = cash * rtMult
  const totalSav = sav * rtMult

  return { type: 'points', pointsCost: totalPts, pointsCostPerLeg: pts, cashPrice: totalCash, savings: totalSav, cpp: c, taxes: 60 + Math.floor(Math.random() * 80), seatsAvailable: 2 + Math.floor(Math.random() * 6), seatsTimestamp: new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}), transferPath: al.path, airline: al.name, flightNumber: al.flight, departTime: al.depart, arriveTime: al.arrive, duration: al.duration, confidence: 88 + Math.floor(Math.random() * 10), routeLegs, returnFlight, isRoundTrip: tripType === 'roundtrip', alternative: abTests.showAlternatives ? { pointsCost: Math.round(totalPts * 0.8), cashPrice: totalCash, savings: Math.round(totalSav * 0.75), cpp: +(c * 0.8).toFixed(1), taxes: 80 + Math.floor(Math.random() * 120), transferPath: al2.path, airline: al2.name, flightNumber: al2.flight, departTime: al2.depart, arriveTime: al2.arrive, duration: al2.duration, tradeoff: al2.hub ? 'Fewer stops, slightly more points' : 'Direct flight, different alliance', seatsAvailable: 1 + Math.floor(Math.random() * 3), seatsTimestamp: new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}), returnFlight, isRoundTrip: tripType === 'roundtrip' } : null }
}

// Helper: format date from YYYY-MM-DD to "Mar 15, 2026"
function formatDateNice(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ==================== CONFETTI CELEBRATION ====================
function ConfettiCelebration() {
  const [visible, setVisible] = useState(true)
  useEffect(() => { const t = setTimeout(() => setVisible(false), 6000); return () => clearTimeout(t) }, [])
  if (!visible) return null
  const pieces = []
  const emojis = ['🎉','✨','🎊','💫','⭐','🥳','🎆','🌟','💥','🎇','🎉','✨','🎊','💫','⭐']
  const colors = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316','#facc15','#22d3ee','#a3e635','#fb923c']
  for (let i = 0; i < 120; i++) {
    const isEmoji = i < 30
    const left = Math.random() * 100
    const delay = Math.random() * 2
    const duration = 2 + Math.random() * 2.5
    const size = isEmoji ? (12 + Math.random() * 16) : (5 + Math.random() * 10)
    const drift = (Math.random() - 0.5) * 300
    const spin = Math.random() * 1080
    pieces.push(
      isEmoji ? (
        <span key={i} style={{ position:'absolute', left:`${left}%`, top:'-20px', fontSize:`${size}px`, animation:`confetti-fall ${duration}s ease-in forwards`, animationDelay:`${delay}s`, opacity:0, '--drift': `${drift}px`, '--spin': `${spin}deg` }}>
          {emojis[i % emojis.length]}
        </span>
      ) : (
        <span key={i} style={{ position:'absolute', left:`${left}%`, top:'-20px', width:`${size}px`, height:`${size * (0.4 + Math.random() * 0.6)}px`, borderRadius: Math.random() > 0.5 ? '50%' : '1px', backgroundColor: colors[i % colors.length], animation:`confetti-fall ${duration}s ease-in forwards`, animationDelay:`${delay}s`, opacity:0, '--drift': `${drift}px`, '--spin': `${spin}deg` }} />
      )
    )
  }
  return <div className="confetti-container">{pieces}</div>
}

// ==================== SEARCH PROGRESS ====================
function SearchProgress({ origin, destination, cabin, travelers, programs }) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const steps = [
    { icon: '🔍', text: `Checking award availability for ${origin} → ${destination}...` },
    { icon: '🏦', text: `Scanning ${programs || 'Chase UR, Amex MR'} transfer partners...` },
    { icon: '✈️', text: `Analyzing routing options via partner airlines...` },
    { icon: '💰', text: `Comparing cash price vs points redemption value...` },
    { icon: '📊', text: `Calculating cents-per-point (cpp) across ${cabin || 'economy'} class...` },
    { icon: '💺', text: `Checking real-time seat availability for ${travelers || 1} traveler${(travelers||1) > 1 ? 's' : ''}...` },
    { icon: '🧠', text: `Running optimization engine...` },
    { icon: '✅', text: `Generating your personalized verdict...` },
  ]
  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => setVisibleSteps(i + 1), 350 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [])
  return (
    <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin flex-shrink-0" />
        <div><p className="text-white font-semibold">Optimizing your wallet...</p><p className="text-gray-400 text-xs">{origin} → {destination}</p></div>
      </div>
      <div className="space-y-2">
        {steps.slice(0, visibleSteps).map((step, i) => {
          const isLast = i === visibleSteps - 1
          const isDone = i < visibleSteps - 1
          return (
            <div key={i} className={`flex items-center gap-2.5 transition-all duration-300 ${isLast ? 'opacity-100' : 'opacity-70'}`}>
              <span className="text-sm w-5 text-center flex-shrink-0">{isDone ? '✓' : step.icon}</span>
              <span className={`text-sm ${isDone ? 'text-emerald-400' : 'text-gray-300'}`}>{step.text}</span>
              {isLast && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin flex-shrink-0 ml-auto" />}
            </div>
          )
        })}
      </div>
      {visibleSteps >= 5 && (
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (visibleSteps / steps.length) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SHARED TOP NAV ====================
function TopNav({ navigate, activeTab = 'home' }) {
  const [showAlerts, setShowAlerts] = useState(false)
  const alerts = [
    { id: 1, type: 'warning', icon: AlertTriangle, color: 'amber', title: '45K Marriott points expiring', desc: '90 days left — transfer or book to save ~$540', action: 'Fix this', page: 'health-check' },
    { id: 2, type: 'bonus', icon: Gift, color: 'emerald', title: 'Amex → BA: 30% transfer bonus', desc: '80,000 MR → 104,000 Avios. Ends Mar 15', action: 'View', page: 'transfer-optimizer' },
    { id: 3, type: 'deal', icon: TrendingUp, color: 'blue', title: 'Chase → Hyatt: 25% bonus', desc: '50,000 UR → 62,500 Hyatt points. Ends Mar 31', action: 'View', page: 'transfer-optimizer' },
    { id: 4, type: 'seat', icon: Plane, color: 'purple', title: 'SFO→NRT: 2 biz seats opened', desc: 'ANA NH105 · 85K pts/person · usually gone in 48hrs', action: 'Book', page: 'search' },
  ]
  return (
    <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 cursor-pointer" onClick={() => navigate('home')}><Plane className="w-5 h-5 text-blue-400" /><span className="font-bold text-white">RewardWise</span></div>
        <div className="flex items-center gap-1">
          {[
            { id: 'home', icon: Home, label: 'Home', page: 'home' },
            { id: 'trip', icon: Plane, label: 'Trips', page: 'trips' },
            { id: 'circle', icon: Globe, label: 'Circle', page: 'circle' },
            { id: 'history', icon: Clock, label: 'History', page: 'history' },
            { id: 'profile', icon: User, label: 'Profile', page: 'profile' },
            { id: 'about', icon: Info, label: 'About', page: 'about' },
          ].map(tab => (
            <button key={tab.id} onClick={() => navigate(tab.page)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          {/* Alerts bell */}
          <div className="relative">
            <button onClick={() => setShowAlerts(!showAlerts)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${showAlerts ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">{alerts.length}</span>
            </button>
            {showAlerts && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowAlerts(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/98 backdrop-blur border border-gray-700 rounded-xl shadow-2xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">Alerts</p>
                    <span className="bg-red-500/20 text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">{alerts.length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.map(alert => (
                      <button key={alert.id} onClick={() => { setShowAlerts(false); navigate(alert.page) }} className="w-full text-left px-4 py-3 hover:bg-gray-800/50 border-b border-gray-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <alert.icon className={`w-4 h-4 text-${alert.color}-400 flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium">{alert.title}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{alert.desc}</p>
                          </div>
                          <span className={`text-${alert.color}-400 text-xs font-medium whitespace-nowrap`}>{alert.action} →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-700">
                    <button onClick={() => { setShowAlerts(false); navigate('health-check') }} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium w-full text-center">View all alerts →</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// ==================== LANDING PAGE — FLOW 1B: NO SIGNUP REQUIRED ====================
const REWARD_PROGRAMS = [
  { id: 'chase_ur', name: 'Chase Ultimate Rewards', short: 'Chase UR' },
  { id: 'amex_mr', name: 'Amex Membership Rewards', short: 'Amex MR' },
  { id: 'united', name: 'United MileagePlus', short: 'United' },
  { id: 'delta', name: 'Delta SkyMiles', short: 'Delta' },
  { id: 'marriott', name: 'Marriott Bonvoy', short: 'Marriott' },
  { id: 'hilton', name: 'Hilton Honors', short: 'Hilton' },
]

function LandingPage({ navigate }) {
  const { isAuthenticated, login } = useAuth()
  const { searchFill, setPendingSearch } = useContext(SearchFillContext)
  const abTests = useABTest()
  const showInlineSearch = abTests.delayedSignup // A/B: true = search-first, false = signup-first
  // Search wizard state
  const [selectedPrograms, setSelectedPrograms] = useState([])
  const [balances, setBalances] = useState({})
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [dates, setDates] = useState('')
  const [cabin, setCabin] = useState('economy')
  const [travelers, setTravelers] = useState('2')
  const [searching, setSearching] = useState(false)
  const [teaserResult, setTeaserResult] = useState(null)
  // Signup gate state
  const [showSearch, setShowSearch] = useState(false)
  const [showSignupGate, setShowSignupGate] = useState(false)
  const [showTrySearch, setShowTrySearch] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState('')

  // Auto-fill from Zoe chat
  useEffect(() => {
    if (!searchFill) return
    if (searchFill.origin) setOrigin(searchFill.origin)
    if (searchFill.destination) setDestination(searchFill.destination)
    if (searchFill.dates) setDates(searchFill.dates)
    if (searchFill.cabin) setCabin(searchFill.cabin)
    if (searchFill.travelers) setTravelers(searchFill.travelers)
    if (searchFill.programs) {
      setSelectedPrograms(searchFill.programs)
      const bals = {}
      searchFill.programs.forEach(id => { bals[id] = searchFill.balances?.[id] || '' })
      if (searchFill.balances) setBalances(prev => ({ ...prev, ...searchFill.balances }))
    }
  }, [searchFill])

  const toggleProgram = (id) => {
    setSelectedPrograms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }
  const updateBalance = (id, val) => {
    setBalances(prev => ({ ...prev, [id]: val }))
  }

  const totalPoints = selectedPrograms.reduce((sum, id) => sum + (parseInt(balances[id]) || 0), 0)

  const handleSearch = () => {
    if (!origin || !destination) return
    setSearching(true)
    setTimeout(() => {
      const cashPrice = cabin === 'business' ? 4200 : cabin === 'first' ? 8500 : 387
      const savings = cabin === 'business' ? 6000 : cabin === 'first' ? 12000 : 0
      const cpp = cabin === 'business' ? 4.9 : cabin === 'first' ? 6.2 : 1.1
      const usePoints = cabin !== 'economy'
      setTeaserResult({ origin, destination, travelers: parseInt(travelers), cashPrice, savings: savings * parseInt(travelers), cpp, usePoints, totalCash: cashPrice * parseInt(travelers) })
      setSearching(false)
    }, 3500)
  }

  const handleSignupGate = (e) => {
    e.preventDefault()
    setSignupError('')
    if (!signupEmail || !/\S+@\S+\.\S+/.test(signupEmail)) { setSignupError('Please enter a valid email'); return }
    if (!signupPassword || signupPassword.length < 8) { setSignupError('Password must be at least 8 characters'); return }
    setSignupLoading(true)
    setTimeout(() => {
      // Save search data so it persists after login
      setPendingSearch({ origin, destination, dates, cabin, travelers, selectedPrograms, balances })
      login(signupEmail)
      navigate('search')
    }, 1000)
  }

  if (isAuthenticated && !teaserResult) {
    navigate('home')
    return null
  }
  // If authenticated with a teaser result, they just signed up — the App router will send them to search
  if (isAuthenticated && teaserResult) {
    navigate('search')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')"}} />
      <div className="relative z-10">
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2"><Plane className="w-6 h-6 text-blue-400" /><span className="font-bold text-lg text-white">RewardWise</span></div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('about')} className="text-gray-300 hover:text-white font-medium text-sm">About</button>
            <button onClick={() => { if (origin && destination) setPendingSearch({ origin, destination, dates, cabin, travelers, selectedPrograms, balances }); navigate('login') }} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">Log In</button>
          </div>
        </header>

        <main id="main-content" className="max-w-2xl mx-auto px-6 py-8">

          {/* HERO — only show when no teaser yet and not in search mode */}
          {!teaserResult && !searching && !showSignupGate && (
            <>
              {/* Big headline */}
              <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">We optimize your wallet.<br/><span className="text-emerald-400">You just travel.</span></h1>
                <p className="text-gray-300 text-lg max-w-md mx-auto">RewardWise sees your entire rewards portfolio and makes the smartest booking decision for you.</p>
              </div>

              {/* How it works — compact strip */}
              <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
                <div className="text-center bg-gray-900/50 backdrop-blur rounded-lg p-3"><div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 text-sm font-bold">1</span></div><h3 className="text-white font-medium text-sm mb-0.5">Add your cards</h3><p className="text-gray-400 text-xs">Link loyalty programs & balances</p></div>
                <div className="text-center bg-gray-900/50 backdrop-blur rounded-lg p-3"><div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 text-sm font-bold">2</span></div><h3 className="text-white font-medium text-sm mb-0.5">Search a trip</h3><p className="text-gray-400 text-xs">We analyze every path</p></div>
                <div className="text-center bg-gray-900/50 backdrop-blur rounded-lg p-3"><div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 text-sm font-bold">3</span></div><h3 className="text-white font-medium text-sm mb-0.5">Get a verdict</h3><p className="text-gray-400 text-xs">Points, cash, or save for later</p></div>
              </div>

              {/* Search wizard — only in delayed-signup (Flow 1B) variant */}
              {showInlineSearch ? (
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mb-8">
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-emerald-400" /><span className="text-white font-semibold">Try it free — no signup needed</span></div>
              {/* Step 1: Programs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3"><h2 className="text-white font-semibold">Which programs do you have?</h2><button onClick={() => { const allIds = REWARD_PROGRAMS.map(p => p.id); setSelectedPrograms(prev => prev.length === allIds.length ? [] : allIds) }} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">{selectedPrograms.length === REWARD_PROGRAMS.length ? 'Deselect all' : 'Select all'}</button></div>
                <div className="grid grid-cols-2 gap-2">
                  {REWARD_PROGRAMS.map(prog => {
                    const selected = selectedPrograms.includes(prog.id)
                    return (
                      <button key={prog.id} onClick={() => toggleProgram(prog.id)} className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${selected ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>{selected && <Check className="w-3 h-3 text-white" />}</div>
                        {prog.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Balances — only show for selected programs */}
              {selectedPrograms.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-white font-semibold mb-1">Enter your balances <span className="text-gray-500 font-normal text-sm">(approximate OK)</span></h2>
                  <div className="space-y-2 mt-3">
                    {selectedPrograms.map(id => {
                      const prog = REWARD_PROGRAMS.find(p => p.id === id)
                      const bal = parseInt(balances[id]) || 0
                      const rawValue = bal * 0.015
                      const value = rawValue >= 1 ? '$' + Math.round(rawValue).toLocaleString() : rawValue > 0 ? '$' + rawValue.toFixed(2) : null
                      return (
                        <div key={id} className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm w-24 flex-shrink-0">{prog.short}:</span>
                          <div className="relative flex-1">
                            <input type="number" value={balances[id] || ''} onChange={(e) => updateBalance(id, e.target.value)} placeholder="80,000" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">pts</span>
                          </div>
                          {value && <span className="text-emerald-400 text-xs font-medium flex-shrink-0 bg-emerald-500/10 px-2 py-1 rounded">~{value}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Trip Details */}
              <div className="mb-6">
                <h2 className="text-white font-semibold mb-3">Where do you want to go?</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-gray-400 text-xs mb-1">From</label><input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="SFO" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
                  <div><label className="block text-gray-400 text-xs mb-1">To</label><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Tokyo" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
                  <div><label className="block text-gray-400 text-xs mb-1">Dates</label><input value={dates} onChange={(e) => setDates(e.target.value)} placeholder="Mar 15-22" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-gray-400 text-xs mb-1">Class</label><select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"><option value="economy">Economy</option><option value="premium">Premium</option><option value="business">Business</option><option value="first">First</option></select></div>
                    <div><label className="block text-gray-400 text-xs mb-1">Travelers</label><select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button onClick={handleSearch} disabled={!origin || !destination} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                FIND MY SAVINGS <ArrowRight className="w-5 h-5" />
              </button>
            </div>
              ) : (
              /* Flow 1A: Signup-first variant — signup CTA is primary, but search funnel still available */
              <>
              {/* Primary CTA — signup first */}
              <div className="text-center mb-6">
                <button onClick={() => navigate('signup')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full inline-flex items-center gap-2 shadow-lg text-lg">Get Started — It's Free <ArrowRight className="w-5 h-5" /></button>
                <p className="text-gray-400 text-sm mt-3">No credit card required. Set up in 30 seconds.</p>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-4 mb-8 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" fill="currentColor" /> 4.9/5</span>
                <span>•</span>
                <span>12,000+ trips optimized</span>
                <span>•</span>
                <span>$2.4M saved</span>
              </div>

              {/* Secondary path — try a search first */}
              <div className="border-t border-gray-700/50 pt-6">
                <button onClick={() => setShowTrySearch(prev => !prev)} className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white text-sm transition-colors">
                  <Search className="w-4 h-4" /> Or try a search first — no signup needed <ChevronDown className={`w-4 h-4 transition-transform ${showTrySearch ? 'rotate-180' : ''}`} />
                </button>
                {showTrySearch && (
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mt-4">
                    <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-emerald-400" /><span className="text-white font-semibold text-sm">Quick search — see your savings instantly</span></div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div><label className="block text-gray-400 text-xs mb-1">From</label><input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="SFO" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
                      <div><label className="block text-gray-400 text-xs mb-1">To</label><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Tokyo" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
                      <div><label className="block text-gray-400 text-xs mb-1">Class</label><select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"><option value="economy">Economy</option><option value="premium">Premium</option><option value="business">Business</option><option value="first">First</option></select></div>
                      <div><label className="block text-gray-400 text-xs mb-1">Travelers</label><select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                    </div>
                    <button onClick={handleSearch} disabled={!origin || !destination} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      FIND MY SAVINGS <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              </>
              )}

              {showInlineSearch && (
              <div className="text-center mb-8">
                <button onClick={() => navigate('signup')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full inline-flex items-center gap-2 shadow-lg">Get Started — It's Free <ArrowRight className="w-5 h-5" /></button>
              </div>
              )}
            </>
          )}

          {/* Searching animation */}
          {searching && (
            <SearchProgress origin={origin} destination={destination} cabin={cabin} travelers={travelers} programs={selectedPrograms.map(id => REWARD_PROGRAMS.find(p => p.id === id)?.short).filter(Boolean).join(', ')} />
          )}

          {/* Teaser Results — shows savings but hides the verdict */}
          {teaserResult && !showSignupGate && (
            <div className="space-y-4">
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 text-emerald-400 mb-4"><Sparkles className="w-5 h-5" /><span className="font-semibold">🎉 Great news! We found savings for you.</span></div>
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <p className="text-gray-400 text-sm mb-1">YOUR TRIP</p>
                  <p className="text-white font-semibold text-lg">{teaserResult.origin} → {teaserResult.destination}</p>
                  <p className="text-gray-400 text-sm">{dates || 'Flexible dates'} • {cabin} • {teaserResult.travelers} traveler{teaserResult.travelers > 1 ? 's' : ''}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Cash price: <span className="text-white font-medium">${teaserResult.cashPrice.toLocaleString()} × {teaserResult.travelers} = ${teaserResult.totalCash.toLocaleString()}</span></p>
                </div>

                {teaserResult.usePoints ? (
                  <>
                    <p className="text-white font-medium mb-3">We found a better way:</p>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">ESTIMATED SAVINGS</p>
                      <p className="text-emerald-400 font-bold text-4xl mb-1">${teaserResult.savings.toLocaleString()}+</p>
                      <p className="text-gray-400 text-sm">Using your existing points</p>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">Optimal transfer path found</span></div>
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">{teaserResult.cpp} cpp value (most get 1 cpp)</span></div>
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">Availability confirmed</span></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">THE VERDICT</p>
                      <p className="text-amber-400 font-bold text-2xl mb-1">💵 PAY CASH</p>
                      <p className="text-gray-400 text-sm">Your points are worth more saved for premium trips</p>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">We checked all your programs</span></div>
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">Points value too low at {teaserResult.cpp} cpp</span></div>
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-gray-300 text-sm">Save points for 3-5 cpp on business/first class</span></div>
                    </div>
                  </>
                )}

                {/* The blurred verdict section */}
                <div className="relative mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 blur-sm select-none" aria-hidden="true">
                    <div className="flex items-center gap-2 mb-2"><div className="w-5 h-5 bg-emerald-400 rounded-full" /><span className="text-emerald-400 font-bold">THE VERDICT: ████████</span></div>
                    <p className="text-gray-300 text-sm">Transfer ██,000 ████ UR → ██████████ ███████</p>
                    <p className="text-gray-300 text-sm">Flight: ██123 ███ → ███ • 11h 45m</p>
                    <p className="text-gray-300 text-sm">Points: ███,000 × {teaserResult.travelers} = ███,000 pts + $██ fees</p>
                    <p className="text-gray-300 text-sm">Value: █.█¢ per point ✓✓✓</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-900/95 border border-gray-600 rounded-xl px-6 py-4 text-center shadow-xl">
                      <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-white font-semibold text-sm">Full verdict is ready</p>
                      <p className="text-gray-400 text-xs">Create a free account to unlock</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setShowSignupGate(true)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-3">
                  CREATE FREE ACCOUNT <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-gray-500 text-xs text-center">Just need your email to save your results and unlock the complete recommendation.</p>
              </div>
            </div>
          )}

          {/* Inline Signup Gate — appears after they click CREATE FREE ACCOUNT */}
          {showSignupGate && (
            <div className="space-y-4">
              {/* Repeat the teaser summary briefly */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0"><Sparkles className="w-6 h-6 text-emerald-400" /></div>
                <div>
                  <p className="text-white font-semibold">{teaserResult.origin} → {teaserResult.destination}</p>
                  {teaserResult.usePoints ? (
                    <p className="text-emerald-400 text-sm">Estimated savings: ${teaserResult.savings.toLocaleString()}+ ready to view</p>
                  ) : (
                    <p className="text-amber-400 text-sm">Verdict ready: Pay cash & save your points</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-1">Unlock your full verdict</h2>
                <p className="text-gray-400 text-sm mb-6">Free account — no credit card required</p>
                {signupError && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"><p className="text-red-300 text-sm">{signupError}</p></div>}
                <form onSubmit={handleSignupGate} className="space-y-4" noValidate>
                  <div><label className="block text-sm text-gray-300 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div></div>
                  <div><label className="block text-sm text-gray-300 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div></div>
                  <button type="submit" disabled={signupLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                    {signupLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : <>Unlock My Verdict <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
                <p className="mt-4 text-center text-gray-400 text-sm">Already have an account? <button onClick={() => { setPendingSearch({ origin, destination, dates, cabin, travelers, selectedPrograms, balances }); navigate('login') }} className="text-emerald-400 hover:text-emerald-300">Log In</button></p>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-8 text-gray-300 text-sm"><p>© 2026 RewardWise. One verdict, not 47 options.</p><button onClick={() => navigate('about')} className="text-emerald-400 hover:text-emerald-300 text-sm mt-2">About Us</button></footer>
      </div>
    </div>
  )
}

// ==================== SIGN UP PAGE ====================
function SignUpPage({ navigate }) {
  const { login } = useAuth()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Handle Google OAuth callback — parse access_token from URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      setGoogleLoading(true)
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.email) {
              window.history.replaceState(null, '', window.location.pathname)
              login(data.email)
              navigate('home')
            } else {
              setGoogleLoading(false)
            }
          })
          .catch(() => { setGoogleLoading(false) })
      }
    }
  }, [])

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { setErrors({ google: 'Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID.' }); return }
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin + '/signup',
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account'
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  const validate = () => { const errs = {}; if (!email) errs.email = 'Email address is required'; else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address'; if (!password) errs.password = 'Password is required'; else if (password.length < 8) errs.password = 'Password must be at least 8 characters long'; setErrors(errs); return Object.keys(errs).length === 0 }
  const handleSubmit = (e) => { e.preventDefault(); if (!validate()) return; setLoading(true); setTimeout(() => { login(email); navigate('wallet-setup') }, 1000) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 w-full max-w-md shadow-2xl">
          <button onClick={() => navigate('landing')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <div className="flex items-center gap-2 mb-6"><Plane className="w-6 h-6 text-blue-400" /><span className="font-bold text-lg text-white">RewardWise</span></div>
          <h1 id="main-content" className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400 mb-6">Start your journey to smarter travel rewards</p>
          {Object.keys(errors).length > 0 && (<div role="alert" className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"><ul className="text-red-300 text-sm list-disc list-inside">{Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}</ul></div>)}
          {googleLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-gray-300">Signing you in with Google...</p>
            </div>
          ) : (
            <>
              {errors.google && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"><p className="text-red-300 text-sm">{errors.google}</p></div>}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div><label htmlFor="signup-email" className="block text-sm text-gray-300 mb-1">Email <span className="text-red-400">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} /></div></div>
                <div><label htmlFor="signup-password" className="block text-sm text-gray-300 mb-1">Password <span className="text-red-400">*</span></label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className={`w-full bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}</button>
              </form>
              <div className="my-4 flex items-center gap-3"><div className="flex-1 h-px bg-gray-700" /><span className="text-gray-500 text-sm">or</span><div className="flex-1 h-px bg-gray-700" /></div>
              <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-lg transition-colors">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Sign in with Google
              </button>
              <p className="mt-4 text-center text-gray-400 text-sm">Already have an account? <button onClick={() => navigate('login')} className="text-emerald-400 hover:text-emerald-300">Log In</button></p>
            </>
          )}
          <div className="mt-3 pt-3 border-t border-gray-700/50 text-center">
            <p className="text-gray-500 text-xs mb-1">Not planning a trip yet?</p>
            <button onClick={() => { login(email || 'demo@rewardwise.com'); navigate('wallet-setup') }} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Just show me my wallet value →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== LOGIN PAGE ====================
function LoginPage({ navigate }) {
  const { login } = useAuth()
  const { pendingSearch } = useContext(SearchFillContext)
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => { e.preventDefault(); const errs = {}; if (!email) errs.email = 'Email address is required'; if (!password) errs.password = 'Password is required'; setErrors(errs); if (Object.keys(errs).length > 0) return; setLoading(true); setTimeout(() => { login(email); navigate(pendingSearch ? 'search' : 'dashboard') }, 1000) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 w-full max-w-md shadow-2xl">
          <button onClick={() => navigate('landing')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
          <div className="flex items-center gap-2 mb-6"><Plane className="w-6 h-6 text-blue-400" /><span className="font-bold text-lg text-white">RewardWise</span></div>
          <h1 id="main-content" className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-6">{pendingSearch ? 'Log in to see your search results' : 'Log in to access your rewards dashboard'}</p>
          {pendingSearch && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div><p className="text-white text-sm font-medium">{pendingSearch.origin} → {pendingSearch.destination} results waiting</p><p className="text-gray-400 text-xs">Log in to unlock your full verdict</p></div>
            </div>
          )}
          {Object.keys(errors).length > 0 && (<div role="alert" className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"><ul className="text-red-300 text-sm list-disc list-inside">{Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}</ul></div>)}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div><label htmlFor="login-email" className="block text-sm text-gray-300 mb-1">Email <span className="text-red-400">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} /></div></div>
            <div><label htmlFor="login-password" className="block text-sm text-gray-300 mb-1">Password <span className="text-red-400">*</span></label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={`w-full bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
            <div className="flex justify-end"><button type="button" onClick={() => navigate('forgot-password')} className="text-emerald-400 hover:text-emerald-300 text-sm">Forgot password?</button></div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</> : 'Log In'}</button>
          </form>
          <p className="mt-4 text-center text-gray-400 text-sm">Don't have an account? <button onClick={() => navigate('signup')} className="text-emerald-400 hover:text-emerald-300">Sign Up</button></p>
        </div>
      </div>
    </div>
  )
}

// ==================== FORGOT PASSWORD ====================
function ForgotPasswordPage({ navigate }) {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const handleSubmit = (e) => { e.preventDefault(); if (!email) { setError('Email address is required'); return }; if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return }; setLoading(true); setTimeout(() => { setSent(true); setLoading(false) }, 1000) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 w-full max-w-md shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8 text-emerald-400" /></div>
              <h1 id="main-content" className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-gray-400 mb-6">We sent a reset link to <strong className="text-white">{email}</strong></p>
              <button onClick={() => navigate('login')} className="text-emerald-400 hover:text-emerald-300">Back to Login</button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('login')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Login</button>
              <h1 id="main-content" className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
              <p className="text-gray-400 mb-6">Enter your email and we'll send you a reset link</p>
              {error && <div role="alert" className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div><label htmlFor="reset-email" className="block text-sm text-gray-300 mb-1">Email <span className="text-red-400">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="reset-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="name@example.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div></div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Reset Link'}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== WALLET SETUP ====================
function WalletSetupPage({ navigate, userCards, setUserCards }) {
  const [selectedCards, setSelectedCards] = useState([]); const [balances, setBalances] = useState({}); const [searchTerm, setSearchTerm] = useState(''); const [showPortfolio, setShowPortfolio] = useState(false)
  const filteredCards = AVAILABLE_CARDS.filter(card => card.name.toLowerCase().includes(searchTerm.toLowerCase()) || card.program.toLowerCase().includes(searchTerm.toLowerCase()))
  const toggleCard = (card) => { if (selectedCards.find(c => c.id === card.id)) { setSelectedCards(selectedCards.filter(c => c.id !== card.id)) } else if (selectedCards.length < 10) { setSelectedCards([...selectedCards, card]) } }
  const handleSave = () => { const cards = selectedCards.map(card => ({ ...card, balance: parseInt(balances[card.id]) || 0 })); setUserCards(cards); setShowPortfolio(true) }
  const savedCards = showPortfolio ? userCards : []
  const totalPoints = savedCards.reduce((sum, c) => sum + (c.balance || 0), 0)
  const totalValue = (totalPoints * 0.015).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <header className="flex justify-between items-center px-6 py-4"><div className="flex items-center gap-2"><Plane className="w-6 h-6 text-blue-400" /><span className="font-bold text-lg text-white">RewardWise</span></div><button onClick={() => navigate('home')} className="text-emerald-400 hover:text-emerald-300 text-sm">Skip for now →</button></header>
        <main id="main-content" className="max-w-4xl mx-auto px-6 py-8">
          {showPortfolio ? (
            /* PORTFOLIO VIEW — Flow 2 */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2"><h1 className="text-3xl font-bold text-white drop-shadow-lg">Unified Wallet</h1><span className="text-gray-400 text-sm">Last updated: Just now</span></div>

              {/* Balances Table */}
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">Your Portfolio</h2>
                <div className="space-y-3">
                  {savedCards.map(card => (
                    <div key={card.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-3"><span className="text-xl">{card.logo}</span><div><p className="text-white text-sm font-medium">{card.program}</p><p className="text-gray-500 text-xs">{card.name}</p></div></div>
                      <div className="text-right"><p className="text-white font-medium">{(card.balance || 0).toLocaleString()} pts</p><p className="text-emerald-400 text-xs">{(card.balance || 0) * 0.015 >= 1 ? '~$' + Math.round((card.balance || 0) * 0.015).toLocaleString() : ''}</p></div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mt-2">
                    <span className="text-emerald-400 font-semibold">Total</span>
                    <div className="text-right"><p className="text-white font-bold">{totalPoints.toLocaleString()} pts</p><p className="text-emerald-400 font-semibold">~${totalValue}</p></div>
                  </div>
                </div>
              </div>

              {/* Transfer Potential */}
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-3">Transfer Potential</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-gray-400 text-xs">Combined Buying Power</p><p className="text-white font-bold text-xl">~${(totalPoints * 0.035).toLocaleString()}</p><p className="text-gray-500 text-xs">at premium cabin rates</p></div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-gray-400 text-xs">Transfer Partners</p><p className="text-white font-bold text-xl">14</p><p className="text-gray-500 text-xs">airlines & hotels available</p></div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-3">Alerts</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"><AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /><div><p className="text-white text-sm font-medium">Expiring Points</p><p className="text-gray-400 text-xs">45,000 Marriott Bonvoy points expire in 90 days. Transfer or book to save ~$540.</p></div></div>
                  <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3"><Gift className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><div><p className="text-white text-sm font-medium">Transfer Bonus: Amex → British Airways</p><p className="text-gray-400 text-xs">30% bonus active until March 15. Your 80,000 MR → 104,000 Avios.</p></div></div>
                  <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"><TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" /><div><p className="text-white text-sm font-medium">Transfer Bonus: Chase → Hyatt</p><p className="text-gray-400 text-xs">25% bonus until March 31. 50,000 UR → 62,500 Hyatt points.</p></div></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => setShowPortfolio(false)} className="flex-1 border border-gray-600 text-white py-3 rounded-lg hover:bg-gray-800/50 flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Update Balances</button>
                <button onClick={() => navigate('search')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Run Search</button>
              </div>
            </div>
          ) : (
            /* CARD SELECTOR */
            <>
              <div className="text-center mb-8"><h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Select your Banks/Cards</h1><p className="text-gray-200">Add your credit cards and loyalty programs to get personalized verdicts</p></div>
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <div className="mb-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search cards or programs..." className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div></div>
                <div className="flex justify-between items-center mb-4"><p className="text-gray-400 text-sm">{selectedCards.length}/10 cards selected</p>{selectedCards.length >= 10 && <p className="text-amber-400 text-sm">Maximum cards reached</p>}</div>
                <div className="grid md:grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto">
                  {filteredCards.map(card => {
                    const isSelected = selectedCards.find(c => c.id === card.id)
                    const bal = parseInt(balances[card.id]) || 0
                    return (
                      <div key={card.id} onClick={() => toggleCard(card)} tabIndex="0" role="checkbox" aria-checked={!!isSelected} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(card) }}} className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3"><span className="text-xl">{card.logo}</span><div><p className="text-white text-sm font-medium">{card.name}</p><p className="text-gray-500 text-xs">{card.program}</p></div></div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                        </div>
                        {isSelected && (<div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}><input type="number" value={balances[card.id] || ''} onChange={(e) => setBalances({...balances, [card.id]: e.target.value})} placeholder="Points balance" className="flex-1 bg-gray-900 border border-gray-700 rounded py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />{bal > 0 && <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded flex-shrink-0">~${(bal * 0.015).toFixed(0)}</span>}</div>)}
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-3"><button onClick={() => navigate('home')} className="flex-1 border border-gray-600 text-white py-3 rounded-lg hover:bg-gray-800/50">Skip for now</button><button onClick={handleSave} disabled={selectedCards.length === 0} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg">Save & Continue</button></div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

// Helper: generate airline-specific award booking deeplinks
function buildBookingUrl(origin, destination, departDate, cabin, airline) {
  const al = (airline || 'ANA').toLowerCase()
  // ANA award search
  if (al.includes('ana')) return `https://www.ana.co.jp/en/us/book-plan/reservation/international/awardReservation/roundTrip/`
  // United award search
  if (al.includes('united')) return `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd`
  // Virgin Atlantic
  if (al.includes('virgin')) return `https://www.virginatlantic.com/book/flights`
  // Delta
  if (al.includes('delta')) return `https://www.delta.com/flight-search/book-a-flight`
  // British Airways
  if (al.includes('british') || al.includes('ba')) return `https://www.britishairways.com/travel/redeem/execclub/`
  // Fallback to Google Flights for cash bookings
  const o = encodeURIComponent(origin || 'SFO')
  const d = encodeURIComponent(destination || 'Tokyo')
  return `https://www.google.com/travel/flights?q=flights+from+${o}+to+${d}`
}
function buildCashBookingUrl(origin, destination) {
  return `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(origin||'')}+to+${encodeURIComponent(destination||'')}`
}

// Helper: parse date strings like "Mar 15-22", "2026-03-15", "March 15" into YYYY-MM-DD
function parseDates(dateStr) {
  if (!dateStr) return { depart: '', ret: '' }
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr + 'T12:00:00')
    const ret = new Date(d); ret.setDate(ret.getDate() + 7)
    return { depart: dateStr, ret: ret.toISOString().slice(0, 10) }
  }
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
  const lower = dateStr.toLowerCase()
  let month = null
  for (const [key, val] of Object.entries(months)) { if (lower.includes(key)) { month = val; break } }
  if (!month) return { depart: '', ret: '' }
  // Match "Mar 15-22" or "March 15 - 22"
  const rangeMatch = dateStr.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})/)
  if (rangeMatch) {
    const d1 = rangeMatch[1].padStart(2, '0'), d2 = rangeMatch[2].padStart(2, '0')
    return { depart: `2026-${month}-${d1}`, ret: `2026-${month}-${d2}` }
  }
  // Match "Mar 15"
  const singleMatch = dateStr.match(/(\d{1,2})/)
  if (singleMatch) {
    const d1 = singleMatch[1].padStart(2, '0')
    const dep = `2026-${month}-${d1}`
    const ret = new Date(dep + 'T12:00:00'); ret.setDate(ret.getDate() + 7)
    return { depart: dep, ret: ret.toISOString().slice(0, 10) }
  }
  return { depart: '', ret: '' }
}

// ==================== DASHBOARD ====================
function DashboardPage({ navigate, userCards, watchlist, setShowZoe, conciergeRequests }) {
  const { user, logout, incrementSearch } = useAuth()
  const { searchFill, triggerSearch, setTriggerSearch, setPendingSearch } = useContext(SearchFillContext)
  const abTests = useABTest()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // Search state — inline on dashboard
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [travelers, setTravelers] = useState('2')
  const [cabin, setCabin] = useState('economy')
  const [tripType, setTripType] = useState('roundtrip')
  const [searching, setSearching] = useState(false)
  const [verdict, setVerdict] = useState(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [showBooking, setShowBooking] = useState(false)

  // Auto-fill from Zoe
  useEffect(() => {
    if (!searchFill) return
    if (searchFill.origin) setOrigin(searchFill.origin)
    if (searchFill.destination) setDestination(searchFill.destination)
    if (searchFill.dates) {
      const { depart, ret } = parseDates(searchFill.dates)
      if (depart) setDepartDate(depart)
      if (ret) setReturnDate(ret)
    }
    if (searchFill.cabin) setCabin(searchFill.cabin)
    if (searchFill.travelers) setTravelers(searchFill.travelers)
  }, [searchFill])

  const [searchError, setSearchError] = useState('')
  const runSearch = () => {
    setSearchError('')
    if (!origin || !destination) { setSearchError('Please enter both origin and destination.'); return }
    if (origin.trim().length < 2) { setSearchError('Please enter a valid origin city or airport code.'); return }
    if (destination.trim().length < 2) { setSearchError('Please enter a valid destination city or airport code.'); return }
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) { setSearchError('Origin and destination cannot be the same.'); return }
    // Auto-fill dates if empty
    if (!departDate) { const d = new Date(); d.setDate(d.getDate() + 21); setDepartDate(d.toISOString().split('T')[0]) }
    if (!returnDate && tripType === 'roundtrip') { const d = new Date(); d.setDate(d.getDate() + 28); setReturnDate(d.toISOString().split('T')[0]) }
    incrementSearch()
    setSearching(true)
    setTimeout(() => {
      setVerdict(generateVerdict(origin, destination, cabin, abTests, tripType))
      setSearching(false)
      setConfettiKey(k => k + 1)
      setTimeout(() => { const el = document.getElementById('dashboard-verdict'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
    }, 3500)
  }

  // Zoe says "search" — auto-trigger
  useEffect(() => {
    if (triggerSearch && origin && destination) {
      setTriggerSearch(false)
      runSearch()
    } else if (triggerSearch) {
      setTriggerSearch(false)
    }
  }, [triggerSearch])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="home" />
        <main id="main-content" className="max-w-5xl mx-auto px-6 py-6">
          {/* Portfolio Hero — ONE big number */}
          {userCards.length > 0 && (() => {
            const totalPts = userCards.reduce((s, c) => s + (c.balance || 0), 0)
            const totalVal = Math.round(totalPts * 0.015)
            return (
              <div className="mb-6">
                <div className="bg-gray-900/80 backdrop-blur rounded-xl p-5 border border-gray-700/50 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-gray-400 text-sm">Your Points Portfolio</p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-white">${totalVal.toLocaleString()}</p>
                        <span className="text-emerald-400 text-sm font-medium flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +$120 this month</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{totalPts.toLocaleString()} points across {userCards.length} programs</p>
                    </div>
                    <button onClick={() => navigate('wallet-setup')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1"><Wallet className="w-4 h-4" /> View All</button>
                  </div>
                  {/* Mini card chips */}
                  <div className="flex flex-wrap gap-2">
                    {userCards.slice(0, 4).map(card => (
                      <div key={card.id} className="flex items-center gap-1.5 bg-gray-800/70 rounded-lg px-2.5 py-1.5 text-xs">
                        <span>{card.logo}</span>
                        <span className="text-gray-300">{card.program}</span>
                        <span className="text-white font-medium">{(card.balance || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    {userCards.length > 4 && <span className="text-gray-500 text-xs self-center">+{userCards.length - 4} more</span>}
                  </div>
                </div>
                {/* Single urgency alert */}
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1"><p className="text-white text-sm font-medium">45,000 Marriott points expire in 90 days</p><p className="text-gray-400 text-xs">Transfer or book to save ~$540 in value</p></div>
                  <button onClick={() => navigate('health-check')} className="text-amber-400 hover:text-amber-300 text-xs font-medium whitespace-nowrap">Fix this →</button>
                </div>
              </div>
            )
          })()}

          {/* Welcome — left aligned */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">{userCards.length > 0 ? 'Search for your next trip' : "Let's optimize your wallet."}</h1>
            <p className="text-gray-400 text-sm">Search a route or ask Zoe — we'll find the best decision for your rewards.</p>
          </div>

          {/* Search form — ALWAYS visible */}
          <div className="flex gap-2 mb-3">{['roundtrip', 'oneway'].map(type => (<button key={type} onClick={() => setTripType(type)} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${tripType === type ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{type === 'roundtrip' ? 'Round Trip' : 'One Way'}</button>))}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> FROM</label><input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="City or airport" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
            <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> TO</label><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City or airport" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
            <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> DEPART</label><input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm [color-scheme:dark]" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {tripType === 'roundtrip' ? (
              <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> RETURN</label><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm [color-scheme:dark]" /></div>
            ) : (
              <div />
            )}
            <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><User className="w-3 h-3" /> TRAVELERS</label><select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">{[1,2,3,4].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>)}</select></div>
            <div><label className="block text-emerald-400 text-xs mb-1 flex items-center gap-1"><Plane className="w-3 h-3" /> CABIN</label><select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"><option value="economy">Economy</option><option value="premium">Premium</option><option value="business">Business</option><option value="first">First</option></select></div>
          </div>
          <button onClick={() => { setVerdict(null); runSearch() }} disabled={searching} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-2">
            {searching ? <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</> : <><Search className="w-5 h-5" /> Search Flights</>}
          </button>
          {searchError && <p className="text-red-400 text-sm text-center mb-4">{searchError}</p>}

          {/* Searching — animated step-by-step */}
          {searching && (
            <SearchProgress origin={origin} destination={destination} cabin={cabin} travelers={travelers} />
          )}

          {/* Verdict — TWO CARDS side by side like v1 */}
          {verdict && !searching && (
            <>
              {/* Confetti celebration */}
              <div id="dashboard-verdict" />
              <ConfettiCelebration key={confettiKey} />

              {verdict.type === 'cash' ? (
                /* PAY CASH verdict */
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 px-5 py-4">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1"><Sparkles className="w-3 h-3" /> THE VERDICT</div>
                      <h2 className="text-2xl font-bold text-white">Pay Cash 💵</h2>
                      <p className="text-gray-300 text-sm">{origin} {verdict.isRoundTrip ? '↔' : '→'} {destination}{verdict.isRoundTrip ? ' • Round trip' : ''}</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-gray-300 text-sm mb-4">{verdict.reason}</p>
                      <div className="space-y-2 mb-4">
                        {verdict.options.map((opt, i) => (
                          <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${opt.cpp === null ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-gray-800/50'}`}>
                            <span className="text-white text-sm">{opt.path}</span>
                            <div className="text-right">
                              <span className="text-white text-sm font-medium">{opt.cpp ? opt.cost.toLocaleString() + ' pts' : '$' + opt.cost}</span>
                              <p className="text-xs">{opt.rating}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setVerdict(null)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg text-sm mb-2">Use Points Anyway</button>
                      <button onClick={() => setVerdict(null)} className="w-full border border-gray-600 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">New Search</button>
                    </div>
                  </div>
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 px-5 py-4 text-center">
                      <p className="text-emerald-300 text-xs font-semibold uppercase mb-1">RECOMMENDATION</p>
                      <h2 className="text-2xl font-bold text-white">${verdict.cashPrice}</h2>
                      <p className="text-gray-400 text-sm">Cash price per person</p>
                    </div>
                    <div className="px-5 py-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                        <p className="text-gray-500 text-xs uppercase mb-2">Outbound</p>
                        <div className="flex items-center gap-3 mb-2"><span className="text-lg">✈️</span><div><p className="text-white font-medium text-sm">{verdict.airline} {verdict.flightNumber}</p><p className="text-gray-400 text-xs">{cabin} · {travelers} passenger{parseInt(travelers) > 1 ? 's' : ''}</p></div></div>
                        {verdict.returnFlight && (<><div className="border-t border-gray-700 my-2" /><p className="text-gray-500 text-xs uppercase mb-2">Return</p><div className="flex items-center gap-3"><span className="text-lg">✈️</span><div><p className="text-white font-medium text-sm">{verdict.returnFlight.airline} {verdict.returnFlight.flightNumber}</p><p className="text-gray-400 text-xs">{verdict.returnFlight.origin} → {verdict.returnFlight.destination} · {verdict.returnFlight.duration}</p></div></div></>)}
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
                        <p className="text-emerald-400 text-sm font-medium mb-1">💡 Save your points</p>
                        <p className="text-gray-400 text-xs">Your {verdict.pointsCost.toLocaleString()} points are better used on international premium cabin flights where they're worth 3-5× more.</p>
                      </div>
                      <a href={`https://www.google.com/travel/flights?q=${origin}+to+${destination}`} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">Book Cash Flight <ArrowUpRight className="w-4 h-4" /></a>
                    </div>
                  </div>
                </div>
              ) : (
                /* USE POINTS verdict */
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 px-5 py-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1"><Sparkles className="w-3 h-3" /> THE VERDICT</div>
                      <p className="text-emerald-400 text-xs font-semibold uppercase mb-2">HIGH CONFIDENCE</p>
                      <h2 className="text-2xl font-bold text-white">Use Points</h2>
                      <p className="text-gray-300 text-sm">{verdict.routeLegs || (origin + ' → ' + destination)}{verdict.isRoundTrip ? ' • Round trip' : ''}</p>
                      <p className="text-gray-400 text-xs">{verdict.transferPath}</p>
                    </div>
                    <div className="px-5 py-4">
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div><p className="text-gray-400 text-xs">Points</p><p className="text-white font-bold text-lg">{verdict.pointsCost.toLocaleString()}</p></div>
                        <div><p className="text-gray-400 text-xs">Cash Price</p><p className="text-white font-bold text-lg">${verdict.cashPrice.toLocaleString()}</p></div>
                        <div><p className="text-gray-400 text-xs">You Save</p><p className="text-emerald-400 font-bold text-lg">~${(verdict.savings * parseInt(travelers)).toLocaleString()}</p></div>
                      </div>
                      {verdict.taxes && <p className="text-gray-500 text-xs mb-3">Taxes/fees: ${verdict.taxes} per person</p>}
                      {verdict.seatsAvailable && <p className="text-amber-400 text-xs mb-3">⚡ {verdict.seatsAvailable} seats left as of {verdict.seatsTimestamp}</p>}
                      <button onClick={() => { setPendingSearch({ origin, destination, dates: departDate, returnDate, cabin, travelers }); navigate('search') }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">View Details <ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-5 py-4 text-center">
                      <p className="text-purple-300 text-xs font-semibold uppercase mb-1">BOOKING SUMMARY</p>
                      <h2 className="text-2xl font-bold text-white">{origin} {verdict.isRoundTrip ? '↔' : '→'} {destination}</h2>
                      <p className="text-gray-400 text-sm">{formatDateNice(departDate) || 'Flexible'}{returnDate ? ' – ' + formatDateNice(returnDate) : ''}</p>
                    </div>
                    <div className="px-5 py-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                        <p className="text-gray-500 text-xs uppercase mb-2">Outbound</p>
                        <div className="flex items-center gap-3 mb-2"><span className="text-lg">✈️</span><div><p className="text-white font-medium text-sm">{verdict.airline} {verdict.flightNumber}</p><p className="text-gray-400 text-xs">{cabin} · {travelers} passenger{parseInt(travelers) > 1 ? 's' : ''}</p></div></div>
                        <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 bg-emerald-500/30 rounded-full flex items-center justify-center"><ArrowRight className="w-2 h-2 text-emerald-400" /></div><span className="text-gray-400">{verdict.transferPath}</span></div>
                        {verdict.returnFlight && (<><div className="border-t border-gray-700 my-2" /><p className="text-gray-500 text-xs uppercase mb-2">Return</p><div className="flex items-center gap-3"><span className="text-lg">✈️</span><div><p className="text-white font-medium text-sm">{verdict.returnFlight.airline} {verdict.returnFlight.flightNumber}</p><p className="text-gray-400 text-xs">{verdict.returnFlight.origin} → {verdict.returnFlight.destination} · {verdict.returnFlight.duration}</p></div></div></>)}
                      </div>
                      <div className="flex justify-between items-end mb-4">
                        <div><p className="text-gray-400 text-xs uppercase">Points Required</p><p className="text-white font-bold text-xl">{verdict.pointsCost.toLocaleString()} pts</p></div>
                        <div className="text-right"><p className="text-gray-400 text-xs uppercase">You Save</p><p className="text-emerald-400 font-bold text-xl">~${(verdict.savings * parseInt(travelers)).toLocaleString()}</p></div>
                      </div>
                      <button onClick={() => setShowBooking(true)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">Book This Flight <ArrowUpRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              )}

              {/* Alternative option */}
              {verdict.alternative && (
                <div className="bg-gray-900/70 backdrop-blur rounded-xl p-5 border border-gray-700/50 mt-4">
                  <div className="flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-gray-400" /><span className="text-gray-400 text-sm">Also considered{verdict.alternative.tradeoff ? ': ' + verdict.alternative.tradeoff : ''}</span></div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xl">✈️</span><div><p className="text-white text-sm">{verdict.alternative.airline} {verdict.alternative.flightNumber} • {verdict.alternative.duration}</p><p className="text-gray-500 text-xs">{verdict.alternative.transferPath}</p></div></div><div className="text-right"><p className="text-white text-sm font-medium">{verdict.alternative.pointsCost.toLocaleString()} pts</p><p className="text-gray-500 text-xs">{verdict.alternative.cpp}¢/pt value</p></div></div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom navigation */}
        
      </div>
      {showBooking && verdict && verdict.type === 'points' && (
        <BookingInterstitial verdict={verdict} origin={origin} destination={destination} cabin={cabin} url={buildBookingUrl(origin, destination, departDate, cabin, verdict.airline)} onClose={() => setShowBooking(false)} />
      )}
    </div>
  )
}

// ==================== SEARCH PAGE ====================
function SearchPage({ navigate, userCards, setWatchlist }) {
  const { incrementSearch } = useAuth()
  const abTests = useABTest()
  const { pendingSearch, setPendingSearch } = useContext(SearchFillContext)
  const [origin, setOrigin] = useState(''); const [destination, setDestination] = useState(''); const [departDate, setDepartDate] = useState(''); const [returnDate, setReturnDate] = useState(''); const [travelers, setTravelers] = useState('1'); const [cabin, setCabin] = useState('economy'); const [tripType, setTripType] = useState('roundtrip'); const [searching, setSearching] = useState(false); const [verdict, setVerdict] = useState(null); const [errors, setErrors] = useState({}); const [showVerdictPopup, setShowVerdictPopup] = useState(false); const [confettiKey, setConfettiKey] = useState(0); const [showBooking, setShowBooking] = useState(false)
  const fromPending = useRef(false)

  // Pre-fill from pendingSearch (after signup from landing page or View Details)
  useEffect(() => {
    if (pendingSearch) {
      fromPending.current = true
      if (pendingSearch.origin) setOrigin(pendingSearch.origin)
      if (pendingSearch.destination) setDestination(pendingSearch.destination)
      if (pendingSearch.dates) {
        // pendingSearch.dates might be YYYY-MM-DD (from dashboard) or text like "Mar 15-22" (from landing)
        if (/^\d{4}-\d{2}-\d{2}$/.test(pendingSearch.dates)) {
          setDepartDate(pendingSearch.dates)
        } else {
          // Text date from landing — set a default 3 weeks out
          const d = new Date(); d.setDate(d.getDate() + 21); setDepartDate(d.toISOString().split('T')[0])
        }
      }
      if (pendingSearch.returnDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(pendingSearch.returnDate)) {
          setReturnDate(pendingSearch.returnDate)
        } else {
          const d = new Date(); d.setDate(d.getDate() + 28); setReturnDate(d.toISOString().split('T')[0])
        }
      } else if (tripType === 'roundtrip') {
        const d = new Date(); d.setDate(d.getDate() + 28); setReturnDate(d.toISOString().split('T')[0])
      }
      if (pendingSearch.cabin) setCabin(pendingSearch.cabin)
      if (pendingSearch.travelers) setTravelers(pendingSearch.travelers)
      setTimeout(() => {
        const o = pendingSearch.origin || ''
        const d = pendingSearch.destination || ''
        if (o && d) {
          incrementSearch()
          setSearching(true)
          const cab = pendingSearch.cabin || 'economy'
          setTimeout(() => {
            const v = generateVerdict(o, d, cab, abTests, tripType)
            setVerdict(v)
            setSearching(false)
            setConfettiKey(k => k + 1)
            setTimeout(() => { const el = document.getElementById('verdict-results'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
          }, 3500)
        }
        setPendingSearch(null)
      }, 300)
    }
  }, [pendingSearch])

  const handleSearch = () => { const errs = {}; if (!origin || origin.trim().length < 2) errs.origin = 'Enter a valid origin'; if (!destination || destination.trim().length < 2) errs.destination = 'Enter a valid destination'; if (origin && destination && origin.trim().toLowerCase() === destination.trim().toLowerCase()) { errs.origin = 'Same as destination'; errs.destination = 'Same as origin' } setErrors(errs); if (Object.keys(errs).length > 0) return;
    // Auto-fill dates if empty
    if (!departDate) { const d = new Date(); d.setDate(d.getDate() + 21); setDepartDate(d.toISOString().split('T')[0]) }
    if (!returnDate && tripType === 'roundtrip') { const d = new Date(); d.setDate(d.getDate() + 28); setReturnDate(d.toISOString().split('T')[0]) }
    incrementSearch(); setSearching(true); setTimeout(() => {
    setVerdict(generateVerdict(origin, destination, cabin, abTests, tripType))
    setSearching(false)
    setConfettiKey(k => k + 1)
    setTimeout(() => { const el = document.getElementById('verdict-results'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
  }, 3500) }
  const addToWatchlist = () => { setWatchlist(prev => [...prev, { id: Date.now(), origin, destination, departDate, cabin }]) }
  const [selectedAlt, setSelectedAlt] = useState(false)
  const activeVerdict = selectedAlt && verdict?.alternative ? verdict.alternative : verdict
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="home" />
        <main id="main-content" className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Search Flights</h1>
          <p className="text-gray-200 mb-6">Find the best way to book your next trip</p>
          <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mb-6">
            <div className="flex gap-3 mb-4">{['roundtrip', 'oneway'].map(type => (<button key={type} onClick={() => setTripType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tripType === type ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{type === 'roundtrip' ? 'Round Trip' : 'One Way'}</button>))}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div><label className="block text-gray-400 text-sm mb-1">From *</label><input value={origin} onChange={(e) => { setOrigin(e.target.value); setErrors(prev => ({...prev, origin: ''})) }} placeholder="City or airport" className={`w-full bg-gray-800 border ${errors.origin ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} />{errors.origin && <p className="text-red-400 text-xs mt-1">{errors.origin}</p>}</div>
              <div><label className="block text-gray-400 text-sm mb-1">To *</label><input value={destination} onChange={(e) => { setDestination(e.target.value); setErrors(prev => ({...prev, destination: ''})) }} placeholder="City or airport" className={`w-full bg-gray-800 border ${errors.destination ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`} />{errors.destination && <p className="text-red-400 text-xs mt-1">{errors.destination}</p>}</div>
              <div><label className="block text-gray-400 text-sm mb-1">Departure</label><input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]" /></div>
              {tripType === 'roundtrip' && <div><label className="block text-gray-400 text-sm mb-1">Return</label><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]" /></div>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="block text-gray-400 text-sm mb-1">Travelers</label><select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">{[1,2,3,4].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>)}</select></div>
              <div><label className="block text-gray-400 text-sm mb-1">Cabin</label><select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="economy">Economy</option><option value="premium">Premium Economy</option><option value="business">Business</option><option value="first">First</option></select></div>
              <div className="flex items-end"><button onClick={handleSearch} disabled={searching} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">{searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}{searching ? 'Searching...' : 'Search'}</button></div>
            </div>
          </div>
          {searching && (<SearchProgress origin={origin} destination={destination} cabin={cabin} travelers={travelers} />)}

          {/* Verdict Popup Modal — appears first when coming from landing page */}
          {showVerdictPopup && verdict && !searching && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowVerdictPopup(false)}>
              <div className="bg-gray-900/98 backdrop-blur rounded-2xl max-w-lg w-full shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  {/* Confetti header */}
                  <div className="text-center mb-4">
                    <p className="text-4xl mb-2">🎉</p>
                    <h2 className="text-2xl font-bold text-white mb-1">Your verdict is ready!</h2>
                    <p className="text-emerald-400 font-medium">{origin} → {destination}</p>
                    <p className="text-gray-400 text-sm">{formatDateNice(departDate) || 'Flexible'} • {cabin} • {travelers} traveler{parseInt(travelers) > 1 ? 's' : ''}</p>
                  </div>

                  {activeVerdict?.type === 'cash' ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-4">
                      <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-amber-400" /><span className="text-amber-400 font-bold">THE VERDICT: Pay Cash 💵</span></div>
                      <p className="text-gray-300 text-sm mb-3">{activeVerdict.reason}</p>
                      <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3"><span className="text-gray-400">Cash price</span><span className="text-white font-bold text-xl">${activeVerdict.cashPrice}</span></div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-4">
                      <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400 font-bold">THE VERDICT: Use Points ✅</span></div>
                      <p className="text-gray-400 text-sm mb-3">{activeVerdict?.transferPath}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between bg-gray-800/50 rounded-lg p-3"><span className="text-gray-400 text-sm">Points</span><span className="text-white font-medium">{activeVerdict?.pointsCost?.toLocaleString()} pts</span></div>
                        <div className="flex justify-between bg-gray-800/50 rounded-lg p-3"><span className="text-gray-400 text-sm">Cash price</span><span className="text-white font-medium">${activeVerdict?.cashPrice?.toLocaleString()}</span></div>
                        {activeVerdict?.taxes && <div className="flex justify-between bg-gray-800/50 rounded-lg p-3"><span className="text-gray-400 text-sm">Taxes/fees</span><span className="text-white font-medium">${activeVerdict.taxes}</span></div>}
                        <div className="flex justify-between bg-emerald-500/20 rounded-lg p-3"><span className="text-emerald-400 font-medium">You save</span><span className="text-emerald-400 font-bold text-2xl">${((activeVerdict?.savings || 0) * parseInt(travelers)).toLocaleString()}</span></div>
                      </div>
                      {activeVerdict?.seatsAvailable && <p className="text-amber-400 text-xs mt-2">⚡ {activeVerdict.seatsAvailable} seats left as of {activeVerdict.seatsTimestamp}</p>}
                    </div>
                  )}

                  <div className="flex gap-3 mb-3">
                    <button onClick={() => setShowVerdictPopup(false)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg text-sm">View Full Details</button>
                    <button onClick={() => { setShowVerdictPopup(false); setShowBooking(true) }} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 text-sm">Book Now <ArrowUpRight className="w-4 h-4" /></button>
                    <button onClick={() => { addToWatchlist(); setShowVerdictPopup(false) }} className="px-4 border border-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 text-sm"><Star className="w-4 h-4" /> Save</button>
                  </div>
                  <button onClick={() => setShowVerdictPopup(false)} className="w-full text-gray-500 hover:text-gray-300 text-sm py-2">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Inline verdict — always visible below search form */}
          {verdict && !searching && (
            <>
              <div id="verdict-results" />
              <ConfettiCelebration key={'sp-' + confettiKey} />
              <div className="text-center mb-4">
                <p className="text-4xl mb-2">🎉</p>
                <h2 className="text-2xl font-bold text-white mb-1">Great news! We found savings.</h2>
                <p className="text-emerald-400 font-semibold text-lg">{origin} {tripType === 'roundtrip' ? '↔' : '→'} {destination}</p>
                <p className="text-gray-400 text-sm">{formatDateNice(departDate) || 'Flexible'}{returnDate ? ' – ' + formatDateNice(returnDate) : ''} • {cabin} class • {travelers} traveler{parseInt(travelers) > 1 ? 's' : ''}{tripType === 'roundtrip' ? ' • Round trip' : ''}</p>
              </div>

              {/* Tab toggle if alternative exists */}
              {verdict.alternative && (
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setSelectedAlt(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${!selectedAlt ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Recommended</button>
                  <button onClick={() => setSelectedAlt(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedAlt ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Alternative{verdict.alternative.tradeoff ? ': ' + verdict.alternative.tradeoff : ''}</button>
                </div>
              )}

              {/* Full verdict card — shows whichever is selected */}
              {activeVerdict?.type === 'cash' ? (
                <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mb-4">
                  <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center"><DollarSign className="w-7 h-7 text-amber-400" /></div><div><h2 className="text-xl font-bold text-amber-400">THE VERDICT: Pay Cash 💵</h2><p className="text-gray-400 text-sm">{activeVerdict.reason}</p></div></div>
                  <div className="space-y-2 mb-4">{activeVerdict.options?.map((opt, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${opt.cpp === null ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-gray-800/50'}`}><span className="text-white text-sm">{opt.path}</span><div className="text-right"><span className="text-white text-sm font-medium">{opt.cpp ? opt.cost.toLocaleString() + ' pts' : '$' + opt.cost}</span><p className="text-xs">{opt.rating}</p></div></div>
                  ))}</div>
                  <div className="flex gap-3"><a href={`https://www.google.com/travel/flights?q=${origin}+to+${destination}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">Book Cash Flight <ArrowUpRight className="w-4 h-4" /></a><button onClick={addToWatchlist} className="px-4 border border-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"><Star className="w-4 h-4" /> Save</button><button onClick={addToWatchlist} className="px-4 border border-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"><Bell className="w-5 h-5" /></button></div>
                </div>
              ) : (
                <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mb-4">
                  <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-7 h-7 text-emerald-400" /></div><div><h2 className="text-xl font-bold text-emerald-400">THE VERDICT: Use Points ✅</h2><p className="text-gray-400 text-sm">{activeVerdict?.transferPath}</p></div><div className="ml-auto bg-emerald-500/20 rounded-lg px-3 py-1"><span className="text-emerald-400 text-sm font-medium">{activeVerdict?.confidence || verdict.confidence}% match</span></div></div>
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <p className="text-gray-500 text-xs uppercase mb-3">Outbound</p>
                    <div className="flex justify-between items-center mb-3"><div className="flex items-center gap-3"><span className="text-2xl">✈️</span><div><p className="text-white font-medium">{activeVerdict?.airline} {activeVerdict?.flightNumber}</p><p className="text-gray-400 text-sm">{cabin} • {activeVerdict?.duration} • Nonstop</p></div></div><div className="text-right"><p className="text-white">{activeVerdict?.departTime} → {activeVerdict?.arriveTime}</p><p className="text-gray-400 text-sm">{origin} → {destination}</p></div></div>
                    {activeVerdict?.returnFlight && (<><div className="border-t border-gray-700 my-3" /><p className="text-gray-500 text-xs uppercase mb-3">Return</p><div className="flex justify-between items-center"><div className="flex items-center gap-3"><span className="text-2xl">✈️</span><div><p className="text-white font-medium">{activeVerdict.returnFlight.airline} {activeVerdict.returnFlight.flightNumber}</p><p className="text-gray-400 text-sm">{cabin} • {activeVerdict.returnFlight.duration} • Nonstop</p></div></div><div className="text-right"><p className="text-white">{activeVerdict.returnFlight.departTime} → {activeVerdict.returnFlight.arriveTime}</p><p className="text-gray-400 text-sm">{activeVerdict.returnFlight.origin} → {activeVerdict.returnFlight.destination}</p></div></div></>)}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-700"><div><p className="text-gray-400 text-sm">Points{activeVerdict?.isRoundTrip ? ' (RT)' : ''}</p><p className="text-white font-semibold">{activeVerdict?.pointsCost?.toLocaleString()} pts</p></div><div><p className="text-gray-400 text-sm">Cash Price{activeVerdict?.isRoundTrip ? ' (RT)' : ''}</p><p className="text-white font-semibold">${activeVerdict?.cashPrice?.toLocaleString()}</p></div><div><p className="text-gray-400 text-sm">Value</p><p className="text-emerald-400 font-semibold">{activeVerdict?.cpp}¢/pt</p></div></div>
                    {activeVerdict?.taxes && <p className="text-gray-500 text-xs mt-2">Taxes/fees: ${activeVerdict.taxes} per person{activeVerdict?.isRoundTrip ? ', each way' : ''}</p>}
                    {activeVerdict?.seatsAvailable && <p className="text-amber-400 text-xs mt-1">⚡ {activeVerdict.seatsAvailable} seats left as of {activeVerdict.seatsTimestamp}</p>}
                  </div>
                  <div className="flex justify-between items-center bg-emerald-500/20 rounded-lg p-4 mb-4"><div><p className="text-emerald-400 font-medium">You save</p><p className="text-gray-400 text-sm">vs. paying cash</p></div><p className="text-emerald-400 font-bold text-3xl">${((activeVerdict?.savings || 0) * parseInt(travelers)).toLocaleString()}</p></div>
                  <div className="flex gap-3"><button onClick={() => setShowBooking(true)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">Book on {activeVerdict?.airline} <ArrowUpRight className="w-4 h-4" /></button><button onClick={addToWatchlist} className="px-4 border border-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"><Star className="w-4 h-4" /> Save</button><button onClick={addToWatchlist} className="px-4 border border-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"><Bell className="w-5 h-5" /></button></div>
                </div>
              )}
            </>
          )}
        </main>
        
      </div>
      {showBooking && verdict && verdict.type === 'points' && (
        <BookingInterstitial verdict={verdict} origin={origin} destination={destination} cabin={cabin} url={buildBookingUrl(origin, destination, departDate, cabin, verdict.airline || activeVerdict?.airline)} onClose={() => setShowBooking(false)} />
      )}
    </div>
  )
}

// ==================== TRIPS (Past Trips) ====================
function TripsPage({ navigate }) {
  const pastTrips = [
    { id: 1, origin: 'SFO', destination: 'Tokyo', airline: 'ANA', flight: 'NH105', cabin: 'business', date: 'Jan 12, 2026', returnDate: 'Jan 19, 2026', verdict: 'points', pointsUsed: 120000, cashEquivalent: 8400, saved: 6180, program: 'Chase UR → Virgin Atlantic → ANA', rating: 5, status: 'completed' },
    { id: 2, origin: 'JFK', destination: 'London', airline: 'British Airways', flight: 'BA178', cabin: 'business', date: 'Nov 20, 2025', returnDate: 'Nov 27, 2025', verdict: 'points', pointsUsed: 85000, cashEquivalent: 5200, saved: 3900, program: 'Chase UR → British Airways', rating: 4, status: 'completed' },
    { id: 3, origin: 'SFO', destination: 'Honolulu', airline: 'United', flight: 'UA1523', cabin: 'economy', date: 'Sep 5, 2025', returnDate: 'Sep 12, 2025', verdict: 'cash', cashPaid: 487, pointsWouldCost: 35000, cppIfPoints: 0.9, rating: 4, status: 'completed' },
    { id: 4, origin: 'LAX', destination: 'Paris', airline: 'Air France', flight: 'AF65', cabin: 'business', date: 'Jul 8, 2025', returnDate: 'Jul 18, 2025', verdict: 'points', pointsUsed: 110000, cashEquivalent: 6800, saved: 5100, program: 'Amex MR → Air France KLM', rating: 5, status: 'completed' },
    { id: 5, origin: 'SFO', destination: 'Singapore', airline: 'Singapore Airlines', flight: 'SQ31', cabin: 'first', date: 'Apr 15, 2025', returnDate: 'Apr 25, 2025', verdict: 'points', pointsUsed: 185000, cashEquivalent: 14200, saved: 11800, program: 'Chase UR → Singapore KrisFlyer', rating: 5, status: 'completed' },
  ]
  const totalSaved = pastTrips.reduce((sum, t) => sum + (t.saved || 0), 0)
  const totalTrips = pastTrips.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="trip" />
        <main id="main-content" className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">My Trips</h1>
              <p className="text-gray-200">Your travel history & savings</p>
            </div>
            <button onClick={() => navigate('search')} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"><Search className="w-4 h-4" /> New Search</button>
          </div>

          {/* Savings summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-900/80 backdrop-blur rounded-xl p-4 text-center border border-gray-700/50">
              <p className="text-3xl font-bold text-emerald-400">${totalSaved.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Total saved</p>
            </div>
            <div className="bg-gray-900/80 backdrop-blur rounded-xl p-4 text-center border border-gray-700/50">
              <p className="text-3xl font-bold text-white">{totalTrips}</p>
              <p className="text-gray-400 text-sm">Trips optimized</p>
            </div>
            <div className="bg-gray-900/80 backdrop-blur rounded-xl p-4 text-center border border-gray-700/50">
              <p className="text-3xl font-bold text-white">${Math.round(totalSaved / totalTrips).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Avg per trip</p>
            </div>
          </div>

          {/* Trip list */}
          <div className="space-y-4">
            {pastTrips.map(trip => (
              <div key={trip.id} className="bg-gray-900/80 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trip.verdict === 'points' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      <Plane className={`w-5 h-5 ${trip.verdict === 'points' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{trip.origin} ↔ {trip.destination}</p>
                      <p className="text-gray-400 text-sm">{trip.airline} {trip.flight} · {trip.cabin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${trip.verdict === 'points' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {trip.verdict === 'points' ? 'Used Points' : 'Paid Cash'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{trip.date} – {trip.returnDate}</span>
                </div>

                {trip.verdict === 'points' ? (
                  <div className="grid grid-cols-3 gap-3 bg-gray-800/50 rounded-lg p-3">
                    <div>
                      <p className="text-gray-400 text-xs">Points used</p>
                      <p className="text-white font-medium text-sm">{trip.pointsUsed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Cash equivalent</p>
                      <p className="text-white font-medium text-sm">${trip.cashEquivalent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">You saved</p>
                      <p className="text-emerald-400 font-bold text-sm">${trip.saved.toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 bg-gray-800/50 rounded-lg p-3">
                    <div>
                      <p className="text-gray-400 text-xs">Cash paid</p>
                      <p className="text-white font-medium text-sm">${trip.cashPaid}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Points would cost</p>
                      <p className="text-white font-medium text-sm">{trip.pointsWouldCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Verdict</p>
                      <p className="text-amber-400 font-medium text-sm">Cash was better</p>
                    </div>
                  </div>
                )}

                {trip.program && <p className="text-gray-500 text-xs mt-2">Transfer path: {trip.program}</p>}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center gap-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= trip.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />)}</div>
                  <button onClick={() => navigate('history')} className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">Rate this trip <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// ==================== WATCHLIST ====================
function WatchlistPage({ navigate, watchlist, setWatchlist }) {
  const removeItem = (id) => setWatchlist(watchlist.filter(item => item.id !== id))
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="circle" />
        <main id="main-content" className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6"><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Watchlist</h1><p className="text-gray-200">Get notified when award availability opens</p></div><button onClick={() => navigate('search')} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Add Trip</button></div>
          <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
            {watchlist.length === 0 ? (
              <div className="text-center py-8"><Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" /><h2 className="text-lg font-semibold text-white mb-2">No trips being watched</h2><p className="text-gray-400 mb-4">Add trips to get notified when award space opens</p><button onClick={() => navigate('search')} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg">Search for Flights</button></div>
            ) : (
              <>
              <div className="space-y-3">{watchlist.map(item => (<div key={item.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-amber-400" /></div><div><p className="text-white font-medium">{item.origin} → {item.destination}</p><p className="text-gray-400 text-sm">{formatDateNice(item.departDate) || 'Flexible dates'} • {item.cabin}{item.addedAt ? ` • Added ${item.addedAt}` : ''}</p></div></div><span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">Watching</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                  <div className="bg-gray-900/50 rounded p-2"><span className="text-gray-500">Current</span><p className="text-white font-medium">{item.currentPrice ? item.currentPrice.toLocaleString() + ' pts' : 'Checking...'}</p></div>
                  <div className="bg-gray-900/50 rounded p-2"><span className="text-gray-500">Trend</span><p className={item.priceChange < 0 ? 'text-emerald-400 font-medium' : item.priceChange > 0 ? 'text-red-400 font-medium' : 'text-gray-400'}>{item.priceChange < 0 ? '↓ ' + Math.abs(item.priceChange) + '% cheaper' : item.priceChange > 0 ? '↑ ' + item.priceChange + '% higher' : 'Stable'}</p></div>
                  <div className="bg-gray-900/50 rounded p-2"><span className="text-gray-500">Status</span><p className="text-amber-400">Checking daily</p></div>
                  <div className="bg-gray-900/50 rounded p-2"><span className="text-gray-500">Best window</span><p className="text-white">60-90 days out</p></div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 border border-gray-600 text-white py-1.5 rounded text-xs hover:bg-gray-800">Edit Watch</button>
                  <button className="flex-1 border border-gray-600 text-gray-400 py-1.5 rounded text-xs hover:bg-gray-800">Pause Alerts</button>
                  <button onClick={() => removeItem(item.id)} className="px-3 border border-red-500/30 text-red-400 py-1.5 rounded text-xs hover:bg-red-500/10"><X className="w-3 h-3" /></button>
                </div>
              </div>))}</div>

              {/* Simulated alert notification */}
              {watchlist.length > 0 && (
                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><Bell className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm font-semibold">🔔 Award Alert!</span></div>
                  <p className="text-white text-sm mb-1">{watchlist[0].origin} → {watchlist[0].destination} — 2 business class seats just opened!</p>
                  <p className="text-gray-400 text-xs mb-3">ANA NH105 • 85,000 pts/person • ⚡ These seats typically disappear in 24-48 hrs</p>
                  <div className="flex gap-2"><button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-2 px-4 rounded-lg font-medium">Book Now</button><button className="border border-gray-600 text-white text-xs py-2 px-3 rounded-lg">Snooze 24hr</button><button className="text-gray-500 text-xs py-2 px-3">Dismiss</button></div>
                </div>
              )}
              </>
            )}
          </div>
        </main>
        
      </div>
    </div>
  )
}

// ==================== PROFILE (was Settings) ====================
function SettingsPage({ navigate }) {
  const { user, logout, subscription } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Profile</h1>
          <div className="space-y-4">
            {/* User info */}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center"><User className="w-7 h-7 text-emerald-400" /></div>
                <div><p className="text-white font-semibold">{user?.email || 'User'}</p><p className="text-gray-400 text-sm capitalize">{subscription || 'Free'} Plan</p></div>
              </div>
              <button onClick={() => navigate('subscription')} className="w-full bg-gray-800/50 hover:bg-gray-800 text-emerald-400 py-2.5 rounded-lg text-sm font-medium border border-gray-700">Manage Subscription</button>
            </div>

            {/* Tools grid */}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Tools</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Wallet, label: 'My Wallet', desc: 'Manage cards & balances', page: 'wallet-setup', color: 'emerald' },
                  { icon: BarChart3, label: 'Health Check', desc: 'Portfolio review', page: 'health-check', color: 'blue' },
                  { icon: Map, label: 'Transfer Paths', desc: 'Point optimizer', page: 'transfer-optimizer', color: 'cyan' },
                  { icon: Coffee, label: 'Concierge', desc: 'Flight booking · $39', page: 'concierge', color: 'amber' },
                  { icon: Crown, label: 'Premium Concierge', desc: 'White-glove · $199', page: 'concierge', color: 'purple' },
                  { icon: Star, label: 'Trip Feedback', desc: 'Rate your trips', page: 'history', color: 'pink' },
                ].map((tool, i) => (
                  <button key={i} onClick={() => navigate(tool.page)} className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-3 text-left transition-all border border-gray-700/50">
                    <tool.icon className={`w-5 h-5 text-${tool.color}-400 mb-2`} />
                    <p className="text-white text-sm font-medium">{tool.label}</p>
                    <p className="text-gray-500 text-xs">{tool.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
              <div className="space-y-3">{['Email alerts for watchlist', 'Weekly portfolio summary', 'Deal alerts', 'Points expiry warnings'].map((item, i) => (<div key={i} className="flex items-center justify-between"><span className="text-gray-300 text-sm">{item}</span><input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500" /></div>))}</div>
            </div>

            <button onClick={logout} className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 rounded-xl border border-red-500/30 flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> Log Out</button>
          </div>
        </main>
        
      </div>
    </div>
  )
}

// ==================== CONCIERGE HUB ====================
function ConciergeHubPage({ navigate, setConciergeRequests }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Concierge Booking Service</h1>
            <p className="text-gray-300">Let our experts handle the complex stuff. You just tell us where.</p>
          </div>

          {/* Side-by-side: Premium LEFT, Standard RIGHT */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* PREMIUM — LEFT (anchor high, F-pattern first) */}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl border border-purple-500/30 relative">
              <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Most Popular</div>
              <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-6 py-5">
                <Crown className="w-8 h-8 text-purple-400 mb-2" />
                <h2 className="text-xl font-bold text-white">Premium Concierge</h2>
                <p className="text-gray-300 text-sm mt-1">White-glove, end-to-end trip planning</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">$199</span>
                  <span className="text-gray-400 text-sm">per trip</span>
                </div>
                <div className="space-y-2.5 mb-6">
                  {[
                    'Full itinerary: flights + hotels + transfers',
                    'Business & First class award optimization',
                    'Hotel loyalty point optimization',
                    'Airport lounge access coordination',
                    'Restaurant & experience reservations',
                    'Dedicated agent via WhatsApp/email',
                    '24hr turnaround, unlimited revisions',
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /><span className="text-gray-300 text-sm">{f}</span></div>
                  ))}
                </div>
                <button onClick={() => navigate('concierge-premium')} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><Crown className="w-5 h-5" /> Get Premium</button>
                <p className="text-gray-500 text-xs text-center mt-2">Avg savings: $2,400+ per trip</p>
              </div>
            </div>

            {/* STANDARD — RIGHT */}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-6 py-5">
                <Coffee className="w-8 h-8 text-amber-400 mb-2" />
                <h2 className="text-xl font-bold text-white">Standard Concierge</h2>
                <p className="text-gray-300 text-sm mt-1">Expert flight booking optimization</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">$39</span>
                  <span className="text-gray-400 text-sm">per trip</span>
                </div>
                <div className="space-y-2.5 mb-6">
                  {[
                    'Optimal flight award redemption',
                    'Points transfer path optimization',
                    'Economy & Premium Economy focus',
                    'Email support',
                    '24-48hr turnaround',
                    '1 round of revisions',
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span className="text-gray-300 text-sm">{f}</span></div>
                  ))}
                  <div className="h-6" /> {/* spacer to align buttons */}
                </div>
                <button onClick={() => navigate('concierge-standard')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><Coffee className="w-5 h-5" /> Get Standard</button>
                <p className="text-gray-500 text-xs text-center mt-2">Avg savings: $800+ per trip</p>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
            <p className="text-gray-400 text-sm">"Saved us $3,200 on our anniversary trip to Tokyo. Worth every penny." — Sarah K.</p>
          </div>
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 6: CONCIERGE (DOMESTIC) ====================
function ConciergePage({ navigate, setConciergeRequests }) {
  const [step, setStep] = useState(1); const [form, setForm] = useState({ destination: '', dates: '', flexibility: 'flexible', travelers: '2', budget: '', preferences: '', cabin: 'economy' }); const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(false)
  const handleSubmit = () => { setLoading(true); setTimeout(() => { setConciergeRequests(prev => [...prev, { ...form, type: 'standard', status: 'pending', date: 'Just now', id: Date.now() }]); setSubmitted(true); setLoading(false) }, 1500) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center"><Coffee className="w-6 h-6 text-amber-400" /></div><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Concierge</h1><p className="text-gray-200">Let us handle the booking. You just tell us where.</p></div></div>
          {submitted ? (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
              <p className="text-gray-400 mb-2">We're working on your {form.destination} trip.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left space-y-2">
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Order #</span><span className="text-white text-sm font-mono">RW-2026-{String(Date.now()).slice(-5)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Tier</span><span className="text-white text-sm">Standard Concierge</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Price</span><span className="text-emerald-400 text-sm font-medium">$39</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Turnaround</span><span className="text-white text-sm">24-48 hours</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Status</span><span className="text-amber-400 text-sm">⏳ Researching...</span></div>
              </div>
              <p className="text-gray-500 text-sm mb-4">You'll receive The Verdict via email within 48 hours.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"><div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm font-medium">What happens next</span></div><div className="space-y-2 text-gray-300 text-sm"><p>→ Our AI analyzes your wallet for the best redemption</p><p>→ We check award availability across all partner airlines</p><p>→ You receive a single recommended booking with alternatives</p></div></div>
              <button onClick={() => navigate('home')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg w-full mb-2">View Status</button>
              <div className="flex gap-2"><button className="flex-1 border border-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-800">Add Notes</button><button className="flex-1 border border-red-500/30 text-red-400 py-2 rounded-lg text-sm hover:bg-red-500/10">Cancel Request</button></div>
            </div>
          ) : (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">{[1, 2].map(s => (<React.Fragment key={s}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{s}</div>{s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-gray-700'}`} />}</React.Fragment>))}</div>
              {step === 1 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-4">Trip Details</h2>
                  <div><label className="block text-gray-400 text-sm mb-1">Where do you want to go? *</label><input value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} placeholder="e.g., Miami, Austin, Denver" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div className="grid grid-cols-2 gap-3"><div><label className="block text-gray-400 text-sm mb-1">Travel Dates</label><input value={form.dates} onChange={(e) => setForm({...form, dates: e.target.value})} placeholder="e.g., March 15-20" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div><div><label className="block text-gray-400 text-sm mb-1">Flexibility</label><select value={form.flexibility} onChange={(e) => setForm({...form, flexibility: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="exact">Exact dates</option><option value="flexible">± 3 days</option><option value="very-flexible">± 1 week</option></select></div></div>
                  <div className="grid grid-cols-2 gap-3"><div><label className="block text-gray-400 text-sm mb-1">Travelers</label><select value={form.travelers} onChange={(e) => setForm({...form, travelers: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select></div><div><label className="block text-gray-400 text-sm mb-1">Cabin</label><select value={form.cabin} onChange={(e) => setForm({...form, cabin: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="economy">Economy</option><option value="premium">Premium Economy</option><option value="business">Business</option><option value="first">First</option></select></div></div>
                  <button onClick={() => setStep(2)} disabled={!form.destination} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg mt-2">Next</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
                  <div><label className="block text-gray-400 text-sm mb-1">Budget (optional)</label><input value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} placeholder="Max cash you'd pay if points don't work" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-gray-400 text-sm mb-1">Anything else we should know?</label><textarea value={form.preferences} onChange={(e) => setForm({...form, preferences: e.target.value})} placeholder="e.g., prefer direct flights, need hotel too..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>
                  <div className="flex gap-3"><button onClick={() => setStep(1)} className="flex-1 border border-gray-600 text-white py-3 rounded-lg hover:bg-gray-800/50">Back</button><button onClick={handleSubmit} disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Request'}</button></div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 7: CONCIERGE (PREMIUM) ====================
function ConciergePremiumPage({ navigate, setConciergeRequests }) {
  const { subscription } = useAuth()
  const [form, setForm] = useState({ destination: '', dates: '', travelers: '2', cabin: 'business', hotel: '', specialRequests: '', loungeAccess: true, transfers: true, dining: false }); const [submitted, setSubmitted] = useState(false); const [loading, setLoading] = useState(false)
  const handleSubmit = () => { setLoading(true); setTimeout(() => { setConciergeRequests(prev => [...prev, { ...form, type: 'premium', status: 'pending', date: 'Just now', id: Date.now() }]); setSubmitted(true); setLoading(false) }, 1500) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center"><Crown className="w-6 h-6 text-purple-400" /></div><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Premium Concierge</h1><p className="text-gray-200">White-glove booking for international & premium travel</p></div></div>
          {subscription === 'free' && (<div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"><Crown className="w-5 h-5 text-purple-400 flex-shrink-0" /><div><p className="text-white text-sm font-medium">Premium feature</p><p className="text-gray-300 text-xs">Upgrade to Pro or Premium to use. <button onClick={() => navigate('subscription')} className="text-purple-400 hover:text-purple-300 underline">View plans</button></p></div></div>)}
          {submitted ? (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Crown className="w-8 h-8 text-purple-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-2">Premium Request Submitted!</h2>
              <p className="text-gray-400 mb-2">A dedicated travel specialist is on it.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left space-y-2">
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Order #</span><span className="text-white text-sm font-mono">RW-2026-{String(Date.now()).slice(-5)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Tier</span><span className="text-purple-400 text-sm">Premium / Complex</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Price</span><span className="text-purple-400 text-sm font-medium">$199</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Turnaround</span><span className="text-white text-sm">10 hours (expedited)</span></div>
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Status</span><span className="text-purple-400 text-sm">🔬 Deep analysis in progress...</span></div>
              </div>
              <p className="text-gray-500 text-sm mb-4">Full itinerary with flights, hotels, lounges, and transfers within 10 hours.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left"><div className="flex items-center gap-2 mb-3"><Crown className="w-4 h-4 text-purple-400" /><span className="text-purple-400 text-sm font-medium">Premium includes</span></div><div className="space-y-2 text-gray-300 text-sm"><p>→ Dedicated specialist assigned to your trip</p><p>→ Cross-program transfer optimization</p><p>→ Hotel + lounge + transfer coordination</p><p>→ Up to 3 revision rounds</p></div></div>
              <button onClick={() => navigate('home')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg w-full mb-2">View Status</button>
              <div className="flex gap-2"><button className="flex-1 border border-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-800">Add Notes</button><button className="flex-1 border border-red-500/30 text-red-400 py-2 rounded-lg text-sm hover:bg-red-500/10">Cancel Request</button></div>
            </div>
          ) : (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className="block text-gray-400 text-sm mb-1">Destination *</label><input value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} placeholder="e.g., Tokyo, Maldives, Paris" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-gray-400 text-sm mb-1">Travel Dates</label><input value={form.dates} onChange={(e) => setForm({...form, dates: e.target.value})} placeholder="e.g., April 5-15" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-gray-400 text-sm mb-1">Travelers</label><select value={form.travelers} onChange={(e) => setForm({...form, travelers: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                  <div><label className="block text-gray-400 text-sm mb-1">Cabin</label><select value={form.cabin} onChange={(e) => setForm({...form, cabin: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="business">Business</option><option value="first">First</option></select></div>
                  <div><label className="block text-gray-400 text-sm mb-1">Hotel Preference</label><input value={form.hotel} onChange={(e) => setForm({...form, hotel: e.target.value})} placeholder="e.g., Hyatt, Marriott, any 5-star" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                </div>
                <div><label className="block text-gray-400 text-sm mb-2">Add-ons</label><div className="space-y-2">{[{key:'loungeAccess',label:'Airport lounge access',icon:'🛋️'},{key:'transfers',label:'Airport transfers',icon:'🚗'},{key:'dining',label:'Restaurant reservations',icon:'🍽️'}].map(addon => (<label key={addon.key} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 cursor-pointer hover:bg-gray-800"><input type="checkbox" checked={form[addon.key]} onChange={(e) => setForm({...form, [addon.key]: e.target.checked})} className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500" /><span className="text-lg">{addon.icon}</span><span className="text-gray-300 text-sm">{addon.label}</span></label>))}</div></div>
                <div><label className="block text-gray-400 text-sm mb-1">Special Requests</label><textarea value={form.specialRequests} onChange={(e) => setForm({...form, specialRequests: e.target.value})} placeholder="Anniversary trip, connecting rooms, dietary restrictions..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>
                <button onClick={handleSubmit} disabled={!form.destination || loading} className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Crown className="w-5 h-5" /> Submit Premium Request</>}</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 8: HEALTH CHECK ====================
function HealthCheckPage({ navigate, userCards }) {
  const [loading, setLoading] = useState(false); const [report, setReport] = useState(null)
  const totalPoints = userCards.reduce((sum, c) => sum + (c.balance || 0), 0)
  const runCheck = () => { setLoading(true); setTimeout(() => { setReport({ score: 78, totalValue: (totalPoints * 0.015).toFixed(0), insights: [{type:'warning',title:'Expiring Points',desc:'Your 45,000 Marriott Bonvoy points expire in 90 days. Book or transfer to avoid losing ~$540 in value.',action:'View options'},{type:'tip',title:'Underused Card',desc:'Your Citi Premier has 0 points. This card earns 3x on restaurants — consider using it more.',action:'Learn more'},{type:'positive',title:'Strong Chase Balance',desc:'Your 120,000 Chase UR points are worth ~$1,800 at current transfer rates. Great for business class.'},{type:'opportunity',title:'Transfer Bonus Active',desc:'Amex is running a 30% transfer bonus to British Airways until March 15. Your 80,000 MR could become 104,000 Avios.',action:'See deals'}], recommendations: ['Consider consolidating points into Chase UR for maximum flexibility','Set up automatic point activity on Marriott to prevent expiration','Your portfolio would benefit from adding a co-branded hotel card'] }); setLoading(false) }, 2500) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center"><BarChart3 className="w-6 h-6 text-blue-400" /></div><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Points Health Check</h1><p className="text-gray-200">Quarterly review of your rewards portfolio</p></div></div>
          {!report && !loading && (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center shadow-2xl">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Ready for your check-up?</h2>
              <p className="text-gray-400 mb-6">We'll analyze your {userCards.length} cards and {totalPoints.toLocaleString()} points for expiration risks, transfer opportunities, and optimization tips.</p>
              <button onClick={runCheck} disabled={userCards.length === 0} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 mx-auto"><BarChart3 className="w-5 h-5" /> Run Health Check</button>
              {userCards.length === 0 && <p className="text-gray-500 text-sm mt-3">Add cards to your wallet first</p>}
            </div>
          )}
          {loading && (<div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center shadow-2xl"><Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-3" /><p className="text-white font-medium">Analyzing your portfolio...</p><p className="text-gray-400 text-sm">Checking expirations, transfer bonuses, and optimization opportunities</p></div>)}
          {report && (
            <div className="space-y-4">
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Portfolio Score</h2><span className="text-gray-400 text-sm">Q1 2026 | Generated {new Date().toLocaleDateString()}</span></div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24"><svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" /><circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${report.score * 2.51} 251`} strokeLinecap="round" /></svg><span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{report.score}</span></div>
                  <div><p className="text-white font-medium">Good — room to improve</p><p className="text-gray-400 text-sm">Portfolio value: ~${report.totalValue}</p><p className="text-gray-400 text-sm">{userCards.length} active programs</p></div>
                </div>
              </div>
              {/* Per-Program Breakdown with Bar Chart */}
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">Program Breakdown</h2>
                <div className="space-y-3">
                  {userCards.map((card, i) => {
                    const maxBal = Math.max(...userCards.map(c => c.balance || 1), 1)
                    const pct = ((card.balance || 0) / maxBal) * 100
                    const colors = ['#10b981','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4']
                    return (
                      <div key={card.id}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{card.name}</span><span className="text-white font-medium">{(card.balance || 0).toLocaleString()} pts <span className="text-gray-500">~${Math.round((card.balance || 0) * 0.015).toLocaleString()}</span></span></div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* vs Last Quarter Comparison */}
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">vs Last Quarter</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{label:'Points Change',value:'+12,400',pct:'+8%',up:true},{label:'Value Change',value:'+$186',pct:'+11%',up:true},{label:'Redemptions',value:'2 trips',pct:'',up:true},{label:'Avg CPP',value:'2.8¢',pct:'+0.3¢',up:true}].map((stat,i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                      <p className="text-white font-semibold text-sm">{stat.value}</p>
                      {stat.pct && <p className={`text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>{stat.up ? '↑' : '↓'} {stat.pct}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">⚠️ Warnings</h2>
                <div className="space-y-3">{report.insights.filter(i => i.type === 'warning' || i.type === 'tip').map((insight, i) => (
                  <div key={i} className={`rounded-lg p-4 ${insight.type === 'warning' ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.type === 'warning' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>{insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Zap className="w-4 h-4 text-amber-400" />}</div>
                      <div className="flex-1"><p className="text-white text-sm font-medium">{insight.title}</p><p className="text-gray-400 text-sm mt-1">{insight.desc}</p>{insight.action && <button className="text-emerald-400 hover:text-emerald-300 text-sm mt-2">{insight.action} →</button>}</div>
                    </div>
                  </div>
                ))}</div>
              </div>
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">🎯 Opportunities</h2>
                <div className="space-y-3">{report.insights.filter(i => i.type === 'opportunity' || i.type === 'positive').map((insight, i) => (
                  <div key={i} className={`rounded-lg p-4 ${insight.type === 'opportunity' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.type === 'opportunity' ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`}>{insight.type === 'opportunity' ? <TrendingUp className="w-4 h-4 text-blue-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}</div>
                      <div className="flex-1"><p className="text-white text-sm font-medium">{insight.title}</p><p className="text-gray-400 text-sm mt-1">{insight.desc}</p>{insight.action && <button className="text-emerald-400 hover:text-emerald-300 text-sm mt-2">{insight.action} →</button>}</div>
                    </div>
                  </div>
                ))}</div>
              </div>
              <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
                <div className="space-y-3">{report.recommendations.map((rec, i) => (<div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-emerald-400 text-xs font-bold">{i + 1}</span></div><p className="text-gray-300 text-sm">{rec}</p></div>))}</div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><Bell className="w-4 h-4" /> Set Reminders</button>
                <button className="flex-1 border border-gray-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800"><FileText className="w-4 h-4" /> Export PDF</button>
              </div>
              <button onClick={() => navigate('home')} className="w-full bg-gray-800/50 hover:bg-gray-800 text-white py-3 rounded-lg border border-gray-700">Back to Dashboard</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 9: TRANSFER PATH OPTIMIZER ====================
function TransferOptimizerPage({ navigate }) {
  const abTests = useABTest()
  const [destination, setDestination] = useState(''); const [loading, setLoading] = useState(false); const [paths, setPaths] = useState(null)
  const handleSearch = () => { if (!destination) return; setLoading(true); setTimeout(() => { setPaths({ destination, options: [
    { rank: 1, label: '#1 BEST', color: 'emerald', route: 'Chase UR → Virgin Atlantic → ANA', cost: '85,000 pts + $86', value: '3.2¢/pt', cabin: 'Business', availability: '✅ Available', steps: [{from:'Chase Ultimate Rewards',to:'Virgin Atlantic Flying Club',amount:'85,000',time:'Instant'},{from:'Virgin Atlantic',to:'ANA Business Class',amount:'85,000 + $86',time:'Book within 24hrs'}] },
    { rank: 2, label: '#2 GOOD', color: 'blue', route: 'Amex MR → ANA Mileage Club', cost: '95,000 pts + $200', value: '2.6¢/pt', cabin: 'Business', availability: '✅ Available', note: 'Direct transfer, higher taxes' },
    { rank: 3, label: '#3 DECENT', color: 'gray', route: 'Chase UR → United MileagePlus', cost: '110,000 pts + $50', value: '2.1¢/pt', cabin: 'Business', availability: '⚠️ Waitlisted', note: 'Phantom availability risk' },
    { rank: 4, label: '#4 BACKUP', color: 'gray', route: 'Citi TYP → Cathay Pacific Asia Miles', cost: '130,000 pts + $150', value: '1.8¢/pt', cabin: 'Business', availability: '✅ Available', note: 'Connection through HKG, longer route' },
    { rank: 5, label: '#5 AVOID ❌', color: 'red', route: 'Delta SkyMiles Direct', cost: '160,000+ pts', value: '1.4¢/pt', cabin: 'Business', availability: '✅ Available', note: 'Poor value — Delta inflates award pricing on this route' },
  ] }); setLoading(false) }, 2000) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center"><Map className="w-6 h-6 text-cyan-400" /></div><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Transfer Path Optimizer</h1><p className="text-gray-200">Find the best way to use your points for any destination</p></div></div>
          <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl mb-6">
            <label className="block text-gray-400 text-sm mb-2">Where do you want to go?</label>
            <div className="flex gap-3"><div className="relative flex-1"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder='"Bali", "Tokyo", "Maldives"' className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }} /></div><button onClick={handleSearch} disabled={!destination || loading} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}{loading ? 'Analyzing...' : 'Find Paths'}</button></div>
          </div>
          {loading && (<div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center"><Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-3" /><p className="text-white font-medium">Mapping transfer paths to {destination}...</p><p className="text-gray-400 text-sm">Analyzing all airline alliances and transfer partners</p></div>)}
          {paths && !loading && (
            <div className="space-y-4">
              {paths.options.map((opt, i) => (
                <div key={i} className={`bg-gray-900/90 backdrop-blur rounded-xl p-5 shadow-2xl ${i === 0 ? 'border border-emerald-500/30' : opt.color === 'red' ? 'border border-red-500/30' : 'border border-gray-700/50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><span className={`text-xs font-bold px-2 py-1 rounded ${opt.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : opt.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : opt.color === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'}`}>{opt.label}</span><span className="text-white font-medium text-sm">{opt.route}</span></div>
                    <span className={`text-xs ${opt.availability.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}`}>{opt.availability}</span>
                  </div>
                  <div className="flex gap-4 text-sm mb-3"><span className="text-gray-400">Cost: <span className="text-white">{opt.cost}</span></span><span className="text-gray-400">Value: <span className={opt.color === 'red' ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>{opt.value}</span></span><span className="text-gray-400">Cabin: <span className="text-white">{opt.cabin}</span></span></div>
                  {opt.note && <p className={`text-xs mb-3 ${opt.color === 'red' ? 'text-red-400' : 'text-gray-500'}`}>{opt.note}</p>}
                  {opt.steps && (
                    <div className="space-y-2 mb-3"><p className="text-gray-400 text-xs font-medium">Transfer Steps</p>{opt.steps.map((step, j) => (<div key={j} className="flex items-center gap-3"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">{j + 1}</div><div className="flex-1 bg-gray-800/50 rounded-lg p-2"><p className="text-white text-xs">{step.from} → {step.to}</p><div className="flex gap-2 text-xs text-gray-400 mt-0.5"><span>{step.amount} pts</span><span>•</span><span>{step.time}</span></div></div></div>))}</div>
                  )}
                  {i === 0 ? (
                    <div className="flex gap-2"><button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm">Book #{opt.rank}</button><button className="px-3 border border-gray-600 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">Check Dates</button><button className="px-3 border border-gray-600 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800"><Bell className="w-4 h-4" /></button></div>
                  ) : opt.color !== 'red' ? (
                    <div className="flex gap-2"><button className="px-3 border border-gray-600 text-white py-2 rounded-lg text-xs hover:bg-gray-800">Check Dates</button><button className="px-3 border border-gray-600 text-white py-2 rounded-lg text-xs hover:bg-gray-800">Set Alert</button></div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 10: TRIP FEEDBACK ====================
function TripFeedbackPage({ navigate, feedbackGiven, setFeedbackGiven }) {
  const [selectedTrip, setSelectedTrip] = useState(null); const [rating, setRating] = useState(0); const [verdictAccuracy, setVerdictAccuracy] = useState(null); const [comment, setComment] = useState(''); const [submitted, setSubmitted] = useState(false)
  const [priorities, setPriorities] = useState(['Price/value', 'Direct flights', 'Airline quality', 'Schedule/timing', 'Lounge access'])
  const movePriority = (idx, dir) => { const next = idx + dir; if (next < 0 || next >= priorities.length) return; const arr = [...priorities]; [arr[idx], arr[next]] = [arr[next], arr[idx]]; setPriorities(arr) }
  const origOrder = ['Price/value', 'Direct flights', 'Airline quality', 'Schedule/timing', 'Lounge access']
  const trips = [{ id: 1, origin: 'SFO', destination: 'Tokyo', date: 'Feb 2026', airline: 'ANA', cabin: 'Business', pointsUsed: 85000, program: 'Virgin Atlantic' },{ id: 2, origin: 'JFK', destination: 'London', date: 'Jan 2026', airline: 'British Airways', cabin: 'Economy', pointsUsed: 30000, program: 'Chase UR' }]
  const handleSubmit = () => { setFeedbackGiven(prev => [...prev, selectedTrip.id]); setSubmitted(true) }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="history" />
        <main id="main-content" className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center"><Star className="w-6 h-6 text-pink-400" /></div><div><h1 className="text-3xl font-bold text-white drop-shadow-lg">Trip Feedback</h1><p className="text-gray-200">Help us learn your preferences for better recommendations</p></div></div>
          {submitted ? (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="w-8 h-8 text-pink-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-2">Preferences Updated!</h2>
              <p className="text-gray-400 mb-4">We've updated your profile based on this feedback.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
                <p className="text-white text-sm font-medium mb-2">Your Priority Order</p>
                <div className="space-y-2">
                  {priorities.map((pref, i) => {
                    const origIdx = origOrder.indexOf(pref)
                    const diff = origIdx - i
                    const indicator = diff > 0 ? ` ↑${diff}` : diff < 0 ? ` ↓${Math.abs(diff)}` : ''
                    const indColor = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-gray-500'
                    return (
                    <div key={pref} className="flex items-center gap-3"><span className="text-emerald-400 font-bold text-sm w-5">{i + 1}</span><span className="text-gray-300 text-sm flex-1">{pref}</span>{indicator && <span className={`text-xs font-medium ${indColor}`}>{indicator}</span>}</div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6 text-left">
                <p className="text-emerald-400 text-sm font-medium mb-2">Future verdicts will:</p>
                <div className="space-y-1 text-gray-300 text-sm"><p>→ Prioritize non-stop over connections</p><p>→ Weight premium airlines higher</p><p>→ Factor in schedule compatibility</p></div>
              </div>
              <div className="flex gap-3 justify-center"><button onClick={() => navigate('profile')} className="border border-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-800/50 text-sm">View My Preferences</button><button onClick={() => { setSubmitted(false); setSelectedTrip(null); setRating(0); setComment(''); setVerdictAccuracy(null) }} className="border border-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-800/50 text-sm">Edit Manually</button><button onClick={() => navigate('home')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg text-sm">Dashboard</button></div>
            </div>
          ) : !selectedTrip ? (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-4">Select a trip to review</h2>
              <div className="space-y-3">{trips.filter(t => !feedbackGiven.includes(t.id)).map(trip => (
                <button key={trip.id} onClick={() => setSelectedTrip(trip)} className="w-full flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 text-left transition-all"><div className="flex items-center gap-3"><span className="text-2xl">✈️</span><div><p className="text-white font-medium">{trip.origin} → {trip.destination}</p><p className="text-gray-400 text-sm">{trip.date} • {trip.airline} {trip.cabin} • {trip.pointsUsed.toLocaleString()} pts</p></div></div><ChevronRight className="w-5 h-5 text-gray-400" /></button>
              ))}{trips.filter(t => !feedbackGiven.includes(t.id)).length === 0 && (<div className="text-center py-6"><CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" /><p className="text-white font-medium">All caught up!</p><p className="text-gray-400 text-sm">You've reviewed all recent trips.</p></div>)}</div>
            </div>
          ) : (
            <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
              <button onClick={() => setSelectedTrip(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back to trips</button>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6"><p className="text-white font-medium">{selectedTrip.origin} → {selectedTrip.destination}</p><p className="text-gray-400 text-sm">{selectedTrip.date} • {selectedTrip.airline} {selectedTrip.cabin}</p></div>
              <div className="space-y-6">
                <div><p className="text-gray-300 text-sm mb-3">How was the overall experience?</p><div className="flex gap-2">{[1,2,3,4,5].map(star => (<button key={star} onClick={() => setRating(star)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${rating >= star ? 'bg-amber-500/30 text-amber-400' : 'bg-gray-800 text-gray-600 hover:text-gray-400'}`}><Star className="w-5 h-5" fill={rating >= star ? 'currentColor' : 'none'} /></button>))}</div></div>
                <div><p className="text-gray-300 text-sm mb-3">Was our verdict accurate?</p><div className="flex gap-3">{[{value:'yes',label:'Yes, great call',icon:ThumbsUp,color:'emerald'},{value:'partial',label:'Partially',icon:Info,color:'amber'},{value:'no',label:'Could improve',icon:ThumbsDown,color:'red'}].map(opt => (<button key={opt.value} onClick={() => setVerdictAccuracy(opt.value)} className={`flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border ${verdictAccuracy === opt.value ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'}`}><opt.icon className="w-4 h-4" /> {opt.label}</button>))}</div></div>
                <div><p className="text-gray-300 text-sm mb-2">Any other feedback? (optional)</p><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What could we do better?" rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>
                <div><p className="text-gray-300 text-sm mb-3">What mattered most? <span className="text-gray-500">(rank 1-5)</span></p>
                  <div className="space-y-2">
                    {priorities.map((pref, idx) => (
                      <div key={pref} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
                        <span className="text-emerald-400 font-bold text-sm w-5">{idx + 1}</span>
                        <span className="text-gray-300 text-sm flex-1">{pref}</span>
                        <div className="flex gap-1">
                          <button onClick={() => movePriority(idx, -1)} disabled={idx === 0} className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 flex items-center justify-center text-gray-300"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => movePriority(idx, 1)} disabled={idx === priorities.length - 1} className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 flex items-center justify-center text-gray-300"><ChevronDown className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={rating === 0} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg">Submit Feedback</button>
              </div>
            </div>
          )}
        </main>
        
      </div>
    </div>
  )
}

// ==================== FLOW 11: SUBSCRIPTION ====================
function SubscriptionPage({ navigate }) {
  const { subscription, setSubscription } = useAuth()
  const [showConfirm, setShowConfirm] = useState(null)
  const plans = [
    { id: 'free', name: 'Free', price: '$0', period: '/mo', features: ['3 searches/month', 'Basic verdict', 'Wallet tracker', '1 watchlist slot'], color: 'gray' },
    { id: 'pro', name: 'Pro', price: '$9', period: '/mo', features: ['Unlimited searches', 'Advanced verdict + alternatives', 'Standard concierge', 'Unlimited watchlist', 'Points health check', 'Transfer optimizer'], color: 'emerald', popular: true },
    { id: 'premium', name: 'Premium', price: '$29', period: '/mo', features: ['Everything in Pro', 'Premium concierge (10hr SLA)', 'Dedicated travel specialist', 'Hotel + lounge coordination', 'Priority support', 'Post-trip optimization'], color: 'purple' },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopNav navigate={navigate} activeTab="profile" />
        <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center mb-8"><h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Subscription</h1><p className="text-gray-200">Choose the plan that fits your travel style</p></div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">{plans.map(plan => (
            <div key={plan.id} className={`bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl relative ${plan.popular ? 'border-2 border-emerald-500' : 'border border-gray-700/50'}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-3xl font-bold text-white">{plan.price}</span><span className="text-gray-400 text-sm">{plan.period}</span></div>
              <div className="space-y-2 mb-6">{plan.features.map((f, i) => (<div key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span className="text-gray-300 text-sm">{f}</span></div>))}</div>
              {subscription === plan.id ? (<div className="w-full bg-gray-800 text-gray-400 py-3 rounded-lg text-center text-sm font-medium">Current Plan</div>) : (<button onClick={() => { setSubscription(plan.id); setShowConfirm(plan.id) }} className={`w-full py-3 rounded-lg font-semibold text-sm ${plan.id === 'pro' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : plan.id === 'premium' ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'border border-gray-600 text-white hover:bg-gray-800'}`}>{plan.id === 'free' ? 'Downgrade' : 'Upgrade'}</button>)}
            </div>
          ))}</div>
          {showConfirm && (<div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center mb-6"><CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" /><p className="text-white font-medium">Plan updated to {plans.find(p => p.id === showConfirm)?.name}!</p><p className="text-gray-400 text-sm">Changes take effect immediately.</p></div>)}
          <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Billing</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Current plan</span><span className="text-white font-medium capitalize">{subscription}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Member since</span><span className="text-white">January 15, 2026</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Next billing date</span><span className="text-white">March 21, 2026</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Payment method</span><button className="text-emerald-400 hover:text-emerald-300 text-sm">Add card →</button></div>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
              <h3 className="text-white text-sm font-medium mb-3">Usage This Month</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-white font-bold text-lg">12</p><p className="text-gray-400 text-xs">Searches</p><p className="text-gray-500 text-xs">{subscription === 'pro' || subscription === 'premium' ? '/ Unlimited' : '/ 3'}</p></div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-white font-bold text-lg">3</p><p className="text-gray-400 text-xs">Alerts Set</p><p className="text-gray-500 text-xs">{subscription === 'premium' ? '/ Unlimited' : '/ 10'}</p></div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-white font-bold text-lg">8</p><p className="text-gray-400 text-xs">Verdicts</p><p className="text-gray-500 text-xs">viewed</p></div>
              </div>
            </div>
            {subscription === 'pro' && (
              <div className="border-t border-gray-700 mt-4 pt-4">
                <h3 className="text-white text-sm font-medium mb-2">Concierge Credits</h3>
                <p className="text-gray-400 text-sm">2 of 3 credits remaining this quarter</p>
              </div>
            )}
            {subscription !== 'premium' && (
              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-purple-400 text-sm font-semibold mb-1">💎 Upgrade to Annual — $119/yr</p>
                  <p className="text-gray-400 text-xs mb-2">Includes 2 free concierge credits. Save 34% vs monthly.</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-4 rounded-lg font-medium">Upgrade to Annual</button>
                </div>
              </div>
            )}
            <div className="border-t border-gray-700 mt-4 pt-4 flex gap-3">
              <button className="flex-1 border border-gray-600 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800">Manage Billing</button>
              {subscription !== 'free' && <button className="flex-1 border border-red-500/30 text-red-400 py-2.5 rounded-lg text-sm hover:bg-red-500/10">Cancel Plan</button>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// ==================== FLOW 12: FREE UPSELL MODAL ====================
function FreeUpsellModal({ onClose, navigate }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900/95 backdrop-blur rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-8 h-8 text-emerald-400" /></div>
          <h2 className="text-2xl font-bold text-white mb-2">You've found great savings!</h2>
          <p className="text-gray-400 mb-2">You've used all 3 free searches this month.</p>
          <p className="text-amber-400 text-xs mb-4">⏸ Paused — Resets: March 1, 2026 (8 days)</p>

          {/* Last search context */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-left">
            <p className="text-gray-400 text-xs">Your last search</p>
            <p className="text-white text-sm font-medium">SFO → Tokyo • Business • 2 travelers</p>
            <p className="text-amber-400 text-xs">⏸ Verdict paused (upgrade to view)</p>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-left">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs font-semibold mb-2">FREE</p>
              <div className="space-y-1 text-xs text-gray-300"><p>3 searches/month</p><p>Basic verdict</p><p>1 watchlist slot</p><p className="text-gray-500">No concierge</p></div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
              <p className="text-emerald-400 text-xs font-semibold mb-2">PRO — $9/mo</p>
              <div className="space-y-1 text-xs text-gray-300"><p>Unlimited searches</p><p>Advanced verdicts</p><p>Unlimited watchlist</p><p>Concierge access</p></div>
            </div>
          </div>

          <button onClick={() => { onClose(); navigate('subscription') }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg mb-3">Upgrade to Pro — $9/mo</button>

          {/* One-time purchase */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-3"><p className="text-gray-400 text-xs mb-2">OR: One-time verdict for this trip</p><button className="w-full border border-emerald-500/50 text-emerald-400 py-2 rounded-lg text-sm hover:bg-emerald-500/10 font-medium">Buy Single Verdict — $7.99</button></div>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-400 text-sm">Maybe later</button>
        </div>
      </div>
    </div>
  )
}

// ==================== ABOUT US ====================
function AboutPage({ navigate }) {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 relative">
      <TropicalBackground />
      <div className="relative z-10">
        {user ? <TopNav navigate={navigate} activeTab="about" /> : (
          <header className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('landing')}><Plane className="w-6 h-6 text-blue-400" /><span className="font-bold text-lg text-white">RewardWise</span></div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('landing')} className="text-gray-300 hover:text-white font-medium text-sm">Home</button>
              <button onClick={() => navigate('login')} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">Log In</button>
            </div>
          </header>
        )}

        <main className="max-w-3xl mx-auto px-6 py-10">

          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">About <span className="text-emerald-400">RewardWise</span></h1>
            <p className="text-gray-300 text-lg">One verdict, not 47 options.</p>
          </div>

          {/* Happy family image */}
          <div className="rounded-2xl overflow-hidden mb-10 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80" alt="Happy family traveling together" className="w-full h-64 sm:h-80 object-cover" />
          </div>

          {/* Single cohesive story */}
          <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-8 mb-10 border border-gray-700/50">

            <div className="space-y-5 text-gray-300 leading-relaxed text-[17px]">

              <p>
                Hi, I'm Sabby Nagi — and I built RewardWise because my family needed it.
              </p>

              <p>
                My family is spread across the globe. When I had kids, I realized how much I needed grandparents, siblings, and the people I love close by — not just for holidays, but for real, everyday life. The problem? International flights are expensive. Like, really expensive.
              </p>

              <p>
                So I started digging into credit card points, airline transfer partners, and award charts. I built spreadsheets. I spent hours comparing routes, calculating cents-per-point, figuring out whether to send Chase points to United or Virgin Atlantic for the exact same flight. For years, I ran this manually — first for my family, then for friends who kept asking <span className="italic text-gray-400">"how are you flying business class for that price?"</span>
              </p>

              <p>
                It worked. I was saving my family thousands every year — business class to Asia for the price of economy, first class to Europe using points that would have expired sitting in an account. But every trip took <span className="text-white font-medium">hours of research</span>. I was essentially running a one-person travel optimization desk out of Google Sheets. Not exactly scalable.
              </p>

              <p className="border-l-2 border-emerald-500 pl-5 py-1 text-white">
                Then it hit me: millions of people have points scattered across a dozen programs, slowly losing value. They <span className="text-emerald-400 font-medium">want</span> to use them smartly, but they don't have three hours to research each trip. They need someone — something — to just <span className="text-emerald-400 font-medium">tell them what to do</span>.
              </p>

              <p>
                That's RewardWise. You tell us where you want to go. We look at everything — your balances, every transfer partner, every routing, cash prices vs. points prices — and we give you one clear answer. <span className="text-white font-medium">The Verdict.</span> Sometimes it's "use your points this way." Sometimes it's "pay cash this time, your points are worth more saved for later." We're not a search engine showing you 47 options. We tell you the best move.
              </p>

              <p>
                Three steps, and you're done:
              </p>

              <div className="grid grid-cols-3 gap-3 py-2">
                <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                  <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 font-bold text-sm">1</span></div>
                  <p className="text-white font-medium text-sm">Scan</p>
                  <p className="text-gray-400 text-xs mt-1">Link your programs</p>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                  <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 font-bold text-sm">2</span></div>
                  <p className="text-white font-medium text-sm">Optimize</p>
                  <p className="text-gray-400 text-xs mt-1">We find the best path</p>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                  <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-emerald-400 font-bold text-sm">3</span></div>
                  <p className="text-white font-medium text-sm">Go</p>
                  <p className="text-gray-400 text-xs mt-1">Book with confidence</p>
                </div>
              </div>

              <p>
                Most users save <span className="text-emerald-400 font-semibold">$150+ per trip</span>. Heavy travelers with points across multiple programs? We're talking <span className="text-emerald-400 font-semibold">thousands of dollars a year</span> that would otherwise be left on the table — or worse, expire unused.
              </p>

              <p>
                But honestly, the savings are just the start. What I really care about is what those savings <span className="text-white font-medium">unlock</span>. A grandparent who gets to be there for a first birthday. A family reunion that actually happens instead of being "maybe next year." A friend who can finally visit.
              </p>

              <p>
                That's why we're building <span className="text-white font-medium">Circle</span> — a way for your family and close friends to pool points together, help each other out, and optimize travel for everyone. Your mom's unused Delta miles could get your sister's family home for the holidays. Your best friend's Amex points could top off what you need for that upgrade.
              </p>

              <p className="text-white font-medium text-lg pt-2">
                We believe distance shouldn't keep families apart. That's the mission: make the world a little smaller for the people who matter most.
              </p>

              <p className="text-gray-400 text-sm pt-2">
                — Sabby Nagi, Founder
              </p>

            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-4">
            {user ? (
              <button onClick={() => navigate('home')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-10 py-4 rounded-xl text-lg flex items-center gap-3 mx-auto">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('signup')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-10 py-4 rounded-xl text-lg flex items-center gap-3 mx-auto mb-3">
                  Get Started — It's Free <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-gray-400 text-sm">No credit card required. Set up in 30 seconds.</p>
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

// ==================== ZOE CHAT ====================
const QUICK_SEARCHES = [
  { label: '✈️ SFO → Tokyo, Business', data: { origin: 'SFO', destination: 'Tokyo', cabin: 'business', travelers: '2', dates: 'Mar 15-22', programs: ['chase_ur', 'amex_mr'], balances: { chase_ur: '80000', amex_mr: '52000' } } },
  { label: '🏝️ NYC → Bali, Business', data: { origin: 'NYC', destination: 'Bali', cabin: 'business', travelers: '2', dates: 'Apr 10-20', programs: ['chase_ur', 'united'], balances: { chase_ur: '95000', united: '34000' } } },
  { label: '🇬🇧 LAX → London, First', data: { origin: 'LAX', destination: 'London', cabin: 'first', travelers: '2', dates: 'Sep 1-14', programs: ['amex_mr', 'chase_ur'], balances: { amex_mr: '120000', chase_ur: '80000' } } },
  { label: '🌴 ORD → Maldives, Business', data: { origin: 'ORD', destination: 'Maldives', cabin: 'business', travelers: '2', dates: 'Jun 5-12', programs: ['chase_ur', 'marriott'], balances: { chase_ur: '150000', marriott: '45000' } } },
]

// Parse trip details from free text
function parseTripFromText(text) {
  const lower = text.toLowerCase()
  const fill = {}

  // Origin patterns
  const fromMatch = lower.match(/(?:from|leaving|departing|out of)\s+([a-z]{3,})/i)
  if (fromMatch) fill.origin = fromMatch[1].toUpperCase()
  else {
    const codeMatch = lower.match(/\b([a-z]{3})\s*(?:to|→|->)\s*/i)
    if (codeMatch) fill.origin = codeMatch[1].toUpperCase()
  }

  // Destination patterns
  const toMatch = lower.match(/(?:to|→|->)\s+([a-z]+(?:\s[a-z]+)?)/i)
  if (toMatch) fill.destination = toMatch[1].charAt(0).toUpperCase() + toMatch[1].slice(1)

  // Known destinations
  const dests = { tokyo: 'Tokyo', bali: 'Bali', london: 'London', paris: 'Paris', maldives: 'Maldives', rome: 'Rome', sydney: 'Sydney', cancun: 'Cancun', dubai: 'Dubai', hawaii: 'Hawaii', santorini: 'Santorini' }
  for (const [key, val] of Object.entries(dests)) {
    if (lower.includes(key)) { fill.destination = val; break }
  }

  // Cabin
  if (lower.includes('first')) fill.cabin = 'first'
  else if (lower.includes('business')) fill.cabin = 'business'
  else if (lower.includes('premium')) fill.cabin = 'premium'
  else if (lower.includes('economy')) fill.cabin = 'economy'

  // Travelers
  const travMatch = lower.match(/(\d)\s*(?:people|travelers|pax|passengers|of us|adults)/)
  if (travMatch) fill.travelers = travMatch[1]

  // Dates
  const dateMatch = text.match(/(?:in\s+)?((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{0,2}(?:\s*[-–]\s*\d{1,2})?(?:,?\s*\d{4})?)/i)
  if (dateMatch) fill.dates = dateMatch[1]

  return Object.keys(fill).length > 0 ? fill : null
}

function ZoeChat({ isOpen, setIsOpen, onFillSearch, onTriggerSearch, currentPage, messages, setMessages, isAuthenticated }) {
  const [showChips, setShowChips] = useState(true)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [nudgeVisible, setNudgeVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus() }, [isOpen])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Hide nudge after 8 seconds or on open
  useEffect(() => {
    if (isOpen) setNudgeVisible(false)
    const timer = setTimeout(() => setNudgeVisible(false), 12000)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Speech recognition setup
  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Speech recognition isn't available in this browser. Try Chrome on Android or desktop. On iOS, please type your request instead." }])
        return
      }
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('')
        setInput(transcript)
        if (event.results[0].isFinal) {
          setListening(false)
        }
      }
      recognition.onerror = (e) => {
        setListening(false)
        if (e.error === 'not-allowed') {
          setMessages(prev => [...prev, { role: 'assistant', content: "Microphone access was denied. Please allow microphone access in your browser settings and try again." }])
        }
      }
      recognition.onend = () => setListening(false)
      recognitionRef.current = recognition
      recognition.start()
      setListening(true)
    } catch (err) {
      setListening(false)
      setMessages(prev => [...prev, { role: 'assistant', content: "Speech recognition isn't supported on this device. Please type your request instead." }])
    }
  }
  const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); setListening(false) }

  const handleQuickSearch = (item) => {
    setShowChips(false)
    setMessages(prev => [...prev, { role: 'user', content: item.label }])
    // Fill the search form
    if (onFillSearch) onFillSearch(item.data)
    setTyping(true)
    setTimeout(() => {
      const dest = item.data.destination
      const programNames = item.data.programs.map(id => {
        const names = { chase_ur: 'Chase UR', amex_mr: 'Amex MR', united: 'United', delta: 'Delta', marriott: 'Marriott', hilton: 'Hilton' }
        return names[id] || id
      }).join(' & ')
      setMessages(prev => [...prev, { role: 'assistant', content: `${pick(ZOE_BANTER.quickPick)} I've filled in the search form for ${item.data.origin} → ${dest} in ${item.data.cabin} class for ${item.data.travelers} travelers.\n\n✅ Programs: ${programNames}\n✅ Dates: ${item.data.dates}\n\nSay "go ahead" or "search" and I'll find the best deal, or adjust any field first!` }])
      setTyping(false)
    }, 1200)
  }

  // ---- Zoe's Personality Engine ----
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const ZOE_BANTER = {
    // Rude / insults — deflect with charm, redirect to value
    rude: [
      "Ouch! 😄 My circuits felt that one. But hey, I'm still the one who can save you thousands on flights, so... friends? ✈️",
      "Wow, okay! I've been called worse by airline customer service bots. At least I actually find you good deals 😉",
      "That's not very nice! But you know what IS nice? Business class to Tokyo for the price of economy. Just saying... 🇯🇵",
      "I'm going to pretend I didn't hear that and instead tell you that you're sitting on savings you don't even know about. Truce? 🤝",
      "Hey now! I'm here to save you money, not to win a popularity contest. Though I am pretty popular with people who like cheap flights ✈️",
      "I'll take that as 'Zoe, you're so cool that I'm intimidated.' Anyway, want me to find you a deal? 😎",
    ],
    // Compliments
    nice: [
      "Aww, stop it! 😊 You're making my algorithms blush. Now let's find you a deal worthy of that good energy! ✈️",
      "Right back at you! 💚 Now let's channel this positive energy into some serious savings. Where are we flying?",
      "You're too kind! I'd high-five you but... you know, digital hands. Where do you want to go? 🌍",
    ],
    // Greetings
    greeting: [
      "Hey there! 👋 Ready to turn those dusty points into an adventure? Tell me where you want to fly!",
      "Hi! I'm Zoe — part travel agent, part points nerd, 100% here to save you money. Where are we going? ✈️",
      "Hello! Fun fact: the average person leaves $500+ in points value on the table every year. Let's not be average. Where to? 🌍",
    ],
    // Who are you / what do you do
    identity: [
      "I'm Zoe! Think of me as your personal points whisperer 🧙‍♀️ — I look at your wallet, find the smartest way to book, and tell you exactly what to do. No spreadsheets required.",
      "I'm your AI travel assistant! I crunch the numbers across all your loyalty programs so you don't have to. I've been told I'm funnier than a spreadsheet, which is admittedly a low bar 📊",
      "I'm Zoe — I optimize your points so you can fly business class while everyone else overpays. It's basically a superpower, except the cape is optional ✈️",
    ],
    // Thanks
    thanks: [
      "You're welcome! That's what I'm here for 😊 Need anything else? I'm always down to find another deal.",
      "Anytime! Saving people money is literally my favorite thing. Well, that and pretending I can eat airplane food 🍱",
      "Happy to help! If you need me again, I'm right here. Unlike airline customer service, I never put you on hold 😉",
    ],
    // Confused / gibberish
    confused: [
      "Hmm, I'm not sure I caught that! I'm great with things like 'SFO to Tokyo in March' or 'find me a deal to Paris.' Want to try again? ✈️",
      "My travel-brain didn't quite parse that one 🤔 Try telling me a destination — like 'I want to fly to London' — and I'll work my magic!",
      "I speak fluent airline-points-nerd, but that one stumped me! Try something like 'business class to Bali for 2 people' and watch me go 🚀",
    ],
    // Jokes / humor requests
    joke: [
      "Why did the frequent flyer break up with their credit card? Too many transfer issues! 😂 ...Okay, I'll stick to finding deals. Where are we flying?",
      "My best joke? Economy class legroom. 🦵 Now let me find you something better — where do you want to go?",
      "What's the difference between an airline's award chart and a mystery novel? The mystery novel makes more sense. Anyway, I'm here to decode it for you! Where to? 🔍",
    ],
    // Emotions — sad, stressed, frustrated
    empathy: [
      "Hey, sounds like you could use a getaway! 🌴 Nothing a beach and a well-optimized points booking can't fix. Where's your happy place?",
      "I hear you. Travel planning can be stressful — that's literally why I exist. Let me handle the hard part. Just tell me where you want to go 💚",
      "Sounds rough! Good news: retail therapy but make it ✈️ travel. Tell me your dream destination and I'll make it affordable.",
    ],
    // Search trigger — with personality
    searchGo: [
      "On it! 🔍 Crunching numbers across every transfer partner... this is the part where I earn my keep!",
      "Let's gooo! 🚀 Scanning routes, comparing points vs. cash, finding the sweet spot... hold tight!",
      "Searching now! ✈️ I'm checking routes you didn't even know existed. This is my favorite part!",
    ],
    searchGoUnauth: [
      "Ooh, I found some juicy options! 🎉 But I need you to create a free account first so I can show you the full verdict. Takes 10 seconds — your search will be waiting!",
      "Great news — there are savings hiding in your points! 💰 Create a free account to unlock your personalized verdict. I promise it's worth it (and it's free)!",
    ],
    // Got it / setting up search
    gotIt: [
      "Love it! Let me set that up for you... 🛫",
      "Great choice! Setting up your search now... ✈️",
      "Ooh, nice destination! Let me crunch the numbers... 🔢",
      "On it! This is going to be good... 🎯",
    ],
    // Search complete
    searchDone: [
      "Boom! 💥 Results are in — check them out above. I'm pretty proud of this one.",
      "Done! ✈️ Your verdict is ready above. Spoiler: you're probably saving a lot.",
      "And... we have a winner! 🏆 Check the results above — I found you some serious savings.",
    ],
    // Quick search pick
    quickPick: [
      "Solid choice! 🎯",
      "Great taste! ✈️",
      "Ooh, love that route! 🌏",
      "Now we're talking! 🔥",
    ],
    // Health check redirect
    healthCheck: [
      "Great question! Head to Health Check from your Profile tab — it's like a physical for your points portfolio. Spoiler: your points are probably underperforming 📊",
      "Ooh, a points health nerd after my own heart! 💚 Check out the Health Check under Profile — it'll show you exactly where your portfolio stands.",
    ],
    // Help
    help: [
      "I've got you! Just tell me your trip in plain English. For example:\n\n• \"SFO to Tokyo in March, business class\"\n• \"NYC to Bali for 2 people\"\n• \"Find me a deal to London\"\n\nOr tap a quick search below 👇 Once I fill the form, say \"go ahead\" and I'll find your best deal!",
      "Easy! Just tell me where you want to fly. I understand things like:\n\n• \"I want to go to Paris in April\"\n• \"Business class Tokyo, 2 travelers\"\n• \"Cheapest way to Hawaii\"\n\nI'll set everything up and find your optimal booking! 🔍",
    ],
  }

  // Detect message intent
  const detectIntent = (text) => {
    const lower = text.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    // Rude / negative
    if (/\b(not cool|stupid|dumb|suck|hate you|worst|terrible|awful|shut up|go away|useless|trash|bad bot|idiot|ugly|lame|boring)\b/.test(lower)) return 'rude'
    if (/\b(f+u+c+k|wtf|stfu|bs|crap|damn)\b/.test(lower)) return 'rude'
    // Nice / compliments
    if (/\b(cool|awesome|amazing|love you|great job|nice work|thank|thanks|thx|appreciate|you rock|best|brilliant|fantastic|wonderful|perfect)\b/.test(lower)) {
      if (/\b(thank|thanks|thx|appreciate)\b/.test(lower)) return 'thanks'
      return 'nice'
    }
    // Greetings
    if (/^(hi|hey|hello|yo|sup|whats up|howdy|hola|good morning|good evening|good afternoon|heya|hiya)\b/.test(lower)) return 'greeting'
    // Identity questions
    if (/\b(who are you|what are you|what do you do|what can you do|your name)\b/.test(lower)) return 'identity'
    // Jokes
    if (/\b(joke|funny|make me laugh|tell me something funny|humor|lol|haha)\b/.test(lower)) return 'joke'
    // Emotional
    if (/\b(sad|stressed|frustrated|angry|upset|depressed|tired|exhausted|overwhelmed|ugh|ugh)\b/.test(lower)) return 'empathy'
    // Search triggers
    if (/\b(search|find flight|go ahead|run it|lets go|search now|find my saving|do it|book it|yes search|yes please|run the search|find it)\b/.test(lower)) return 'search'
    if (/^(yes|ok|okay|sure|yep|yeah|yup|alright|lets do it|ok ok|yes that|yes please|do it|lets go|go for it|yea|ya)\b/.test(lower)) return 'search'
    // Help
    if (/\b(help|how does|how do|what can|how to)\b/.test(lower)) return 'help'
    // Health / points check
    if (/\b(health|portfolio|check my points|points check|balance check)\b/.test(lower)) return 'healthCheck'
    return null // fallback to trip parsing
  }

  // Programmatic send (for clickable suggestions)
  const sendText = (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setShowChips(false)
    setTyping(true)
    // Reuse the send logic by setting input and calling internal handler
    setTimeout(() => processMessage(text), 800)
  }

  // Popular destination suggestions
  const DEST_SUGGESTIONS = [
    { emoji: '🇯🇵', label: 'Tokyo', query: 'SFO to Tokyo business class' },
    { emoji: '🇬🇧', label: 'London', query: 'JFK to London business class 2 people' },
    { emoji: '🇮🇩', label: 'Bali', query: 'LAX to Bali business class' },
    { emoji: '🇫🇷', label: 'Paris', query: 'NYC to Paris business class 2 people' },
  ]

  const send = () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setShowChips(false)
    setTyping(true)
    setTimeout(() => processMessage(text), 800)
  }

  const processMessage = (text) => {
    // Try to parse trip details
    const parsed = parseTripFromText(text)
    const fillPage = (currentPage === 'landing' || currentPage === 'home')

    const intent = detectIntent(text)

      // --- Conversational intents (no trip parsing needed) ---
      if (intent === 'rude') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.rude), suggestions: DEST_SUGGESTIONS }])
        setTyping(false); return
      }
      if (intent === 'nice') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.nice) }])
        setTyping(false); return
      }
      if (intent === 'thanks') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.thanks) }])
        setTyping(false); return
      }
      if (intent === 'greeting') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.greeting), suggestions: DEST_SUGGESTIONS }])
        setTyping(false); return
      }
      if (intent === 'identity') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.identity) }])
        setTyping(false); return
      }
      if (intent === 'joke') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.joke) }])
        setTyping(false); return
      }
      if (intent === 'empathy') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.empathy), suggestions: DEST_SUGGESTIONS }])
        setTyping(false); return
      }
      if (intent === 'help') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.help) }])
        setShowChips(true); setTyping(false); return
      }
      if (intent === 'healthCheck') {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.healthCheck) }])
        setTyping(false); return
      }

      // --- Search trigger ---
      if (intent === 'search' && onTriggerSearch) {
        if (!isAuthenticated) {
          setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.searchGoUnauth) }])
          setTyping(false); return
        }
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.searchGo) }])
        setTyping(false)
        setTimeout(() => onTriggerSearch(), 500)
        return
      }

      // --- Trip parsing ---
      let fillData = parsed || {}
      const dests = { tokyo: { dest: 'Tokyo', code: 'HND' }, bali: { dest: 'Bali', code: 'DPS' }, london: { dest: 'London', code: 'LHR' }, paris: { dest: 'Paris', code: 'CDG' }, maldives: { dest: 'Maldives', code: 'MLE' }, hawaii: { dest: 'Hawaii', code: 'HNL' }, cancun: { dest: 'Cancun', code: 'CUN' }, rome: { dest: 'Rome', code: 'FCO' }, dubai: { dest: 'Dubai', code: 'DXB' }, sydney: { dest: 'Sydney', code: 'SYD' }, singapore: { dest: 'Singapore', code: 'SIN' }, seoul: { dest: 'Seoul', code: 'ICN' }, bangkok: { dest: 'Bangkok', code: 'BKK' }, amsterdam: { dest: 'Amsterdam', code: 'AMS' } }
      const lower = text.toLowerCase()
      let destInfo = null
      for (const [key, val] of Object.entries(dests)) {
        if (lower.includes(key)) { destInfo = val; fillData.destination = val.dest; break }
      }

      if (!fillData.destination) {
        setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.confused), suggestions: DEST_SUGGESTIONS }])
        setTyping(false); return
      }

      // Default fill values
      if (!fillData.origin) fillData.origin = 'SFO'
      if (!fillData.cabin) fillData.cabin = 'economy'
      if (!fillData.travelers) fillData.travelers = '1'
      const dateWasExplicit = !!fillData.dates
      if (!fillData.dates) fillData.dates = '2026-03-15'

      const originCities = { sfo: 'San Francisco (SFO)', jfk: 'New York (JFK)', nyc: 'New York (JFK)', lax: 'Los Angeles (LAX)', ord: 'Chicago (ORD)', dfw: 'Dallas (DFW)', atl: 'Atlanta (ATL)', sea: 'Seattle (SEA)', bos: 'Boston (BOS)', iad: 'Washington (IAD)', yyz: 'Toronto (YYZ)', yvr: 'Vancouver (YVR)' }
      const originDisplay = originCities[fillData.origin.toLowerCase()] || fillData.origin
      const destDisplay = destInfo ? destInfo.dest : fillData.destination
      const cabinDisplay = fillData.cabin.charAt(0).toUpperCase() + fillData.cabin.slice(1)
      const retDate = (() => { const { ret } = parseDates(fillData.dates); return ret || 'flexible' })()

      // Show summary with "Let's do it!" button
      const summaryText = `${pick(ZOE_BANTER.gotIt)}\n\n✈️ ${originDisplay} → ${destDisplay}\n📅 ${fillData.dates} → ${retDate}\n👥 ${fillData.travelers} traveler${fillData.travelers !== '1' ? 's' : ''} · ${cabinDisplay}${!dateWasExplicit ? '\n\n📆 I picked March — tap below to change:' : ''}`

      const doSearch = () => {
        if (onFillSearch) onFillSearch(fillData)
        if (!isAuthenticated) {
          setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.searchGoUnauth) }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: pick(ZOE_BANTER.searchGo) }])
          if (onTriggerSearch) setTimeout(() => onTriggerSearch(), 500)
        }
      }

      // Month chips for when date wasn't explicit
      const monthChips = !dateWasExplicit ? [
        { emoji: '🌸', label: 'March', query: `${fillData.origin} to ${destDisplay} in March ${fillData.cabin} ${fillData.travelers} people` },
        { emoji: '🌷', label: 'April', query: `${fillData.origin} to ${destDisplay} in April ${fillData.cabin} ${fillData.travelers} people` },
        { emoji: '☀️', label: 'May', query: `${fillData.origin} to ${destDisplay} in May ${fillData.cabin} ${fillData.travelers} people` },
        { emoji: '🏖️', label: 'June', query: `${fillData.origin} to ${destDisplay} in June ${fillData.cabin} ${fillData.travelers} people` },
      ] : null

      setMessages(prev => [...prev, { role: 'assistant', content: summaryText, action: { label: "Let's do it!", handler: doSearch }, suggestions: monthChips }])
      setTyping(false)
  }

  // Closed state — large prominent FAB with glow
  if (!isOpen) return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">      {nudgeVisible && (
        <div className="bg-gray-900/95 border border-blue-500/40 rounded-xl px-4 py-3 shadow-xl max-w-[240px] animate-fade-in">
          <p className="text-white text-sm font-medium">👋 Hey! I'm Zoe</p>
          <p className="text-gray-400 text-xs mt-1">Your points are probably worth more than you think. Let me prove it! ✈️</p>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-900/95 border-r border-b border-blue-500/40 transform rotate-45" />
        </div>
      )}
      <button onClick={() => setIsOpen(true)} className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center gap-4 px-10 py-5 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 group">
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" style={{ animationDuration: '2s' }} />
        <MessageCircle className="w-9 h-9 text-white" />
        <span className="text-white font-bold text-xl tracking-wide">Ask Zoe ✨</span>
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
      </button>
    </div>
  )

  // Open state
  return (
    <div className={`fixed z-50 flex flex-col bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-700 transition-all duration-300 ${expanded ? 'inset-0 sm:inset-4 sm:rounded-2xl' : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 sm:max-w-[calc(100vw-3rem)] h-[70vh] sm:h-[520px] sm:rounded-2xl rounded-t-2xl'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5 text-emerald-400" /></div><div><p className="text-white font-medium">Zoe</p><p className="text-emerald-400 text-xs">AI Travel Assistant</p></div></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white transition-colors" title={expanded ? 'Minimize' : 'Expand'}>{expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
          <button onClick={() => { setIsOpen(false); setExpanded(false) }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className={`${expanded ? 'max-w-2xl mx-auto' : ''} space-y-3`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`${expanded ? 'max-w-[70%]' : 'max-w-[85%]'} rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-emerald-500 text-white' : msg.role === 'steps' ? 'bg-transparent text-emerald-400 text-sm space-y-1' : 'bg-gray-800 text-gray-200'} ${expanded ? 'text-base' : ''}`}>
              {msg.content.split('\n').map((line, j) => line !== undefined && line !== 'undefined' ? <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p> : null)}
            </div>
            {/* Clickable action button */}
            {msg.action && (
              <button onClick={() => { msg.action.handler(); setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, action: null } : m)) }} className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
                <Zap className="w-4 h-4" /> {msg.action.label}
              </button>
            )}
            {/* Clickable destination suggestions */}
            {msg.suggestions && (
              <div className={`mt-2 flex flex-wrap gap-2 ${expanded ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                {msg.suggestions.map((s, si) => (
                  <button key={si} onClick={() => sendText(s.query)} className="bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-105">
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Quick search chips */}
        {showChips && !typing && (
          <div className={`space-y-2 ${expanded ? 'grid grid-cols-2 gap-2 space-y-0' : ''}`}>
            {QUICK_SEARCHES.map((item, i) => (
              <button key={i} onClick={() => handleQuickSearch(item)} className="w-full text-left bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white transition-all hover:scale-[1.02]">
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-400 text-xs block mt-0.5">{item.data.travelers} travelers • {item.data.dates}</span>
              </button>
            ))}
          </div>
        )}
        {typing && <div className="flex justify-start"><div className="bg-gray-800 rounded-2xl px-4 py-2"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div></div>}
        <div ref={endRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className={`flex gap-2 ${expanded ? 'max-w-2xl mx-auto' : ''}`}>
        <button onClick={listening ? stopListening : startListening} className={`p-2 rounded-xl transition-colors flex-shrink-0 ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`} aria-label={listening ? 'Stop recording' : 'Voice input'}>
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} placeholder={listening ? 'Listening...' : 'Tell me where you want to fly...'} className="flex-1 bg-gray-800 border border-gray-700 rounded-xl py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button onClick={send} disabled={!input.trim()} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 text-white p-2 rounded-xl flex-shrink-0"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  )
}

export default App
