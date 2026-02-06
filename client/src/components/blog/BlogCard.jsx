import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import { truncateHtml } from '../../utils/formatters'
import { getBlogDetailPath } from '../../constants/routes'

function BlogCard({ blog }) {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(getBlogDetailPath(_id))
  }

  return (
    <Card hover onClick={handleClick} className='w-full'>
      <Card.Image src={image} alt={title} />
      <Card.Badge>{category}</Card.Badge>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Description>
          {truncateHtml(description, 80)}
        </Card.Description>
      </Card.Body>
    </Card>
  )
}

export default BlogCard
