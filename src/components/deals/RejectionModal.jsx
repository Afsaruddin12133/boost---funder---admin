import { useState } from 'react'
import { Modal, textareaClass } from '../BoostFundrUI'

const RejectionModal = ({ isOpen, onClose, onConfirm, startupName }) => {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (!reason.trim()) return
    onConfirm(reason)
    setReason('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject Submission: ${startupName}`}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-200">
          <p className="font-bold uppercase tracking-widest text-[10px] mb-1">Warning</p>
          Rejection is a formal action. Please provide a clear explanation for the founder on how they can improve their submission.
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Rejection Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this deal is being rejected..."
            className={`${textareaClass} min-h-[120px]`}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="flex-[2] rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all hover:bg-rose-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectionModal
