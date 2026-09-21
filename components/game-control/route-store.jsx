'use client';
import {usePathname} from 'next/navigation';
import {Store} from './store';
export default function RouteStore({children}) {
  const pathname=usePathname();
  if(!['/admin','/play','/roulette'].some(route=>pathname===route||pathname?.startsWith(route+'/')))return children;
  return <Store>{children}</Store>;
}
