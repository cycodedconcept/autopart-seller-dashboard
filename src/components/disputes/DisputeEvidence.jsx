import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { getDisputeEvidence } from '../../services/disputes'
import { DisputeAttachmentType } from '../../types/disputes'
import { formatDisputeDate } from '../../utils/disputes'

export default function DisputeEvidence({ attachment }) {
  const [state, setState] = useState({ loading: Boolean(attachment.url), url: '', error: '' })

  useEffect(() => {
    if (!attachment.url) {
      setState({ loading: false, url: '', error: 'Attachment is unavailable.' })
      return undefined
    }
    const controller = new AbortController()
    let objectUrl = ''
    setState({ loading: true, url: '', error: '' })
    getDisputeEvidence(attachment.url, { signal: controller.signal }).then(blob => {
      objectUrl = URL.createObjectURL(blob)
      setState({ loading: false, url: objectUrl, error: '' })
    }).catch(error => {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        setState({ loading: false, url: '', error: 'Could not load this attachment.' })
      }
    })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [attachment.url])

  return <article className="dispute-evidence-item">
    <div className="dispute-evidence-preview" aria-busy={state.loading}>
      {state.loading && <div role="status" className="dispute-evidence-loading"><span className="sr-only">Loading {attachment.filename}</span></div>}
      {state.url && <a href={state.url} target="_blank" rel="noreferrer" aria-label={`Open ${attachment.filename}`}>
        <img src={state.url} alt={attachment.filename} onError={() => setState({ loading: false, url: '', error: 'Could not display this attachment.' })} />
      </a>}
      {state.error && <div className="dispute-evidence-failed"><ImageOff size={22} aria-hidden="true" /><span>{state.error}</span></div>}
    </div>
    <div><strong>{attachment.filename}</strong><small>{formatDisputeDate(attachment.uploadedAt)}</small></div>
  </article>
}
DisputeEvidence.propTypes = { attachment: DisputeAttachmentType.isRequired }
