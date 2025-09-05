import { Product } from '@/types';
import bananaImg from '@/assets/banana.jpg';
import applesImg from '@/assets/apples.jpg';
import riceImg from '@/assets/rice.jpg';
import milkImg from '@/assets/milk.jpg';
import breadImg from '@/assets/bread.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    price: 2.99,
    image: bananaImg,
    category: 'fruits'
  },
  {
    id: '2',
    name: 'Fresh Organic Apples',
    price: 4.99,
    image: applesImg,
    category: 'fruits'
  },
  {
    id: '3',
    name: 'Brown Rice (Organic)',
    price: 8.99,
    image: riceImg,
    category: 'grains'
  },
  {
    id: '4',
    name: 'Organic Whole Milk',
    price: 3.99,
    image: milkImg,
    category: 'dairy'
  },
  {
    id: '5',
    name: 'Artisan Bread',
    price: 5.99,
    image: breadImg,
    category: 'bakery'
  },
  {
    id: '6',
    name: 'Organic Spinach',
    price: 3.49,
    image: bananaImg, // Reusing for demo
    category: 'vegetables'
  },
  {
    id: '7',
    name: 'Free-Range Eggs',
    price: 6.99,
    image: milkImg, // Reusing for demo
    category: 'dairy'
  },
  {
    id: '8',
    name: 'Quinoa (Organic)',
    price: 12.99,
    image: riceImg, // Reusing for demo
    category: 'grains'
  }
];

export const searchProducts = (query: string): Product[] => {
  if (!query) return products;
  
  return products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
  );
};