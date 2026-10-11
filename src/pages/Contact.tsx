import { Link } from 'react-router-dom';
import { siteConfig, isReal, hasPhone, hasWhatsapp } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { healthClubSchema, breadcrumbSchema } from '../utils/structuredData';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

/* ---------------------------------------------------------------------------
   Contact.

   The rule this page is built around: a tel: or wa.me link is rendered only
   when the number behind it is real. A dead or wrong number is worse than no
   number — someone taps it, it fails, and the club looks careless. Every field
   reads siteConfig, so this block, the footer and the sticky call bar can never
   disagree with each other.

   The map is the same story: both the embed and the directions link come from
   siteConfig.location, so correcting the address there corrects the map.
   --------------------------------------------------------------------------- */

const FIRST_VISIT = [
  {
    icon: 'check' as const,
    title: 'The first session is free',
    body: 'No joining fee, no card, no obligation. Walk in for a session, train, and decide afterwards.',
  },
  {
    icon: 'pin' as const,
    title: 'Mahavir Bazar, Samantarapur',
    body: `Walk in from the main road. ${siteConfig.business.area}, ${siteConfig.business.city}, ${siteConfig.business.state}.`,
  },
  {
    icon: 'whistle' as const,
    title: 'A coach will be on the floor',
    body: 'Tell whoever is at the desk it is your first time. A coach will walk you through the setup and write a starting card.',
  },
  {
    icon: 'music' as const,
    title: 'Zumba and aerobics run as classes',
    body: 'If you would rather start with a group than with a barbell, ask which class is next and join that one instead.',
  },
];

