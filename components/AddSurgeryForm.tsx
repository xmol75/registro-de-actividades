import React, { useState, useEffect, useCallback } from 'react';
import { SurgicalActivity } from '../types';

interface AddSurgeryFormProps {
  onSubmit: (activityData: SurgicalActivity | Omit<SurgicalActivity, 'id' | 'isPaid' | 'mesCobro'>) => void;
  activityToEdit: SurgicalActivity | null;
  onCancelEdit: () => void;
  isDisabled?: boolean;
}

const AddSurgeryForm: React.FC<AddSurgeryFormProps> = ({ onSubmit, activityToEdit, onCancelEdit, isDisabled }) => {
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nhc, setNhc] = useState<string>('');
  const [cirugia, setCirugia] = useState<string>('');
  const [equipoQuirurgico, setEquipoQuirurgico] = useState<string>('');
  const [tiempoFin, setTiempoFin] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [comentario, setComentario] = useState<string>('');
  const [mesCobroForm, setMesCobroForm] = useState<string>(''); // Formato YYYY-MM

  const isEditing = !!activityToEdit;

  const resetFormFields = useCallback(() => {
    setFecha(new Date().toISOString().split('T')[0]);
    setNhc('');
    setCirugia('');
    setEquipoQuirurgico('');
    setTiempoFin('');
    setPrecio('');
    setComentario('');
    setMesCobroForm('');
  }, []);

  useEffect(() => {
    if (activityToEdit) {
      setFecha(activityToEdit.fecha);
      setNhc(activityToEdit.nhc);
      setCirugia(activityToEdit.cirugia);
      setEquipoQuirurgico(activityToEdit.equipoQuirurgico);
      setTiempoFin(activityToEdit.tiempoFin || '');
      setPrecio(activityToEdit.precio !== undefined ? String(activityToEdit.precio) : '');
      setComentario(activityToEdit.comentario || '');
      if (activityToEdit.isPaid && activityToEdit.mesCobro) {
        setMesCobroForm(activityToEdit.mesCobro);
      } else {
        setMesCobroForm('');
      }
    } else {
      resetFormFields();
    }
  }, [activityToEdit, resetFormFields]);

  const commonInputClass = "w-full p-3 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-700 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const commonLabelClass = "block mb-1.5 text-sm font-medium text-sky-700";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    if (!fecha || !nhc.trim() || !cirugia.trim() || !equipoQuirurgico.trim()) {
      alert("Por favor, completa Fecha, NHC, Cirugía y Equipo Quirúrgico.");
      return;
    }

    if (isEditing && activityToEdit && activityToEdit.isPaid && !mesCobroForm) {
        alert("Por favor, introduce el Mes de Cobro para una actividad pagada.");
        return;
    }


    const activityBaseData = {
      fecha,
      nhc: nhc.trim(),
      cirugia: cirugia.trim(),
      equipoQuirurgico: equipoQuirurgico.trim(),
      tiempoFin: tiempoFin || undefined,
      precio: precio ? parseFloat(precio) : undefined,
      comentario: comentario.trim() || undefined,
    };

    if (isEditing && activityToEdit) {
      onSubmit({
        ...activityToEdit, // Preserve id, isPaid
        ...activityBaseData,
        mesCobro: activityToEdit.isPaid ? mesCobroForm : undefined,
      });
    } else {
      onSubmit(activityBaseData as Omit<SurgicalActivity, 'id' | 'isPaid' | 'mesCobro'>);
      resetFormFields();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-semibold text-sky-600 mb-6">
        {isEditing ? 'Editar Actividad Quirúrgica' : 'Registrar Nueva Actividad'}
      </h2>
      <div>
        <label htmlFor="fecha" className={commonLabelClass}>Fecha</label>
        <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} className={commonInputClass} required disabled={isDisabled} />
      </div>
      <div>
        <label htmlFor="nhc" className={commonLabelClass}>NHC (Nº Historia Clínica)</label>
        <input type="text" id="nhc" value={nhc} onChange={(e) => setNhc(e.target.value)} placeholder="ej., 1234567 / SIALAB01" className={commonInputClass} required disabled={isDisabled} />
      </div>
      <div>
        <label htmlFor="cirugia" className={commonLabelClass}>Cirugía</label>
        <input type="text" id="cirugia" value={cirugia} onChange={(e) => setCirugia(e.target.value)} placeholder="ej., Apendicectomía laparoscópica" className={commonInputClass} required disabled={isDisabled} />
      </div>
      <div>
        <label htmlFor="equipoQuirurgico" className={commonLabelClass}>Equipo Quirúrgico</label>
        <input type="text" id="equipoQuirurgico" value={equipoQuirurgico} onChange={(e) => setEquipoQuirurgico(e.target.value)} placeholder="ej., Dr. Pérez, Dra. Gómez, Enf. Ruiz" className={commonInputClass} required disabled={isDisabled} />
      </div>
       {isEditing && activityToEdit && activityToEdit.isPaid && (
        <div>
          <label htmlFor="mesCobro" className={commonLabelClass}>Mes de Cobro (Pagada)</label>
          <input
            type="month"
            id="mesCobro"
            value={mesCobroForm}
            onChange={(e) => setMesCobroForm(e.target.value)}
            className={commonInputClass}
            required
            disabled={isDisabled}
          />
        </div>
      )}
      <div>
        <label htmlFor="tiempoFin" className={commonLabelClass}>Tiempo Fin</label>
        <input type="time" id="tiempoFin" value={tiempoFin} onChange={(e) => setTiempoFin(e.target.value)} className={commonInputClass} disabled={isDisabled} />
      </div>
      <div>
        <label htmlFor="precio" className={commonLabelClass}>Precio (€)</label>
        <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="ej., 1500.50" step="0.01" min="0" className={commonInputClass} disabled={isDisabled} />
      </div>
      <div>
        <label htmlFor="comentario" className={commonLabelClass}>Comentario (Opcional)</label>
        <textarea id="comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="ej., Cirugía sin complicaciones, paciente estable." rows={3} className={`${commonInputClass} resize-y`} disabled={isDisabled} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d={isEditing ? "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" : "M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"} clipRule="evenodd" />
          </svg>
          {isEditing ? 'Guardar Cambios' : 'Registrar Actividad'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full sm:w-auto flex items-center justify-center p-3 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-slate-400 transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default AddSurgeryForm;