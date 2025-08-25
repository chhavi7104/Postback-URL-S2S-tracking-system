import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

const API = "http://localhost:3001"; // backend URL

export default function Dashboard() {
  const router = useRouter();
  const [affiliateId, setAffiliateId] = useState(1);

  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);

  // ✅ Fix: wait until router is ready
  useEffect(() => {
    if (!router.isReady) return;

    const id = router.query.affiliate_id || 1;
    setAffiliateId(id);

    // Load clicks
    axios
      .get(`${API}/clicks?affiliate_id=${id}`)
      .then((res) => setClicks(res.data))
      .catch((err) => console.error(err));

    // Load conversions
    axios
      .get(`${API}/conversions?affiliate_id=${id}`)
      .then((res) => setConversions(res.data))
      .catch((err) => console.error(err));
  }, [router.isReady, router.query.affiliate_id]);

  return (
    <div className={styles.container}>
      <h1>Affiliate {affiliateId} Dashboard</h1>

      {/* Postback URL */}
      <h2>Your Postback URL</h2>
      <code className={styles.codeBlock}>
        {`${API}/postback?affiliate_id=${affiliateId}&click_id={click_id}&amount={amount}&currency={currency}`}
      </code>

      {/* Clicks table */}
      <h2>Clicks</h2>
      {clicks.length === 0 ? (
        <p>No clicks tracked yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Click ID</th>
              <th>Campaign</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click.id}>
                <td>{click.click_id}</td>
                <td>
                  {click.campaign_name} (#{click.campaign_id})
                </td>
                <td>{new Date(click.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Conversions table */}
      <h2>Conversions</h2>
      {conversions.length === 0 ? (
        <p>No conversions tracked yet.</p>
      ) : (
        <table className={styles.table}>
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
            {conversions.map((conv) => (
              <tr key={conv.id}>
                <td>{conv.amount}</td>
                <td>{conv.currency}</td>
                <td>{conv.click_id}</td>
                <td>
                  {conv.campaign_name} (#{conv.campaign_id})
                </td>
                <td>{new Date(conv.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
