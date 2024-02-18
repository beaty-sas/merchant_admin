'use client';

import { OverviewAppView } from 'src/sections/overview/app/view';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';


export default function HomeView() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <OverviewAppView />
      </DashboardLayout>
    </AuthGuard>
    )
}
