/**
 * Ambient backdrop, pure CSS.
 *
 * This replaced a Three.js / react-three-fiber scene when the hub became a
 * public, shareable link: the 3D version pulled the bundle to ~1.2 MB, which is
 * a poor first impression on a phone. Visually it lands in the same place —
 * dark field, warm drifting motes, one slow centre glow — for a few kilobytes.
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-glow" />
      <div className="backdrop-motes" />
      <div className="backdrop-motes backdrop-motes-slow" />
      <div className="backdrop-vignette" />
    </div>
  )
}
