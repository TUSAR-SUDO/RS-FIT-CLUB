/**
 * Cinematic finish: a static film-grain layer and a vignette.
 *
 * Both are `position: fixed` and `pointer-events: none`, so they cost one
 * composited layer each and no per-frame work — this is the cheap way to get
 * the gritty-but-polished feel without a canvas render loop or a large
 * backdrop-filter (which is the usual mobile performance trap).
 */
export function Overlays() {
  return (
    <>
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
