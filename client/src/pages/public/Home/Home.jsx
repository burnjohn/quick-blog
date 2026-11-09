import React from 'react'
import { Navbar, Footer } from '../../../components/layout'
import { Header } from '../../../components/forms'
import { BlogList } from '../../../components/blog'
import { NewsletterForm } from '../../../components/forms'

function Home() {
  return (
    <div className='overflow-x-clip'>
      <Navbar />
      <main>
        <Header />
        <BlogList />
        <NewsletterForm />
      </main>
      <Footer />
    </div>
  )
}

export default Home
