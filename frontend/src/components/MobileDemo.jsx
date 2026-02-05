import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';
import TouchButton from './TouchButton';
import MobileCard, { MobileCardRow, MobileCardBadge, MobileCardActions } from './MobileCard';
import BottomNavigation from './BottomNavigation';
import MobileDrawer from './MobileDrawer';
import SwipeableCard from './SwipeableCard';
import PullToRefresh from './PullToRefresh';
import { FiHome, FiUser, FiSettings, FiMenu } from 'react-icons/fi';

/**
 * Demo component untuk showcase mobile components
 * Hapus file ini jika tidak diperlukan
 */
const MobileDemo = () => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home', exact: true },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Refreshed!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Mobile Components Demo</h1>
          <p className="text-gray-600">
            Device: {isMobile ? '📱 Mobile' : '💻 Desktop'}
          </p>
        </div>

        {/* TouchButton Demo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">TouchButton</h2>
          <div className="space-y-3">
            <TouchButton variant="primary" fullWidth>
              Primary Button
            </TouchButton>
            <TouchButton variant="success" fullWidth>
              Success Button
            </TouchButton>
            <TouchButton variant="danger" fullWidth>
              Danger Button
            </TouchButton>
          </div>
        </div>

        {/* MobileCard Demo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">MobileCard</h2>
          <MobileCard>
            <h3 className="font-bold text-lg mb-2">John Doe</h3>
            <MobileCardRow label="Email" value="john@example.com" />
            <MobileCardRow label="Phone" value="+62 812 3456 7890" />
            <MobileCardBadge variant="success">Active</MobileCardBadge>
            <MobileCardActions>
              <TouchButton variant="primary" size="sm" fullWidth>
                Edit
              </TouchButton>
            </MobileCardActions>
          </MobileCard>
        </div>

        {/* SwipeableCard Demo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">SwipeableCard (Swipe me!)</h2>
          <SwipeableCard
            onSwipeLeft={() => alert('Deleted!')}
            onSwipeRight={() => alert('Approved!')}
          >
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
              <p className="font-semibold">Swipe left to delete</p>
              <p className="text-sm text-gray-600">Swipe right to approve</p>
            </div>
          </SwipeableCard>
        </div>

        {/* Drawer Demo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">MobileDrawer</h2>
          <TouchButton
            variant="primary"
            icon={FiMenu}
            onClick={() => setDrawerOpen(true)}
          >
            Open Drawer
          </TouchButton>
        </div>

        {/* Pull to Refresh Demo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">PullToRefresh</h2>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center text-gray-700">
                Pull down to refresh this content
              </p>
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Menu"
      >
        <div className="space-y-2">
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
            Menu Item 1
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
            Menu Item 2
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">
            Menu Item 3
          </button>
        </div>
      </MobileDrawer>

      {/* Bottom Navigation */}
      {isMobile && <BottomNavigation items={navItems} />}
    </div>
  );
};

export default MobileDemo;
