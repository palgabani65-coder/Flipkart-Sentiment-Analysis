-- Flipkart Sentiment Analysis - PostgreSQL Database Schema
-- Run this script in PostgreSQL (psql / pgAdmin / DBeaver) to initialize the database schema.

-- 1. Create Database (Execute separately if database does not exist)
-- CREATE DATABASE flipkart_sentiment_db;

-- Connect to flipkart_sentiment_db before running remaining statements:
-- \c flipkart_sentiment_db;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on Users Email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. One-Time Passwords (OTPs) Table
CREATE TABLE IF NOT EXISTS otps (
    email VARCHAR(255) PRIMARY KEY,
    otp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index on OTP Expiration
CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);

-- 4. Exploratory Data Analysis (EDA) Summary Metrics Table
CREATE TABLE IF NOT EXISTS eda_metrics (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'eda_summary',
    metrics JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(512),
    product_price NUMERIC(10, 2),
    rate INTEGER,
    review TEXT,
    summary TEXT,
    cleaned_review TEXT,
    full_review TEXT,
    sentiment VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Reviews Queries
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_reviews_rate ON reviews(rate);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_name);
