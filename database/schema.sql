-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Create clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id SERIAL PRIMARY KEY,
  affiliate_id INT REFERENCES affiliates(id),
  campaign_id INT REFERENCES campaigns(id),
  click_id VARCHAR(255) UNIQUE NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id SERIAL PRIMARY KEY,
  click_id VARCHAR(255) REFERENCES clicks(click_id),
  amount FLOAT,
  currency VARCHAR(10),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Insert dummy affiliates
INSERT INTO affiliates (name) VALUES ('Affiliate 1'), ('Affiliate 2');

-- Insert dummy campaigns
INSERT INTO campaigns (name) VALUES ('Campaign A'), ('Campaign B');
