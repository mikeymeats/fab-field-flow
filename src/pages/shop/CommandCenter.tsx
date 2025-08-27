import { Navigate } from 'react-router-dom'

export default function CommandCenter() {
  // Redirect to Package Review by default
  return <Navigate to="/shop/command-center/review" replace />
}