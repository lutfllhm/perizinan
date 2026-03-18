import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Input from '../ui/Input';
import BottomNavigation from '../BottomNavigation';
import { Bell } from 'lucide-react';

export default function DashboardShell({
  children,
  logoSrc = '/img/logo.png',
  brandTitle = 'IWARE',
  brandSubtitle,
  navItems = [],
  bottomNavItems,
  user,
  roleLabel,
  onLogout,
  searchPlaceholder = 'Search…',
  onSearchChange,
  accent = 'violet',
  notificationCount = 0,
  onNotificationsClick,
}) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handle = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const items = useMemo(() => navItems.filter(Boolean), [navItems]);
  const mobileItems = useMemo(
    () => (bottomNavItems ? bottomNavItems.filter(Boolean) : items.slice(0, 4)),
    [bottomNavItems, items]
  );

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const accentDot =
    accent === 'cyan'
      ? 'bg-cyan-300'
      : accent === 'emerald'
      ? 'bg-emerald-300'
      : accent === 'fuchsia'
      ? 'bg-fuchsia-300'
      : 'bg-violet-300';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}

      {(sidebarOpen || !isMobile) && (
        <motion.aside
          initial={{ x: isMobile ? -320 : 0 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          className={`${
            isMobile ? 'w-72' : sidebarOpen ? 'w-72' : 'w-20'
          } min-h-screen fixed left-0 top-0 transition-all duration-300 z-40 overflow-y-auto dark-scrollbar
           bg-slate-950/60 backdrop-blur-2xl border-r border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]`}
        >
          <div className="p-3 pb-20">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-xl border border-white/15 bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden">
                    <img
                      src={logoSrc}
                      alt={brandTitle}
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{brandTitle}</h2>
                    <p className="text-xs text-slate-300">{brandSubtitle}</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <span className="text-lg text-slate-200">{sidebarOpen ? '✕' : '☰'}</span>
              </button>
            </div>

            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400 truncate">@{user?.username || 'user'}</p>
                  </div>
                  {roleLabel && (
                    <span className="text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-slate-200">
                      {roleLabel}
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            <nav className="space-y-1">
              {items.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link key={item.path} to={item.path} onClick={() => isMobile && setSidebarOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`flex items-center space-x-2 p-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-white/10 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                          : 'hover:bg-white/5 hover:translate-x-1'
                      }`}
                    >
                      {Icon ? <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} /> : null}
                      {sidebarOpen && (
                        <span className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                      )}
                      {active && sidebarOpen && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${accentDot}`} />}
                    </motion.div>
                  </Link>
                );
              })}

              <div className="py-2">
                <div className="border-t border-white/10" />
              </div>

              <motion.button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center space-x-2 p-2.5 rounded-xl hover:bg-rose-500/15 hover:translate-x-1 transition-all duration-200 group border border-transparent hover:border-rose-400/20"
              >
                <span className="text-slate-400 group-hover:text-white">⎋</span>
                {sidebarOpen && <span className="text-sm font-medium text-slate-300 group-hover:text-white">Logout</span>}
              </motion.button>
            </nav>
          </div>
        </motion.aside>
      )}

      {/* Main */}
      <div
        className={`flex-1 ${
          !isMobile && sidebarOpen ? 'ml-72' : !isMobile ? 'ml-20' : 'ml-0'
        } transition-all duration-300 ${isMobile ? 'pb-20' : ''}`}
      >
        {/* Topbar */}
        {!isMobile && (
          <div className="sticky top-0 z-30">
            <div className="mx-auto max-w-[1200px] px-4 md:px-8 pt-4">
              <Card className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xl">
                    <Input placeholder={searchPlaceholder} className="w-full" onChange={onSearchChange} />
                  </div>
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                    aria-label="Notifications"
                    onClick={onNotificationsClick}
                  >
                    <span className="relative">
                      <Bell className="h-4 w-4 text-slate-200" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border border-rose-300/30">
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
                    </span>
                  </button>
                  <div className="flex items-center gap-2 pl-2">
                    <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      <img
                        src={logoSrc}
                        alt={brandTitle}
                        className="h-6 w-6 object-contain opacity-90"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-semibold leading-tight">{user?.name || brandTitle}</div>
                      <div className="text-xs text-slate-400 leading-tight">{roleLabel || ''}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Mobile header */}
        {isMobile && (
          <div className="p-4">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Open menu"
                >
                  ☰
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl border border-white/15 bg-white/90 flex items-center justify-center overflow-hidden">
                    <img
                      src={logoSrc}
                      alt={brandTitle}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-white">{brandTitle}</div>
                    <div className="text-xs text-slate-300">{roleLabel}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 hover:bg-rose-500/15 text-rose-300 rounded-xl transition-colors"
                  aria-label="Logout"
                >
                  ⎋
                </button>
              </div>
            </Card>
          </div>
        )}

        <div className="p-4 md:p-8">{children}</div>
      </div>

      {isMobile && <BottomNavigation items={mobileItems} variant="dark" />}
    </div>
  );
}

