'use client';

import Price from 'components/price';
import { Product, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ModelViewer from './model-viewer';
import { useProduct } from './product-context';

type VariantGalleryProps = {
  productHandle?: string;       // The product handle to fetch
  productSearch?: string;       // Search string to find a product
  collectionHandle?: string;    // Collection handle to fetch all products
  showHeading?: boolean;
  product?: Product;            // Optional direct product object
};

export default function VariantGallery({ 
  productHandle,
  productSearch,
  collectionHandle,
  showHeading = true,
  product: initialProduct
}: VariantGalleryProps) {
  const [products, setProducts] = useState<Product[]>(initialProduct ? [initialProduct] : []);
  const [loading, setLoading] = useState(!initialProduct && (!!productHandle || !!productSearch || !!collectionHandle));
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  // Fetch product data if handle, search, or collection is provided and no direct product
  useEffect(() => {
    if (initialProduct) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/products';
        
        if (collectionHandle) {
          // Fetch all products from a collection
          url = `/api/collections/${encodeURIComponent(collectionHandle)}/products`;
        } else if (productHandle) {
          // Fetch a specific product by handle
          url = `/api/products/${encodeURIComponent(productHandle)}`;
        } else if (productSearch) {
          // Search for products
          url = `/api/products?search=${encodeURIComponent(productSearch)}`;
        } else {
          throw new Error('Either productHandle, productSearch, or collectionHandle must be provided');
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        let data = await response.json();
        
        // Normalize the data structure
        let productsArray: Product[] = [];
        
        if (Array.isArray(data)) {
          // Result is already an array
          productsArray = data;
        } else if (data && typeof data === 'object') {
          // Single product result
          productsArray = [data];
        }
        
        if (productsArray.length === 0) {
          throw new Error('No products found');
        }
        
        setProducts(productsArray);
        setSelectedProduct(productsArray[0]);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    if (productHandle || productSearch || collectionHandle) {
      fetchData();
    }
  }, [productHandle, productSearch, collectionHandle, initialProduct]);
  
  // Get search params early - Hook must not be called conditionally
  const searchParams = useSearchParams();
  
  // Try to use ProductContext if available, otherwise use searchParams directly
  let productState: Record<string, string> = {};
  let productContextAvailable = false;
  
  try {
    const { state } = useProduct();
    productState = state;
    productContextAvailable = true;
  } catch (error) {
    // If useProduct fails (not in a ProductProvider), create state from URL search params
    for (const [key, value] of searchParams.entries()) {
      productState[key] = value;
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>Loading product variants...</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        {error}
      </div>
    );
  }
  
  // If no products were found
  if (products.length === 0) {
    return (
      <div className="p-4 text-center">
        No products found
      </div>
    );
  }
  
  // Get color map for the 3D model
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
  
  // Create a model path and default color for 3D model display
  const modelPath = "/models/creme/together.stl";
  const modelColor = selectedVariant 
    ? getColorCode(selectedVariant.selectedOptions.find(
        option => (option.name.toLowerCase() === 'color' || 
                  option.name.toLowerCase() === 'farbe' || 
                  option.name.toLowerCase() === 'colour')
      )?.value || 'White')
    : "#f1f1f1";
  
  // Handle variant hover
  const handleVariantHover = (product: Product, variant: ProductVariant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
  };
  
  return (
    <div className="w-full">
      {showHeading && (
        <h2 className="mb-6 text-2xl font-medium">Produkte aus der Kollektion</h2>
      )}
      
      <div className="flex flex-col items-center gap-8">
        {/* 3D model preview */}
        <div className="relative aspect-square w-full max-w-lg max-h-[400px] mb-6">
          <ModelViewer modelPath={modelPath} initialColor={modelColor} />
        </div>
        
        {/* Products and their variants */}
        {products.map((product) => {
          // Skip if product structure is invalid
          if (!product || !product.options || !product.variants) {
            return null;
          }
          
          // Get color options if they exist
          const colorOption = product.options.find(
            option => option.name.toLowerCase() === 'color' || 
                     option.name.toLowerCase() === 'farbe' || 
                     option.name.toLowerCase() === 'colour'
          );
          
          // Skip if no color options
          if (!colorOption) {
            return null;
          }
          
          // Prepare individual variants for display
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
          
          if (variantItems.length === 0) {
            return null;
          }
          
          // Duplicate variants to make the carousel loop and fill wide screens
          const carouselVariants = [...variantItems, ...variantItems, ...variantItems];
          
          return (
            <div key={product.id} className="w-full mb-10">
              <h3 className="text-xl font-medium mb-4">{product.title}</h3>
              
              <div className="w-full overflow-x-auto pb-6 pt-1">
                <ul className="flex animate-carousel gap-4">
                  {carouselVariants.map((item, i) => (
                    <li
                      key={`${item!.variant.id}${i}`}
                      className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
                    >
                      <Link
                        href={item!.url}
                        className="relative h-full w-full"
                        prefetch={false}
                        onMouseEnter={() => handleVariantHover(product, item!.variant)}
                        onMouseLeave={() => setSelectedVariant(null)}
                      >
                        <div 
                          className="h-full w-full flex items-center justify-center rounded-lg border overflow-hidden"
                          style={{ 
                            backgroundColor: item!.colorCode,
                            borderColor: productState[colorOption.name.toLowerCase()] === item!.colorValue 
                              ? 'rgb(37, 99, 235)' 
                              : 'rgb(229, 231, 235)'
                          }}
                        >
                          <div className="p-4 text-center">
                            <h3 className="font-medium mb-2">{product.title}</h3>
                            <p className="text-sm mb-1">{item!.colorValue}</p>
                            <Price
                              className="text-sm"
                              amount={item!.variant.price.amount}
                              currencyCode={item!.variant.price.currencyCode}
                            />
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
