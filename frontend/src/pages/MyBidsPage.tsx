import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auctionService } from '../services/api';

interface MyBid {
  id: string;
  amount: number;
  title: string;
  city: string;
  createdAt: Date;
}

function MyBidsPage() {
  const [bids, setBids] = useState<MyBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const data = await auctionService.getMyBids();
      setBids(data as MyBid[]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading bids...</div>;

  return (
    <div>
      <h1>My Bids</h1>

      {error && <div className="error-message">{error}</div>}

      {bids.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>You haven't placed any bids yet. <Link to="/properties">Browse properties</Link></p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Property</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Bid Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '1rem' }}>{bid.title}</td>
                  <td style={{ padding: '1rem' }}>{bid.city}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#27ae60' }}>
                    ${bid.amount?.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(bid.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBidsPage;
