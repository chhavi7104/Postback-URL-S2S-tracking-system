// index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Click Tracking Endpoint
app.get("/click", async (req, res) => {
  try {
    const { affiliate_id, campaign_id, click_id } = req.query;

    if (!affiliate_id || !campaign_id || !click_id) {
      return res.status(400).json({ status: "error", message: "Missing params" });
    }

    const result = await pool.query(
      `INSERT INTO clicks (affiliate_id, campaign_id, click_id, timestamp)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [affiliate_id, campaign_id, click_id]
    );

    res.json({ status: "success", click: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// ✅ Postback Endpoint
app.get("/postback", async (req, res) => {
  try {
    const { affiliate_id, click_id, amount, currency } = req.query;

    if (!affiliate_id || !click_id || !amount || !currency) {
      return res.status(400).json({ status: "error", message: "Missing params" });
    }

    // validate click exists
    const click = await pool.query(
      `SELECT * FROM clicks WHERE affiliate_id = $1 AND click_id = $2`,
      [affiliate_id, click_id]
    );

    if (click.rows.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid click_id" });
    }

    // insert conversion
    const result = await pool.query(
      `INSERT INTO conversions (click_id, amount, currency, timestamp)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [click_id, amount, currency]
    );

    res.json({ status: "success", message: "Conversion tracked", conversion: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// ✅ Get Clicks (for dashboard)
app.get("/clicks", async (req, res) => {
  try {
    const { affiliate_id } = req.query;

    const result = await pool.query(
      `SELECT c.*, ca.name AS campaign_name
       FROM clicks c
       JOIN campaigns ca ON c.campaign_id = ca.id
       WHERE c.affiliate_id = $1
       ORDER BY c.timestamp DESC`,
      [affiliate_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// ✅ Get Conversions (for dashboard)
app.get("/conversions", async (req, res) => {
  try {
    const { affiliate_id } = req.query;

    const result = await pool.query(
      `SELECT v.*, c.campaign_id, ca.name AS campaign_name
       FROM conversions v
       JOIN clicks c ON v.click_id = c.click_id
       JOIN campaigns ca ON c.campaign_id = ca.id
       WHERE c.affiliate_id = $1
       ORDER BY v.timestamp DESC`,
      [affiliate_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
