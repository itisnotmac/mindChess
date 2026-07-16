import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Check, ChevronDown } from 'lucide-react';

export default function MobileSelect({ value, onChange, options, placeholder, triggerClassName, title }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  const label = current ? current.label : (placeholder || 'Select');

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button type="button"
          className={`${triggerClassName} border flex items-center justify-between gap-2 min-h-[44px] cursor-pointer`}>
          <span className="truncate text-left">{label}</span>
          <ChevronDown className="w-4 h-4 opacity-70 shrink-0" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[75vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-base">{title || placeholder || 'Select'}</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 pb-4 overflow-y-auto scrollbar-thin">
          {options.map(o => (
            <button key={o.value} type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] rounded-lg text-left hover:bg-secondary transition-colors">
              <span className="text-sm">{o.label}</span>
              {o.value === value && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}