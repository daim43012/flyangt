export const ANG01_CONTEXT_EN = `
═══ ANG-01 AIRCRAFT ═══

Model: ANG-01 — a 5-seat next-generation light aircraft (2019)
Based on LA-50, improved with carbon-fiber composites for reduced weight and better structural strength.

Key specs:
- Empty weight: 380 kg | Max takeoff: 950 kg | Useful load: 570 kg (~150% of own weight)
- Engine: Rotax 915 iS, 141 HP | Fuel: A-92 / A-95 / A-98 / 100LL
- Propeller: 3-blade variable pitch
- Landing gear: tricycle, hydraulically retractable
- Fuel tank: 245 L | Wing area: 10.8 m² | Wingspan: 9.6 m
- Max cruise: 345 km/h | Top speed: 360 km/h
- Landing speed: 80 km/h | Climb rate: 7 m/s
- Takeoff roll: 240 m | Landing roll: 150 m
- Service ceiling: 7,200 m (no engine power loss)

Safety & avionics:
- Ballistic parachute system: GRS 6 800-990 SDS (whole-aircraft recovery)
- Glass cockpit: Dynon SkyView HDX
- Onboard flight computer with error prevention

═══ ANGT TOKEN ═══

- Name: ANGT
- Network: Polygon (ERC-20)
- Total supply: 500,000,000 ANGT (fixed — no minting, no inflation)
- Purpose: investment token tied to the FlyANGT aviation project
- Listing plan: DEX (Uniswap/QuickSwap on Polygon) after presale & vesting phases

═══ TOKENOMICS (500M ANGT) ═══

Treasury Fund:      175M (35%) — project governance & reserves
Limited Partners:    60M (12%) — strategic partners
Marketing:           50M (10%) — growth, partnerships, awareness
Community:           50M (10%) — rewards, missions, ecosystem incentives
Presale:             50M (10%) — early distribution (current phase)
Liquidity:           40M  (8%) — DEX liquidity pools
Dev Team:            25M  (5%) — team allocation (with vesting schedule)
Advisors:            20M  (4%) — expert support
Airdrop:             15M  (3%) — free distribution to community
Reserve:             15M  (3%) — operational buffer

═══ PRESALE ═══

- Status: LIVE (Early Bird phase)
- Goal: 50,000,000 ANGT
- End date: May 4, 2026, 23:59:59 UTC
- Pricing: starts at launch price, increases 10% every week
- No minimum purchase amount
- Payment methods:
  • Crypto: USDT or USDC on the Polygon network
  • Card: Visa/Mastercard via Stripe (requires connected wallet for token delivery)
- Token delivery: tokens are distributed during the vesting phase after presale ends (NOT immediately)
- Page: /app/presale

How crypto purchase works:
1. Connect your wallet (MetaMask, Rabby, etc.)
2. Make sure you're on the Polygon network
3. Have USDT or USDC in your wallet
4. Have a small amount of POL for gas fees (~0.5 POL is plenty)
5. Select Crypto → enter amount → Approve token → Confirm purchase

How Stripe purchase works:
1. Connect your wallet (needed for token delivery address)
2. Select Stripe → enter amount → Confirm
3. Complete payment on the Stripe checkout page
4. Tokens will be assigned to your wallet address during vesting

═══ AIRDROP ═══

Free token rewards for completing tasks:

| Task | Reward | How |
|------|--------|-----|
| Connect wallet | +50 ANG | Connect any EVM wallet on the platform |
| Complete profile | +100 ANG | Fill in your details at /app/config |
| Follow on Instagram | +75 ANG | Follow @flyangt on Instagram |
| Find Instagram code | +50 ANG | Find the hidden code in Instagram posts |
| Invite a friend | +150 ANG | Share your referral link (friend must connect wallet) |
| Presale $500+ | +200 ANG | Make a presale purchase of $500 or more |

Total possible: up to 625 ANG per user
Page: /app/airdrop

═══ STAKING & REWARDS ═══

- APY: 12% fixed annual yield
- Lock period: 180 days
- Payouts: monthly
- Status: LOCKED — activates after token listing on DEX
- Page: /app/rewards

═══ ROADMAP ═══

Phase 1: PRESALE (current) — Token sale with weekly price increases
Phase 2: VESTING — Token distribution to presale buyers
Phase 3: AIRDROP — Reward distribution to task completers
Phase 4: TOKEN LISTING — Launch on DEX (Uniswap/QuickSwap on Polygon)
Phase 5: STAKING ACTIVATION — Rewards program goes live

═══ BUSINESS MODEL ═══

Three pillars:
1. Physical Hub — Aircraft hangar near Cyprus international airport: assembly, testing, and maintenance of ANG-01 aircraft
2. Airport Operations — Runway access, logistics infrastructure, safety compliance
3. Digital Platform — FlyANGT web platform with knowledge base, flight calculations, token integration, and investor dashboard

═══ PLATFORM PAGES ═══

- /app/dashboard — Main overview: balances, investment pool, community activity
- /app/presale — Token presale terminal (crypto + Stripe)
- /app/airdrop — Tasks to earn free tokens
- /app/rewards — Staking rewards (locked until listing)
- /app/documents — Flight manual, documentation
- /app/config — Profile settings
- /whitepaper — Project whitepaper
- /about — About the project and team

═══ TEAM ═══

- Artem Prokopenko — CEO, Founder
- Vladimir Morgunov — Director of Production & Chief Pilot (Major General of Aviation)
- Vladimir Gatsko — CTO (token architecture, blockchain, platform)
- Liia Khatkova — Head of Communications (brand, content strategy)
- Andrey Sakhno — Business Development
- Oleksiy Shevchenko — CDO, Head of PMO

═══ SOCIAL & COMMUNITY ═══

- Instagram: @flyangt (primary channel)
- Website: flyangt.com

═══ TECHNICAL DETAILS (for advanced users) ═══

- Blockchain: Polygon PoS (Chain ID: 137, hex: 0x89)
- Gas token: POL (formerly MATIC)
- Accepted stablecoins: USDT and USDC (6 decimals)
- Wallet support: MetaMask, Rabby, Coinbase Wallet, Brave, OKX, Phantom, WalletConnect
- Smart contracts: deployed on Polygon mainnet (addresses not public until listing)
- RPC: polygon-rpc.com
- Block explorer: polygonscan.com
`;

// Both languages use the same English context
export const ANG01_CONTEXT_RU = ANG01_CONTEXT_EN;
