/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoController } from './components/DemoController';
import { LandingView } from './views/LandingView';
import { MapView } from './views/MapView';
import { ReportView } from './views/ReportView';
import { DestinationDetailView } from './views/DestinationDetailView';
import { DashboardView } from './views/DashboardView';
import { LeaderboardView } from './views/LeaderboardView';
import { AboutView } from './views/AboutView';
import { AuthModal } from './views/AuthModal';
import { storageService } from './services/storageService';
import { Destination, CrowdReport, User } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [isViewingDetail, setIsViewingDetail] = useState<boolean>(false);
  
  const [destinations, setDestinations] = useState<Destination[]>(storageService.getDestinations());
  const [reports, setReports] = useState<CrowdReport[]>(storageService.getReports());
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(storageService.isDemoMode());

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  // Subscribe to storage changes for instant real-time synchronization
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setDestinations(storageService.getDestinations());
      setReports(storageService.getReports());
      setCurrentUser(storageService.getCurrentUser());
      setIsDemoMode(storageService.isDemoMode());
    });
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setIsViewingDetail(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestination = (destId: string) => {
    setSelectedDestinationId(destId);
    setIsViewingDetail(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportDestination = (destId: string) => {
    setSelectedDestinationId(destId);
    setIsViewingDetail(false);
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOnMap = (destId: string) => {
    setSelectedDestinationId(destId);
    setIsViewingDetail(false);
    setCurrentTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportSuccess = (destId: string) => {
    setSelectedDestinationId(destId);
    setIsViewingDetail(true);
  };

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Navbar with Top Bar Contract */}
      <Navbar
        currentTab={isViewingDetail ? '' : currentTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isDemoMode={isDemoMode}
        onToggleDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        {/* If user clicked a destination, render DestinationDetailView */}
        {isViewingDetail && selectedDestination ? (
          <DestinationDetailView
            destination={selectedDestination}
            reports={reports}
            onBack={() => setIsViewingDetail(false)}
            onReport={handleReportDestination}
            onViewOnMap={handleViewOnMap}
            isDemoMode={isDemoMode}
            onOpenSimulator={() => setIsDemoModalOpen(true)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <LandingView
                destinations={destinations}
                reports={reports}
                onSelectTab={handleSelectTab}
                onSelectDestination={handleSelectDestination}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {currentTab === 'map' && (
              <MapView
                destinations={destinations}
                reports={reports}
                selectedDestinationId={selectedDestinationId}
                onSelectDestination={handleSelectDestination}
                onReportDestination={handleReportDestination}
                isDemoMode={isDemoMode}
                onToggleDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {currentTab === 'report' && (
              <ReportView
                destinations={destinations}
                initialDestinationId={selectedDestinationId || undefined}
                currentUser={currentUser}
                onReportSuccess={handleReportSuccess}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                reports={reports}
                destinations={destinations}
                onSelectTab={handleSelectTab}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSelectDestination={handleSelectDestination}
              />
            )}

            {currentTab === 'leaderboard' && (
              <LeaderboardView
                currentUser={currentUser}
                onSelectTab={handleSelectTab}
              />
            )}

            {currentTab === 'about' && (
              <AboutView
                onSelectTab={handleSelectTab}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Modals & Simulation Controller */}
      <DemoController
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        destinations={destinations}
        onSelectDestination={(id) => {
          setSelectedDestinationId(id);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
