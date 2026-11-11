import React from 'react'
import { Navbar, Footer } from '../../../components/layout'
import { Header } from '../../../components/forms'
import { BlogList } from '../../../components/blog'
import { NewsletterForm } from '../../../components/forms'

function Home() {
  return (
    <div className='min-h-dvh bg-paper text-ink'>
      <Navbar />
      <main id='main' tabIndex={-1} className='outline-none'>
        <Header />
        <BlogList />
        <NewsletterForm />
      </main>
      <Footer />
    </div>
  )
}

export default Home
