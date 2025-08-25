// backend/server.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",          // your postgres user
  host: "localhost",
  database: "affiliate",     // your database name
  password: "yourpassword",  // your postgres password
  port: 5432,
});

// --- Endpoints ---

// 1. Track Clicks
app.get("/click", async (req, res) => {
  const { affiliate_id, campaign_id, click_id } = req.query;

  if (!affiliate_id || !campaign_id || !click_id) {
    return res.status(400).json({ status: "error", message: "Missing parameters" });
  }

  try {
    await pool.query(
      `INSERT INTO clicks (affiliate_id, campaign_id, click_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (click_id) DO NOTHING`,
      [affiliate_id, campaign_id, click_id]
    );

    res.json({ status: "success", message: "Click tracked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// 2. Postback Conversion
app.get("/postback", async (req, res) => {
  const { affiliate_id, click_id, amount, currency } = req.query;

  if (!affiliate_id || !click_id || !amount || !currency) {
    return res.status(400).json({ status: "error", message: "Missing parameters" });
  }

  try {
    // Validate that click exists for this affiliate
    const { rowCount } = await pool.query(
      "SELECT * FROM clicks WHERE affiliate_id=$1 AND click_id=$2",
      [affiliate_id, click_id]
    );

    if (rowCount === 0) {
      return res.status(400).json({ status: "error", message: "Invalid click_id or affiliate_id" });
    }

    // Insert conversion
    await pool.query(
      `INSERT INTO conversions (click_id, amount, currency)
       VALUES ($1, $2, $3)`,
      [click_id, amount, currency]
    );

    res.json({ status: "success", message: "Conversion tracked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// 3. Fetch clicks for affiliate (for dashboard)
app.get("/clicks", async (req, res) => {
  const { affiliate_id } = req.query;

  if (!affiliate_id) return res.status(400).json({ status: "error", message: "Missing affiliate_id" });

  try {
    const result = await pool.query(
      `SELECT clicks.id, clicks.click_id, clicks.timestamp, campaigns.id as campaign_id, campaigns.name as campaign_name
       FROM clicks
       JOIN campaigns ON clicks.campaign_id = campaigns.id
       WHERE clicks.affiliate_id=$1
       ORDER BY clicks.timestamp DESC`,
      [affiliate_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// 4. Fetch conversions for affiliate (for dashboard)
app.get("/conversions", async (req, res) => {
  const { affiliate_id } = req.query;

  if (!affiliate_id) return res.status(400).json({ status: "error", message: "Missing affiliate_id" });

  try {
    const result = await pool.query(
      `SELECT conversions.id, conversions.click_id, conversions.amount, conversions.currency, conversions.timestamp,
              campaigns.id as campaign_id, campaigns.name as campaign_name
       FROM conversions
       JOIN clicks ON conversions.click_id = clicks.click_id
       JOIN campaigns ON clicks.campaign_id = campaigns.id
       WHERE clicks.affiliate_id=$1
       ORDER BY conversions.timestamp DESC`,
      [affiliate_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
