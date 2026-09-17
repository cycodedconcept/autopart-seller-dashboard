import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle, Clock, AlertCircle, Upload, RefreshCw, XCircle, Loader, FileCheck2, FileText } from 'lucide-react'
import { getSellerProfile, uploadSellerDocuments, retryCacVerification } from '../../features/authSlice'
import autoLogo from '../../assets/auto logo.PNG'

export default function PendingVerification() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, sellerProfile, loading } = useSelector(state => state.auth)
  const businessName = sellerProfile?.businessName || user?.fullName || 'your account'
  const status = sellerProfile?.verificationStatus || 'pending'
  const rejectionReason = sellerProfile?.rejectionReason
  const isApproved = status === 'approved' || status === 'verified'
  const hasDocuments = (sellerProfile?.documents?.length || 0) > 0
  const documents = sellerProfile?.documents || []

  const documentLabel = (type) => {
    if (type === 'CAC') return 'CAC Certificate'
    if (type === 'PROOF_OF_ADDRESS') return 'Proof of Address'
    return String(type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const [cacFile, setCacFile] = useState(null)
  const [addressFile, setAddressFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    if (isApproved) {
      navigate('/dashboard', { replace: true })
    }
  }, [isApproved, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getSellerProfile())
    }, 30000)
    dispatch(getSellerProfile())
    return () => clearInterval(interval)
  }, [dispatch])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!cacFile || !addressFile) return
    setUploadLoading(true)
    setUploadError(null)
    setUploadSuccess(false)
    try {
      const fd = new FormData()
      fd.append('cacDocument', cacFile)
      fd.append('proofOfAddressDocument', addressFile)
      await dispatch(uploadSellerDocuments(fd)).unwrap()
      setUploadSuccess(true)
      setCacFile(null)
      setAddressFile(null)
      dispatch(getSellerProfile())
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleRetryCac = async () => {
    try {
      await dispatch(retryCacVerification()).unwrap()
      dispatch(getSellerProfile())
    } catch (err) {
      // error will be in Redux state
    }
  }

  const handleRefreshStatus = () => {
    dispatch(getSellerProfile())
  }

  const badgeStyles = {
    pending: { backgroundColor: '#FEF3C7', color: '#92400E' },
    rejected: { backgroundColor: '#FEE2E2', color: '#991B1B' },
    approved: { backgroundColor: '#D1FAE5', color: '#065F46' },
    verified: { backgroundColor: '#D1FAE5', color: '#065F46' },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '520px', width: '100%' }}>
        <img src={autoLogo} alt="AutoParts Logo" style={{ width: '64px', height: 'auto', marginBottom: '32px' }} />

        {isApproved ? (
          <div style={{ marginBottom: '24px' }}><CheckCircle size={64} color="#22C55E" strokeWidth={1.5} /></div>
        ) : status === 'rejected' ? (
          <div style={{ marginBottom: '24px' }}><XCircle size={64} color="#EF4444" strokeWidth={1.5} /></div>
        ) : (
          <div style={{ marginBottom: '24px' }}><Clock size={64} color="#F59E0B" strokeWidth={1.5} /></div>
        )}

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
          {isApproved ? 'Verification Approved!' : status === 'rejected' ? 'Verification Rejected' : 'Thank you for signing up!'}
        </h1>

        <p style={{ fontSize: '1rem', color: '#4B5563', marginBottom: '8px', lineHeight: 1.6 }}>
          <strong style={{ color: '#111827' }}>{businessName}</strong> has been registered successfully.
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px', borderRadius: '20px',
          fontSize: '0.85rem', fontWeight: 600, marginBottom: '32px',
          ...(badgeStyles[status] || badgeStyles.pending)
        }}>
          {isApproved ? <CheckCircle size={16} /> : status === 'rejected' ? <AlertCircle size={16} /> : <Clock size={16} />}
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {status === 'rejected' && rejectionReason && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', color: '#991B1B', margin: 0 }}><strong>Reason:</strong> {rejectionReason}</p>
          </div>
        )}

        {!isApproved && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <button onClick={handleRefreshStatus} disabled={loading} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', color: '#374151', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Status
              </button>
            </div>

            {status === 'rejected' && (
              <div style={{ marginBottom: '24px' }}>
                <button onClick={handleRetryCac} disabled={loading} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {loading ? <Loader size={16} className="spin" /> : <RefreshCw size={16} />} Retry CAC Verification
                </button>
              </div>
            )}

            {hasDocuments && status !== 'rejected' && (
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={18} color="#059669" /> Documents Submitted
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px' }}>Your verification documents are uploaded and awaiting review.</p>
                {documents.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', fontSize: '0.85rem', color: '#374151' }}>
                    <FileText size={15} color="#6B7280" />
                    <span style={{ fontWeight: 600 }}>{documentLabel(d.type)}</span>
                    <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>
                      {new Date(d.uploadedAt || d.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '12px', marginBottom: 0 }}>
                  Our team is reviewing your account. This page refreshes automatically — you'll be taken to your dashboard as soon as your account is verified.
                </p>
              </div>
            )}

            {(!hasDocuments || status === 'rejected') && (
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} /> {status === 'rejected' ? 'Re-upload Verification Documents' : 'Upload Verification Documents'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '16px' }}>
                  {status === 'rejected'
                    ? 'Your previous documents were rejected. Please upload corrected documents to complete verification.'
                    : 'Upload your CAC certificate and proof of business address to complete verification.'}
                </p>

              {uploadSuccess && (
                <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> Documents uploaded successfully!
                </div>
              )}

              {uploadError && (
                <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>CAC Document (PDF/Image)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setCacFile(e.target.files[0])} required={!cacFile} style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Proof of Address (PDF/Image)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setAddressFile(e.target.files[0])} required={!addressFile} style={{ fontSize: '0.85rem' }} />
                </div>
                <button type="submit" disabled={uploadLoading || !cacFile || !addressFile} className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {uploadLoading ? <> <Loader size={16} className="spin" /> Uploading...</> : <> <Upload size={16} /> Upload Documents</>}
                </button>
              </form>
              </div>
            )}
          </>
        )}

        {isApproved && (
          <div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '0.95rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
