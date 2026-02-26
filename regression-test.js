#!/usr/bin/env node
/**
 * RewardWise v2 Baseline Regression Test
 * =======================================
 * Run: node regression-test.js
 *
 * Validates all 12 PMA flows and critical behaviors.
 * Any FAIL = regression introduced. Do not deploy.
 *
 * Baseline frozen: 2026-02-21
 */

const fs = require('fs');
const path = require('path');

const APP = fs.readFileSync(path.join(__dirname, 'src/App.jsx'), 'utf8');
const CSS = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');

let pass = 0, fail = 0;
function check(label, condition) {
  if (condition) { pass++; console.log(`  ✅ ${label}`); }
  else { fail++; console.log(`  ❌ FAIL: ${label}`); }
}
function section(name) { console.log(`\n━━━ ${name} ━━━`); }

function between(startMarker, endMarker) {
  const s = APP.indexOf(startMarker);
  if (s === -1) return '';
  const e = endMarker ? APP.indexOf(endMarker, s + 1) : APP.length;
  return APP.substring(s, e > -1 ? e : APP.length);
}

const landing = between('function LandingPage', 'function WalletSetupPage');
const dashboard = between('function DashboardPage', 'function SearchPage');
const searchPage = between('function SearchPage', 'function WatchlistPage');
const wallet = between('function WalletSetupPage', 'function DashboardPage');
const healthCheck = between('function HealthCheckPage', 'function TransferOptimizerPage');
const transferOpt = between('function TransferOptimizerPage', 'function TripFeedbackPage');
const feedback = between('function TripFeedbackPage', '// ==================== FLOW 11');
const subscription = between('function SubscriptionPage', 'function ZoeChat');
const watchlist = between('function WatchlistPage', 'function ConciergePage');
const concierge = between('function ConciergePage', 'function HealthCheckPage');
const genVerdict = between('function generateVerdict', 'function formatDateNice');
const zoeChat = between('function ZoeChat', 'function SubscriptionPage');

// ==================== FLOW 1A/1B: LANDING + A/B TEST ====================
section('FLOW 1A/1B: Landing Page & A/B Test');
check('delayedSignup A/B flag defined', APP.includes('delayedSignup: Math.random()'));
check('showInlineSearch reads flag', landing.includes('showInlineSearch = abTests.delayedSignup'));
check('1B: full wizard (programs + balances + trip)', landing.includes('Which programs do you have') && landing.includes('Enter your balances') && landing.includes('FIND MY SAVINGS'));
check('1A: signup-first CTA', landing.includes('Get Started'));
check('1A: "try a search first" expander', landing.includes('Or try a search first'));
check('1A: showTrySearch state', landing.includes('showTrySearch'));
check('Shared: search → teaserResult', landing.includes('setTeaserResult'));
check('Shared: blurred verdict gate', landing.includes('blur-sm') && landing.includes('Full verdict is ready'));
check('Shared: ESTIMATED SAVINGS', landing.includes('ESTIMATED SAVINGS'));
check('Shared: CREATE FREE ACCOUNT', landing.includes('CREATE FREE ACCOUNT'));
check('Shared: inline signup form', landing.includes('signupEmail') && landing.includes('signupPassword'));
check('PAY CASH teaser for economy', landing.includes('PAY CASH'));

// ==================== AUTH GUARDS ====================
section('AUTH GUARDS');
check('Zoe hidden on signup/login only (NOT landing)', APP.includes("!['signup', 'login'].includes(currentPage)"));
check('Zoe visible on landing', !APP.includes("'landing'].includes(currentPage)"));

// ==================== FLOW 2: WALLET ====================
section('FLOW 2: Wallet Setup');
check('Transfer Potential', wallet.includes('Transfer Potential') || wallet.includes('transfer'));
check('Expiry alerts', wallet.includes('xpir'));
check('Balance entry', wallet.includes('balance'));

