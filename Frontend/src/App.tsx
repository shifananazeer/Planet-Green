import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";
import CategoryPage from "./pages/admin/CategoryPage";
import ProductPage from "./pages/admin/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import UserLayout from "./layout/UserLayout";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import MyReferralsPage from "./pages/MyReferralsPage";
import ProductsPage from "./pages/user/ProductPageUser";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import CartPage from "./pages/user/cartPage";
import PurchaseSettingsPage from "./pages/admin/PurchaseSettingsPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import MyOrdersPage from "./pages/user/MyOrdersPage";
import WalletPage from "./pages/WalletPage";
import NetworkTreePage from "./pages/user/NetworkTreePage";
import AdminNetworkTreePage from "./pages/admin/AdminNetworkTreePage";
import AdminCommissionReportPage from "./pages/admin/AdminCommissionReportPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import WithdrawalPage from "./pages/user/WithdrawalPage";
import AdminWithdrawalPage from "./pages/admin/AdminWithdrawalPage";
import AdminMyWithdrawalPage from "./pages/admin/AdminMyWithdrawalPage";
import TransactionsPage from "./pages/TransactionsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetailsPage";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />}/>



<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard"element={<AdminDashboard />}/>
  <Route path="/admin/category" element={<CategoryPage/>}/>
  <Route path="/admin/products" element={<ProductPage/>}/>
  <Route path="/admin/profile" element={<ProfilePage/>}/>
  <Route path="/admin/purchase-settings"element={<PurchaseSettingsPage />}/>
  <Route path="/admin/wallet" element={<WalletPage/>}/>
  <Route path="/admin/network-tree" element={<AdminNetworkTreePage />}/>
  <Route path="/admin/commission-report" element={<AdminCommissionReportPage/>}/>
  <Route path="/admin/orders" element={<AdminOrdersPage/>}/>
  <Route path="/admin/withdrawals" element={<AdminWithdrawalPage/>}/>
  <Route path="/admin/my-withdrawals" element={<AdminMyWithdrawalPage/>}/>
  <Route path="/admin/transactions" element={<TransactionsPage/>}/>
  <Route path="/admin/users" element={<AdminUsersPage/>}/>
  <Route path="/admin/users/:id" element={<AdminUserDetailsPage />}/>
</Route>

<Route path="/user" element={<UserLayout />}>
  <Route path="dashboard" element={<UserDashboardPage />} />
  <Route path="referrals" element={<MyReferralsPage />} />
  <Route path="products" element={<ProductsPage />} />
  <Route path="products/:id" element={<ProductDetailsPage />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="cart" element={<CartPage />} />
  <Route path="checkout" element={<CheckoutPage />} />
  <Route path="orders" element={<MyOrdersPage/>}/>
  <Route path="wallet"element={<WalletPage />}/>
  <Route path="network-tree" element={<NetworkTreePage/>}/>
  <Route path="withdrawals"element={<WithdrawalPage />}/>
  <Route path="transactions" element={<TransactionsPage />}/>
</Route>
        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;