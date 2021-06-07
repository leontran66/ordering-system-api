export const createCategory = 'INSERT INTO categories (title) VALUES($1)';
export const deleteCategory = 'DELETE FROM categories WHERE title = $1';
export const getCategory = 'SELECT * FROM categories WHERE title = $1';

export const getProduct = 'SELECT * FROM products WHERE name = $1';
