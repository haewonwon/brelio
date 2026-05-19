import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articles = [
  {
    title: 'Federal Reserve Signals Caution on Future Rate Cuts',
    source: 'Global Economy Daily',
    summary:
      'The Federal Reserve said it will continue watching inflation and labor market data before making additional rate decisions.',
    url: 'https://example.com/economy/fed-rate-cuts-caution',
    publishedAt: new Date('2026-05-18T09:00:00.000Z'),
  },
  {
    title: 'Oil Prices Rise as Supply Concerns Return',
    source: 'Market Brief',
    summary:
      'Crude oil prices moved higher after traders reacted to renewed supply concerns and stronger seasonal demand expectations.',
    url: 'https://example.com/economy/oil-prices-supply-concerns',
    publishedAt: new Date('2026-05-17T11:30:00.000Z'),
  },
  {
    title: 'US Retail Sales Show Modest Growth',
    source: 'Commerce Watch',
    summary:
      'Retail sales increased slightly, suggesting consumers remain cautious but continue spending on essential categories.',
    url: 'https://example.com/economy/us-retail-sales-growth',
    publishedAt: new Date('2026-05-16T14:00:00.000Z'),
  },
  {
    title: 'Global Shipping Costs Ease After Port Delays Improve',
    source: 'Trade Monitor',
    summary:
      'Shipping costs declined as major ports reported shorter delays and improved cargo processing times.',
    url: 'https://example.com/economy/shipping-costs-ease',
    publishedAt: new Date('2026-05-15T08:15:00.000Z'),
  },
  {
    title: 'Small Business Confidence Edges Higher',
    source: 'Business Ledger',
    summary:
      'A new survey showed small business owners are slightly more optimistic about sales and hiring over the next quarter.',
    url: 'https://example.com/economy/small-business-confidence',
    publishedAt: new Date('2026-05-14T10:45:00.000Z'),
  },
];

async function main() {
  for (const article of articles) {
    await prisma.article.upsert({
      where: {
        url: article.url,
      },
      update: article,
      create: article,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
