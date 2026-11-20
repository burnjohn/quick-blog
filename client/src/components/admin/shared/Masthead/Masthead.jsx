import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import CountUp from '../CountUp'
import { EASE_EDITORIAL, riseIn } from '../motion'

const STICKER_MOTION = {
  initial: { opacity: 0, scale: 0.7, rotate: -14 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: -3,
    transition: { delay: 0.55, type: 'spring', stiffness: 380, damping: 18 }
  }
}

function Insight({ kicker, children, index }) {
  return (
    <motion.li
      variants={riseIn}
      custom={index + 2}
      className='border-paper/15 p-6 font-serif text-xl leading-snug max-md:border-b max-md:last:border-b-0 md:border-r md:last:border-r-0 lg:p-7'
    >
      <span className='mb-3 block font-mono text-[10px] uppercase tracking-[0.18em] text-signal'>
        § {kicker}
      </span>
      {children}
    </motion.li>
  )
}

// Front-page masthead: ink block with dateline, one giant serif number,
// a rotated sticker and a row of § insights.
function Masthead({ dateline = [], label, value, sticker, sub, insights = [] }) {
  return (
    <motion.section
      aria-label={`${label} overview`}
      initial='hidden'
      animate='show'
      variants={riseIn}
      className='relative mb-10 grid overflow-hidden bg-ink text-paper shadow-hard-signal xl:grid-cols-[minmax(320px,5fr)_7fr]'
    >
      <p className='flex flex-wrap justify-between gap-3 border-b border-paper/15 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60 xl:col-span-2'>
        {dateline.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </p>

      <div className='relative border-paper/15 px-6 pt-7 pb-10 max-xl:border-b xl:border-r'>
        <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60'>{label}</p>
        <p className='mt-3 font-serif text-[clamp(88px,11vw,168px)] font-semibold leading-[0.85] tracking-tight tabular-nums'>
          {typeof value === 'number' ? <CountUp value={value} /> : value}
        </p>
        {sticker && (
          <motion.span
            {...STICKER_MOTION}
            className='mt-5 inline-block border-2 border-paper bg-signal px-3 py-1.5 font-mono text-base font-medium text-ink'
          >
            {sticker}
          </motion.span>
        )}
        {sub && (
          <p className='mt-4 max-w-[34ch] font-serif text-lg italic text-paper/75'>{sub}</p>
        )}
        <motion.span
          aria-hidden='true'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { delay: 0.35, duration: 0.9, ease: EASE_EDITORIAL } }}
          className='halftone-signal absolute inset-x-0 bottom-0 h-7 origin-left opacity-60 [mask-image:linear-gradient(transparent,#000)]'
        />
      </div>

      {insights.length > 0 && (
        <ol className='grid md:grid-cols-3'>
          {insights.map((item, index) => (
            <Insight key={item.kicker} kicker={item.kicker} index={index}>
              {item.text}
            </Insight>
          ))}
        </ol>
      )}
    </motion.section>
  )
}

export default Masthead