// ==================== FLOW 3: SEARCH + VERDICT ====================
section('FLOW 3: Search & Verdict');
check('Round trip / one way toggle', searchPage.includes('roundtrip') && searchPage.includes('oneway'));
check('Return date field', searchPage.includes('returnDate'));
check('Taxes/fees', searchPage.includes('Taxes/fees') || searchPage.includes('taxes'));
check('Seat availability timestamp', searchPage.includes('seats left as of'));
check('Route legs', genVerdict.includes('routeLegs'));
check('Return flight for round trips', genVerdict.includes('returnFlight'));
check('RT pricing doubles', genVerdict.includes('rtMult') && genVerdict.includes('totalPts'));
check('isRoundTrip flag', genVerdict.includes("isRoundTrip: tripType === 'roundtrip'"));
check('Outbound + Return labels', searchPage.includes('Outbound') && searchPage.includes('Return'));
check('↔ for round trips', searchPage.includes('↔'));
check('(RT) label on pricing', searchPage.includes('(RT)'));
check('Save Trip button', searchPage.includes('Save<'));
check('Watch (bell) button', searchPage.includes('Bell'));

// ==================== FLOW 4: PAY CASH ====================
section('FLOW 4: Pay Cash Verdict');
check('Cash verdict generated', genVerdict.includes("type: 'cash'"));
check('Domestic economy → cash', genVerdict.includes('isDomestic && isEconomy'));
check('Use Points Anyway button', dashboard.includes('Use Points Anyway'));

// ==================== FLOW 5: WATCHLIST ====================
section('FLOW 5: Watchlist');
check('Price change indicators', watchlist.includes('priceChange'));
check('Book Now / Snooze / Dismiss', watchlist.includes('Book Now') && watchlist.includes('Snooze') && watchlist.includes('Dismiss'));

// ==================== FLOW 6/7: CONCIERGE ====================
section('FLOW 6/7: Concierge');
check('Order numbers (RW-)', concierge.includes('RW-'));
check('Pricing ($39/$199)', concierge.includes('39') && concierge.includes('199'));
check('Cancel Request', concierge.includes('Cancel'));

// ==================== FLOW 8: HEALTH CHECK ====================
section('FLOW 8: Health Check');
check('Portfolio Score', healthCheck.includes('Portfolio Score'));
check('Q1 2026 header', healthCheck.includes('Q1 2026'));
check('Per-program bar chart', healthCheck.includes('Program Breakdown'));
check('vs Last Quarter QoQ', healthCheck.includes('vs Last Quarter'));
check('QoQ metrics', healthCheck.includes('Points Change') && healthCheck.includes('Value Change') && healthCheck.includes('Avg CPP'));
check('Warnings + Opportunities', healthCheck.includes('Warnings') && healthCheck.includes('Opportunities'));
check('Set Reminders + Export PDF', healthCheck.includes('Set Reminders') && healthCheck.includes('Export PDF'));

// ==================== FLOW 9: TRANSFER OPTIMIZER ====================
section('FLOW 9: Transfer Optimizer');
check('5 ranked paths (#1 BEST to #5 AVOID)', transferOpt.includes('#1 BEST') && transferOpt.includes('#5 AVOID'));

// ==================== FLOW 10: TRIP FEEDBACK ====================
section('FLOW 10: Trip Feedback');
check('Star rating', feedback.includes('rating'));
check('Verdict accuracy', feedback.includes('verdictAccuracy'));
check('Priority ranking with movePriority', feedback.includes('priorities') && feedback.includes('movePriority'));
check('↑/↓ reorder buttons', feedback.includes('ChevronUp') && feedback.includes('ChevronDown'));
check('Post-submit ↑/↓ vs original order', feedback.includes('origOrder') && feedback.includes('origIdx'));
check('View My Preferences / Edit Manually', feedback.includes('View My Preferences') && feedback.includes('Edit Manually'));
check('Future verdicts will:', feedback.includes('Future verdicts will'));

// ==================== FLOW 11: SUBSCRIPTION ====================
section('FLOW 11: Subscription');
check('Cancel Plan', subscription.includes('Cancel'));
check('Annual plan savings', subscription.includes('34%') || subscription.includes('annual'));