export default function Contact() {
  const { startLead } = useLead();
  const { business, contact, location, hours } = siteConfig;

  const whatsapp = buildWhatsAppLink({ source: 'contact' });
  const fullAddress = isReal(location.streetLine)
    ? `${location.streetLine}, ${location.area}, ${location.city} ${location.pin}`
    : `${location.landmark}, ${location.area}, ${location.city}, ${location.state}`;

  useSeo({
    title: 'Contact RS Fit Club — Samantarapur, Bhubaneswar',
    description:
      'Address, phone, WhatsApp and opening hours for RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar. Claim a free trial session.',
    path: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        healthClubSchema(),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]),
      ],
    },
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
            <span className={s.crumbCurrent}>Contact</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Visit
            </span>
            <p className="micro micro--accent">08 / Contact</p>
            <MaskedLines
              as="h1"
              lines={['Find us on', 'Mahavir Bazar.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            {business.spokenName} sits at {location.landmark}, {location.area}, {location.city}.
            Walk in, or leave your number on the trial form and the club will call you back.
          </p>
        </div>
      </header>

      {/* ----------------------------------------------------------- details */}
      <section className={cx('section', s.body)} aria-labelledby="details-title">
        <div className="shell">
          <SectionHead
            id="details-title"
            index="01"
            label="Reach us"
            title={['Address, phone,', 'and hours.']}
            lead="Anything with a verified value behind it is a working link. Anything still missing shows as a labelled blank rather than a guess."
            ghost="Where"
          />

          <div className={s.contactGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {/* -------------------------------------------------- left column */}
            <div className={s.contactBlock}>
              <div>
                <p className={s.contactLabel}>Address</p>
                <p className={s.contactValue}>{fullAddress}</p>
              </div>

              <div>
                <p className={s.contactLabel}>Landmark</p>
                <p className={s.contactValue}>{location.landmark}</p>
              </div>

              <div>
                <p className={s.contactLabel}>Phone</p>
                {hasPhone ? (
                  <a
                    className={s.contactLink}
                    href={`tel:${contact.phoneDisplay.replace(/\s/g, '')}`}
                    onClick={() => trackEvent('call_click', { where: 'contact' })}
                  >
                    <Icon name="phone" size={16} />
                    {contact.phoneDisplay}
                  </a>
                ) : (
                  <p className={s.contactValue}>{contact.phoneDisplay}</p>
                )}
              </div>

              <div>
                <p className={s.contactLabel}>WhatsApp</p>
                {hasWhatsapp && whatsapp ? (
                  <a
                    className={s.contactLink}
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { where: 'contact' })}
                  >
                    <Icon name="whatsapp" size={16} />
                    Message the club
                  </a>
                ) : (
                  <p className={s.contactValue}>
                    The same mobile answers WhatsApp — save {contact.phoneDisplay} and message the
                    club there.
                  </p>
                )}
              </div>

              <div>
                <p className={s.contactLabel}>Email</p>
                <p className={s.contactValue}>
                  {business.emailConfirmed ? (
                    <a className={s.contactLink} href={`mailto:${business.email}`}>
                      <Icon name="mail" size={16} />
                      {business.email}
                    </a>
                  ) : (
                    <>{business.email}</>
                  )}
                </p>
              </div>

              <div>
                <p className={s.contactLabel}>Opening hours</p>
                {hours.alwaysOpen ? (
                  <p className={s.contactValue}>Open 24 hours a day, seven days a week.</p>
                ) : (
                  <table className={s.hoursTable}>
                    <caption className="sr-only">Opening hours</caption>
                    <tbody>
                      {hours.rows.map((row) => (
                        <tr className={s.hoursRow} key={row.days}>
                          <th className={s.hoursDay} scope="row">
                            {row.days}
                          </th>
                          <td className={s.hoursTime}>{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <p className={s.footnote}>
                  <Icon name="clock" size={14} />
                  <span>
                    Classes run inside these hours; the floor stays open between them for your own
                    sessions and your exercise card. Worth a call before a long trip.
                  </span>
                </p>
              </div>
            </div>

            {/* ------------------------------------------------- right column */}
            <div className={s.contactBlock}>
              <div className={s.mapFrame}>
                {isReal(location.mapsEmbedUrl) ? (
                  <iframe
                    title={`Map showing ${business.spokenName}`}
                    src={location.mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ width: '100%', height: '100%', border: 0 }}
                  />
                ) : (
                  <div className={s.mapPlaceholder}>
                    <Icon name="pin" size={22} />
                    <p style={{ margin: 0, maxWidth: '36ch' }}>
                      The pin, the walk from the main road and turn-by-turn directions all live on
                      the club&rsquo;s Google listing.
                    </p>
                    {isReal(location.mapsDirectionsUrl) ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="arrow-right"
                        href={location.mapsDirectionsUrl}
                        onClick={() => trackEvent('cta_click', { source: 'contact', kind: 'maps' })}
                      >
                        Open in Google Maps
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>

              <div className={s.infoRow}>
                <Icon name="pin" size={15} />
                <span>{fullAddress}</span>
              </div>

              {isReal(location.mapsDirectionsUrl) ? (
                <a
                  className={s.contactLink}
                  href={location.mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="arrow-right" size={16} />
                  Get directions
                </a>
              ) : (
                <div className={s.infoRow}>
                  <Icon name="arrow-right" size={15} />
                  <span>
                    Turn-by-turn directions appear once the address is confirmed. For now, ask for
                    Mahavir Bazar in Samantarapur — the club is on the main road.
                  </span>
                </div>
              )}

              <div>
                <p className={s.contactLabel}>Trial form</p>
                <p className={s.contactValue}>
                  {business.spokenName} calls back from the same form the home page uses. Leave your
                  number, pick a goal, and the desk will offer two or three times that fit.
                </p>
              </div>

              <div>
                <Button
                  variant="primary"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'contact' })}
                >
                  Claim your free trial
                </Button>
              </div>

              <p className={s.footnote}>
                <Icon name="clock" size={14} />
                <span>
                  {isReal(contact.responseWindow)
                    ? `Enquiries answered within ${contact.responseWindow} during opening hours.`
                    : 'Leave your number and the desk calls you back.'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------- first visit */}
      <section className={cx('section', s.bodySection)} aria-labelledby="visit-title">
        <div className="shell">
          <SectionHead
            id="visit-title"
            index="02"
            label="Your first visit"
            title={['What to expect', 'when you walk in.']}
            lead="No tour, no clipboard, no pressure at the desk. Four things are true from the moment you arrive."
            ghost="First"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {FIRST_VISIT.map((item) => (
              <article className={s.card} key={item.title}>
                <span className={s.cardIcon}>
                  <Icon name={item.icon} size={18} />
                </span>
                <h3 className={s.cardTitle}>{item.title}</h3>
                <p className={s.cardBody}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Easiest way in: message first</h2>
            <p className={s.ctaBody}>
              Leave your number and the club calls back with a time. Or walk in — whoever is at the
              desk will put a coach with you for the first hour.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'contact-cta' })}
              >
                Claim your free trial
              </Button>
              {hasWhatsapp && whatsapp ? (
                <Button
                  variant="secondary"
                  icon="whatsapp"
                  iconPosition="start"
                  href={whatsapp}
                  onClick={() => trackEvent('whatsapp_click', { where: 'contact-cta' })}
                >
                  WhatsApp the club
                </Button>
              ) : (
                <Button variant="secondary" to="/programs">
                  See the programmes
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
