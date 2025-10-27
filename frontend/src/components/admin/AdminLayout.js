import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  FileCheck,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Key,
  Lock,
  UserCog,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const { isMobile, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on navigation
  useEffect(() => {
    if (isMobile || isTablet) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile, isTablet]);

  // Desktop: show sidebar by default, Mobile/Tablet: hide by default
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile, isTablet]);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/kyc', icon: Shield, label: 'KYC Verification' },
    { path: '/admin/documents', icon: FileText, label: 'Documents' },
    { path: '/admin/deposits', icon: ArrowDownCircle, label: 'Deposits' },
    { path: '/admin/withdrawals', icon: ArrowUpCircle, label: 'Withdrawals' },
    { path: '/admin/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/admin/logs', icon: FileCheck, label: 'Audit Logs' },
    { path: '/admin/api-tokens', icon: Key, label: 'API Tokens', divider: true },
    { path: '/admin/api-permissions', icon: Lock, label: 'API Permissions' },
    { path: '/admin/admin-users', icon: UserCog, label: 'Admin Users', superAdminOnly: true },
    { path: '/admin/settings', icon: Settings, label: 'Settings', superAdminOnly: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base sm:text-lg">Admin Panel</h1>
            <p className="text-slate-400 text-xs">Trading Platform</p>
          </div>
        </div>
        {(isMobile || isTablet) && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          // Hide super admin only items for non-super admins
          if (item.superAdminOnly && admin?.role !== 'super_admin') {
            return null;
          }
          
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={item.path}>
              {item.divider && <div className="h-px bg-slate-800 my-3" />}
              <Link
                to={item.path}
                onClick={() => (isMobile || isTablet) && setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all tap-target ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 sm:p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 mb-3">
          <p className="text-white font-medium text-sm">{admin?.full_name || 'Admin'}</p>
          <p className="text-slate-400 text-xs truncate">{admin?.email}</p>
          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
            admin?.role === 'super_admin'
              ? 'bg-purple-500/20 text-purple-300'
              : admin?.role === 'admin'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-green-500/20 text-green-300'
          }`}>
            {admin?.role?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-slate-800 hover:bg-red-600 text-white border-slate-700 tap-target"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      {!isMobile && !isTablet && (
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } bg-slate-900 border-r border-slate-800 w-64`}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Mobile/Tablet Sidebar (Sheet) */}
      {(isMobile || isTablet) && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-72 sm:w-80 bg-slate-900 border-slate-800">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen && !isMobile && !isTablet ? 'lg:ml-64' : 'ml-0'
      }`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 safe-top">
          <button
            onClick={() => {
              if (isMobile || isTablet) {
                setMobileMenuOpen(!mobileMenuOpen);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors tap-target"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
          
          <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          
          {/* Mobile date - shorter format */}
          <div className="text-xs text-slate-600 sm:hidden">
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 safe-bottom">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;