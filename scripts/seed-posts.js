import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    slug: 'angt-presale-is-live',
    title: 'ANGT Token Presale is Now Live',
    excerpt:
      'The official ANGT token presale has launched. Secure your tokens at the earliest stage and join the future of aviation-grade digital assets.',
    image: '/images/presale.png',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'The Wait is Over' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'We are thrilled to announce that the ANGT token presale officially launched on February 22, 2026. This marks a pivotal milestone for the FlyANGT ecosystem as we open the doors for early supporters to acquire ANGT at the most favorable terms.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Why Join the Presale?' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Early participants gain access to ANGT at the lowest price before public listing. The presale is structured in tiers \u2014 the earlier you enter, the better the rate. Tokens purchased during the presale will be fully unlocked at TGE.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'How to Participate' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Create an account or log in to the FlyANGT platform.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Navigate to the Presale section in your dashboard.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Choose your desired amount and complete the purchase via crypto or card.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Key Details' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Start date: ',
                    },
                    {
                      type: 'text',
                      text: 'February 22, 2026 at 10:34 PM UTC',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Network: ',
                    },
                    { type: 'text', text: 'Polygon (ERC-20)' },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Payment methods: ',
                    },
                    {
                      type: 'text',
                      text: 'USDT, USDC, ETH, credit card via Stripe',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Don't miss this opportunity. The presale allocation is limited, and tiers fill up fast. Join now and be part of the aviation revolution.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'earn-angt-airdrop',
    title: 'Earn Free ANGT Tokens with Our Airdrop Program',
    excerpt:
      'Complete simple tasks, climb the leaderboard, and earn ANGT tokens for free. Our airdrop program rewards active community members.',
    image: '/images/airdrop.png',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Free Tokens, Real Rewards' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The FlyANGT Airdrop Program is live! We believe in rewarding our community, so we've designed a task-based airdrop where anyone can earn ANGT tokens simply by engaging with the ecosystem.",
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'How It Works' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Each task you complete earns you points. The more points you accumulate, the larger your airdrop allocation. Tasks refresh regularly, so keep checking back for new opportunities.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Available Tasks' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Connect your wallet ',
                    },
                    {
                      type: 'text',
                      text: '\u2014 Link your Polygon wallet to your FlyANGT account.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Follow on social media ',
                    },
                    {
                      type: 'text',
                      text: '\u2014 Follow our official Instagram and other channels.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Refer friends ',
                    },
                    {
                      type: 'text',
                      text: '\u2014 Share your referral link and earn bonus points for each sign-up.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Participate in presale ',
                    },
                    {
                      type: 'text',
                      text: '\u2014 Presale participants receive additional airdrop points.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [
            { type: 'text', text: 'Leaderboard & Distribution' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Your ranking on the leaderboard determines your share of the airdrop pool. Top contributors receive bonus multipliers. The airdrop distribution will happen at TGE \u2014 tokens will be sent directly to your connected wallet.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Head to the Airdrop section in your dashboard to start earning today. Every task counts!',
            },
          ],
        },
      ],
    },
  },
];

async function main() {
  for (const post of posts) {
    const result = await prisma.flyPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
      },
      create: post,
    });
    console.log(`Upserted: ${result.slug} (${result.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
