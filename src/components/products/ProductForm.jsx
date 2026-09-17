import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CATEGORIES, generatePartNumber } from '../../config/categories'
import { koboToNaira } from '../../config/constant'
import { buildProductFormData } from '../../services/products'
import { MAX_PHOTOS, validatePhoto, validateProduct } from '../../utils/productValidation'
import { ProductDetailType } from '../../types/products'
import ProductImage, { FilePreview } from './ProductImage'
import { ErrorNotice } from './CatalogState'

const emptyVehicle = () => ({ make: '', model: '', yearFrom: '', yearTo: '' })

export default function ProductForm({ product, onSubmit }) {
  const edit = Boolean(product)
  const categories = product && !CATEGORIES.some(category => String(category.id) === String(product.category.id))
    ? [...CATEGORIES, product.category] : CATEGORIES
  const [values, setValues] = useState(() => ({
    title: product?.title ?? '', description: product?.description ?? '',
    categoryId: String(product?.category.id ?? categories[0].id),
    partNumber: product?.partNumber ?? generatePartNumber(categories[0].slug),
    condition: product?.condition ?? 'new', price: product ? String(koboToNaira(product.priceKobo)) : '',
    stockQty: String(product?.stockQty ?? ''), location: product?.location ?? '',
    compatibility: product ? product.compatibility.map(({ make, model, yearFrom, yearTo }) => ({ make, model, yearFrom, yearTo })) : [emptyVehicle()],
  }))
  const [retained, setRetained] = useState(() => [...(product?.photos || [])].sort((a, b) => a.position - b.position))
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const submitting = useRef(false)
  const errorSummary = useRef(null)
  const photoChanges = !edit || files.length > 0 || retained.length !== product.photos.length

  const set = (key, value) => {
    setValues(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: undefined }))
  }
  const changeCategory = (id) => {
    const category = categories.find(item => String(item.id) === id)
    setValues(previous => ({ ...previous, categoryId: id,
      partNumber: edit ? previous.partNumber : generatePartNumber(category.slug),
    }))
  }
  const fieldError = key => errors[key] ? <span id={`${key}-error`} className="catalog-field-error">{errors[key]}</span> : null
  const input = (key, label, props = {}) => <div className="catalog-field">
    <label htmlFor={key}>{label}</label>
    <input id={key} value={values[key]} onChange={event => set(key, event.target.value)}
      aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} {...props} />
    {fieldError(key)}
  </div>
  const addFiles = incoming => {
    setMessage('')
    let error = incoming.map(validatePhoto).find(Boolean)
    if (retained.length + files.length + incoming.length > MAX_PHOTOS) error = 'Keep no more than six photos.'
    if (error) { setErrors(previous => ({ ...previous, photos: error })); return }
    setFiles(previous => [...previous, ...incoming])
    setErrors(previous => ({ ...previous, photos: undefined }))
  }
  const submit = async event => {
    event.preventDefault()
    if (submitting.current) return
    const validation = validateProduct(values, retained.length + files.length)
    setErrors(validation); setMessage('')
    if (Object.keys(validation).length) {
      setMessage('Please correct the highlighted fields before saving.')
      requestAnimationFrame(() => errorSummary.current?.focus())
      return
    }
    submitting.current = true; setBusy(true)
    try {
      const formData = await buildProductFormData(values, { files, retainedPhotos: retained, replacePhotos: photoChanges })
      await onSubmit(formData)
    } catch (error) {
      const fieldErrors = { ...(error.fieldErrors || {}) }
      if (fieldErrors.priceKobo) { fieldErrors.price = fieldErrors.priceKobo; delete fieldErrors.priceKobo }
      const duplicate = !edit && /duplicate|already exists|already in use/i.test(error.message || '')
        && (/part.?number/i.test(error.message || '') || fieldErrors.partNumber)
      if (duplicate) {
        const category = categories.find(item => String(item.id) === values.categoryId)
        const previousSecond = Number(values.partNumber.split('-').at(-1))
        // A second-based identifier must advance before regenerating in the same second.
        const wait = Math.max(0, (previousSecond + 1) * 1000 - Date.now())
        if (wait) await new Promise(resolve => setTimeout(resolve, wait))
        setValues(previous => ({ ...previous, partNumber: generatePartNumber(category.slug) }))
        delete fieldErrors.partNumber
        setMessage('That part number is already in use. A new number has been generated. Please save again.')
      } else setMessage(error.message || 'Product could not be saved. Please try again.')
      setErrors(fieldErrors)
      requestAnimationFrame(() => errorSummary.current?.focus())
    } finally { submitting.current = false; setBusy(false) }
  }

  return <form className="catalog-form" onSubmit={submit} noValidate>
    {message && <div ref={errorSummary} tabIndex={-1}><ErrorNotice message={message} /></div>}
    <fieldset disabled={busy} className="catalog-panel">
      <legend>Product information</legend>
      <div className="catalog-form-grid">
        {input('title', 'Title', { required: true, maxLength: 255 })}
        <div className="catalog-field"><label htmlFor="categoryId">Category</label>
          <select id="categoryId" value={values.categoryId} onChange={event => changeCategory(event.target.value)} aria-invalid={Boolean(errors.categoryId)}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>{fieldError('categoryId')}</div>
        <div className="catalog-field"><label htmlFor="partNumber">Part number</label>
          <div className="catalog-input-action"><input id="partNumber" value={values.partNumber} disabled aria-describedby="part-number-help" />
            <button type="button" className="catalog-button secondary" onClick={async () => {
              try { await navigator.clipboard.writeText(values.partNumber) } catch { setMessage(`Part number: ${values.partNumber}`) }
            }}>Copy</button></div>
          <small id="part-number-help">{edit ? 'Your existing part number is preserved.' : 'Generated automatically from the selected category.'}</small>
          {fieldError('partNumber')}</div>
        <div className="catalog-field"><label htmlFor="condition">Condition</label>
          <select id="condition" value={values.condition} onChange={event => set('condition', event.target.value)}>
            {edit && !['new', 'used'].includes(product.condition) && <option value={product.condition}>{product.condition}</option>}
            <option value="new">New</option><option value="used">Used</option>
          </select>{fieldError('condition')}</div>
        {input('price', 'Price (₦)', { inputMode: 'decimal', required: true, placeholder: '85000.00' })}
        {input('stockQty', 'Units in stock', { inputMode: 'numeric', required: true })}
        {input('location', 'Location', { required: true, maxLength: 120 })}
        <div className="catalog-field catalog-full"><label htmlFor="description">Description</label>
          <textarea id="description" rows={5} maxLength={5000} value={values.description} onChange={event => set('description', event.target.value)}
            aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} />
          {fieldError('description')}</div>
      </div>
    </fieldset>
    <fieldset disabled={busy} className="catalog-panel"><legend>Vehicle compatibility</legend>
      <p>Add the make, model and supported year range for each vehicle.</p>
      {values.compatibility.map((row, index) => <div className="catalog-vehicle" key={index}>
        {['make', 'model', 'yearFrom', 'yearTo'].map(key => {
          const name = `compatibility.${index}.${key}`
          const label = { make: 'Make', model: 'Model', yearFrom: 'Start year', yearTo: 'End year' }[key]
          return <div className="catalog-field" key={key}><label htmlFor={name}>{label} {index + 1}</label>
            <input id={name} value={row[key]} inputMode={key.startsWith('year') ? 'numeric' : 'text'}
              aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined}
              onChange={event => set('compatibility', values.compatibility.map((item, i) => i === index ? { ...item, [key]: event.target.value } : item))} />
            {fieldError(name)}</div>
        })}
        <button type="button" className="catalog-button danger" aria-label={`Remove vehicle ${index + 1}`}
          onClick={() => set('compatibility', values.compatibility.filter((_, i) => i !== index))}>Remove</button>
      </div>)}
      {fieldError('compatibility')}
      <button type="button" className="catalog-button secondary" onClick={() => set('compatibility', [...values.compatibility, emptyVehicle()])}>Add vehicle</button>
    </fieldset>
    <fieldset disabled={busy} className="catalog-panel"><legend>Product photos</legend>
      <p>{edit ? 'Saving photo changes replaces the complete photo set with the images shown below. Retained photos are uploaded again. Leave the set unchanged to keep the originals.' : 'Add one to six photos. The first photo is your listing thumbnail.'}</p>
      <p className="catalog-muted">JPEG, PNG or WebP · up to 2 MB each · at least one photo required</p>
      <div className="catalog-photo-grid">
        {retained.map((photo, index) => <div className="catalog-photo" key={photo.id}>
          <ProductImage src={photo.url} alt={`Existing photo ${index + 1}`} />
          <button type="button" className="catalog-button danger" aria-label={`Remove existing photo ${index + 1}`} onClick={() => setRetained(retained.filter(item => item.id !== photo.id))}>Remove</button>
        </div>)}
        {files.map((file, index) => <div className="catalog-photo" key={`${file.name}-${index}`}>
          <FilePreview file={file} />
          <button type="button" className="catalog-button danger" aria-label={`Remove new photo ${index + 1}`} onClick={() => setFiles(files.filter((_, i) => i !== index))}>Remove</button>
        </div>)}
      </div>
      <label className="catalog-dropzone" onDragOver={event => event.preventDefault()} onDrop={event => {
        event.preventDefault(); if (!busy) addFiles(Array.from(event.dataTransfer.files))
      }}>Choose photos or drop them here
        <input type="file" aria-label="Choose photos" accept="image/jpeg,image/png,image/webp" multiple onChange={event => {
          addFiles(Array.from(event.target.files || [])); event.target.value = ''
        }} />
      </label>
      {fieldError('photos')}
    </fieldset>
    <div className="catalog-form-footer"><Link className="catalog-button secondary" to="/products">Cancel</Link>
      <button type="submit" className="catalog-button" disabled={busy}>{busy ? 'Saving…' : edit ? 'Save changes' : 'Create product'}</button>
    </div>
  </form>
}
ProductForm.propTypes = { product: ProductDetailType, onSubmit: PropTypes.func.isRequired }
