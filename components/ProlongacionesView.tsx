import React, { useState, useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddSurgeryForm from './AddSurgeryForm';
import SurgeryActivityList from './SurgeryActivityList';
import MonthYearInputDialog from './MonthYearInputDialog';
import { SurgicalActivity, ActivityFilter } from '../types'; // Adjusted path
import useLocalStorage from '../hooks/useLocalStorage'; // Adjusted path

interface ProlongacionesViewProps {
  navigateToMenu: () => void;
}

const ProlongacionesView: React.FC<ProlongacionesViewProps> = ({ navigateToMenu }) => {
  const [activities, setActivities] = useLocalStorage<SurgicalActivity[]>('surgicalActivities', []);
  const [filter, setFilter] = useState<ActivityFilter>(ActivityFilter.ALL);
  const [editingActivity, setEditingActivity] = useState<SurgicalActivity | null>(null);
  const [activityToPromptForMonth, setActivityToPromptForMonth] = useState<SurgicalActivity | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSaveActivity = useCallback((activityData: SurgicalActivity | Omit<SurgicalActivity, 'id' | 'isPaid' | 'mesCobro'>) => {
    if ('id' in activityData && activityData.id) {
      let updatedActivity = activityData as SurgicalActivity;
      if (!updatedActivity.isPaid) {
        updatedActivity = { ...updatedActivity, mesCobro: undefined };
      }
      setActivities(prev =>
        prev.map(act => (act.id === updatedActivity.id ? updatedActivity : act))
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      );
    } else {
      const newActivityDetails = activityData as Omit<SurgicalActivity, 'id' | 'isPaid' | 'mesCobro'>;
      const newActivity: SurgicalActivity = {
        ...newActivityDetails,
        id: uuidv4(),
        isPaid: false,
      };
      setActivities(prev => [newActivity, ...prev].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    }
    setEditingActivity(null);
  }, [setActivities]);

  const handleRequestMonthForPayment = useCallback((activity: SurgicalActivity) => {
    setActivityToPromptForMonth(activity);
  }, []);

  const handleConfirmMonthForPayment = useCallback((activityId: string, mesCobroValue: string) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? { ...act, isPaid: true, mesCobro: mesCobroValue }
          : act
      )
    );
    setActivityToPromptForMonth(null);
  }, [setActivities]);

  const handleCancelMonthPrompt = useCallback(() => {
    setActivityToPromptForMonth(null);
  }, []);

  const handleMarkAsUnpaid = useCallback((activityId: string) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? { ...act, isPaid: false, mesCobro: undefined }
          : act
      )
    );
  }, [setActivities]);

  const deleteActivity = useCallback((id: string) => {
    if (editingActivity && editingActivity.id === id) {
      setEditingActivity(null); 
    }
    if (activityToPromptForMonth && activityToPromptForMonth.id === id) {
      setActivityToPromptForMonth(null);
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.')) {
      setActivities(prev => prev.filter(act => act.id !== id));
    }
  }, [setActivities, editingActivity, activityToPromptForMonth]);

  const handleStartEdit = useCallback((activity: SurgicalActivity) => {
    if (activityToPromptForMonth) setActivityToPromptForMonth(null);
    setEditingActivity(activity);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activityToPromptForMonth]);

  const handleCancelEdit = useCallback(() => {
    setEditingActivity(null);
  }, []);

  const getTranslatedFilterName = (filterValue: ActivityFilter): string => {
    switch (filterValue) {
      case ActivityFilter.ALL: return 'Todas';
      case ActivityFilter.PAID: return 'Pagadas';
      case ActivityFilter.UNPAID: return 'Pendientes';
      default: return filterValue;
    }
  };

  const filteredActivities = useMemo(() => {
    return activities
      .filter(activity => {
        if (filter === ActivityFilter.PAID) return activity.isPaid;
        if (filter === ActivityFilter.UNPAID) return !activity.isPaid;
        return true;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [activities, filter]);

  const isUIBlocked = !!editingActivity || !!activityToPromptForMonth;

  return (
    <div className="w-full">
      <button
        onClick={navigateToMenu}
        className="mb-6 flex items-center px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver al Menú Principal
      </button>

      <header className="w-full max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-sky-700">
          Registro de prolongaciones HUSE
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Lleva un control de tus procedimientos quirúrgicos y estado de cobro.
        </p>
      </header>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200 ${isUIBlocked && !editingActivity ? 'opacity-50 pointer-events-none' : ''}`} ref={formRef}>
          <AddSurgeryForm
            onSubmit={handleSaveActivity}
            activityToEdit={editingActivity}
            onCancelEdit={handleCancelEdit}
            isDisabled={!!activityToPromptForMonth}
          />
        </div>

        <div className={`lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200 ${isUIBlocked && !editingActivity && !activityToPromptForMonth ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-sky-600">Historial de Actividades</h2>
            <div className="flex gap-2">
              {(Object.values(ActivityFilter) as ActivityFilter[]).map(filterKey => (
                <button
                  key={filterKey}
                  onClick={() => setFilter(filterKey)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    ${filter === filterKey
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  disabled={isUIBlocked} 
                >
                  {getTranslatedFilterName(filterKey)}
                </button>
              ))}
            </div>
          </div>
          {activities.length === 0 ? (
             <div className="text-center py-10 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M12 14.25m-2.625 0a2.625 2.625 0 1 0 5.25 0 2.625 2.625 0 1 0-5.25 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25v-2.192c0-.963-.787-1.75-1.75-1.75h-2c-.963 0-1.75.787-1.75 1.75v2.192m2.25 11.458c-2.825.268-4.5 2.035-4.5 4.292C7.5 22.25 9.75 24 12.75 24H15c2.25 0 4.5-1.75 4.5-4.292 0-2.257-1.675-4.024-4.5-4.292m0 0a5.25 5.25 0 0 04.933-4.404c.129-.955-.164-1.92-.895-2.523-.73-.602-1.73-.836-2.662-.684a5.25 5.25 0 0 0-4.933 4.404c-.129.955.164 1.92.895 2.523.73.602 1.73.836 2.662-.684Z" />
                </svg>
               <p className="text-lg">Aún no hay actividades registradas.</p>
               <p className="text-sm">Usa el formulario para añadir tu primera actividad quirúrgica.</p>
             </div>
          ) : filteredActivities.length === 0 && !editingActivity ? (
            <div className="text-center py-10 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-lg">Ninguna actividad coincide con el filtro "{getTranslatedFilterName(filter)}".</p>
            </div>
          ) : (
            <SurgeryActivityList
              activities={filteredActivities}
              onRequestMonthForPayment={handleRequestMonthForPayment}
              onMarkAsUnpaid={handleMarkAsUnpaid}
              onDelete={deleteActivity}
              onStartEdit={handleStartEdit}
              editingActivityId={editingActivity?.id || null}
              activityPromptingForMonthId={activityToPromptForMonth?.id || null}
            />
          )}
        </div>
      </main>

      {activityToPromptForMonth && (
        <MonthYearInputDialog
          activity={activityToPromptForMonth}
          onConfirm={handleConfirmMonthForPayment}
          onCancel={handleCancelMonthPrompt}
        />
      )}

      <footer className="w-full max-w-6xl mx-auto mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Registro de prolongaciones HUSE. Todos los datos se guardan localmente en tu navegador.</p>
      </footer>
    </div>
  );
};

export default ProlongacionesView;
