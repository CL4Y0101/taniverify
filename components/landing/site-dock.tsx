'use client';

import {
  Cog,
  Cpu,
  Home,
  LayoutDashboard,
  Sparkles,
  Users,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const items = [
  { title: 'Beranda', href: '/', icon: Home },
  { title: 'Fitur', href: '/#fitur', icon: Sparkles },
  { title: 'Cara Kerja', href: '/#cara-kerja', icon: Cog },
  { title: 'Perangkat', href: '/#perangkat', icon: Cpu },
  { title: 'Tim', href: '/#tim', icon: Users },
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export function SiteDock() {
  return (
    <div className='fixed bottom-4 left-1/2 z-50 max-w-full -translate-x-1/2'>
      <Dock className='items-end border border-white/15 bg-[#123c29]/90 pb-3 shadow-2xl backdrop-blur-md'>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <DockItem
              key={item.title}
              className='aspect-square rounded-full bg-white/15'
              onClick={() => {
                window.location.href = item.href;
              }}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <Icon className='h-full w-full text-white' />
              </DockIcon>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}
