import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { glassCardClass, outlineButtonClass, primaryButtonClass, textareaClass } from '../BoostFundrUI'

const ActionModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const isReject = type === 'reject'

  const handleClose = () => {
    setReason('')
    setErrorMessage('')
    onClose()
  }

  const handleSubmit = () => {
    if (isReject && !reason.trim()) {
      setErrorMessage('Rejection reason is required.')
      return
    }

    setErrorMessage('')
    onSubmit(isReject ? reason.trim() : undefined)
    setReason('')
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      
      <div className={`relative z-10 w-full max-w-md overflow-hidden p-6 ${glassCardClass} shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isReject ? 'bg-rose-500/10 text-rose-500' : 'bg-[#01F27B]/10 text-[#01F27B]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isReject ? 'Reject Verification' : 'Approve Verification'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isReject ? (
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Please provide a reason for rejecting this verification request. This will be sent to the user.
            </p>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              placeholder="e.g. NID image is blurry..."
              required
              className={`${textareaClass} min-h-[100px]`}
            />
            {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
          </div>
        ) : (
          <p className="text-sm text-white/60 mb-6">
            Are you sure you want to approve this user? They will gain full platform access based on their role.
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <button 
            onClick={handleClose}
            className={`${outlineButtonClass} flex-1`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isReject && !reason.trim()}
            className={`${primaryButtonClass} flex-1 disabled:opacity-50`}
          >
            {isReject ? 'Confirm Rejection' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ActionModal
