import './ui.css'

// A spinning loading indicator. Pass `center` to center it in a big empty area
// (used while a page's data is loading).
export function Spinner({ center = false }: { center?: boolean }) {
  if (center) {
    return (
      <div className="spinner--center" role="status" aria-label="Loading">
        <span className="spinner" />
      </div>
    )
  }
  return <span className="spinner" role="status" aria-label="Loading" />
}
