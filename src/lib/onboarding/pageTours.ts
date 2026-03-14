export type PageTourStep = {
  selector: string;
  title: string;
  description: string;
  tooltipPosition: "top" | "bottom" | "left" | "right";
  icon: string;
};

export type PageTourDef = {
  pageId: string;
  routeMatch: string;
  steps: PageTourStep[];
};

export const PAGE_TOURS: PageTourDef[] = [
  {
    pageId: "dashboard",
    routeMatch: "/app/dashboard",
    steps: [
      {
        selector: '[data-tour-page="hero"]',
        title: "Command Center",
        description:
          "Overview of your flight status, weather, and personalized greeting. Your starting point every day.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-sun",
      },
      {
        selector: '[data-tour-page="balances"]',
        title: "Token Balances",
        description:
          "Track your ANGT, POL, and stablecoin balances in real time. Data updates automatically from your wallet.",
        tooltipPosition: "left",
        icon: "fa-solid fa-wallet",
      },
      {
        selector: '[data-tour-page="investment"]',
        title: "Presale Progress",
        description:
          "See how much of the presale has been filled. Jump directly to the presale terminal from here.",
        tooltipPosition: "right",
        icon: "fa-solid fa-chart-line",
      },
      {
        selector: '[data-tour-page="roadmap"]',
        title: "Launch Roadmap",
        description:
          "Key milestones — presale, vesting, airdrop distribution, and exchange listing.",
        tooltipPosition: "right",
        icon: "fa-solid fa-road",
      },
      {
        selector: '[data-tour-page="community"]',
        title: "Quick Actions",
        description:
          "Shortcuts to buy tokens, earn airdrop, check rewards, or read the whitepaper.",
        tooltipPosition: "right",
        icon: "fa-solid fa-bolt",
      },
    ],
  },
  {
    pageId: "presale",
    routeMatch: "/app/presale",
    steps: [
      {
        selector: '[data-tour-page="presale-timer"]',
        title: "Presale Timer",
        description:
          "Live countdown showing time remaining in the current phase. Don't miss the early-bird pricing!",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-clock",
      },
      {
        selector: '[data-tour-page="presale-progress"]',
        title: "Presale Progress",
        description:
          "Total amount raised and percentage filled. The progress bar updates in real time.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-chart-pie",
      },
      {
        selector: '[data-tour-page="terminal"]',
        title: "Token Terminal",
        description:
          "Purchase ANGT tokens here. Choose between Stripe (card) or crypto (USDT/USDC), enter the amount, and confirm.",
        tooltipPosition: "right",
        icon: "fa-solid fa-terminal",
      },
      {
        selector: '[data-tour-page="recent-activity"]',
        title: "Recent Activity",
        description:
          "Your purchase history — both on-chain crypto and off-chain Stripe payments appear here.",
        tooltipPosition: "right",
        icon: "fa-solid fa-clock-rotate-left",
      },
      {
        selector: '[data-tour-page="price-roadmap"]',
        title: "Price Roadmap",
        description:
          "Weekly price schedule. Prices increase each week, so earlier purchases get a better deal.",
        tooltipPosition: "left",
        icon: "fa-solid fa-route",
      },
    ],
  },
  {
    pageId: "airdrop",
    routeMatch: "/app/airdrop",
    steps: [
      {
        selector: '[data-tour-page="airdrop-timer"]',
        title: "Airdrop Timer",
        description:
          "Countdown to airdrop distribution. Complete tasks now to maximize your rewards before time runs out.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-hourglass-half",
      },
      {
        selector: '[data-tour-page="airdrop-earned"]',
        title: "Your Earnings",
        description:
          "Total ANGT tokens earned from completed tasks. Track progress toward the maximum reward.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-coins",
      },
      {
        selector: '[data-tour-page="airdrop-tasks"]',
        title: "Earning Tasks",
        description:
          "Complete tasks to earn free ANGT — connect wallet, follow social media, invite friends, and more.",
        tooltipPosition: "top",
        icon: "fa-solid fa-list-check",
      },
    ],
  },
  {
    pageId: "rewards",
    routeMatch: "/app/rewards",
    steps: [
      {
        selector: '[data-tour-page="rewards-timer"]',
        title: "Rewards Timer",
        description:
          "Countdown to when staking rewards unlock. Available after the token is listed on exchanges.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-hourglass-half",
      },
      {
        selector: '[data-tour-page="rewards-yield"]',
        title: "Annual Yield",
        description:
          "Current staking APY and reward terms. Fixed monthly rewards with a 180-day lock period.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-percent",
      },
      {
        selector: '[data-tour-page="rewards-terms"]',
        title: "Staking Terms",
        description:
          "Lock period, payout frequency, and unlock schedule at a glance.",
        tooltipPosition: "top",
        icon: "fa-solid fa-file-contract",
      },
      {
        selector: '[data-tour-page="rewards-station"]',
        title: "Reward Station",
        description:
          "Deposit USDT to stake, view locked amount, expected monthly returns, and the full reward schedule.",
        tooltipPosition: "top",
        icon: "fa-solid fa-vault",
      },
    ],
  },
  {
    pageId: "documents",
    routeMatch: "/app/documents",
    steps: [
      {
        selector: '[data-tour-page="docs-hero"]',
        title: "Document Center",
        description:
          "Access all official ANG-01 documentation. Manuals organized by category for easy reference.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-book",
      },
      {
        selector: '[data-tour-page="docs-grid"]',
        title: "Document Library",
        description:
          "Browse build, flight, and maintenance manuals. Filter by category with tabs. Click any card to open.",
        tooltipPosition: "top",
        icon: "fa-solid fa-folder-open",
      },
    ],
  },
  {
    pageId: "config",
    routeMatch: "/app/config",
    steps: [
      {
        selector: '[data-tour-page="cfg-hero"]',
        title: "ANG Configurator",
        description:
          "Build your ideal ANG-01 aircraft. Select engine, avionics, interior, safety, and paint options.",
        tooltipPosition: "bottom",
        icon: "fa-solid fa-plane",
      },
      {
        selector: '[data-tour-page="cfg-options"]',
        title: "Configuration Options",
        description:
          "Choose upgrades in each category. Prices and weight impact update in real time as you select.",
        tooltipPosition: "right",
        icon: "fa-solid fa-sliders",
      },
      {
        selector: '[data-tour-page="cfg-summary"]',
        title: "Order Summary",
        description:
          "Review total price, weight, and lead time. When ready, click to submit your order request.",
        tooltipPosition: "left",
        icon: "fa-solid fa-receipt",
      },
    ],
  },
];
