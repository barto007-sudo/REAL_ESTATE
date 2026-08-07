import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import { Property } from '../types';

function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    isAvailableForAuction: false,
    isAvailableForRent: false,
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties(filters);
      setProperties(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div>
      <h1>Real Estate Properties</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                name="isAvailableForAuction"
                checked={filters.isAvailableForAuction}
                onChange={handleFilterChange}
              />
              Available for Auction
            </label>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                name="isAvailableForRent"
                checked={filters.isAvailableForRent}
                onChange={handleFilterChange}
              />
              Available for Rent
            </label>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No properties found</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="property-card">
                <div className="property-card-image">🏠</div>
                <div className="property-card-content">
                  <div className="property-card-title">{property.title}</div>
                  <div className="property-card-address">
                    {property.address}, {property.city}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    {property.isAvailableForAuction && <span className="badge auction">Auction</span>}
                    {property.isAvailableForRent && <span className="badge rental">Rental</span>}
                  </div>
                  {property.isAvailableForAuction && (
                    <div className="property-card-price">${property.price?.toLocaleString()}</div>
                  )}
                  {property.isAvailableForRent && !property.isAvailableForAuction && (
                    <div className="property-card-price">${property.rentalPrice}/month</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;
