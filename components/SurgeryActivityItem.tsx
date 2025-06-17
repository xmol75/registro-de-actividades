import React from 'react';
import { SurgicalActivity } from '../types';

interface SurgeryActivityItemProps {
  activity: SurgicalActivity;
  onRequestMonthForPayment: (activity: SurgicalActivity) => void;
  onMarkAsUnpaid: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (activity: SurgicalActivity) => void;
  isBeingEdited: boolean;
  isAnotherItemBeingEdited: boolean;
  isPromptingForMonth: boolean;
}

const SurgeryActivityItem: React.FC<SurgeryActivityItemProps> = ({ 
  activity, 
  onRequestMonthForPayment,
  onMarkAsUnpaid, 
  onDelete, 
  onStartEdit,
  isBeingEdited,
  isAnotherItemBeingEdited,
  isPromptingForMonth
}) => {
  const { id, fecha, nhc, cirugia, equipoQuirurgico, tiempoFin, precio, comentario, isPaid, mesCobro } = activity;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatMonthYear = (monthYearString?: string) => {
    if (!monthYearString) return 'N/A'; // YYYY-MM
    const [year, month] = monthYearString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  const actionsDisabled = isAnotherItemBeingEdited || isBeingEdited || isPromptingForMonth;
  const itemStyles = `bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150 
    ${isBeingEdited || isPromptingForMonth ? 'ring-2 ring-sky-500' : ''} 
    ${isAnotherItemBeingEdited && !isBeingEdited && !isPromptingForMonth ? 'opacity-60 pointer-events-none' : ''}`;


  return (
    <div className={itemStyles}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        <div className="flex-grow space-y-1.5">
          <div className="flex items-center">
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full mr-3
                ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
            >
              {isPaid ? 'Pagada' : 'Pendiente'}
            </span>
            <h3 className="text-lg font-semibold text-sky-700 flex-1">{cirugia}</h3>
          </div>
          
          <p className="text-sm text-slate-600">
            <strong className="font-medium">Fecha:</strong> {formatDate(fecha)}
          </p>
          <p className="text-sm text-slate-600">
            <strong className="font-medium">NHC:</strong> {nhc}
          </p>
          <p className="text-sm text-slate-600">
            <strong className="font-medium">Equipo:</strong> {equipoQuirurgico}
          </p>
          
          <div className="grid grid-cols-2 gap-x-3 text-sm text-slate-600">
            {tiempoFin && (
              <p><strong className="font-medium">Hora Fin:</strong> {tiempoFin}</p>
            )}
            {precio !== undefined && (
               <p><strong className="font-medium">Precio:</strong> {formatCurrency(precio)}</p>
            )}
          </div>

          {isPaid && mesCobro && (
            <p className="text-xs text-green-600">
              <strong className="font-medium">Mes Cobro:</strong> {formatMonthYear(mesCobro)}
            </p>
          )}
          {comentario && (
            <div className="mt-2 text-sm text-slate-500 bg-slate-100 p-2.5 rounded-md">
              <strong className="block mb-0.5 font-medium text-slate-600">Comentario:</strong> 
              <p className="whitespace-pre-wrap">{comentario}</p>
            </div>
          )}
        </div>
        <div className="flex sm:flex-col items-stretch sm:items-end gap-2 mt-2 sm:mt-0 flex-shrink-0 min-w-[130px]">
          <button
            onClick={() => onStartEdit(activity)}
            aria-label="Editar actividad"
            disabled={actionsDisabled}
            className="px-3 py-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-100 rounded-md transition-colors w-full flex items-center justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => isPaid ? onMarkAsUnpaid(id) : onRequestMonthForPayment(activity)}
            aria-label={isPaid ? "Marcar como Pendiente" : "Marcar como Pagada y registrar mes"}
            disabled={actionsDisabled && !isPromptingForMonth} // Enable if it's this item prompting
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors w-full flex items-center justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed
              ${isPaid 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
               {isPaid ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
               ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               )}
            </svg>
            {isPaid ? 'Pendiente' : 'Pagada...'}
          </button>
          <button
            onClick={() => onDelete(id)}
            aria-label="Eliminar actividad"
            disabled={actionsDisabled}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors w-full flex items-center justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurgeryActivityItem;