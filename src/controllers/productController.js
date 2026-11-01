import products from '../data/products.js';

export const getProducts = (req, res) => {
    res.render('products', { products });
};

export const getProductById = (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).send("Товар не найден");
    }
    res.render('product', { product });
};
