
import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Box, Users, ShoppingCart, BarChart3,
  ArrowUpDown, Inbox, Settings, HelpCircle, Menu,
  ChevronDown, Search, Calendar, Filter, Sun,
  PanelLeftClose, Bell
} from 'lucide-react'
import { currentUser } from '../utils/mockData'
import autoLogo from '../assets/Logo.png'

const menuItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: Users, label: 'Customers', to: '/customers' },
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
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: Settings, label: 'Settings', to: '/account-settings' },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
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
              <img src={currentUser.avatar} alt={currentUser.name} className="user-profile-avatar" />
              <div className="user-profile-status"></div>
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">{currentUser.name}</div>
              <div className="user-profile-email">{currentUser.email}</div>
            </div>
            <ChevronDown size={16} className="user-profile-chevron" />
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
              <span className="greeting-text">Good Morning, Kamal Okelola!</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={16} className="search-icon" />
              <input placeholder="Search anything" />
              <Filter size={16} className="search-filter-icon" />
            </div>
            <button className="topbar-icon-btn">
              <Calendar size={20} />
            </button>
            <button className="topbar-icon-btn">
              <Bell size={20} />
            </button>
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
