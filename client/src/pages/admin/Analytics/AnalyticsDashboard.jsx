import React from 'react'
import {
  ActivityHeatmap,
  CountryList,
  DonutChart,
  FunnelChart,
  KpiGrid,
  TagsBarChart,
  TopPostsBarChart,
  TopPostsTable,
  TrendChart,
} from '../../../components/admin/analytics'
import { DEVICE_LABELS, SOURCE_LABELS } from '../../../constants/analytics'
import Reveal from './Reveal'

const toggle = (list, value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

// Dashboard sections for a non-empty overview.
function AnalyticsDashboard({ overview, filters, actions, onOpenPost }) {
  return (
    <div className='min-w-0 space-y-6'>
      <Reveal index={0}>
        <KpiGrid kpis={overview.kpis} compare={filters.compare} />
      </Reveal>
      <Reveal index={1}>
        <TrendChart series={overview.series} bucket={overview.range.bucket} compare={filters.compare} />
      </Reveal>
      <div className='grid min-w-0 gap-6 lg:grid-cols-3'>
        <Reveal index={2} className='min-w-0 lg:col-span-2'>
          <TagsBarChart
            tags={overview.tags}
            selectedTags={filters.tags}
            onSelectTag={(tag) => actions.setTags(toggle(filters.tags, tag))}
          />
        </Reveal>
        <Reveal index={3} className='min-w-0'>
          <DonutChart
            title='Traffic sources'
            description='Share of views by traffic source.'
            data={overview.sources}
            labels={SOURCE_LABELS}
            selected={filters.sources}
            onSelect={(key) => actions.setSources(toggle(filters.sources, key))}
          />
        </Reveal>
        <Reveal index={4} className='min-w-0'>
          <DonutChart
            title='Devices'
            description='Share of views by device type.'
            data={overview.devices}
            labels={DEVICE_LABELS}
          />
        </Reveal>
        <Reveal index={5} className='min-w-0'>
          <FunnelChart funnel={overview.funnel} />
        </Reveal>
        <Reveal index={6} className='min-w-0'>
          <CountryList countries={overview.countries} />
        </Reveal>
      </div>
      <Reveal index={7}>
        <ActivityHeatmap heatmap={overview.heatmap} />
      </Reveal>
      <Reveal index={8} className='min-w-0'>
        <section aria-labelledby='top-posts-heading' className='min-w-0 space-y-4'>
          <h2
            id='top-posts-heading'
            tabIndex={-1}
            className='font-display text-2xl font-semibold text-ink-text focus:outline-none'
          >
            Top posts
          </h2>
          <TopPostsBarChart posts={overview.posts} onOpenPost={(id) => onOpenPost(id)} />
          <TopPostsTable
            posts={overview.posts}
            sort={filters.sort}
            dir={filters.dir}
            onSortChange={actions.setSort}
            onOpenPost={onOpenPost}
          />
        </section>
      </Reveal>
    </div>
  )
}

export default AnalyticsDashboard
