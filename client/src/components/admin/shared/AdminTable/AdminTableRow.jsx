import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import { rowMotion } from '../motion'

// <tr> that rises in (staggered by `index`) and slides out when removed
// from an <AdminTable>. Siblings glide into the freed space.
function AdminTableRow({ index = 0, className = '', children }) {
  return (
    <motion.tr
      layout='position'
      custom={index}
      variants={rowMotion}
      initial='hidden'
      animate='show'
      exit='exit'
      className={classNames('border-b border-line transition-colors last:border-b-0 hover:bg-paper', className)}
    >
      {children}
    </motion.tr>
  )
}

export default AdminTableRow
