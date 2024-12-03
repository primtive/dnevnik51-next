import * as React from 'react';
import { StatsComponent } from './stats';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Статистика',
};

export default function Stats() {
    return (
        <React.Suspense fallback={<Skeleton className='h-10 w-10' />}>
            <StatsComponent />
        </React.Suspense>
    );
}