// ==================== FLOW 12: PAYWALL ====================
section('FLOW 12: Paywall / Free Tier');
check('Search limit tracking', APP.includes('incrementSearch'));
check('Single Verdict purchase', APP.includes('Single Verdict'));

// ==================== CONFETTI + UX ====================
section('CONFETTI & UX');
check('ConfettiCelebration component', APP.includes('function ConfettiCelebration'));
check('No popup intercepts results', (APP.match(/setShowVerdictPopup\(true\)/g) || []).length === 0);
check('Confetti z-index: 60', CSS.includes('z-index: 60'));
check('Auto-scroll to results (search)', searchPage.includes('scrollIntoView'));
check('Auto-scroll to results (dashboard)', dashboard.includes('scrollIntoView'));

// ==================== DATE AUTO-FILL ====================
section('DATE AUTO-FILL');
check('SearchPage auto-fills departDate when empty', searchPage.includes("if (!departDate)") && searchPage.includes('setDepartDate'));
check('SearchPage auto-fills returnDate for round trips', searchPage.includes("if (!returnDate && tripType === 'roundtrip')"));
check('Dashboard auto-fills departDate when empty', dashboard.includes("if (!departDate)") && dashboard.includes('setDepartDate'));
check('Dashboard auto-fills returnDate for round trips', dashboard.includes("if (!returnDate && tripType === 'roundtrip')"));
check('PendingSearch: validates YYYY-MM-DD format', searchPage.includes('test(pendingSearch.dates)'));

// ==================== ROUND TRIP CONSISTENCY ====================
section('ROUND TRIP END-TO-END');
check('generateVerdict accepts tripType', genVerdict.includes('tripType'));
const callers = APP.match(/generateVerdict\([^)]+\)/g) || [];
check('All callers pass tripType (' + callers.length + ' callers)', callers.length >= 3 && callers.every(c => c.includes('tripType')));
check('returnFlight null for one-way', genVerdict.includes(': null'));
check('Dashboard return flight', dashboard.includes('returnFlight'));
check('Dashboard ↔ + Round trip', dashboard.includes('↔') && dashboard.includes('Round trip'));

// ==================== ZOE ====================
section('ZOE CHAT');
check('Zoe component exists', zoeChat.length > 100);
check('Voice input icons', APP.includes('Mic') && APP.includes('MicOff'));
check('ZOE_BANTER personality system', APP.includes('ZOE_BANTER'));
check('Banter: rude/insult responses', APP.includes('ZOE_BANTER') && APP.includes('rude:'));
check('Banter: greeting responses', APP.includes('greeting:'));
check('Banter: thanks responses', APP.includes('thanks:'));
check('Banter: identity responses', APP.includes('identity:'));
check('Banter: joke responses', APP.includes('joke:'));
check('Banter: empathy responses', APP.includes('empathy:'));
check('Banter: confused fallback', APP.includes('confused:'));
check('Intent detection system', APP.includes('detectIntent'));
check('Random response picker', APP.includes('pick(ZOE_BANTER'));
check('Destination suggestions (DEST_SUGGESTIONS)', APP.includes('DEST_SUGGESTIONS'));
check('Suggestions on confused/fallback', APP.includes('suggestions: DEST_SUGGESTIONS'));
check('Let\'s do it action button', APP.includes("label: \"Let's do it!\"") || APP.includes("Let's do it!"));
check('Action button in message rendering', APP.includes('msg.action'));
check('Suggestion chips in message rendering', APP.includes('msg.suggestions'));
check('sendText for programmatic messages', APP.includes('sendText'));

