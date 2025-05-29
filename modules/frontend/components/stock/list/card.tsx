import { ExternalLink, Calendar, User, Package } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {ResellableItem} from '@/store/state'

interface ProductCardProps {
  product: ResellableItem;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const originalPrice = product.price.discount ? product.price.buy / (1 - product.price.discount / 100) : product.price.buy

  return (
      <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
                src={product.listingDetails.image}
                alt={product.itemDetails.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop';
                }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                {product.listingDetails.condition}
              </Badge>
              {product.price.discount && product.price.discount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    -{product.price.discount}%
                  </Badge>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-white/90 text-xs">
                Size {product.itemDetails.size}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {product.itemDetails.brand}
            </p>
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
              {product.itemDetails.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              £{product.price.buy.toFixed(2)}
            </span>
              {product.price.discount && product.price.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                £{originalPrice.toFixed(2)}
              </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Package className="w-3 h-3" />
              <span>{product.price.quantityAvailable} left</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{product.listingDetails.seller}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(product.listingDetails.datePosted)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => window.open(product.listingDetails.url, '_blank')}
          >
            View Item
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
  );
};

export default ProductCard