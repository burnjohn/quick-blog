import React from 'react'
import { assets } from '../../assets/assets'

function SocialShare({ title = 'Share this article on social media' }) {
  return (
    <div className='my-24 max-w-3xl mx-auto'>
      <p className='font-semibold my-4'>{title}</p>
      <div className='flex gap-2'>
        <button 
          className='hover:scale-110 transition-transform'
          aria-label='Share on Facebook'
        >
          <img src={assets.facebook_icon} width={50} alt='Facebook' />
        </button>
        <button 
          className='hover:scale-110 transition-transform'
          aria-label='Share on Twitter'
        >
          <img src={assets.twitter_icon} width={50} alt='Twitter' />
        </button>
        <button 
          className='hover:scale-110 transition-transform'
          aria-label='Share on Google Plus'
        >
          <img src={assets.googleplus_icon} width={50} alt='Google Plus' />
        </button>
      </div>
    </div>
  )
}

export default SocialShare

