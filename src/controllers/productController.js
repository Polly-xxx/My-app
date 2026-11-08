import products from '../data/products.js';
import { productService } from '../services/productService.js';

export const getProducts = (req, res) => {
    const { filter, sort } = req.query;
    let displayProducts = products;

    // Применяем фильтр по цене из сервиса
    if (filter === 'cheap') {
        displayProducts = productService.getCheapProducts(3000);
    } 

    // Применяем сортировку из сервиса
    if (sort === 'price') {
        displayProducts = productService.getSortedByPrice();
    }

    res.render('products', { products: displayProducts }); //отрисовать страницу
};

export const getProductById = (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).send("Товар не найден");
    }
    res.render('product', { product });
};
