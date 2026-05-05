import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/BoostFundrUI'
import VerificationDetail from '../components/verification/VerificationDetail'

const VerificationReview = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Verification Center"
        title="Verification Review"
        description="Inspect a single verification request in the same glass-dark design system."
      />

      {id ? (
        <VerificationDetail
          key={id}
          verification={{ _id: id }}
          onBack={() => navigate('/verification')}
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60 backdrop-blur-xl">
          Missing verification id.
        </div>
      )}
    </div>
  )
}

export default VerificationReview
