import { getProducts } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('search') || '';
  
  try {
    const products = await getProducts({
      query: query,
      reverse: false,
      sortKey: 'TITLE'
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Error searching products' },
      { status: 500 }
    );
  }
}
