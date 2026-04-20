import React from 'react'
import Button from '../../ui/Button'

function ExportButton({ onClick, loading = false, disabled = false }) {
  return (
    <Button
      type='button'
      variant='primary'
      size='sm'
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      aria-label='Export CSV'
    >
      Export CSV
    </Button>
  )
}

export default ExportButton
