-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_no VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    plan VARCHAR(50) NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    order_status INTEGER NOT NULL DEFAULT 1,
    paied_at TIMESTAMP,
    stripe_session_id VARCHAR(255),
    credits INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL
);

-- Create covers table
CREATE TABLE IF NOT EXISTS covers (
    uuid VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    img_description TEXT NOT NULL,
    img_size VARCHAR(50) NOT NULL,
    img_url TEXT NOT NULL,
    llm_name VARCHAR(255) NOT NULL,
    llm_params TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    status INTEGER NOT NULL DEFAULT 1
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_covers_user_email ON covers(user_email);
CREATE INDEX IF NOT EXISTS idx_covers_created_at ON covers(created_at);
