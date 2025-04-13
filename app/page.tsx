import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import FeaturedModel from 'components/home/featured-model';
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
      <ThreeItemGrid />
      <FeaturedModel />
      <Carousel />
    </>
  );
}
