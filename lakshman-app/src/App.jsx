import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/ui/AppShell'
import Breathe from './pages/Breathe'
import FirstAid from './pages/FirstAid'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/first-aid" element={<FirstAid />} />
        <Route path="/breathe" element={<Breathe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
