import { useEffect, useState } from 'react';
import { siteConfig, hasPhone, hasWhatsapp } from '../../data/siteConfig';
import { LEAD_SECTION_ID, useLead } from '../../context/lead';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { trackEvent } from '../../utils/analytics';
import { Icon } from '../ui/Icon';
import { cx } from '../../utils/cx';
import styles from './MobileActionBar.module.css';

/* ---------------------------------------------------------------------------
   The single highest-leverage element on the whole site: most visitors arrive
   from a phone, from a WhatsApp or Instagram link, with a thumb already on the
   screen. Call / WhatsApp / Free Trial sit 48px tall inside the bottom safe
   area, and the bar steps out of the way while the lead form is visible.

   Only real actions render. While the club has not supplied a phone number the
   bar collapses to the one action that always works — the trial form — rather
   than shipping a dead tel: link.
   --------------------------------------------------------------------------- */
export function MobileActionBar() {
  const { startLead } = useLead();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hide while the lead form is on screen. IntersectionObserver rather than a
     scroll listener so it costs nothing per frame, and it keeps working when
     the form is reached by a CTA rather than by scrolling. */
  useEffect(() => {
    const target = document.getElementById(LEAD_SECTION_ID);
    if (!target) {
      setFormVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      rootMargin: '-10% 0px -20% 0px',
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [pastHero]);

  const whatsapp = buildWhatsAppLink({ source: 'sticky-bar' });
  const phoneHref = hasPhone ? `tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}` : null;

  const visible = pastHero && !formVisible;

  return (
    <div
      className={cx(styles.bar, visible && styles.visible)}
      /* The bar is a shortcut, not new content: hide it from AT when it is not
         on screen so a screen reader is never told about off-canvas buttons. */
      aria-hidden={visible ? undefined : true}
    >
      {phoneHref ? (
        <a
          className={cx(styles.action, styles.call)}
          href={phoneHref}
          onClick={() => trackEvent('call_click', { where: 'sticky-bar' })}
        >
          <Icon name="phone" size={17} />
          Call
        </a>
      ) : null}

      {hasWhatsapp && whatsapp ? (
        <a
          className={cx(styles.action, styles.whatsapp)}
          href={whatsapp}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => trackEvent('whatsapp_click', { where: 'sticky-bar' })}
        >
          <Icon name="whatsapp" size={17} />
          WhatsApp
        </a>
      ) : null}

      <button
        type="button"
        className={cx(styles.action, styles.primary)}
        onClick={() => startLead({ source: 'sticky-bar' })}
      >
        <Icon name="sparkle" size={15} />
        Free trial
      </button>
    </div>
  );
}
