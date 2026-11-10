import React from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import KpiCard from '../KpiCard'
import { KPI_META } from '../../../../constants/analytics'

const STAGGER_SECONDS = 0.06

function KpiGrid({ kpis, compare = true }) {
  const reduceMotion = useReducedMotion()
  const byKey = new Map((kpis ?? []).map((kpi) => [kpi.key, kpi]))

  return (
    <ul className='grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6'>
      {KPI_META.map((meta, index) => (
        <motion.li
          key={meta.key}
          className='min-w-0'
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * STAGGER_SECONDS }}
        >
          <KpiCard kpi={byKey.get(meta.key)} label={meta.label} format={meta.format} compare={compare} />
        </motion.li>
      ))}
    </ul>
  )
}

export default KpiGrid
