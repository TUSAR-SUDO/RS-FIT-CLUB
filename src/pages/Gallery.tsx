import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { Photo } from '../components/ui/Photo';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

/* ---------------------------------------------------------------------------
   The gallery.

   Every frame comes from the photo pipeline in src/data/photos.ts — licensed
   photography today, the club's own shoot whenever it lands. Replacing the whole
   gallery is: drop the new files into FILES/photos/ with the same names, run
   `npm run photos`, and these frames update. No component changes needed.
   --------------------------------------------------------------------------- */

interface Frame {
  /** Key into src/data/photos.ts. */
  slug: string;
  label: string;
  /** Tallest frames are placed first so the masonry columns stay balanced. */
  span: 'tall' | 'wide';
}

const FRAMES: Frame[] = [
  { slug: 'floor-wide', label: 'The floor, lights on', span: 'wide' },
  { slug: 'team-strength', label: 'Coaching a heavy set', span: 'tall' },
  { slug: 'transform-before', label: 'Where a block starts', span: 'tall' },
  { slug: 'team-class', label: 'Zumba & aerobics class', span: 'wide' },
  { slug: 'team-nutrition', label: 'Diet consult', span: 'tall' },
  { slug: 'team-weights', label: 'Weight training', span: 'tall' },
  { slug: 'transform-after', label: 'Where it ends up', span: 'wide' },
];

/** What a visitor actually finds in the room, area by area. */
const AREAS = [
  {
    icon: 'dumbbell' as const,
    title: 'The free-weights floor',
    body: 'Racks, benches, plates and dumbbells, with a coach working the room rather than sitting at a desk. This is where most sessions start.',
  },
  {
    icon: 'pulse' as const,
    title: 'The cardio line',
    body: 'Treadmills, cycles and cross-trainers along the wall, busy from early morning until the last session of the night.',
  },
  {
    icon: 'music' as const,
    title: 'The class floor',
    body: 'Zumba and aerobics run here in the evenings and on Saturday mornings. Two left feet are genuinely welcome.',
  },
  {
    icon: 'plate' as const,
    title: 'The diet desk',
    body: 'Where the nutritionist reads your routine and writes the food side of the plan, on paper you take home.',
  },
];

export default function Gallery() {
  const { startLead } = useLead();

  useSeo({
    title: 'Gallery — RS Fit Club, Bhubaneswar',
    description:
      'Photographs of the gym floor, equipment and classes at RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar.',
    path: '/gallery',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
    ]),
  });

  return (
    <div className={s.page}>
      {/* -------------------------------------------------------- page header */}
      <header className={s.pageHeader}>
        <span className={s.gridLines} aria-hidden="true" />
        <RegistrationMarks inset={20} />

        <div className={cx('shell', s.headerInner)}>
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className={s.crumbSep} aria-hidden="true">
              /
            </span>
            <span className={s.crumbCurrent}>Gallery</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Look
            </span>
            <p className="micro micro--accent">07 / Gallery</p>
            <MaskedLines
              as="h1"
              lines={['The floor,', 'as it is.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            {FRAMES.length} frames of the gym, the coaching and the classes — the floor with the
            lights on, the rack, the cardio line and a class mid-song. This is the room you walk
            into at Mahavir Bazar.
          </p>
        </div>
      </header>

      {/* -------------------------------------------------------------- grid */}
      <section className={cx('section', s.body)} aria-labelledby="gallery-title">
        <div className="shell">
          <SectionHead
            id="gallery-title"
            index="01"
            label="On the floor"
            title={['What it looks', 'like inside.']}
            lead="Honestly lit, uncluttered, no borrowed gyms. Alt text is written for each frame rather than generated filler."
            ghost="Frames"
          />

          <div className={s.galleryGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {FRAMES.map((frame) => (
              <figure
                className={cx(s.galleryItem, frame.span === 'wide' ? s.frameWide : s.frameTall)}
                key={frame.slug}
              >
                <Photo
                  slug={frame.slug}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                />
                <figcaption className={s.galleryLabel}>{frame.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------- the room */}
      <section className={cx('section', s.bodySection)} aria-labelledby="brief-title">
        <div className="shell">
          <SectionHead
            id="brief-title"
            index="02"
            label="The room"
            title={['Four corners,', 'one membership.']}
            lead="Everything above is inside the same building on Mahavir Bazar Road. Walk in once and you have seen all of it."
            ghost="Floor"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {AREAS.map((area) => (
              <article className={s.card} key={area.title}>
                <span className={s.cardIcon}>
                  <Icon name={area.icon} size={18} />
                </span>
                <h3 className={s.cardTitle}>{area.title}</h3>
                <p className={s.cardBody}>{area.body}</p>
              </article>
            ))}
          </div>

          <p className={s.footnote}>
            <Icon name="pin" size={14} />
            <span>
              {siteConfig.location.streetLine}, {siteConfig.location.area},{' '}
              {siteConfig.location.city} {siteConfig.location.pin} — walk in from the main road.
            </span>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Photographs are not the point</h2>
            <p className={s.ctaBody}>
              Stand on the floor and it looks better than any of these frames. The first session is
              free — come and see the place instead of the pictures.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'gallery-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/contact">
                How to reach us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
