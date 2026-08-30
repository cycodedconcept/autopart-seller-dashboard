
import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Box, ShoppingCart, BarChart3, Boxes,
  ArrowUpDown, Inbox, Settings, HelpCircle, Menu,
  ChevronDown, Search, Calendar, Filter, Sun,
  PanelLeftClose, Bell, LogOut
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/authSlice'
import autoLogo from '../assets/Logo.png'

const menuItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: Boxes, label: 'Inventory', to: '/inventory' },
  { icon: ShoppingCart, label: 'Orders', to: '/orders' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: ArrowUpDown, label: 'Transactions', to: '/transactions' },
  { icon: Inbox, label: 'Inbox', to: '/inbox' },
]

const othersItems = [
  { icon: Settings, label: 'Settings', to: '/account-settings' },
  { icon: HelpCircle, label: 'Help Center', to: '/account-centre' },
]

const bottomNavItems = [
  { icon: Home, label: 'Home', to: '/dashboard' },
  { icon: ShoppingCart, label: 'Orders', to: '/orders' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: Settings, label: 'Settings', to: '/account-settings' },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const displayName = user?.fullName || user?.name || 'Kamal Okelola'
  const displayEmail = user?.email || 'scholar@gmail.com'
  const displayAvatar = user?.avatar || 'https://picsum.photos/200/200?random=100'
  return (
    <>
      {open && <div className="sidebar-overlay open" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-logo-section">
          <div className="sidebar-logo-icon-wrapper">
            <div className="sidebar-logo-icon">
              <img src={autoLogo} alt="AutoParts Logo" className="sidebar-logo-image" />
            </div>
          </div>
          <span className="sidebar-logo-text">AutoParts</span>
          <div className="sidebar-toggle-icon">
            <PanelLeftClose size={18} />
          </div>
        </div>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* Navigation Sections */}
        <div className="sidebar-nav-container">
          {/* MENU Section */}
          <div className="nav-section">
            <div className="nav-label">MENU</div>
            {menuItems.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Spacer */}
          <div className="sidebar-spacer"></div>

          {/* OTHERS Section */}
          <div className="nav-section">
            <div className="nav-label">OTHERS</div>
            {othersItems.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Divider before user card */}
          <div className="sidebar-divider"></div>

          {/* User Profile */}
          <div className="sidebar-user-profile">
            <div className="user-profile-avatar-wrapper">
              <img src={displayAvatar} alt={displayName} className="user-profile-avatar" />
              <div className="user-profile-status"></div>
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">{displayName}</div>
              <div className="user-profile-email">{displayEmail}</div>
            </div>
            <ChevronDown size={16} className="user-profile-chevron" />
          </div>
          <button
            onClick={() => { dispatch(logout()); navigate('/login') }}
            style={{
              width: '100%', padding: '10px 16px', marginTop: '8px',
              background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px',
              fontSize: '0.85rem', color: '#EF4444', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.target.style.background = '#FEF2F2'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const displayName = user?.fullName || user?.name || 'Kamal Okelola'
  const displayAvatar = user?.avatar || 'https://picsum.photos/200/200?random=100'

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
            <div className="greeting">
              <Sun size={20} style={{ color: '#FFA500' }} />
              <span className="greeting-text">Good Morning, {displayName}!</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={16} className="search-icon" />
              <input placeholder="Search anything" />
              <Filter size={16} className="search-filter-icon" />
            </div>
            <button className="topbar-icon-btn topbar-search-btn">
              <Search size={20} />
            </button>
            <button className="topbar-icon-btn">
              <Calendar size={20} />
            </button>
            <button className="topbar-icon-btn">
              <Bell size={20} />
            </button>
            <div className="topbar-user">
              <img src={displayAvatar} alt={displayName} className="topbar-user-avatar" />
              <ChevronDown size={16} className="topbar-user-chevron" />
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
