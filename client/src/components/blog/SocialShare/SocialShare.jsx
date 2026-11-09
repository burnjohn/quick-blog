import React from 'react'
import { assets } from '../../../assets/assets'

const pill = 'flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:scale-110 hover:border-primary/40'
const icon = 'size-6 invert opacity-70'

function SocialShare({ title = 'Share this article on social media' }) {
  return (
    <div className='mx-5 my-20 max-w-[72ch] md:mx-auto'>
      <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted my-4'>{title}</p>
      <div className='flex gap-3'>
        <button className={pill} aria-label='Share on Facebook'>
          <img src={assets.facebook_icon} className={icon} alt='Facebook' />
        </button>
        <button className={pill} aria-label='Share on Twitter'>
          <img src={assets.twitter_icon} className={icon} alt='Twitter' />
        </button>
        <button className={pill} aria-label='Share on Google Plus'>
          <img src={assets.googleplus_icon} className={icon} alt='Google Plus' />
        </button>
      </div>
    </div>
  )
}

export default SocialShare
