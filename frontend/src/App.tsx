import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import GestionAulas from './pages/GestionAulas';
import HistorialConsumo from './pages/HistorialConsumo';
import Alertas from './pages/Alertas';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/aulas" element={<GestionAulas />} />
          <Route path="/historial" element={<HistorialConsumo />} />
          <Route path="/alertas" element={<Alertas />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;