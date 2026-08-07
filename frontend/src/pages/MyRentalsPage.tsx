import React, { useEffect, useState } from 'react';
import { rentalService } from '../services/api';
import { Rental } from '../types';

function MyRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const fetchMyRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getMyRentals();
      setRentals(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      active: '#27ae60',
      pending: '#f39c12',
      completed: '#3498db',
      cancelled: '#e74c3c',
    };
    return (
      <span style={{ backgroundColor: colors[status] || '#95a5a6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading rentals...</div>;

  return (
    <div>
      <h1>My Rentals</h1>

      {error && <div className="error-message">{error}</div>}

      {rentals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>You don't have any rental requests yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Property</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Address</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Start Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>End Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Monthly Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '1rem' }}>{rental.title}</td>
                  <td style={{ padding: '1rem' }}>{rental.address}</td>
                  <td style={{ padding: '1rem' }}>{new Date(rental.startDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{new Date(rental.endDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>${rental.monthlyPrice?.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(rental.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyRentalsPage;