// ==================== NAVIGATION UX ====================
section('NAVIGATION UX');
check('TopNav logo clickable → home', APP.includes("cursor-pointer\" onClick={() => navigate('home')"));
check('Zoe expand/collapse state', APP.includes('expanded') && APP.includes('setExpanded'));
check('Maximize2 icon imported', APP.includes('Maximize2'));
check('Minimize2 icon imported', APP.includes('Minimize2'));
check('Expanded mode: full screen', APP.includes('inset-0 sm:inset-4'));
check('Expanded mode: centered messages', APP.includes('max-w-2xl mx-auto'));
check('Close resets expanded', APP.includes('setExpanded(false)'));

// ==================== FIX 1: SIGNUP GUIDED SKIP ====================
section('SIGNUP GUIDED SKIP');
const signupPage = between('function SignUpPage', '// ==================== LOGIN');
check('Skip option exists on signup', signupPage.includes('Not planning a trip yet'));
check('Skip routes to wallet-setup', signupPage.includes("navigate('wallet-setup')"));
check('Skip text: show me wallet value', signupPage.includes('Just show me my wallet value'));

// ==================== FIX 2: DASHBOARD PORTFOLIO HERO ====================
section('DASHBOARD PORTFOLIO HERO');
const dashHero = between('function DashboardPage', '// ==================== SEARCH');
check('Portfolio hero section exists', dashHero.includes('Your Points Portfolio'));
check('ONE big number: total value', dashHero.includes('totalVal.toLocaleString'));
check('Month-over-month change', dashHero.includes('+$120 this month'));
check('Points count summary', dashHero.includes('points across'));
check('Mini card chips', dashHero.includes('card.logo') && dashHero.includes('card.program'));
check('View All wallet link', dashHero.includes('View All'));
check('Urgency alert: expiring points', dashHero.includes('Marriott points expire'));
check('Urgency alert action: Fix this', dashHero.includes('Fix this'));
check('Contextual headline (cards vs no cards)', dashHero.includes('Search for your next trip'));

// ==================== FIX 3: ALERTS BELL ====================
section('ALERTS BELL IN TOPNAV');
const topNav = between('function TopNav', '// ==================== LANDING');
check('Bell icon in TopNav', topNav.includes('Bell'));
check('Alert badge count', topNav.includes('alerts.length'));
check('Alert dropdown panel', topNav.includes('showAlerts'));
check('Alert types: warning, bonus, deal, seat', topNav.includes("type: 'warning'") && topNav.includes("type: 'bonus'") && topNav.includes("type: 'deal'") && topNav.includes("type: 'seat'"));
check('Clickable alerts navigate to pages', topNav.includes('navigate(alert.page)'));
check('Overlay dismiss on click outside', topNav.includes('fixed inset-0'));
check('View all alerts link', topNav.includes('View all alerts'));

// ==================== FIX 4: CONCIERGE HUB ====================
section('CONCIERGE HUB');
const conciergeHub = between('function ConciergeHubPage', '// ==================== FLOW 6');
check('ConciergeHubPage exists', conciergeHub.length > 100);
check('Side-by-side layout (grid cols-2)', conciergeHub.includes('grid md:grid-cols-2'));
check('Premium on LEFT with Most Popular badge', conciergeHub.includes('Most Popular'));
check('Premium price $199', conciergeHub.includes('$199'));
check('Standard price $39', conciergeHub.includes('$39'));
check('Premium features list', conciergeHub.includes('White-glove'));
check('Standard features list', conciergeHub.includes('Optimal flight'));
check('Premium CTA → concierge-premium', conciergeHub.includes("navigate('concierge-premium')"));
check('Standard CTA → concierge-standard', conciergeHub.includes("navigate('concierge-standard')"));
check('Social proof testimonial', conciergeHub.includes('Sarah K'));
check('Router: concierge hub route', APP.includes("case 'concierge': return <ConciergeHubPage"));
check('Profile links to hub (not separate)', !APP.includes("page: 'concierge-premium'") || APP.includes("page: 'concierge'"));

// ==================== FIX 5: ZOE MONTH CHIPS ====================
section('ZOE MONTH CHIPS');
check('Date explicit detection', APP.includes('dateWasExplicit'));
check('Month chips when date defaulted', APP.includes('monthChips'));
check('Month options: March, April, May, June', APP.includes("label: 'March'") && APP.includes("label: 'April'") && APP.includes("label: 'May'") && APP.includes("label: 'June'"));
check('Prompt: tap below to change', APP.includes('tap below to change'));

