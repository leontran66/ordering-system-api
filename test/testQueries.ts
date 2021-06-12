export const deleteCart = 'DELETE FROM orders WHERE status = \'cart\'';
export const deleteCartItems = 'DELETE FROM order_items WHERE product_id = $1';
export const getCartItem = 'SELECT * FROM order_items WHERE product_id = $1';

export const createCategory = 'INSERT INTO categories (title) VALUES($1)';
export const deleteCategory = 'DELETE FROM categories WHERE title = $1';
export const getCategory = 'SELECT * FROM categories WHERE title = $1';

export const createProduct = 'INSERT INTO products (category_id, name, price, description) VALUES(${category}, ${name}, ${price}, ${description})';
export const deleteProduct = 'DELETE FROM products WHERE name = $1';
export const getProduct = 'SELECT * FROM products WHERE name = $1';
