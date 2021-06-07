DROP DATABASE IF EXISTS ordering_system;
CREATE DATABASE ordering_system;

\c ordering_system;

CREATE TABLE IF NOT EXISTS profile (
	id serial NOT NULL,
	user_id varchar(50) NOT NULL,
	abn varchar(50) NOT NULL,
	name varchar(50) NOT NULL,
	phone varchar(50),
	fax varchar(50),
	address varchar(50),
	suburb varchar(50),
	state varchar(50),
	postcode varchar(50),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS categories (
	id serial NOT NULL,
	title varchar(50) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS products (
	id serial NOT NULL,
	category_id bigint NOT NULL,
	name varchar(50) NOT NULL,
	price decimal(10, 2) NOT NULL,
	description varchar(50) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_category
		FOREIGN KEY(category_id)
			REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_options (
	id serial NOT NULL,
	product_id bigint NOT NULL,
	name varchar(50) NOT NULL,
	price decimal(10, 2) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_product
		FOREIGN KEY(product_id)
			REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
	id serial NOT NULL,
	user_id varchar(50) NOT NULL,
	status varchar(50) NOT NULL,
	type varchar(50) NOT NULL,
	notes varchar(255),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS order_items (
	id serial NOT NULL,
	order_id bigint NOT NULL,
	product_id bigint NOT NULL,
	quantity int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_order
		FOREIGN KEY(order_id)
			REFERENCES orders(id),
	CONSTRAINT fk_product
		FOREIGN KEY(product_id)
			REFERENCES products(id)
);
