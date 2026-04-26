import React, { useState } from 'react'
import { mockVerifications } from '../components/verification/mockData'
import VerificationList from '../components/verification/VerificationList'
import VerificationDetail from '../components/verification/VerificationDetail'
import ActionModal from '../components/verification/ActionModal'
import toast from 'react-hot-toast'

const Verification = () => {
  const [verifications, setVerifications] = useState(mockVerifications)
  const [selectedVerification, setSelectedVerification] = useState(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('approve') // 'approve' | 'reject'

  const handleApproveClick = () => {
    setModalType('approve')
    setIsModalOpen(true)
  }

  const handleRejectClick = () => {
    setModalType('reject')
    setIsModalOpen(true)
  }

  const handleModalSubmit = (reason) => {
    if (!selectedVerification) return

    setVerifications(prev => prev.map(v => {
      if (v.id === selectedVerification.id) {
        const updated = {
          ...v,
          status: modalType === 'approve' ? 'approved' : 'rejected',
          reviewedBy: 'Admin Current',
          reviewedAt: new Date().toISOString()
        }
        if (modalType === 'reject') {
          updated.rejectionReason = reason
          updated.verified = false
        } else {
          updated.verified = true
          updated.rejectionReason = null
        }
        return updated
      }
      return v
    }))

    toast.success(
      modalType === 'approve' 
        ? 'Verification approved successfully' 
        : 'Verification rejected successfully'
    )
    
    // Update local selected state to reflect changes immediately
    setSelectedVerification(prev => ({
      ...prev,
      status: modalType === 'approve' ? 'approved' : 'rejected',
      reviewedBy: 'Admin Current',
      reviewedAt: new Date().toISOString(),
      verified: modalType === 'approve',
      rejectionReason: modalType === 'reject' ? reason : null
    }))
    
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Verification Center</h1>
        <p className="text-sm text-white/50">
          Manage identity checks and document reviews for platform compliance.
        </p>
      </div>

      {!selectedVerification ? (
        <VerificationList 
          verifications={verifications} 
          onView={setSelectedVerification} 
        />
      ) : (
        <VerificationDetail 
          verification={selectedVerification} 
          onBack={() => setSelectedVerification(null)}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
        />
      )}

      <ActionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        type={modalType}
      />

    </div>
  )
}

export default Verification
