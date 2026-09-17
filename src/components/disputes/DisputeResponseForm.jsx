import { useState } from 'react'
import PropTypes from 'prop-types'
import { Paperclip, Send, X } from 'lucide-react'
import { FilePreview } from '../products/ProductImage'
import { DisputeErrorType } from '../../types/disputes'
import { DISPUTE_MAX_FILES, validateDisputeFiles } from '../../utils/disputes'

export default function DisputeResponseForm({ busy, error, onSubmit, onClearError }) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})

  const changeMessage = event => {
    setMessage(event.target.value)
    setErrors(current => ({ ...current, message: '' }))
    onClearError()
  }
  const addFiles = event => {
    const selected = [...event.target.files]
    const next = [...files, ...selected]
    const evidence = validateDisputeFiles(next)
    if (evidence) setErrors(current => ({ ...current, evidence }))
    else { setFiles(next); setErrors(current => ({ ...current, evidence: '' })); onClearError() }
    event.target.value = ''
  }
  const removeFile = index => {
    setFiles(current => current.filter((_, fileIndex) => fileIndex !== index))
    setErrors(current => ({ ...current, evidence: '' }))
  }
  const submit = async event => {
    event.preventDefault()
    const trimmed = message.trim()
    const nextErrors = {}
    if (trimmed.length < 20) nextErrors.message = 'Enter at least 20 characters.'
    else if (trimmed.length > 2000) nextErrors.message = 'Enter no more than 2,000 characters.'
    const evidence = validateDisputeFiles(files)
    if (evidence) nextErrors.evidence = evidence
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const submitted = await onSubmit({ message: trimmed, files })
    if (submitted) { setMessage(''); setFiles([]); setErrors({}) }
  }

  const messageError = errors.message || error?.fieldErrors?.message
  const evidenceError = errors.evidence || error?.fieldErrors?.evidence
  return <form className="catalog-panel dispute-response" onSubmit={submit} noValidate>
    <h2>Respond to this dispute</h2>
    <p>Explain your side clearly. You can attach up to five JPEG, PNG or WebP images, 5 MB each.</p>
    {error && <div className="catalog-error" role="alert">{error.message}</div>}
    <div className="catalog-field">
      <label htmlFor="dispute-response-message">Your response</label>
      <textarea id="dispute-response-message" rows="7" maxLength="2000" value={message} onChange={changeMessage}
        aria-invalid={Boolean(messageError)} aria-describedby={messageError ? 'dispute-message-error' : 'dispute-message-help'} />
      {messageError ? <span id="dispute-message-error" className="catalog-field-error">{messageError}</span>
        : <small id="dispute-message-help">{message.length}/2,000 characters · minimum 20</small>}
    </div>
    <label className="dispute-file-picker">
      <Paperclip size={18} aria-hidden="true" /> Add evidence
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} disabled={busy || files.length >= DISPUTE_MAX_FILES} />
    </label>
    {evidenceError && <span className="catalog-field-error">{evidenceError}</span>}
    {files.length > 0 && <div className="dispute-new-files" aria-label="Selected evidence">
      {files.map((file, index) => <div className="dispute-new-file" key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
        <FilePreview file={file} />
        <span title={file.name}>{file.name}</span>
        <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} disabled={busy}><X size={16} /></button>
      </div>)}
    </div>}
    <div className="catalog-form-footer">
      <button className="catalog-button" disabled={busy} type="submit"><Send size={16} />{busy ? 'Sending…' : 'Submit response'}</button>
    </div>
  </form>
}
DisputeResponseForm.propTypes = {
  busy: PropTypes.bool,
  error: DisputeErrorType,
  onSubmit: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
}
