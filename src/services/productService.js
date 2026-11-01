import products from '../data/products.js';

export const productService = {
    getCheapProducts: (maxPrice = 3000) => {
        return products.filter(p => p.price < maxPrice);
    },
    getSortedByPrice: () => {
        return [...products].sort((a, b) => a.price - b.price);
    }
};
