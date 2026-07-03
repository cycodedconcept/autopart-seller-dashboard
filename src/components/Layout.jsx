
import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Bell, Settings, HelpCircle, LogOut, Menu, X,
  ChevronDown, Search, FileText, Inbox, Calendar,
} from 'lucide-react'
import { currentUser } from '../utils/mockData'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Package, label: 'Products', to: '/products' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: ShoppingBag, label: 'Orders', to: '/orders' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: FileText, label: 'Transactions', to: '/transactions' },
  { icon: Inbox, label: 'Inbox', to: '/inbox' },
]

const bottomNavItems = [
  { icon: LayoutDashboard, label: 'Home', to: '/dashboard' },
  { icon: ShoppingBag, label: 'Orders', to: '/orders' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Package, label: 'Products', to: '/products' },
  { icon: Settings, label: 'Settings', to: '/account-settings' },
]

const bottomNav = [
  { icon: Settings, label: 'Settings', to: '/account-settings' },
  { icon: HelpCircle, label: 'Help Center', to: '/account-centre' },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  return (
    <>
      {open && <div className="sidebar-overlay open" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <a href="/dashboard" className="sidebar-logo">
          <img src="/logo.png" alt="AutoParts Hub" className="sidebar-logo-img" />
          <div>
            <div className="sidebar-logo-text">AutoParts Hub</div>
            <div className="sidebar-logo-sub">Seller Dashboard</div>
          </div>
        </a>

        {/* Main nav */}
        <div className="nav-section">
          <div className="nav-label">Main Menu</div>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom */}
        <div className="nav-section mt-auto" style={{ marginTop: 'auto', paddingTop: 8 }}>
          {bottomNav.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <a href="/login" className="nav-item" style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </div>

        {/* User card */}
        <div className="sidebar-footer">
          <div
            className="user-card"
            onClick={() => navigate('/account-settings')}
            style={{ cursor: 'pointer' }}
          >
            <img src={currentUser.avatar} alt={currentUser.name} />
            <div className="user-info">
              <div className="user-card-name truncate">{currentUser.name}</div>
              <div className="user-card-email">{currentUser.email}</div>
            </div>
            <ChevronDown size={14} className="user-dropdown-icon" />
          </div>
        </div>
      </aside>
    </>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const getPageTitle = () => {
    const p = location.pathname
    if (p.startsWith('/dashboard')) return 'Dashboard'
    if (p.startsWith('/analytics')) return 'Analytics'
    if (p.startsWith('/products/add')) return 'Add New Product'
    if (p.startsWith('/products/')) return 'Product Details'
    if (p.startsWith('/products')) return 'Products'
    if (p.startsWith('/orders/')) return 'Order Details'
    if (p.startsWith('/orders')) return 'Orders'
    if (p.startsWith('/customers/add')) return 'Add Customer'
    if (p.startsWith('/customers')) return 'Customers'
    if (p.startsWith('/transactions')) return 'Transactions'
    if (p.startsWith('/inbox')) return 'Inbox'
    if (p.startsWith('/account-settings')) return 'Account Settings'
    if (p.startsWith('/account-centre')) return 'Account Centre'
    return 'Dashboard'
  }

  const isTransactions = () => {
    return location.pathname.startsWith('/transactions')
  }

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            {isTransactions() ? (
              <div className="greeting">
                <span className="greeting-icon">☀️</span>
                <span className="greeting-text">Good Morning, Kamal Okelola!</span>
              </div>
            ) : (
              <div className="page-title-section">
                <div className="page-title-text">{getPageTitle()}</div>
                <div className="store-name">{currentUser.storeName}</div>
              </div>
            )}
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={16} className="search-icon" />
              <input placeholder="Search..." />
              <span className="topbar-search-shortcut">⌘K</span>
            </div>
            <button className="btn-icon topbar-icon-btn" style={{ position: 'relative' }}>
              <Calendar size={18} />
            </button>
            <button className="btn-icon topbar-icon-btn" style={{ position: 'relative' }}>
              <Bell size={18} />
              <span className="notification-badge" />
            </button>
            <div className="user-avatar-wrapper">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-avatar"
              />
              <ChevronDown size={14} className="avatar-dropdown-icon" />
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <Outlet />
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="bottom-nav">
          {bottomNavItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
