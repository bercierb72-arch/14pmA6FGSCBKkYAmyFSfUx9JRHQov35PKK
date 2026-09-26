import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('updates checklist completion messaging and progress when items are toggled', () => {
    render(<App />)

    const progressBar = screen.getByRole('progressbar', {
      name: /disclosure readiness completion/i,
    })

    expect(screen.getByText('2 of 4 done')).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')

    const firstCheckbox = screen.getByLabelText(
      /separate natural and laboratory-grown inventory descriptions/i,
    )
    const thirdCheckbox = screen.getByLabelText(
      /document escalation steps for sourcing concerns/i,
    )

    fireEvent.click(firstCheckbox)
    expect(screen.getByText('1 of 4 done')).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '25')

    fireEvent.click(thirdCheckbox)
    expect(screen.getByText('2 of 4 done')).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })
})
