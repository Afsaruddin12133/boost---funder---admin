import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, outlineButtonClass } from '../components/BoostFundrUI'
import VerificationList from '../components/verification/VerificationList'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const Verification = () => {
  const navigate = useNavigate()
  const [verifications, setVerifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadVerifications = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const response = await apiClient.request('/api/v1/admin/verifications/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const items = Array.isArray(response?.data?.items) ? response.data.items : []
      setVerifications(items)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load verification requests.')
      setVerifications([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadVerifications()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleReview = (verification) => {
    navigate(`/verification/${verification._id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Verification Center"
        title="Verification Review"
        description="Manage founder and investor verification requests in one clean review surface."
        actions={[
          <button key="refresh" type="button" onClick={loadVerifications} className={outlineButtonClass}>
            Refresh
          </button>,
        ]}
      />

      {errorMessage ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/70 backdrop-blur-xl">
          Loading verification requests...
        </div>
      ) : (
        <VerificationList verifications={verifications} onView={handleReview} />
      )}
    </div>
  )
}

export default Verification
