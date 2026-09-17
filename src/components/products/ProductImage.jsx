import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { productImageUrl, PRODUCT_PLACEHOLDER } from '../../utils/productImages'

export default function ProductImage({ src, alt, preview = false, className = '' }) {
  const url = preview ? src : productImageUrl(src)
  const [state, setState] = useState({ url: null, loaded: false, failed: false })
  const current = state.url === url ? state : { loaded: false, failed: false }
  return <span className={`catalog-image ${className}`} aria-busy={!current.loaded}>
    {!current.loaded && <span className="catalog-image-skeleton" aria-hidden="true" />}
    <img src={current.failed ? PRODUCT_PLACEHOLDER : url} alt={alt}
      onLoad={() => setState({ url, loaded: true, failed: current.failed })}
      onError={() => setState({ url, loaded: true, failed: true })} />
  </span>
}
ProductImage.propTypes = { src: PropTypes.string, alt: PropTypes.string.isRequired, preview: PropTypes.bool, className: PropTypes.string }

export function FilePreview({ file }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return url ? <ProductImage src={url} alt={`New photo: ${file.name}`} preview /> : null
}
FilePreview.propTypes = { file: PropTypes.object.isRequired }
