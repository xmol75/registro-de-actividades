import React from 'react';
import { AppView } from '../types.ts';

interface MainMenuProps {
  navigateTo: (view: AppView) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ navigateTo }) => {
  const menuItemBaseStyle = "p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer text-center";
  const activeMenuItemStyle = `${menuItemBaseStyle} bg-sky-600 text-white hover:bg-sky-700`;
  const inactiveMenuItemStyle = `${menuItemBaseStyle} bg-slate-300 text-slate-500 cursor-not-allowed opacity-70`;

  return (
    <div className="w-full max-w-2xl text-center">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-sky-700">
          Menú Principal
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Selecciona el registro que deseas gestionar.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={activeMenuItemStyle}
          onClick={() => navigateTo(AppView.PROLONGACIONES)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && navigateTo(AppView.PROLONGACIONES)}
        >
          <h2 className="text-2xl font-semibold mb-2">Registro de prolongaciones HUSE</h2>
          <p className="text-sm">Gestiona tus prolongaciones quirúrgicas y su estado de cobro.</p>
        </div>
        <div
          className={inactiveMenuItemStyle}
          title="Funcionalidad no disponible actualmente"
          role="button"
          aria-disabled="true"
        >
          <h2 className="text-2xl font-semibold mb-2">Registro de actividad de trasplantes</h2>
          <p className="text-sm">(Próximamente)</p>
        </div>
      </div>
       <footer className="w-full mt-16 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Gestión de Registros Quirúrgicos.</p>
      </footer>
    </div>
  );
};

export default MainMenu;