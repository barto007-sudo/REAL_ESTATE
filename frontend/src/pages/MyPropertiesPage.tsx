import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import { Property, User } from '../types';

interface MyPropertiesPageProps {
  user: User;
}

function MyPropertiesPage({ user }: MyPropertiesPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties();
      const myProperties = data.filter((p) => p.ownerId === user.id);
      setProperties(myProperties);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete property');
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div>
      <h1>My Properties</h1>

      {error && <div className="error-message">{error}</div>}

      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>You don't have any properties yet. <Link to="/create-property">Create one</Link></p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '1rem' }}>{property.title}</td>
                  <td style={{ padding: '1rem' }}>
                    {property.city}, {property.state}
                  </td>
                  <td style={{ padding: '1rem' }}>${property.price?.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    {property.isAvailableForAuction && <span className="badge auction">Auction</span>}
                    {property.isAvailableForRent && <span className="badge rental">Rental</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/properties/${property.id}`} style={{ marginRight: '1rem' }}>
                      View
                    </Link>
                    <button onClick={() => handleDelete(property.id)} style={{ backgroundColor: '#e74c3c' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyPropertiesPage;
