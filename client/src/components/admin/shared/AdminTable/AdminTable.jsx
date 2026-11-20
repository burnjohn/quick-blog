import React from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import EmptyState from '../EmptyState'

const EMPTY_ROW_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
}

// Shared table frame for admin lists: ink header row, hard shadow, empty state.
// Rows rendered as <AdminTableRow> animate in on mount and out on removal.
function AdminTable({ columns, isEmpty, emptyMessage, emptyHint, children, className = '' }) {
  return (
    <div className={classNames('relative overflow-x-auto border border-ink bg-surface shadow-hard', className)}>
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
          <AnimatePresence>
            {isEmpty ? (
              <motion.tr key='__empty' {...EMPTY_ROW_MOTION}>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyMessage} hint={emptyHint} />
                </td>
              </motion.tr>
            ) : children}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
