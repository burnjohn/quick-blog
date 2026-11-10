import React, { useState } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultiSelect from '.'

const OPTIONS = [
  { value: 'react', label: 'react' },
  { value: 'node', label: 'node' },
]

function Harness() {
  const [selected, setSelected] = useState([])
  return <MultiSelect label='Tags' options={OPTIONS} selected={selected} onChange={setSelected} />
}

describe('MultiSelect', () => {
  it('selects with the keyboard, shows a count badge and resets', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: /tags/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('checkbox', { name: 'react' })).toHaveFocus()
    await user.keyboard('{ArrowDown}{ }')
    expect(screen.getByRole('checkbox', { name: 'node' })).toBeChecked()
    expect(screen.getByLabelText('1 selected')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear tags/i }))
    expect(screen.getByRole('checkbox', { name: 'node' })).not.toBeChecked()
    expect(screen.queryByLabelText('1 selected')).not.toBeInTheDocument()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: /tags/i })
    await user.click(trigger)
    await user.keyboard('{ArrowDown}{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
