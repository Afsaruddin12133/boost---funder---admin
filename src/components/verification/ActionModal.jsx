import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'

const ActionModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  const isReject = type === 'reject'

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isReject ? 'bg-rose-500/10 text-rose-500' : 'bg-[#01F27B]/10 text-[#01F27B]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isReject ? 'Reject Verification' : 'Approve Verification'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
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
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. NID image is blurry..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all min-h-[100px] outline-none"
            />
          </div>
        ) : (
          <p className="text-sm text-white/60 mb-6">
            Are you sure you want to approve this user? They will gain full platform access based on their role.
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSubmit(isReject ? reason : undefined)
              setReason('')
            }}
            disabled={isReject && !reason.trim()}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 ${
              isReject ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[#01F27B] text-black hover:bg-[#01F27B]/90'
            }`}
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
