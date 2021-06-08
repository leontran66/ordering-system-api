export const createCart = 'INSERT INTO orders (user_id, status, type, notes) VALUES($1, \'cart\', \'type\', \'\')';
export const createCartItem = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES(${order}, ${item}, ${quantity})';
export const deleteCartItem = 'DELETE FROM order_items WHERE id = $1';
export const getCart = 'SELECT * FROM orders WHERE status = \'cart\' AND user_id = $1';
export const getCartItem = 'SELECT * FROM order_items WHERE id = $1';
export const updateCart = 'UPDATE orders SET status = \'open\', type = ${type} WHERE user_id = ${user}';
export const updateCartItem = 'UPDATE order_items SET quantity = ${quantity} WHERE id = ${id}';

export const createCategory = 'INSERT INTO categories (title) VALUES(${title})';
export const getCategories = 'SELECT * FROM categories';
export const getCategory = 'SELECT count(*) FROM categories WHERE id = $1';
export const deleteCategory = 'DELETE FROM categories WHERE id = $1';

export const getOrder = 'SELECT * FROM orders WHERE id = $1';
export const getAllOrders = 'SELECT * FROM orders';
export const getAllOrdersForUser = 'SELECT * FROM orders WHERE user_id = $1';
export const updateOrder = 'UPDATE orders SET status = ${status} WHERE id = ${id}';

export const createProduct = 'INSERT INTO products (category_id, name, price, description) VALUES(${category}, ${name}, ${price}, ${description})';
export const createProductOptions = 'INSERT INTO product_options (product_id, name, price) VALUES(${product_id}, ${name}, ${price})';
export const getProductById = 'SELECT * FROM products WHERE id = $1';
export const getProductByName = 'SELECT * FROM products WHERE name = $1';
export const getProducts = 'SELECT * FROM products';
export const getProductOptions = 'SELECT * FROM product_options WHERE product_id = $1';
export const updateProduct = 'UPDATE products SET category_id = ${category}, name = ${name}, price = ${price}, description = ${description} WHERE id = ${id}';
export const updateProductOptions = 'UPDATE product_options SET name = ${name}, price = ${price} WHERE id = ${id}';
export const deleteProduct = 'DELETE FROM products WHERE id = $1';
export const deleteProductOptions = 'DELETE FROM product_options WHERE product_id = $1';

export const createProfile = 'INSERT INTO profile (user_id, abn, name, phone, fax, address, suburb, state, postcode) VALUES(${user}, ${abn}, ${name}, ${phone}, ${fax}, ${address}, ${suburb}, ${state}, ${postCode})';
export const getOwnProfile = 'SELECT * FROM profile WHERE user_id = $1';
export const getProfile = 'SELECT * FROM profile';
export const updateProfile = 'UPDATE profile SET abn = ${abn}, name = ${name}, phone = ${phone}, fax = ${fax}, address = ${address}, suburb = ${suburb}, state = ${state}, postcode = ${postCode} WHERE user_id = ${user}';
