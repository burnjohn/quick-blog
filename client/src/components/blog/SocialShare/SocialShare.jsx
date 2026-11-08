import React from 'react'
import { assets } from '../../../assets/assets'

function SocialShare({ title = 'Share this article on social media' }) {
  return (
    <div className='my-20 max-w-3xl mx-auto px-5 md:px-0'>
      <p className='font-display text-xl font-semibold text-foreground my-4'>{title}</p>
      <div className='flex gap-3'>
        <button 
          className='cursor-pointer rounded-full hover:-translate-y-0.5 hover:opacity-90 transition-all duration-200 motion-reduce:hover:translate-y-0'
          aria-label='Share on Facebook'
        >
          <img src={assets.facebook_icon} width={44} height={44} alt='Facebook' />
        </button>
        <button 
          className='cursor-pointer rounded-full hover:-translate-y-0.5 hover:opacity-90 transition-all duration-200 motion-reduce:hover:translate-y-0'
          aria-label='Share on Twitter'
        >
          <img src={assets.twitter_icon} width={44} height={44} alt='Twitter' />
        </button>
        <button 
          className='cursor-pointer rounded-full hover:-translate-y-0.5 hover:opacity-90 transition-all duration-200 motion-reduce:hover:translate-y-0'
          aria-label='Share on Google Plus'
        >
          <img src={assets.googleplus_icon} width={44} height={44} alt='Google Plus' />
        </button>
      </div>
    </div>
  )
}

export default SocialShare

