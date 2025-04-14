'use client';

import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';

export function CremeVariantGallery({
  product,
  showHeading = true
}: {
  product: Product;
  showHeading?: boolean;
}) {
  // Get color options if they exist
  const colorOption = product.options.find(
    option => option.name.toLowerCase() === 'color' || 
              option.name.toLowerCase() === 'farbe' || 
              option.name.toLowerCase() === 'colour'
  );
  
  // If no color options found, return nothing
  if (!colorOption || !product.variants || product.variants.length === 0) {
    return null;
  }
  
  // Color mapping for 3D model
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      "Weiß": "#f1f1f1",
      "White": "#f1f1f1",
      "Schwarz": "#212121",
      "Black": "#212121",
      "Gold": "#FFD700",
      "Silber": "#C0C0C0",
      "Silver": "#C0C0C0",
      "Kupfer": "#B87333",
      "Copper": "#B87333",
      "Blau": "#1E90FF",
      "Blue": "#1E90FF",
      "Rot": "#DC143C", 
      "Red": "#DC143C",
      "Grün": "#2E8B57",
      "Green": "#2E8B57",
      "Gelb": "#FFD700",
      "Yellow": "#FFD700",
    };
    
    return colorMap[colorName] || "#f1f1f1";
  };
  
  // Prepare variants for display
  const variantItems = colorOption.values.map(colorValue => {
    // Find a variant that matches this color
    const matchingVariant = product.variants.find(variant => 
      variant.selectedOptions.some(
        option => (option.name.toLowerCase() === 'color' || 
                  option.name.toLowerCase() === 'farbe' || 
                  option.name.toLowerCase() === 'colour') && 
                  option.value === colorValue
      )
    );
    
    if (!matchingVariant) return null;
    
    // Create URL params for this variant
    const variantParams = matchingVariant.selectedOptions.reduce(
      (params, option) => {
        params[option.name.toLowerCase()] = option.value;
        return params;
      },
      {} as Record<string, string>
    );
    
    const variantUrl = createUrl(`/product/${product.handle}`, new URLSearchParams(variantParams));
    
    return {
      variant: matchingVariant,
      colorValue,
      url: variantUrl,
      colorCode: getColorCode(colorValue)
    };
  }).filter(Boolean);
  
  // Duplicate variants to make the carousel loop and fill wide screens
  const carouselVariants = [...variantItems, ...variantItems, ...variantItems];
  
  return (
    <div className="w-full mt-8">
      {showHeading && (
        <h2 className="mb-4 text-2xl font-medium">Alle Lampenvarianten</h2>
      )}
      
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {carouselVariants.map((item, i) => (
            <li
              key={`${item?.variant.id}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link href={item?.url || '#'} className="relative h-full w-full">
                <GridTileImage
                  alt={`${product.title} - ${item?.colorValue}`}
                  label={{
                    title: `${product.title} - ${item?.colorValue || ''}`,
                    amount: item?.variant.price.amount || '',
                    currencyCode: item?.variant.price.currencyCode || ''
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  style={{
                    backgroundColor: item?.colorCode
                  }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
