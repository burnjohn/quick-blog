import TopViewedTable from './TopViewedTable'
import TopCommentedTable from './TopCommentedTable'
import RecentCommentsTable from './RecentCommentsTable'
import AnalyticsPanel from '../AnalyticsPanel'

const SECTION_KICKER = 'section-no font-mono text-[11px] uppercase tracking-[0.18em] text-ink'
const SECTION_TITLE = 'mb-5 mt-1 font-serif text-3xl font-semibold tracking-tight text-ink'

function TableSection({ params }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-2">
      <section aria-labelledby="top-viewed" className="min-w-0">
        <p aria-hidden="true" className={SECTION_KICKER}>Readership</p>
        <h2 id="top-viewed" className={SECTION_TITLE}>Top Viewed Posts</h2>
        <TopViewedTable params={params} />
      </section>
      <section aria-labelledby="top-commented" className="min-w-0">
        <p aria-hidden="true" className={SECTION_KICKER}>Conversation</p>
        <h2 id="top-commented" className={SECTION_TITLE}>Top Commented Posts</h2>
        <TopCommentedTable params={params} />
      </section>
      <AnalyticsPanel title="Recent Comments" tone="ink" className="mb-6 lg:col-span-2">
        <RecentCommentsTable params={params} />
      </AnalyticsPanel>
    </div>
  )
}

export default TableSection
