import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService, auctionService, rentalService } from '../services/api';
import { User } from '../types';

interface DashboardPageProps {
  user: User;
}

function DashboardPage({ user }: DashboardPageProps) {
  const [stats, setStats] = useState({
    properties: 0,
    bids: 0,
    rentals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const propertiesData = await propertyService.getProperties();
        const bidsData = await auctionService.getMyBids();
        const rentalsData = await rentalService.getMyRentals();

        setStats({
          properties: propertiesData.filter((p) => p.ownerId === user.id).length,
          bids: bidsData.length,
          rentals: rentalsData.length,
        });
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {(user.role === 'seller' || user.role === 'admin') && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem' }}>My Properties</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3498db', marginBottom: '1rem' }}>
              {stats.properties}
            </div>
            <Link to="/my-properties" style={{ color: '#3498db', textDecoration: 'none' }}>
              View Properties →
            </Link>
          </div>
        )}

        {user.role === 'buyer' && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem' }}>My Bids</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#e74c3c', marginBottom: '1rem' }}>
              {stats.bids}
            </div>
            <Link to="/my-bids" style={{ color: '#e74c3c', textDecoration: 'none' }}>
              View Bids →
            </Link>
          </div>
        )}

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>My Rentals</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#9b59b6', marginBottom: '1rem' }}>
            {stats.rentals}
          </div>
          <Link to="/my-rentals" style={{ color: '#9b59b6', textDecoration: 'none' }}>
            View Rentals →
          </Link>
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Browse Properties</h3>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
          <Link to="/properties" style={{ color: '#27ae60', textDecoration: 'none' }}>
            View All Properties →
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {(user.role === 'seller' || user.role === 'admin') && (
            <Link to="/create-property" style={{ textDecoration: 'none' }}>
              <button>+ Create New Property</button>
            </Link>
          )}
          <Link to="/properties" style={{ textDecoration: 'none' }}>
            <button>Browse Auctions</button>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem', backgroundColor: '#ecf0f1', padding: '2rem', borderRadius: '8px' }}>
        <h3>User Information</h3>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
