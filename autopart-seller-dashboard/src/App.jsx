import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerProfile } from './features/authSlice'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Inbox from './pages/Inbox'
import AccountSettings from './pages/AccountSettings'
import AccountCentre from './pages/AccountCentre'
import Products from './pages/products/Products'
import ProductDetail from './pages/products/ProductDetail'
import AddProduct from './pages/products/AddProduct'
import EditProduct from './pages/products/EditProduct'
import Inventory from './pages/Inventory'
import Orders from './pages/orders/Orders'
import OrderDetail from './pages/orders/OrderDetail'
import Customers from './pages/customers/Customers'
import AddCustomer from './pages/customers/AddCustomer'
import CustomerDetail from './pages/customers/CustomerDetail'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/transactions/TransactionDetail'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import PendingVerification from './pages/auth/PendingVerification'
import NotFound from './pages/auth/NotFound'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(getSellerProfile())
    }
  }, [dispatch, token])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/pending-verification" element={<PendingVerification />} />
        </Route>

        {/* Dashboard shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/account-centre" element={<AccountCentre />} />

            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/inventory" element={<Inventory />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/:refNumber" element={<CustomerDetail />} />

            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
