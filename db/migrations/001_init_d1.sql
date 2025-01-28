-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    amount INTEGER NOT NULL DEFAULT 0,
    order_status INTEGER NOT NULL DEFAULT 0, -- 0: pending, 1: failed, 2: success
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME DEFAULT (datetime('now', '+1 year'))
);

-- Create index on user_email
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);

-- Create video_generations table
CREATE TABLE IF NOT EXISTS video_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    credits_used INTEGER NOT NULL DEFAULT 1,
    status INTEGER NOT NULL DEFAULT 0, -- 0: pending, 1: failed, 2: success
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_email for video_generations
CREATE INDEX IF NOT EXISTS idx_video_generations_user_email ON video_generations(user_email);
