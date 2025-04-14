import { getCollectionProducts } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  try {
    const products = await getCollectionProducts({ collection: handle });

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found in collection' }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error(`Error fetching products from collection ${handle}:`, error);
    return NextResponse.json(
      { error: 'Error fetching products from collection' },
      { status: 500 }
    );
  }
}
