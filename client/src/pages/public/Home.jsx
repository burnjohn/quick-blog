import React from 'react'
import { Navbar, Footer } from '../../components/layout'
import { Header } from '../../components/forms'
import { BlogList } from '../../components/blog'
import { NewsletterForm } from '../../components/forms'

function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsletterForm />
      <Footer />
    </>
  )
}

export default Home
