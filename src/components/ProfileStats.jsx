import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { STAT_DEFS } from '@/lib/stats';

export default function ProfileStats({ profile, className = '' }) {
  const data = profile || {};
  return (
    <TooltipProvider delayDuration={150}>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        {STAT_DEFS.map((s) => (
          <Tooltip key={s.label}>
            <TooltipTrigger asChild>
              <div className="bg-card border border-border rounded-xl px-2 py-3 text-center cursor-help teal-border-glow">
                <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color}`} />
                <div className="text-xl font-bold leading-none">{s.value(data)}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground mt-1.5 leading-tight">{s.label}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[220px] text-center">
              {s.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}