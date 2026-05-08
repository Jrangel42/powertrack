import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, History, AlertCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/aulas', icon: Building, label: 'Gestión de Aulas' },
    { to: '/historial', icon: History, label: 'Historial' },
    { to: '/alertas', icon: AlertCircle, label: 'Alertas' },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Navegación</h2>
      </div>
      <nav className="mt-6 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>PowerTrack v1.0.0</p>
          <p className="mt-1">© 2024 Sistema de Monitoreo</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;