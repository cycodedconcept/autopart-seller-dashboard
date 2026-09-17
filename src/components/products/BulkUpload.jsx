import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { bulkUploadProducts, clearBulkResult } from '../../features/productSlice'
import { validateCsv } from '../../utils/productValidation'
import { ErrorNotice } from './CatalogState'

export default function BulkUpload({ onComplete }) {
  const dispatch = useDispatch()
  const { bulkLoading, bulkError, bulkResult } = useSelector(state => state.products)
  const [file, setFile] = useState(null)
  const [validation, setValidation] = useState('')
  const [progress, setProgress] = useState(null)
  useEffect(() => { dispatch(clearBulkResult()) }, [dispatch])
  const select = selected => {
    const error = validateCsv(selected)
    setValidation(error); setFile(error ? null : selected)
    dispatch(clearBulkResult())
  }
  const upload = async event => {
    event.preventDefault()
    const error = validateCsv(file)
    if (error) { setValidation(error); return }
    setProgress(null)
    await dispatch(bulkUploadProducts({ file, onUploadProgress: event => {
      if (event.total) setProgress(Math.min(100, Math.round(event.loaded * 100 / event.total)))
    } }))
    // Refresh even after a transport error, which can occur after a server commit.
    onComplete()
  }
  return <section className="catalog-panel"><h2>Bulk upload</h2>
    <p>Upload a CSV of products. Prices in the CSV are integer kobo; separate image URLs with a vertical bar (|).</p>
    <a href="/inventory-template.csv" download>Download CSV template</a>
    <form onSubmit={upload}>
      <label className="catalog-dropzone" onDragOver={event => event.preventDefault()} onDrop={event => {
        event.preventDefault(); if (!bulkLoading) select(event.dataTransfer.files[0])
      }}>Choose a CSV file or drop it here · up to 2 MB
        <input type="file" aria-label="Inventory CSV" accept=".csv,text/csv" disabled={bulkLoading} onChange={event => select(event.target.files[0])} />
      </label>
      {file && <p>{file.name}</p>}
      {validation && <ErrorNotice message={validation} />}
      {bulkError && <ErrorNotice message={bulkError.message} />}
      {bulkResult && <div role="status" className="catalog-success">{bulkResult.createdCount} products created.</div>}
      {bulkLoading && <div role="status"><p>{progress === 100 ? 'Processing CSV…' : 'Uploading CSV…'}</p><progress aria-label="CSV upload progress" value={progress ?? undefined} max="100" /></div>}
      <button className="catalog-button" type="submit" disabled={bulkLoading || !file}>{bulkLoading ? 'Uploading…' : 'Upload CSV'}</button>
    </form>
  </section>
}
BulkUpload.propTypes = { onComplete: PropTypes.func.isRequired }
