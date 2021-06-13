export const getCartItem = 'SELECT * FROM order_items WHERE product_id = $1';

export const createCategory = 'INSERT INTO categories (title) VALUES($1)';
export const deleteCategory = 'DELETE FROM categories';
export const getCategory = 'SELECT * FROM categories WHERE title = $1';

export const createOrder = 'INSERT INTO orders (user_id, status, type, notes) VALUES (${user}, ${status}, ${type}, ${notes})';
export const createOrderItem = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES (${order}, ${product}, ${quantity})';
export const deleteOrder = 'DELETE FROM orders';
export const deleteOrderItems = 'DELETE FROM order_items';
export const getOrder = 'SELECT * FROM orders WHERE status = $1';

export const createProduct = 'INSERT INTO products (category_id, name, price, description) VALUES(${category}, ${name}, ${price}, ${description})';
export const deleteProduct = 'DELETE FROM products';
export const getProduct = 'SELECT * FROM products WHERE name = $1';
