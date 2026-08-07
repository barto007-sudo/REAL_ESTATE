import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { auctionService, propertyService, rentalService } from '../services/api';
import { Bid, Property, Rental, User } from '../types';
import './DashboardPage.css';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

interface PropertyRow {
  id: string;
  image: string;
  unidad: string;
  direccion: string;
  tipo: string;
  estado: string;
  updatedAt: Date;
}

interface ContractRow {
  id: string;
  name: string;
  action: string;
  status: string;
}

interface ActivityItem {
  id: string;
  text: string;
  createdAt: Date;
}

interface MonthBar {
  month: string;
  ingresos: number;
  gastos: number;
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: Date): string =>
  new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value);

const hoursAgo = (date: Date): string => {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  return `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
};

const defaultMonthBars = (): MonthBar[] => {
  const result: MonthBar[] = [];
  const current = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    result.push({ month: MONTH_NAMES[d.getMonth()], ingresos: 0, gastos: 0 });
  }
  return result;
};

function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  const displayName = useMemo(() => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (fullName) return fullName;
    const emailPrefix = user.email?.split('@')[0] || '';
    return emailPrefix ? emailPrefix : 'Admin User';
  }, [user.email, user.firstName, user.lastName]);

  const avatarLetters = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [propertiesData, rentalsData, bidsData] = await Promise.all([
          propertyService.getProperties(),
          rentalService.getRentals(),
          auctionService.getMyBids(),
        ]);

        setProperties(propertiesData);
        setRentals(rentalsData);
        setMyBids(bidsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const propertyRows = useMemo<PropertyRow[]>(() => {
    return properties.map((property, index) => {
      const activeRental = rentals.find(
        (r) => r.propertyId === property.id && (r.status === 'active' || r.status === 'pending')
      );

      let estado = 'Vacante';
      if (activeRental?.status === 'active') estado = 'Ocupado';
      else if (activeRental?.status === 'pending') estado = 'En Alquiler';
      else if (!property.isAvailableForRent && !property.isAvailableForAuction) estado = 'Mantenimiento';

      const tipo = property.isAvailableForRent && property.isAvailableForAuction
        ? 'En Alquiler / En Venta'
        : property.isAvailableForRent
          ? 'En Alquiler'
          : 'En Venta';

      return {
        id: property.id,
        image: `https://picsum.photos/seed/real-estate-${index + 1}/240/140`,
        unidad: `Unidad ${index + 1}`,
        direccion: `${property.address}, ${property.city}`,
        tipo,
        estado,
        updatedAt: new Date(property.updatedAt),
      };
    });
  }, [properties, rentals]);

  const filteredPropertyRows = useMemo(() => {
    if (!searchTerm.trim()) return propertyRows;
    const term = searchTerm.toLowerCase();
    return propertyRows.filter(
      (row) =>
        row.unidad.toLowerCase().includes(term) ||
        row.direccion.toLowerCase().includes(term) ||
        row.tipo.toLowerCase().includes(term) ||
        row.estado.toLowerCase().includes(term)
    );
  }, [propertyRows, searchTerm]);

  const occupancy = useMemo(() => {
    const total = Math.max(1, propertyRows.length);
    const occupied = propertyRows.filter((p) => p.estado === 'Ocupado' || p.estado === 'En Alquiler').length;
    const maintenance = propertyRows.filter((p) => p.estado === 'Mantenimiento').length;
    const vacant = Math.max(0, total - occupied - maintenance);

    return [
      { label: 'Ocupado', value: Math.round((occupied / total) * 100), color: '#2f7af8' },
      { label: 'Vacante', value: Math.round((vacant / total) * 100), color: '#f8a23d' },
      { label: 'Mantenimiento', value: Math.round((maintenance / total) * 100), color: '#8b9bb1' },
    ];
  }, [propertyRows]);

  const monthlyRevenue = useMemo(() => {
    const base = defaultMonthBars();
    const indexByMonth = new Map(base.map((item, index) => [item.month, index]));

    rentals.forEach((rental) => {
      const createdAt = new Date(rental.createdAt);
      const month = MONTH_NAMES[createdAt.getMonth()];
      const monthIndex = indexByMonth.get(month);
      if (monthIndex === undefined) return;

      base[monthIndex].ingresos += Number(rental.monthlyPrice || 0);
      base[monthIndex].gastos += Number(rental.monthlyPrice || 0) * 0.24;
    });

    const maxIncome = Math.max(1, ...base.map((m) => m.ingresos));
    return base.map((item) => ({
      ...item,
      ingresos: Math.round((item.ingresos / maxIncome) * 100),
      gastos: Math.round((item.gastos / maxIncome) * 100),
    }));
  }, [rentals]);

  const expiringContracts = useMemo<ContractRow[]>(() => {
    return rentals
      .filter((rental) => rental.status === 'pending' || rental.status === 'active')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 5)
      .map((rental) => ({
        id: rental.id,
        name: rental.title || `Contrato ${rental.id.slice(0, 6)}`,
        action: rental.status === 'pending' ? 'Renovacion pendiente' : 'Seguimiento de permanencia',
        status: formatDate(new Date(rental.endDate)),
      }));
  }, [rentals]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const propertyEvents: ActivityItem[] = propertyRows.slice(0, 3).map((row) => ({
      id: `property-${row.id}`,
      text: `${displayName} actualizo detalles de ${row.unidad} - ${hoursAgo(row.updatedAt)}`,
      createdAt: row.updatedAt,
    }));

    const rentalEvents: ActivityItem[] = rentals.slice(0, 3).map((rental) => {
      const createdAt = new Date(rental.createdAt);
      return {
        id: `rental-${rental.id}`,
        text: `Se registro contrato ${rental.status} para ${rental.title || 'una unidad'} - ${hoursAgo(createdAt)}`,
        createdAt,
      };
    });

    const bidEvents: ActivityItem[] = myBids.slice(0, 2).map((bid) => {
      const createdAt = new Date(bid.createdAt);
      return {
        id: `bid-${bid.id}`,
        text: `Se registro puja de ${formatCurrency(Number(bid.amount || 0))} - ${hoursAgo(createdAt)}`,
        createdAt,
      };
    });

    return [...propertyEvents, ...rentalEvents, ...bidEvents]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [displayName, propertyRows, rentals, myBids]);

  const activeContracts = rentals.filter((r) => r.status === 'active').length;
  const pendingPayments = rentals.filter((r) => r.status === 'pending').reduce((sum, rental) => sum + Number(rental.monthlyPrice || 0), 0);
  const retention = activeContracts + rentals.filter((r) => r.status === 'completed').length;
  const retentionRate = rentals.length > 0 ? Math.round((retention / rentals.length) * 100) : 94;

  const kpis = [
    { title: 'Total de Propiedades', value: String(properties.length), icon: '🏢' },
    { title: 'Contratos Activos', value: String(activeContracts), icon: '📄' },
    { title: 'Pagos Pendientes', value: formatCurrency(pendingPayments), icon: '💰' },
    { title: 'Retencion de Inquilinos', value: `${retentionRate}%`, icon: '👥' },
  ];

  const occupancyGradient = `conic-gradient(${occupancy
    .map((item, index) => {
      const start = occupancy.slice(0, index).reduce((sum, current) => sum + current.value, 0) * 3.6;
      const end = start + item.value * 3.6;
      return `${item.color} ${start}deg ${end}deg`;
    })
    .join(', ')})`;

  const canCreateProperty = user.role === 'admin' || user.role === 'seller';

  if (loading) {
    return <div className="loading">Cargando panel operativo...</div>;
  }

  return (
    <div className="dashboard-shell" data-theme={theme}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">REAL_ESTATE</div>
        <nav className="sidebar-nav" aria-label="Navegacion principal">
          <button className="sidebar-item active" type="button">📊 Panel de Control</button>
          <Link to="/properties" className="sidebar-item">🏠 Propiedades</Link>
          <button className="sidebar-item" type="button">📄 Contratos</button>
          <button className="sidebar-item" type="button">🧑‍💼 Inquilinos</button>
          <button className="sidebar-item" type="button">🧑‍💻 Propietarios</button>
          <Link to="/my-rentals" className="sidebar-item">💳 Pagos</Link>
          <button className="sidebar-item" type="button">📈 Informes</button>
        </nav>
        <button className="sidebar-logout" type="button" onClick={onLogout}>Cerrar sesion</button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="icon-button" type="button" aria-label="Abrir menu">☰</button>
            <div className="header-title-wrap">
              <p className="header-subtitle">app.realestate.com/dashboard</p>
              <h1>Resumen del Panel de Control</h1>
            </div>
          </div>

          <div className="header-right">
            <div className="global-search">
              <span aria-hidden="true">🔎</span>
              <input
                type="text"
                placeholder="Busqueda Global"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="icon-button notification" type="button" aria-label="Notificaciones">
              🔔
              <span className="notification-badge">{recentActivity.length}</span>
            </button>

            <button
              className="icon-button"
              type="button"
              aria-label="Cambiar tema"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              title={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="profile-chip">
              <div className="profile-avatar">{avatarLetters}</div>
              <span>{displayName}</span>
            </div>

            <Link to={canCreateProperty ? '/create-property' : '/properties'} className="new-property-btn">
              + Nueva Propiedad
            </Link>
          </div>
        </header>

        <section className="kpi-grid" aria-label="Indicadores clave">
          {kpis.map((kpi) => (
            <article key={kpi.title} className="kpi-card">
              <div className="kpi-icon">{kpi.icon}</div>
              <div>
                <p className="kpi-label">{kpi.title}</p>
                <p className="kpi-value">{kpi.value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboard-grid-primary">
          <article className="panel-card table-panel">
            <div className="panel-header">
              <h2>Lista de Propiedades</h2>
              <button type="button" className="panel-action-btn">Accion rapida</button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre Unidad</th>
                    <th>Direccion</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPropertyRows.map((property) => (
                    <tr key={property.id}>
                      <td>
                        <img src={property.image} alt={property.unidad} className="property-thumb" />
                      </td>
                      <td>{property.unidad}</td>
                      <td>{property.direccion}</td>
                      <td>{property.tipo}</td>
                      <td>
                        <span className={`status-pill ${property.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                          {property.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPropertyRows.length === 0 && (
                    <tr>
                      <td colSpan={5}>Sin resultados para la busqueda actual.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel-card activity-panel">
            <h2>Actividad Reciente</h2>
            <ul className="activity-list">
              {recentActivity.map((event) => (
                <li key={event.id}>
                  <span className="activity-dot">👤</span>
                  <span>{event.text}</span>
                </li>
              ))}
              {recentActivity.length === 0 && <li>No hay actividad reciente.</li>}
            </ul>
          </article>

          <article className="panel-card occupancy-panel">
            <h2>Estado de Ocupacion de Unidades</h2>
            <div className="occupancy-chart-wrap">
              <div className="donut-chart" style={{ background: occupancyGradient }} aria-label="Grafico de ocupacion" />
              <ul className="occupancy-legend">
                {occupancy.map((item) => (
                  <li key={item.label}>
                    <span className="legend-color" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className="dashboard-grid-secondary">
          <article className="panel-card contracts-panel">
            <h2>Vencimientos de Contratos</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Last Action</th>
                    <th>Status</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.name}</td>
                      <td>{contract.action}</td>
                      <td>{contract.status}</td>
                      <td>
                        <div className="actions-inline">
                          <button type="button" className="edit-btn">Edit</button>
                          <button type="button" className="delete-btn">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {expiringContracts.length === 0 && (
                    <tr>
                      <td colSpan={4}>No hay vencimientos proximos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel-card finance-panel">
            <h2>Ingresos y Gastos Mensuales</h2>
            <div className="stacked-bars" aria-label="Grafico de barras apiladas">
              {monthlyRevenue.map((item) => (
                <div className="stack-col" key={item.month}>
                  <div className="stack-track">
                    <div className="stack-income" style={{ height: `${item.ingresos}%` }} />
                    <div className="stack-expense" style={{ height: `${item.gastos}%` }} />
                  </div>
                  <span className="stack-month">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="finance-legend">
              <span><i className="legend income" /> Ingresos</span>
              <span><i className="legend expense" /> Gastos</span>
              <span className="money-axis">Eje Y: $0 - $120,000</span>
            </div>
          </article>
        </section>

        <footer className="dashboard-footer-meta">
          Usuario activo: {displayName} ({user.email}) | Tema: {theme === 'light' ? 'Claro' : 'Oscuro'}
        </footer>
      </section>
    </div>
  );
}

export default DashboardPage;
