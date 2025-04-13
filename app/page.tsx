import HomePageClient from 'components/home/home-page-client';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <HomePageClient />
      {/* <ThreeItemGrid />
      <Carousel /> */}
    </>
  );
}
