import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../ui/Card'
import { truncateHtml } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'

function BlogCard({ blog, index = 0 }) {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(getBlogDetailPath(_id))
  }

  return (
    <Card hover onClick={handleClick} className='h-full w-full'>
      <div className='relative overflow-hidden'>
        <Card.Image src={image} alt={title} />
        <span
          aria-hidden='true'
          className='absolute left-4 top-4 rounded-full bg-void/70 px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.14em] text-ink backdrop-blur'
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <Card.Body className='flex flex-col'>
        <div className='mb-4 flex items-center justify-between'>
          <Card.Badge>{category}</Card.Badge>
          <span
            aria-hidden='true'
            className='text-lg text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-lime'
          >
            ↗
          </span>
        </div>
        <Card.Title>{title}</Card.Title>
        <Card.Description>
          {truncateHtml(description, 80)}
        </Card.Description>
      </Card.Body>
    </Card>
  )
}

export default BlogCard
