DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER(5) ZEROFILL AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255),
  department_name VARCHAR(255),
  price DECIMAL(13,2),
  stock_quantity INTEGER (11),
  PRIMARY KEY (`item_id`)
);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Basketball", "Sports and Outdoors", 19.99, 300);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Golf Balls", "Sports and Outdoors", 15.00, 380);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Tennis Balls", "Sports and Outdoors", 3.00, 400);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Extension Cord 50'", "Home Improvement", 17.00, 200);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("60W Light Bulbs (3 pack)", "Home Improvement", 13.00, 600);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Push Broom", "Home Improvement", 15.45, 320);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("4k Monitor", "Electronics", 217.00, 125);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Wireless Mouse", "Electronics", 13.56, 525);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Headphones", "Electronics", 113.56, 285);

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Playstation", "Electronics", 299.99, 28);