import React from 'react'
import { classNames } from '../../../../utils/helpers'

// Shared table frame for admin lists: header row + empty state.
function AdminTable({ columns, isEmpty, emptyMessage, children, className = '' }) {
  return (
    <div className={classNames('relative overflow-x-auto border border-ink bg-surface', className)}>
      <table className='w-full text-left text-sm text-ink'>
        <thead className='border-b border-ink bg-ink font-mono text-[11px] uppercase tracking-[0.14em] text-paper'>
          <tr>
            {columns.map((column) => (
              <th key={column.label} scope='col' className={classNames('px-4 py-4 font-medium', column.className)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className='px-4 py-12 text-center text-ink-muted'>
                {emptyMessage}
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
