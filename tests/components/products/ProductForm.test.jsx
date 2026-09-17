import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../../../src/components/products/ProductForm'
import { renderScreen } from '../../render'
import { productDetail } from '../../mocks/fixtures'

const image = (name = 'radiator.png') => new File(['image'], name, { type: 'image/png' })
async function fillValid() {
  const fields = { Title: 'Mazda radiator', Description: 'Radiator for Mazda CX-5 vehicles.', 'Price (₦)': '85000.01', 'Units in stock': '30', Location: 'Lagos', 'Make 1': 'Mazda', 'Model 1': 'CX-5 Signature', 'Start year 1': '2018', 'End year 1': '2021' }
  for (const [label, value] of Object.entries(fields)) fireEvent.change(screen.getByLabelText(label), { target: { value } })
  await userEvent.upload(screen.getByLabelText('Choose photos'), image())
}
describe('shared product form', () => {
  it('generates a disabled category-based part number and regenerates when category changes', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1789105240999)
    renderScreen(<ProductForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Part number')).toBeDisabled()
    expect(screen.getByLabelText('Part number')).toHaveValue('ENGI-1789105240')
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: '1006' } })
    expect(screen.getByLabelText('Part number')).toHaveValue('RAD-1789105240')
    expect(screen.getByText('Generated automatically from the selected category.')).toBeInTheDocument()
  })
  it('prepopulates every edit field, retains photo order and preserves the part number on category change', () => {
    renderScreen(<ProductForm product={productDetail} onSubmit={vi.fn()} />)
    const fields = { Title: productDetail.title, Description: productDetail.description, Category: '1006', Condition: 'new', 'Price (₦)': '85000.01', 'Units in stock': '30', Location: 'Lagos', 'Part number': productDetail.partNumber, 'Make 1': 'Mazda', 'Model 1': 'CX-5 Signature', 'Start year 1': '2018', 'End year 1': '2021', 'Make 2': 'Toyota', 'Model 2': 'Camry', 'Start year 2': '2009', 'End year 2': '2012' }
    for (const [label, value] of Object.entries(fields)) expect(screen.getByLabelText(label)).toHaveValue(value)
    expect(screen.getByAltText('Existing photo 1')).toHaveAttribute('src', expect.stringContaining('/uploads/radiator.png'))
    expect(screen.getByAltText('Existing photo 2')).toHaveAttribute('src', expect.stringContaining('/uploads/second.png'))
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: '1002' } })
    expect(screen.getByLabelText('Part number')).toHaveValue(productDetail.partNumber)
    expect(screen.getByLabelText('Part number')).toBeDisabled()
  })
  it('blocks invalid submission and shows field errors', async () => {
    const submit = vi.fn()
    renderScreen(<ProductForm onSubmit={submit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Create product' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('Title must contain 3–255 characters.')).toBeVisible()
    expect(screen.getByText('Keep between one and six photos.')).toBeVisible()
  })
  it('submits naira as integer kobo and compatibility as a string', async () => {
    const submit = vi.fn().mockResolvedValue({})
    renderScreen(<ProductForm onSubmit={submit} />)
    await fillValid()
    await userEvent.click(screen.getByRole('button', { name: 'Create product' }))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    const body = submit.mock.calls[0][0]
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('priceKobo')).toBe('8500001')
    expect(body.get('partNumber')).toMatch(/^ENGI-\d{10}$/)
    expect(body.getAll('photos')).toHaveLength(1)
    expect(JSON.parse(body.get('compatibility'))).toEqual([{ make: 'Mazda', model: 'CX-5 Signature', yearFrom: 2018, yearTo: 2021 }])
  })
  it('blocks reversed compatibility years, and permits adding/removing rows', async () => {
    const submit = vi.fn()
    renderScreen(<ProductForm onSubmit={submit} />)
    await fillValid()
    fireEvent.change(screen.getByLabelText('End year 1'), { target: { value: '2017' } })
    await userEvent.click(screen.getByRole('button', { name: 'Create product' }))
    expect(screen.getByText('End year must be on or after the start year.')).toBeVisible()
    expect(submit).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Add vehicle' }))
    expect(screen.getByLabelText('Make 2')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Remove vehicle 2' }))
    expect(screen.queryByLabelText('Make 2')).not.toBeInTheDocument()
  })
  it('sends all unchanged edit values without uploading unchanged photos', async () => {
    const submit = vi.fn().mockResolvedValue({})
    renderScreen(<ProductForm product={{ ...productDetail, stockQty: 0, priceKobo: 0 }} onSubmit={submit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    const body = submit.mock.calls[0][0]
    expect(body.get('description')).toBe(productDetail.description)
    expect(body.get('priceKobo')).toBe('0')
    expect(body.get('stockQty')).toBe('0')
    expect(body.get('partNumber')).toBe(productDetail.partNumber)
    expect(JSON.parse(body.get('compatibility'))).toHaveLength(2)
    expect(body.has('photos')).toBe(false)
  })
  it('preserves an existing OEM condition supported by the backend', async () => {
    const submit = vi.fn().mockResolvedValue({})
    renderScreen(<ProductForm product={{ ...productDetail, condition: 'OEM' }} onSubmit={submit} />)
    expect(screen.getByLabelText('Condition')).toHaveValue('OEM')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    expect(submit.mock.calls[0][0].get('condition')).toBe('OEM')
  })
  it('offers only new and used conditions when creating a product', () => {
    renderScreen(<ProductForm onSubmit={vi.fn()} />)
    expect(Array.from(screen.getByLabelText('Condition').options, option => option.value)).toEqual(['new', 'used'])
  })
  it('allows returning to the original OEM condition before saving an edit', async () => {
    const submit = vi.fn().mockResolvedValue({})
    renderScreen(<ProductForm product={{ ...productDetail, condition: 'OEM' }} onSubmit={submit} />)
    const condition = screen.getByLabelText('Condition')
    await userEvent.selectOptions(condition, 'used')
    await userEvent.selectOptions(condition, 'OEM')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    expect(submit.mock.calls[0][0].get('condition')).toBe('OEM')
  })
  it('displays API field errors beside their inputs', async () => {
    const submit = vi.fn().mockRejectedValue({ message: 'Please check your listing.', fieldErrors: { title: 'This title is not allowed.', priceKobo: 'Price exceeds the limit.' } })
    renderScreen(<ProductForm product={productDetail} onSubmit={submit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByText('This title is not allowed.')).toBeVisible()
    expect(screen.getByText('Price exceeds the limit.')).toBeVisible()
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true')
  })
  it('disables submission while a request is in flight', async () => {
    let finish
    const submit = vi.fn(() => new Promise(resolve => { finish = resolve }))
    renderScreen(<ProductForm product={productDetail} onSubmit={submit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    expect(screen.getByLabelText('Title')).toBeDisabled()
    finish({})
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled())
  })
  it('rejects unsupported/oversized files and releases removed previews', async () => {
    renderScreen(<ProductForm onSubmit={vi.fn()} />)
    const user = userEvent.setup({ applyAccept: false })
    await user.upload(screen.getByLabelText('Choose photos'), new File(['bad'], 'bad.svg', { type: 'image/svg+xml' }))
    expect(screen.getByText('Choose a JPEG, PNG or WebP image.')).toBeVisible()
    await user.upload(screen.getByLabelText('Choose photos'), new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }))
    expect(screen.getByText('Each photo must be non-empty and 2 MB or smaller.')).toBeVisible()
    await user.upload(screen.getByLabelText('Choose photos'), image())
    expect(screen.getByAltText('New photo: radiator.png')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Remove new photo 1' }))
    expect(screen.queryByAltText('New photo: radiator.png')).not.toBeInTheDocument()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })
  it('blocks deleting the entire photo set', async () => {
    const submit = vi.fn()
    renderScreen(<ProductForm product={productDetail} onSubmit={submit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove existing photo 2' }))
    await userEvent.click(screen.getByRole('button', { name: 'Remove existing photo 1' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('Keep between one and six photos.')).toBeVisible()
  })
})
