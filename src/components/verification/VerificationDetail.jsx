import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, ShieldAlert, CheckCircle2, User, FileText, Phone, MapPin, Globe, Loader2 } from 'lucide-react'
import { StatusBadge, RoleBadge, DocumentPreview } from './ui'
import apiClient from '../../services/apiClient'
import { getToken } from '../../lib/utils'

const VerificationDetail = ({ verification, onBack, onApprove, onReject }) => {
  const isPending = verification.status === 'pending'
  const isRejected = verification.status === 'rejected'

  const [userDetails, setUserDetails] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true)
      try {
        const token = getToken()
        const res = await apiClient.request(`/api/v1/users/all/${verification.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = res?.data?.user || res?.data || res?.user
        setUserDetails(data)
      } catch (err) {
        console.error('Failed to fetch user details:', err)
      } finally {
        setIsLoadingUser(false)
      }
    }
    
    if (verification.id) fetchUser()
  }, [verification.id])

  const profile = userDetails?.founderProfile || userDetails?.investorProfile
  const avatarUrl = profile?.profileImage
  const phone = profile?.phone || '--'
  const location = userDetails?.founderProfile?.location || '--'
  const companyName = userDetails?.founderProfile?.companyName || '--'

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <User className="w-32 h-32" />
            </div>
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 relative z-10">
              User Information
            </p>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center">
                  {isLoadingUser ? (
                    <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt={verification.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white/40" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{verification.name}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{verification.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <RoleBadge role={verification.role} />
                <StatusBadge status={verification.status} />
              </div>

              <div className="w-full h-px bg-white/5 my-2" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-white/40">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone Number</p>
                    <p className="text-sm text-white/80 mt-0.5">{phone}</p>
                  </div>
                </div>

                {verification.role === 'founder' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-white/40">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company Name</p>
                        <p className="text-sm text-white/80 mt-0.5">{companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-white/40">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Location</p>
                        <p className="text-sm text-white/80 mt-0.5">{location}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-white/5 my-2" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Submitted</span>
                  <span className="text-white/80">{new Date(verification.date).toLocaleDateString()}</span>
                </div>
                {verification.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed By</span>
                    <span className="text-white/80">{verification.reviewedBy}</span>
                  </div>
                )}
                {verification.reviewedAt && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Review Date</span>
                    <span className="text-white/80">{new Date(verification.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isRejected && verification.rejectionReason && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Rejection Reason</h3>
              </div>
              <p className="text-sm text-rose-200/80 leading-relaxed">
                {verification.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Documents & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 shadow-xl flex-1">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <FileText className="w-5 h-5 text-[#01F27B]" />
              <h2 className="text-lg font-bold text-white">Submitted Documents</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verification.documents.nidFront && (
                <DocumentPreview 
                  title="NID Front" 
                  url={verification.documents.nidFront} 
                  onClick={() => window.open(verification.documents.nidFront, '_blank')}
                />
              )}
              {verification.documents.nidBack && (
                <DocumentPreview 
                  title="NID Back" 
                  url={verification.documents.nidBack} 
                  onClick={() => window.open(verification.documents.nidBack, '_blank')}
                />
              )}
              {verification.documents.businessCertificate && (
                <DocumentPreview 
                  title="Business Certificate" 
                  url={verification.documents.businessCertificate} 
                  onClick={() => window.open(verification.documents.businessCertificate, '_blank')}
                />
              )}
              {verification.documents.incomeStatement && (
                <DocumentPreview 
                  title="Income Statement" 
                  url={verification.documents.incomeStatement} 
                  onClick={() => window.open(verification.documents.incomeStatement, '_blank')}
                />
              )}
            </div>
          </div>

          {isPending && (
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Review Action</h3>
                <p className="text-sm text-white/50 mt-1">Please ensure all documents meet compliance standards before approving.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={onReject}
                  className="px-6 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={onApprove}
                  className="px-6 py-2.5 rounded-xl bg-[#01F27B] text-black font-bold hover:bg-[#01F27B]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#01F27B]/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default VerificationDetail
