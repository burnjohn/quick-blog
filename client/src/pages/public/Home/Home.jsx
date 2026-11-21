import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar, Footer } from '../../../components/layout'
import PageTransition from '../../../components/layout/PageTransition'
import { Header, NewsletterForm } from '../../../components/forms'
import { BlogList } from '../../../components/blog'
import FrontCover from '../../../components/blog/FrontCover'
import Gallery from '../../../components/blog/Gallery'
import CategoryDesks from '../../../components/blog/CategoryDesks'
import EditorsPicks from '../../../components/blog/EditorsPicks'
import ArchiveList from '../../../components/blog/ArchiveList'
import { photosFirst, pickLongReads, sortByNewest } from '../../../components/blog/helpers'
import { useAppContext } from '../../../context/AppContext'

// Lead + four secondary stories on the cover
const COVER_COUNT = 5
const ARCHIVE_COUNT = 8
// Desks, gallery, picks and archive only add value once there is more than the cover to show
const MIN_FOR_SECTIONS = COVER_COUNT + 1
// Only drop cover stories from "Latest" when enough remain to fill a row
const MIN_TO_EXCLUDE_COVER = COVER_COUNT + 3

function Home() {
  const { blogs = [], input } = useAppContext()
  const { hash } = useLocation()

  const newest = sortByNewest(blogs)
  // Photo covers lead the first screen; illustrations fill in only when photos run out
  const cover = input ? [] : photosFirst(newest).slice(0, COVER_COUNT)
  const coverIds = cover.map((blog) => blog._id)
  const latestExcludes = newest.length >= MIN_TO_EXCLUDE_COVER ? coverIds : []
  const showSections = !input && newest.length >= MIN_FOR_SECTIONS
  const offCover = newest.filter((blog) => !coverIds.includes(blog._id))
  const picks = showSections ? pickLongReads(newest, coverIds) : []
  const archive = showSections ? [...offCover].reverse().slice(0, ARCHIVE_COUNT) : []

  // Sections render after the blogs arrive, so jump to /#section links once they exist
  const hasBlogs = blogs.length > 0
  useEffect(() => {
    if (!hash || !hasBlogs) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash, hasBlogs])

  return (
    <div className='min-h-dvh bg-paper text-ink'>
      <Navbar />
      <main id='main' tabIndex={-1} className='outline-none'>
        <PageTransition>
          <Header>
            <FrontCover stories={cover} />
          </Header>
          <div className='section-counter'>
            <BlogList excludeIds={latestExcludes} />
            {showSections && <Gallery blogs={offCover} />}
            {showSections && <CategoryDesks blogs={newest} excludeIds={coverIds} />}
            {picks.length > 1 && <EditorsPicks picks={picks} />}
            {archive.length > 0 && <ArchiveList blogs={archive} />}
          </div>
          <NewsletterForm />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default Home
