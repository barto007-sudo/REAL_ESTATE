import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService, auctionService, rentalService } from '../services/api';
import { Property, Bid, User } from '../types';

interface PropertyDetailPageProps {
  user: User | null;
}

function PropertyDetailPage({ user }: PropertyDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<(Property & { bids: Bid[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [rental, setRental] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      const amount = parseFloat(bidAmount);
      await auctionService.placeBid(id, amount);
      setBidAmount('');
      fetchProperty();
      alert('Bid placed successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleCreateRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      await rentalService.createRental(id, new Date(rental.startDate), new Date(rental.endDate));
      setRental({ startDate: '', endDate: '' });
      alert('Rental request created successfully!');
      navigate('/my-rentals');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create rental request');
    }
  };

  if (loading) return <div className="loading">Loading property...</div>;
  if (!property) return <div className="error-message">Property not found</div>;

  const isAuctionActive = property.auctionEndDate && new Date() < new Date(property.auctionEndDate);
  const highestBid = property.bids && property.bids.length > 0 ? property.bids[0].amount : property.price;

  return (
    <div className="property-detail">
      <div className="property-header">
        <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '2rem' }}>🏠</div>
        <h1 className="property-title">{property.title}</h1>
        <p>{property.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="property-info">
        <div className="info-block">
          <div className="info-label">Address</div>
          <div className="info-value">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </div>
        </div>

        {property.isAvailableForAuction && (
          <>
            <div className="info-block">
              <div className="info-label">Starting Price</div>
              <div className="info-value">${property.price?.toLocaleString()}</div>
            </div>
            <div className="info-block">
              <div className="info-label">Current Highest Bid</div>
              <div className="info-value">${highestBid?.toLocaleString()}</div>
            </div>
            <div className="info-block">
              <div className="info-label">Auction Status</div>
              <div className="info-value">
                {isAuctionActive ? (
                  <span style={{ color: '#27ae60' }}>Active</span>
                ) : (
                  <span style={{ color: '#e74c3c' }}>Ended</span>
                )}
              </div>
            </div>
          </>
        )}

        {property.isAvailableForRent && (
          <div className="info-block">
            <div className="info-label">Monthly Rental Price</div>
            <div className="info-value">${property.rentalPrice?.toLocaleString()}</div>
          </div>
        )}
      </div>

      {property.isAvailableForAuction && isAuctionActive && user && (
        <div style={{ marginTop: '2rem', backgroundColor: '#ecf0f1', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Place a Bid</h3>
          <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="number"
              step="100"
              min={highestBid}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Minimum ${highestBid?.toLocaleString()}`}
              required
            />
            <button type="submit">Place Bid</button>
          </form>
        </div>
      )}

      {property.isAvailableForRent && user && user.role === 'buyer' && (
        <div style={{ marginTop: '2rem', backgroundColor: '#ecf0f1', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Request Rental</h3>
          <form onSubmit={handleCreateRental}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={rental.startDate}
                  onChange={(e) => setRental({ ...rental, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={rental.endDate}
                  onChange={(e) => setRental({ ...rental, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '1rem' }}>
              Request Rental
            </button>
          </form>
        </div>
      )}

      {!user && (property.isAvailableForAuction || property.isAvailableForRent) && (
        <div style={{ marginTop: '2rem', backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <p>Please <a href="/login">log in</a> to place a bid or request a rental.</p>
        </div>
      )}

      {property.bids && property.bids.length > 0 && (
        <div className="bids-section">
          <h3>Bids History</h3>
          {property.bids.map((bid) => (
            <div key={bid.id} className="bid-item">
              <span>
                {bid.firstName} {bid.lastName}
              </span>
              <span className="bid-amount">${bid.amount?.toLocaleString()}</span>
              <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyDetailPage;
