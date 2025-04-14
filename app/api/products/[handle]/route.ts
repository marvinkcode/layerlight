import { getProduct } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  try {
    const product = await getProduct(handle);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product with handle ${handle}:`, error);
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    );
  }
}
