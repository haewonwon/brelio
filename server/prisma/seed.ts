/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const legacySeedArticleUrls = [
  'https://example.com/economy/fed-rate-cuts-caution',
  'https://example.com/economy/oil-prices-supply-concerns',
  'https://example.com/economy/us-retail-sales-growth',
  'https://example.com/economy/shipping-costs-ease',
  'https://example.com/economy/small-business-confidence',
];

const articles = [
  {
    title: '한국은행, 기준금리 동결 후 물가 흐름 주시',
    source: 'Brelio Seed',
    summary:
      '한국은행이 기준금리를 동결하고 향후 물가와 가계부채 흐름을 지켜보겠다고 밝혔습니다.',
    url: 'https://example.com/kr/economy/bok-rate-hold',
    publishedAt: new Date('2026-05-18T09:00:00.000Z'),
  },
  {
    title: '원달러 환율, 글로벌 달러 강세에 상승 마감',
    source: 'Brelio Seed',
    summary:
      '글로벌 달러 강세와 위험 회피 심리가 겹치며 원달러 환율이 상승세로 거래를 마쳤습니다.',
    url: 'https://example.com/kr/economy/krw-usd-exchange-rate',
    publishedAt: new Date('2026-05-17T11:30:00.000Z'),
  },
  {
    title: '반도체 수출 회복세에 4월 경상수지 흑자 확대',
    source: 'Brelio Seed',
    summary:
      '반도체 수출이 회복되면서 상품수지가 개선되고 경상수지 흑자 폭이 확대됐습니다.',
    url: 'https://example.com/kr/economy/current-account-surplus',
    publishedAt: new Date('2026-05-16T14:00:00.000Z'),
  },
  {
    title: '국제유가 상승에 국내 휘발유 가격 3주 연속 올라',
    source: 'Brelio Seed',
    summary:
      '국제유가 상승분이 반영되며 국내 주유소 휘발유 평균 가격이 3주 연속 상승했습니다.',
    url: 'https://example.com/kr/economy/gasoline-price-rise',
    publishedAt: new Date('2026-05-15T08:15:00.000Z'),
  },
  {
    title: '소상공인 체감경기 소폭 개선, 내수 회복 기대 커져',
    source: 'Brelio Seed',
    summary:
      '소비 심리가 일부 회복되면서 소상공인 체감경기가 전월보다 소폭 개선됐습니다.',
    url: 'https://example.com/kr/economy/small-business-sentiment',
    publishedAt: new Date('2026-05-14T10:45:00.000Z'),
  },
];

async function main() {
  await prisma.article.deleteMany({
    where: {
      url: {
        in: legacySeedArticleUrls,
      },
    },
  });

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
