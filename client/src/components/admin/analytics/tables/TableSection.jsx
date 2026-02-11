import TopViewedTable from './TopViewedTable'
import TopCommentedTable from './TopCommentedTable'
import RecentCommentsTable from './RecentCommentsTable'

function TableSection({ params }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Viewed Posts</h3>
        <TopViewedTable params={params} />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Commented Posts</h3>
        <TopCommentedTable params={params} />
      </div>
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Comments</h3>
        <RecentCommentsTable params={params} />
      </div>
    </div>
  )
}

export default TableSection
