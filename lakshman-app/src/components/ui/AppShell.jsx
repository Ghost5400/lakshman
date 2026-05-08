import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body antialiased pb-[64px] md:pb-0">
      <AppHeader />
      <SideNav />
      <main className="flex-grow px-margin py-lg max-w-2xl mx-auto w-full md:ml-64 md:max-w-4xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default AppShell
