import React, { useEffect } from 'react'

function DrillDownModal({ date, filterParams, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-700'>Views on {date}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>&times;</button>
        </div>
        <p className='text-gray-500 text-sm'>Drill-down data for {date}</p>
      </div>
    </div>
  )
}

export default DrillDownModal
