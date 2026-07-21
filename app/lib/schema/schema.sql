-- =====================================================
-- E-Commerce Database Schema
-- Single-file version: CREATE TABLE only (no ALTER TABLE)
-- Run this once on a fresh database to get the exact
-- same structure as the original schema + ALTER TABLE version.
-- =====================================================

CREATE DATABASE Ecommerce;

USE Ecommerce;

CREATE TABLE Customers(
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(40) NOT NULL,
    mobile_number CHAR(15) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    username VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE SET NULL
);

CREATE TABLE Customer_address(
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE
);

CREATE TABLE Products(
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Inventory(
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    available_count INT NOT NULL,
    status ENUM('In stock', 'Out of stock') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE CASCADE
);

CREATE TABLE Orders(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    count INT NOT NULL,
    order_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE
);

CREATE TABLE OrderItems(
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    count INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE CASCADE
);

CREATE TABLE Fulfillment(
    shipment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    address_id INT NOT NULL,
    status ENUM('Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled') NOT NULL,
    shipment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (address_id)
        REFERENCES Customer_address(address_id)
        ON DELETE CASCADE
);

CREATE TABLE OrderPayment(
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    status ENUM('Pending', 'Paid', 'Failed', 'Refunded') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('UPI', 'Card', 'Cash', 'NetBanking') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE
);

CREATE TABLE Cart(
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE
);

CREATE TABLE CartItems(
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE(cart_id, product_id),

    FOREIGN KEY (cart_id)
        REFERENCES Cart(cart_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE CASCADE
);

CREATE TABLE Reviews(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review VARCHAR(100),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE(customer_id, product_id),

    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE CASCADE,

    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE
);

CREATE TABLE ProductImages(
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE CASCADE
);

-- =====================================================
-- Dummy Test Data for E-Commerce Schema
-- Run AFTER schema.sql. Order respects foreign keys.
-- =====================================================

-- Customers
INSERT INTO Customers (customer_id, customer_name, mobile_number) VALUES
(1, 'John Doe', '9876543210'),
(2, 'Jane Smith', '9876543211'),
(3, 'Alice Brown', '9876543212'),
(4, 'Bob Johnson', '9876543213'),
(5, 'Emma Wilson', '9876543214');

-- Users
INSERT INTO Users (user_id, customer_id, username, password, auth_token) VALUES
(1, 1, 'johnd', 'hashed_pw_1', 'token_aaa111'),
(2, 2, 'janes', 'hashed_pw_2', 'token_bbb222'),
(3, 3, 'aliceb', 'hashed_pw_3', 'token_ccc333'),
(4, 4, 'bobj', 'hashed_pw_4', 'token_ddd444'),
(5, 5, 'emmaw', 'hashed_pw_5', 'token_eee555');

-- Customer_address
INSERT INTO Customer_address (address_id, customer_id, city, state, country) VALUES
(1, 1, 'Delhi', 'Delhi', 'India'),
(2, 2, 'Mumbai', 'Maharashtra', 'India'),
(3, 3, 'Bangalore', 'Karnataka', 'India'),
(4, 4, 'Chennai', 'Tamil Nadu', 'India'),
(5, 5, 'Kolkata', 'West Bengal', 'India');

-- Products
INSERT INTO Products (product_id, brand, category, product_name, price) VALUES
(1, 'Nike', 'Footwear', 'Air Max 90', 8999.00),
(2, 'Apple', 'Electronics', 'iPhone 14', 69999.00),
(3, 'Samsung', 'Electronics', 'Galaxy S23', 59999.00),
(4, 'Adidas', 'Footwear', 'Ultraboost', 7999.00),
(5, 'Sony', 'Electronics', 'WH-1000XM5', 24999.00),
(6, 'Puma', 'Apparel', 'Running Jacket', 2999.00);

-- Inventory
INSERT INTO Inventory (inventory_id, product_id, available_count, status) VALUES
(1, 1, 50, 'In stock'),
(2, 2, 20, 'In stock'),
(3, 3, 0, 'Out of stock'),
(4, 4, 35, 'In stock'),
(5, 5, 15, 'In stock'),
(6, 6, 60, 'In stock');

-- Orders
INSERT INTO Orders (order_id, customer_id, amount, count, order_date) VALUES
(1, 1, 8999.00, 1, '2026-06-01'),
(2, 2, 69999.00, 1, '2026-06-03'),
(3, 3, 62998.00, 2, '2026-06-05'),
(4, 4, 7999.00, 1, '2026-06-07'),
(5, 5, 24999.00, 1, '2026-06-10');

-- OrderItems
INSERT INTO OrderItems (order_item_id, order_id, product_id, count, amount) VALUES
(1, 1, 1, 1, 8999.00),
(2, 2, 2, 1, 69999.00),
(3, 3, 3, 1, 59999.00),
(4, 3, 6, 1, 2999.00),
(5, 4, 4, 1, 7999.00),
(6, 5, 5, 1, 24999.00);

-- Fulfillment
INSERT INTO Fulfillment (shipment_id, order_id, address_id, status, shipment_date) VALUES
(1, 1, 1, 'Delivered', '2026-06-03'),
(2, 2, 2, 'Shipped', '2026-06-05'),
(3, 3, 3, 'Packed', '2026-06-06'),
(4, 4, 4, 'Pending', '2026-06-08'),
(5, 5, 5, 'Delivered', '2026-06-12');

-- OrderPayment
INSERT INTO OrderPayment (payment_id, order_id, status, amount, payment_mode) VALUES
(1, 1, 'Paid', 8999.00, 'UPI'),
(2, 2, 'Paid', 69999.00, 'Card'),
(3, 3, 'Pending', 62998.00, 'NetBanking'),
(4, 4, 'Paid', 7999.00, 'Cash'),
(5, 5, 'Paid', 24999.00, 'UPI');

-- Cart
INSERT INTO Cart (cart_id, customer_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- CartItems
INSERT INTO CartItems (cart_item_id, cart_id, product_id, quantity, price) VALUES
(1, 1, 2, 1, 69999.00),
(2, 1, 4, 2, 7999.00),
(3, 2, 5, 1, 24999.00),
(4, 3, 1, 1, 8999.00),
(5, 4, 6, 3, 2999.00),
(6, 5, 3, 1, 59999.00);

-- Reviews
INSERT INTO Reviews (review_id, product_id, customer_id, rating, review, comments) VALUES
(1, 1, 1, 5, 'Great shoes!', 'Very comfortable and stylish, worth the price.'),
(2, 2, 2, 4, 'Good phone', 'Battery life could be better but overall solid.'),
(3, 3, 3, 5, 'Excellent phone', 'Camera quality is amazing, very fast performance.'),
(4, 4, 4, 4, 'Nice running shoes', 'True to size and lightweight, good for daily runs.'),
(5, 5, 5, 5, 'Amazing sound quality', 'Noise cancellation is top notch, worth every rupee.');

-- ProductImages
INSERT INTO ProductImages (image_id, product_id, image_url, is_primary) VALUES
(1, 1, 'https://example.com/images/airmax90_1.jpg', TRUE),
(2, 2, 'https://example.com/images/iphone14_1.jpg', TRUE),
(3, 3, 'https://example.com/images/galaxys23_1.jpg', TRUE),
(4, 4, 'https://example.com/images/ultraboost_1.jpg', TRUE),
(5, 5, 'https://example.com/images/sonywh1000xm5_1.jpg', TRUE),
(6, 6, 'https://example.com/images/pumajacket_1.jpg', TRUE);