import React from 'react'
import { cn } from '../../../../lib/utils';
import { clsx } from 'clsx';

interface StatCardProps {
    count: number;
    label: string;
    icon: React.ReactNode;
    countcs?: string;
    type: "appointments" | "pending" | "cancelled";
}

const StatCard = ({count=0 , label, icon, type , countcs}: StatCardProps) => {
  return (
    <div className={clsx('flex flex-1 flex-col gap-2 rounded-2xl bg-cover p-6 shadow-lg drop-shadow-sm shadow-purple5/50 ',
        {'bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 shadow-sm text-teal-700' : type === 'appointments',
        'bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 shadow-sm text-slate-800' : type === 'pending',
        'bg-gradient-to-br from-red-50 to-orange-50 border border-orange-100 shadow-sm text-red-700' : type === 'cancelled',
    }
    )}>
      <div className="flex items-center gap-4">
        {icon}
        <h2 className={`text-2xl font-bold ${countcs}`}>{count}</h2>

      </div>
        <p className="">{label}</p>
    </div>
  )
}

export default StatCard
