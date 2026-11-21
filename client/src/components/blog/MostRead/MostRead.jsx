import React from 'react'
import SectionHeading from '../../layout/SectionHeading'
import Reveal from '../../ui/Reveal'
import { usePopularBlogs } from '../../../hooks/api/queries'
import MostReadFeature from './MostReadFeature'
import MostReadRow from './MostReadRow'
import MostReadSkeleton from './MostReadSkeleton'

const POPULAR_LIMIT = 6
const POPULAR_DAYS = 30

const getRangeLabel = (range) => (range === 'all' ? 'All time' : `Last ${POPULAR_DAYS} days`)

function EmptyRanking() {
  return (
    <p className='border-2 border-dashed border-ink bg-surface px-6 py-14 text-center font-serif text-2xl text-ink sm:text-3xl'>
      No reads counted yet — the ranking fills in as readers arrive.
    </p>
  )
}

/** "Most read": ranking by reader views. Fails silently (section hidden) if the API errors. */
function MostRead() {
  const { blogs, range, loading, error } = usePopularBlogs({ limit: POPULAR_LIMIT, days: POPULAR_DAYS })

  if (error) return null

  const [top, ...rest] = blogs
  const topViews = top?.views || 1

  return (
    <section
      id='most-read'
      aria-labelledby='most-read-title'
      aria-busy={loading}
      className='mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24'
    >
      <SectionHeading id='most-read-title' kicker='Most read' title='What everyone is reading'>
        {!loading && top && (
          <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'>
            Ranked by reader views · {getRangeLabel(range)}
          </p>
        )}
      </SectionHeading>

      {loading && <MostReadSkeleton />}
      {!loading && !top && <EmptyRanking />}

      {!loading && top && (
        <>
          <Reveal>
            <MostReadFeature post={top} />
          </Reveal>

          {rest.length > 0 && (
            <div className='mt-12'>
              <div aria-hidden='true' className='hidden grid-cols-[4.5rem_11rem_minmax(0,1fr)_15rem] gap-x-8 border-b-2 border-ink px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted lg:grid'>
                <span>Rank</span>
                <span className='col-span-2'>Story</span>
                <span>Reads · comments</span>
              </div>
              <ol start={2} className='border-t-2 border-ink lg:border-t-0'>
                {rest.map((post, index) => (
                  <Reveal as='li' key={post._id} index={index} y={12} className='border-b border-ink'>
                    <MostReadRow post={post} rank={index + 2} ratio={post.views / topViews} />
                  </Reveal>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default MostRead
