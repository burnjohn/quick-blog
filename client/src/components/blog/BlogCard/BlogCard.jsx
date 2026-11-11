import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../ui/Card'
import { truncateHtml } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'
import { getLinkKeyHandler } from '../../../utils/helpers'

function BlogCard({ blog, index }) {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(getBlogDetailPath(_id))
  }

  return (
    <Card
      hover
      onClick={handleClick}
      onKeyDown={getLinkKeyHandler(handleClick)}
      role='link'
      tabIndex={0}
      aria-label={title}
      className='h-full w-full'
    >
      <Card.Image src={image} alt={title} />
      <Card.Badge>{category}</Card.Badge>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Description>
          {truncateHtml(description, 110)}
        </Card.Description>
        <span className='mt-auto flex items-center justify-between pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink'>
          {typeof index === 'number' ? `Nº ${String(index + 1).padStart(2, '0')}` : 'Story'}
          <span aria-hidden='true' className='transition-transform duration-300 group-hover:translate-x-1'>
            Read →
          </span>
        </span>
      </Card.Body>
    </Card>
  )
}

export default BlogCard
