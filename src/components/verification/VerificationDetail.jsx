import { ArrowLeft, FileText, Globe, Loader2, MapPin, Phone, ShieldAlert, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getToken } from '../../lib/utils'
import apiClient from '../../services/apiClient'
import { glassCardClass, outlineButtonClass, primaryButtonClass } from '../BoostFundrUI'
import ActionModal from './ActionModal'
import { DocumentPreview, RoleBadge, StatusBadge } from './ui'

const VerificationDetail = ({ verification, onBack }) => {
  const [detail, setDetail] = useState(verification)
  const [isLoadingRequest, setIsLoadingRequest] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState('approve')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRequest = async () => {
      const requestId = verification?._id || verification?.id
      if (!requestId) return

      setIsLoadingRequest(true)
      setErrorMessage('')

      try {
        const token = getToken()
        const response = await apiClient.request(`/api/v1/admin/verifications/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const item = response?.data?.item || response?.data || verification
        setDetail(item)
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load verification detail.')
        setDetail(verification)
      } finally {
        setIsLoadingRequest(false)
      }
    }

    void fetchRequest()
  }, [verification])

  const request = detail?._id === verification?._id ? detail : verification
  const applicant = request?.userId || {}
  const isPending = request?.status === 'pending'
  const isRejected = request?.status === 'rejected'
  const fullName = `${applicant.firstName || 'Unknown'} ${applicant.lastName || 'Applicant'}`.trim()
  const requestId = request?._id || request?.id || verification?._id || verification?.id

  const documentEntries = useMemo(
    () => Object.entries(request?.documents || {}).filter(([, value]) => Boolean(value)),
    [request]
  )

  const reviewedBy = request?.reviewedBy
  const reviewedByLabel = reviewedBy
    ? `${reviewedBy.firstName || ''} ${reviewedBy.lastName || ''}`.trim() || reviewedBy.email || '--'
    : '--'

  const handleActionSubmit = async (reason) => {
    if (!requestId || isSubmitting) return

    if (actionType === 'reject' && !reason?.trim()) {
      toast.error('A rejection reason is required.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const endpoint =
        actionType === 'approve'
          ? `/api/v1/admin/verifications/${requestId}/approve`
          : `/api/v1/admin/verifications/${requestId}/reject`

      const requestBody = actionType === 'reject' ? { reason: reason.trim() } : undefined

      console.log('Verification review submit request', {
        requestId,
        actionType,
        endpoint,
        method: 'PATCH',
        body: requestBody,
      })

      const response = await apiClient.request(endpoint, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: requestBody ? JSON.stringify(requestBody) : undefined,
      })

      console.log('Verification review submit response', response)

      const updatedItem = response?.data?.item || response?.data || request
      setDetail(updatedItem)
      toast.success(response?.message || 'Verification updated successfully')
      setIsActionModalOpen(false)
    } catch (error) {
      const message = error.message || 'Unable to update verification request.'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <div className={`relative overflow-hidden ${glassCardClass} p-6 shadow-xl`}>
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <User className="w-32 h-32" />
            </div>
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 relative z-10">
              User Information
            </p>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-white/5">
                  {isLoadingRequest ? (
                    <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                  ) : (
                    <User className="w-6 h-6 text-white/40" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{fullName}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{applicant.email || 'No email on record'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <RoleBadge role={request?.type || applicant.role || 'founder'} />
                <StatusBadge status={request?.status || 'pending'} />
              </div>

              <div className="w-full h-px bg-white/5 my-2" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-white/40">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone Number</p>
                    <p className="text-sm text-white/80 mt-0.5">{applicant.phone || '--'}</p>
                  </div>
                </div>

                {(request?.type || applicant.role) === 'founder' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-white/40">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company Name</p>
                        <p className="text-sm text-white/80 mt-0.5">{applicant.companyName || '--'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-white/40">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Location</p>
                        <p className="text-sm text-white/80 mt-0.5">{applicant.location || '--'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-white/5 my-2" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Submitted</span>
                  <span className="text-white/80">{request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Updated</span>
                  <span className="text-white/80">{request?.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : '--'}</span>
                </div>
                {reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed By</span>
                    <span className="text-white/80">{reviewedByLabel}</span>
                  </div>
                )}
                {request?.reviewedAt && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed At</span>
                    <span className="text-white/80">{new Date(request.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isRejected && request?.rejectionReason && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-white/60" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Rejection Reason</h3>
              </div>
              <p className="text-sm text-rose-200/80 leading-relaxed">
                {request.rejectionReason}
              </p>
            </div>
          )}

          {errorMessage ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-xl">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className={`flex-1 p-6 ${glassCardClass} shadow-xl`}>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <FileText className="w-5 h-5 text-[#01F27B]" />
              <h2 className="text-lg font-bold text-white">Submitted Documents</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentEntries.map(([label, url]) => (
                <DocumentPreview
                  key={label}
                  title={label.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}
                  url={url}
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          </div>

          {isPending && (
            <div className={`flex items-center justify-between gap-4 p-6 ${glassCardClass} shadow-xl`}>
              <div>
                <h3 className="text-lg font-bold text-white">Review Action</h3>
                <p className="text-sm text-white/50 mt-1">
                  Approve or reject this verification request. Rejecting requires a reason.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => {
                    setActionType('reject')
                    setIsActionModalOpen(true)
                  }}
                  disabled={isSubmitting}
                  className={`${outlineButtonClass} px-6 py-2.5 text-white/70 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  Reject
                </button>
                <button 
                  onClick={() => {
                    setActionType('approve')
                    setIsActionModalOpen(true)
                  }}
                  disabled={isSubmitting}
                  className={`${primaryButtonClass} gap-2 px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isSubmitting ? 'Updating...' : 'Approve'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSubmit={handleActionSubmit}
        type={actionType}
      />
    </div>
  )
}

export default VerificationDetail
