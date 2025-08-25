import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API = "http://localhost:3001"; // backend URL

export default function Dashboard() {
  const router = useRouter();

  // Get affiliate_id from query string, default to 1
  const affiliate_id = router.query.affiliate_id || 1;

  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    if (!affiliate_id) return;

    // Load clicks
    axios.get(`${API}/clicks?affiliate_id=${affiliate_id}`)
      .then(res => setClicks(res.data))
      .catch(err => console.error(err));

    // Load conversions
    axios.get(`${API}/conversions?affiliate_id=${affiliate_id}`)
      .then(res => setConversions(res.data))
      .catch(err => console.error(err));
  }, [affiliate_id]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Affiliate {affiliate_id} Dashboard</h1>

      {/* Postback URL */}
      <h2>Your Postback URL</h2>
      <code style={{ display: "block", marginBottom: "1rem" }}>
        {`${API}/postback?affiliate_id=${affiliate_id}&click_id={click_id}&amount={amount}&currency={currency}`}
      </code>

      {/* Clicks table */}
      <h2 style={{ marginTop: "2rem" }}>Clicks</h2>
      {clicks.length === 0 ? (
        <p>No clicks tracked yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Click ID</th>
              <th>Campaign</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map(click => (
              <tr key={click.id}>
                <td>{click.click_id}</td>
                <td>{click.campaign_name} (#{click.campaign_id})</td>
                <td>{new Date(click.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Conversions table */}
      <h2 style={{ marginTop: "2rem" }}>Conversions</h2>
      {conversions.length === 0 ? (
        <p>No conversions tracked yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Click ID</th>
              <th>Campaign</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {conversions.map(conv => (
              <tr key={conv.id}>
                <td>{conv.amount}</td>
                <td>{conv.currency}</td>
                <td>{conv.click_id}</td>
                <td>{conv.campaign_name} (#{conv.campaign_id})</td>
                <td>{new Date(conv.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
