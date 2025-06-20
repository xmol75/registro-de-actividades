import React from 'react';
import { SurgicalActivity } from '../types.ts';
import SurgeryActivityItem from './SurgeryActivityItem.tsx';

interface SurgeryActivityListProps {
  activities: SurgicalActivity[];
  onRequestMonthForPayment: (activity: SurgicalActivity) => void;
  onMarkAsUnpaid: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (activity: SurgicalActivity) => void;
  editingActivityId: string | null;
  activityPromptingForMonthId: string | null;
}

const SurgeryActivityList: React.FC<SurgeryActivityListProps> = ({ 
  activities, 
  onRequestMonthForPayment, 
  onMarkAsUnpaid, 
  onDelete, 
  onStartEdit, 
  editingActivityId,
  activityPromptingForMonthId
}) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M12 14.25m-2.625 0a2.625 2.625 0 1 0 5.25 0 2.625 2.625 0 1 0-5.25 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25v-2.192c0-.963-.787-1.75-1.75-1.75h-2c-.963 0-1.75.787-1.75 1.75v2.192m2.25 11.458c-2.825.268-4.5 2.035-4.5 4.292C7.5 22.25 9.75 24 12.75 24H15c2.25 0 4.5-1.75 4.5-4.292 0-2.257-1.675-4.024-4.5-4.292m0 0a5.25 5.25 0 0 04.933-4.404c.129-.955-.164-1.92-.895-2.523-.73-.602-1.73-.836-2.662-.684a5.25 5.25 0 0 0-4.933 4.404c-.129.955.164 1.92.895 2.523.73.602 1.73.836 2.662-.684Z" />
         </svg>
        <p className="text-lg">No hay actividades para mostrar.</p>
        <p className="text-sm">Intenta cambiar el filtro o añade nuevas actividades.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar">
      {activities.map((activity) => (
        <SurgeryActivityItem
          key={activity.id}
          activity={activity}
          onRequestMonthForPayment={onRequestMonthForPayment}
          onMarkAsUnpaid={onMarkAsUnpaid}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          isBeingEdited={editingActivityId === activity.id}
          isAnotherItemBeingEdited={(editingActivityId !== null && editingActivityId !== activity.id) || (activityPromptingForMonthId !== null && activityPromptingForMonthId !== activity.id)}
          isPromptingForMonth={activityPromptingForMonthId === activity.id}
        />
      ))}
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0; /* slate-200 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #38bdf8; /* sky-500 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9; /* sky-600 */
        }
      `}</style>
    </div>
  );
};

export default SurgeryActivityList;