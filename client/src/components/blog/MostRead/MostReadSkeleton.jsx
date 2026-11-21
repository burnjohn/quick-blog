import React from 'react'
import Skeleton from '../../ui/Skeleton'

const ROWS = ['row-a', 'row-b', 'row-c']

/** Same boxes as the real ranking so nothing jumps when data lands */
function MostReadSkeleton() {
  return (
    <div aria-hidden='true'>
      <div className='grid border border-line lg:grid-cols-12'>
        <Skeleton className='aspect-[4/3] lg:col-span-7' />
        <div className='space-y-4 p-6 sm:p-8 lg:col-span-5 lg:p-10'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      </div>
      <ul className='mt-10 border-t-2 border-line'>
        {ROWS.map((key) => (
          <li key={key} className='grid grid-cols-[2.25rem_7rem_minmax(0,1fr)] gap-4 border-b border-line py-6 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] lg:grid-cols-[4.5rem_11rem_minmax(0,1fr)_15rem] lg:gap-8'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='aspect-[4/3] w-full' />
            <div className='space-y-3'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-6 w-full' />
            </div>
            <Skeleton className='col-span-3 h-6 lg:col-span-1' />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MostReadSkeleton