// ==================== ABOUT PAGE ====================
section('ABOUT PAGE');
const about = between('function AboutPage', '// ==================== ZOE CHAT');
check('AboutPage component exists', about.length > 100);
check('Founder story (Sabby Nagi)', about.includes('Sabby Nagi') && about.includes('Founder'));
check('Family narrative', about.includes('family') && about.includes('globe'));
check('Scan/Optimize/Go steps', about.includes('Scan') && about.includes('Optimize') && about.includes('Go'));
check('The Verdict messaging', about.includes('tell you the best move') || about.includes('tell you what to do') || about.includes('The Verdict'));
check('Circle vision', about.includes('Circle'));
check('Mission statement', about.includes('one human race') || about.includes('people who matter most'));
check('Customer savings message ($150+)', about.includes('$150'));
check('Heavy traveler savings (thousands)', about.includes('thousands'));
check('No business-sensitive TAM/SAM', !about.includes('TAM') && !about.includes('serviceable market') && !about.includes('$27 billion') && !about.includes('$1.5 billion'));
check('Happy family image', about.includes('img') && about.includes('family'));
check('Single section (no multiple h2 headers)', (about.match(/<h2 /g) || []).length === 0);
check('CTA: Get Started / Dashboard', about.includes('Get Started') && about.includes('Dashboard'));
check('Nav: About in TopNav', APP.includes("id: 'about'") && APP.includes("page: 'about'"));
check('Nav: About on landing page', APP.includes("navigate('about')"));
check('Router: about case', APP.includes("case 'about':"));

// ==================== TRIPS PAGE ====================
section('TRIPS PAGE');
const trips = between('function TripsPage', '// ==================== WATCHLIST');
check('TripsPage component exists', trips.length > 100);
check('Shows past trip history', trips.includes('pastTrips') && trips.includes('My Trips'));
check('Savings summary (total saved, trips count, avg)', trips.includes('Total saved') && trips.includes('Trips optimized') && trips.includes('Avg per trip'));
check('Trip cards with origin ↔ destination', trips.includes('↔'));
check('Points vs Cash verdict display', trips.includes('Used Points') && trips.includes('Paid Cash'));
check('Transfer path shown', trips.includes('Transfer path'));
check('Star ratings on trips', trips.includes('Star') && trips.includes('rating'));
check('New Search button', trips.includes("navigate('search')"));
check('Rate this trip → history', trips.includes("navigate('history')"));
check('activeTab is trip', trips.includes('activeTab="trip"'));
check('Router: trips case exists', APP.includes("case 'trips':"));
check('Trips tab is NOT search page', !APP.includes("page: 'search'") || !APP.includes("label: 'Trips', page: 'search'"));

// ==================== URL ROUTING ====================
section('URL ROUTING');
check('getPageFromURL function exists', APP.includes('getPageFromURL'));
check('history.pushState in navigate', APP.includes('history.pushState'));
check('popstate listener for back/forward', APP.includes('popstate'));
check('validPages includes home', APP.includes("'home'") && APP.includes('validPages'));
check('validPages includes trips', APP.includes("'trips'"));
check('validPages includes circle', APP.includes("'circle'"));
check('validPages includes history', APP.includes("'history'"));
check('validPages includes profile', APP.includes("'profile'"));

// ==================== SUMMARY ====================
console.log('\n' + '═'.repeat(50));
console.log(`  PASS: ${pass}  |  FAIL: ${fail}  |  TOTAL: ${pass + fail}`);
console.log('═'.repeat(50));

if (fail > 0) {
  console.log('\n⛔ REGRESSION DETECTED — Do not deploy.\n');
  process.exit(1);
} else {
  console.log('\n✅ All baseline checks passed. Safe to deploy.\n');
  process.exit(0);
}
