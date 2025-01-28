-- Create orders table if not exists
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    amount INTEGER NOT NULL DEFAULT 0,
    order_status INTEGER NOT NULL DEFAULT 0, -- 0: pending, 1: failed, 2: success
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 year')
);

-- Create index on user_email
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);

-- Create video_generations table if not exists
DROP TABLE IF EXISTS video_generations;
CREATE TABLE video_generations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    credits_used INTEGER NOT NULL DEFAULT 1,
    status INTEGER NOT NULL DEFAULT 0, -- 0: pending, 1: failed, 2: success
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_email for video_generations
CREATE INDEX IF NOT EXISTS idx_video_generations_user_email ON video_generations(user_email);
