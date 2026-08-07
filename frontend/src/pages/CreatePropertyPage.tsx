import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';

function CreatePropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    auctionStartDate: '',
    auctionEndDate: '',
    rentalPrice: '',
    isAvailableForRent: false,
    isAvailableForAuction: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await propertyService.createProperty({
        ...formData,
        price: parseFloat(formData.price),
        rentalPrice: formData.rentalPrice ? parseFloat(formData.rentalPrice) : null,
      });
      alert('Property created successfully!');
      navigate('/my-properties');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Property</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4}></textarea>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Auction Details</h3>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isAvailableForAuction"
              checked={formData.isAvailableForAuction}
              onChange={handleChange}
            />
            Available for Auction
          </label>
        </div>

        {formData.isAvailableForAuction && (
          <>
            <div className="form-group">
              <label>Starting Price</label>
              <input
                type="number"
                step="100"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Auction Start Date</label>
                <input type="datetime-local" name="auctionStartDate" value={formData.auctionStartDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Auction End Date</label>
                <input type="datetime-local" name="auctionEndDate" value={formData.auctionEndDate} onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Rental Details</h3>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isAvailableForRent"
              checked={formData.isAvailableForRent}
              onChange={handleChange}
            />
            Available for Rent
          </label>
        </div>

        {formData.isAvailableForRent && (
          <div className="form-group">
            <label>Monthly Rental Price</label>
            <input
              type="number"
              step="100"
              name="rentalPrice"
              value={formData.rentalPrice}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: '2rem' }}>
          {loading ? 'Creating...' : 'Create Property'}
        </button>
      </form>
    </div>
  );
}

export default CreatePropertyPage;
