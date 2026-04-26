import { X, Mail, Phone, MapPin, Globe, Twitter, Linkedin, Facebook, Github } from 'lucide-react'
import { useEffect, useState } from 'react'
import apiClient from '../../services/apiClient'
import { getToken, formatDate } from '../../lib/utils'

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken()
        const response = await apiClient.request(`/api/v1/users/all/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = response?.data?.user || response?.data || response?.user
        setUser(data)
      } catch (err) {
        setError(err.message || 'Failed to load user details.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (userId) fetchUser()
  }, [userId])

  if (!userId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-white/50">Loading details...</div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-rose-400">{error}</div>
        ) : user ? (
          <div className="max-h-[85vh] overflow-y-auto p-8">
            {/* Header / Basic Info */}
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-6 border-b border-white/10 pb-8">
              <img 
                src={user.founderProfile?.profileImage || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} 
                alt={`${user.firstName} ${user.lastName}`}
                className="h-24 w-24 rounded-full border-4 border-white/5 object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                  {user.isVerified && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Verified</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {user.email}</span>
                  <span className="rounded-full border border-white/20 px-2 py-0.5 capitalize">{user.role}</span>
                </div>
                {user.subscription && (
                  <div className="mt-2 text-xs font-semibold uppercase text-white/40">
                    Plan: <span className="text-[#01F27B]">{user.subscription.plan}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Specific Info */}
            <div className="mt-8 space-y-6">
              {user.founderProfile && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Founder Profile</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/40">Company Name</p>
                      <p className="font-semibold text-white">{user.founderProfile.companyName || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/40">Startup Stage</p>
                      <p className="font-semibold text-white">{user.founderProfile.startupStage || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 sm:col-span-2">
                      <p className="text-xs text-white/40">Description</p>
                      <p className="text-white/80">{user.founderProfile.startupDescription || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 sm:col-span-2">
                      <p className="text-xs text-white/40">Bio</p>
                      <p className="text-white/80">{user.founderProfile.bio || '--'}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-4">
                      <MapPin className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40">Location</p>
                        <p className="text-white">{user.founderProfile.location || '--'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-4">
                      <Globe className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40">Website</p>
                        <a href={user.founderProfile.website} target="_blank" rel="noreferrer" className="text-[#01F27B] hover:underline">
                          {user.founderProfile.website ? 'Visit Website' : '--'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {user.founderProfile.socialLinks && (
                    <div className="mt-4 flex gap-3">
                      {user.founderProfile.socialLinks.linkedin && (
                        <a href={user.founderProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {user.founderProfile.socialLinks.twitter && (
                        <a href={user.founderProfile.socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {user.founderProfile.socialLinks.facebook && (
                        <a href={user.founderProfile.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {user.investorProfile && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Investor Profile</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/5 p-4 sm:col-span-2">
                      <p className="text-xs text-white/40">Bio</p>
                      <p className="text-white/80">{user.investorProfile.bio || '--'}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/40 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {user.investorProfile.interests?.filter(Boolean).length > 0 ? (
                          user.investorProfile.interests.filter(Boolean).map((interest, i) => (
                            <span key={i} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 capitalize">
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/80">--</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/40 mb-2">Investment Sectors</p>
                      <div className="flex flex-wrap gap-2">
                        {user.investorProfile.investmentPreferences?.sectors?.filter(Boolean).length > 0 ? (
                          user.investorProfile.investmentPreferences.sectors.filter(Boolean).map((sector, i) => (
                            <span key={i} className="rounded-full bg-[#01F27B]/10 border border-[#01F27B]/20 px-2.5 py-0.5 text-xs text-[#01F27B] capitalize">
                              {sector}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/80">--</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/40">Max Investment</p>
                      <p className="font-semibold text-white">
                        {user.investorProfile.investmentPreferences?.maxInvestment 
                          ? `$${user.investorProfile.investmentPreferences.maxInvestment.toLocaleString()}` 
                          : '--'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-4">
                      <Phone className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40">Phone</p>
                        <p className="text-white">{user.investorProfile.phone || '--'}</p>
                      </div>
                    </div>
                  </div>

                  {user.investorProfile.socialLinks && (
                    <div className="mt-4 flex gap-3">
                      {user.investorProfile.socialLinks.linkedin && (
                        <a href={user.investorProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {user.investorProfile.socialLinks.twitter && (
                        <a href={user.investorProfile.socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {user.investorProfile.socialLinks.facebook && (
                        <a href={user.investorProfile.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {user.investorProfile.socialLinks.github && (
                        <a href={user.investorProfile.socialLinks.github} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={onClose}
                className="rounded-xl border border-white/20 bg-transparent px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default UserDetailsModal
