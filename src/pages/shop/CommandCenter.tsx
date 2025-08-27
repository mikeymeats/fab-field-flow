import { Navigate } from 'react-router-dom'

export default function CommandCenter() {
  // Redirect to the first sub-view by default
  return <Navigate to="/shop/command-center/review" replace />
}