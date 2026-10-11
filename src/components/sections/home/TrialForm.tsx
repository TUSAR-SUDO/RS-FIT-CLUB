import { useId, useRef, useState } from 'react';
import { hasPhone, hoursLine, isReal, siteConfig } from '../../../data/siteConfig';
import { LEAD_SECTION_ID, useLead } from '../../../context/lead';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { gsap, useGSAP } from '../../../lib/gsap';
import { LeadValidationError, submitLead, validateName, validatePhone } from '../../../utils/leads';
import { buildWhatsAppLink } from '../../../utils/whatsapp';
import { trackEvent } from '../../../utils/analytics';
import { SectionHead } from '../../ui/SectionHead';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './TrialForm.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Values {
  name: string;
  phone: string;
  goal: string;
  preferredTime: string;
  message: string;
  company: string; // honeypot
}

const EMPTY: Values = {
  name: '',
  phone: '',
  goal: '',
  preferredTime: 'Morning',
  message: '',
  company: '',
};

/* ---------------------------------------------------------------------------
   The conversion engine.

   Details that matter and are easy to get wrong:
     · inputs are 16px, so iOS does not zoom the page when they are focused
     · the honeypot is clamped with clip-path, not display:none (bots skip the
       latter)
     · the submit button disables while in flight, so no double leads
     · validation is real: 10 digits, Indian leading digit, name length
     · errors are announced in a live region, and each field is tied to its own
       message with aria-describedby
     · the success state offers a pre-filled WhatsApp hand-off, which for this
       audience is the highest-intent next step there is
   --------------------------------------------------------------------------- */
export function TrialForm() {
  const { plan, source, clearPlan } = useLead();
  const reduced = useReducedMotion();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const whatsapp = buildWhatsAppLink({
    name: values.name,
    goal: values.goal,
    plan: plan ?? undefined,
    source: source ?? 'form',
  });

  /* Success micro-animation: the badge drops in and its ring expands once.
     Nothing loops, nothing runs when reduced motion is on. */
  useGSAP(
    () => {
      if (status !== 'success' || reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(`.${styles.successBadge}`, { scale: 0.6, opacity: 0, duration: 0.6 })
        .from(`.${styles.successRing}`, { scale: 0.7, opacity: 0.9, duration: 0.9 }, 0)
        .from(
          `.${styles.success} > *:not(.${styles.successBadge})`,
          { y: 14, opacity: 0, duration: 0.6, stagger: 0.07 },
          0.15,
        );
      return () => {
        tl.kill();
      };
    },
    { dependencies: [status, reduced], scope: successRef },
  );

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackEvent('form_start', { source: source ?? 'form' });
  };

  const update = (key: keyof Values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateField = (key: 'name' | 'phone') => {
    const message = key === 'name' ? validateName(values.name) : validatePhone(values.phone);
    setErrors((prev) => ({ ...prev, [key]: message ?? undefined }));
    return !message;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;

    const nameOk = validateField('name');
    const phoneOk = validateField('phone');
    const goalOk = Boolean(values.goal);
    if (!goalOk) setErrors((prev) => ({ ...prev, goal: 'Pick a goal so we can plan for you.' }));
    if (!nameOk || !phoneOk || !goalOk) {
      trackEvent('form_error', { reason: 'validation', source: source ?? 'form' });
      /* Move focus to the first thing that needs attention. */
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setStatus('loading');
    setErrors({});

    try {
      const result = await submitLead({
        name: values.name,
        phone: values.phone,
        goal: values.goal,
        preferredTime: values.preferredTime,
        plan: plan ?? undefined,
        message: values.message || undefined,
        company: values.company,
        source: source ?? 'form',
      });
      setResultMessage(result.message);
      setStatus(result.ok ? 'success' : 'error');
    } catch (error) {
      if (error instanceof LeadValidationError) {
        setErrors({ [error.field]: error.message });
        setStatus('idle');
        return;
      }
      setStatus('error');
      setResultMessage('Something went wrong on our side. Please call or WhatsApp us instead.');
    }
  };

  return (
    <section
      className={cx('section', styles.section)}
      id={LEAD_SECTION_ID}
      aria-labelledby="trial-title"
    >
      <span className={styles.diagonal} aria-hidden="true" />

      <div className={cx('shell', styles.grid)}>
        <div className={styles.formCol}>
          <SectionHead
            id="trial-title"
            index="09"
            label="Free trial"
            title={[siteConfig.lead.heading]}
            lead={siteConfig.lead.sub}
            tight
          />

          {status === 'success' ? (
            <div className={styles.success} ref={successRef} role="status" aria-live="polite">
              <span className={styles.successBadge} aria-hidden="true">
                <Icon name="check" size={26} />
                <span className={styles.successRing} />
              </span>

              <h3 className={styles.successTitle}>You are on the list</h3>

              <p className={styles.successBody}>
                {resultMessage} We call back within {siteConfig.contact.responseWindow} during
                opening hours.
              </p>

              {/* The WhatsApp hand-off is the highest-intent next step for this
                  audience, so it is offered whenever there is a number to open
                  a chat with (buildWhatsAppLink returns null when there is not). */}
              <p className={styles.successBody}>
                {whatsapp ? (
                  <>
                    Want to move faster? Message us on WhatsApp and mention{' '}
                    {values.goal ? `your goal (${values.goal.toLowerCase()})` : 'your goal'} — we
                    will reply with trial slots.
                  </>
                ) : (
                  <>
                    Want to move faster? Call {siteConfig.contact.phoneDisplay} and mention{' '}
                    {values.goal ? `your goal (${values.goal.toLowerCase()})` : 'your goal'} — the
                    desk will read out the next trial slots.
                  </>
                )}
              </p>

              <div className={styles.successActions}>
                {whatsapp ? (
                  <Button
                    variant="whatsapp"
                    icon="whatsapp"
                    iconPosition="start"
                    href={whatsapp}
                    onClick={() => trackEvent('whatsapp_click', { where: 'form-success' })}
                  >
                    Continue on WhatsApp
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatus('idle');
                    setValues(EMPTY);
                  }}
                >
                  Send another enquiry
                </Button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate onFocus={markStarted}>
              {plan ? (
                <span className={styles.planChip}>
                  Plan: {plan}
                  <button
                    type="button"
                    className={styles.planChipRemove}
                    onClick={clearPlan}
                    aria-label={`Remove the ${plan} plan from this enquiry`}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </span>
              ) : null}

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={`${uid}-name`}>
                  Your name{' '}
                  <span className={styles.required} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id={`${uid}-name`}
                  className={cx(styles.input, errors.name && styles.inputInvalid)}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={values.name}
                  onChange={(event) => update('name')(event.target.value)}
                  onBlur={() => validateField('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  required
                />
                {errors.name ? (
                  <span className={styles.error} id={`${uid}-name-error`}>
                    <Icon name="close" size={13} />
                    {errors.name}
                  </span>
                ) : null}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={`${uid}-phone`}>
                    Mobile number{' '}
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id={`${uid}-phone`}
                    className={cx(styles.input, errors.phone && styles.inputInvalid)}
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile"
                    value={values.phone}
                    onChange={(event) => update('phone')(event.target.value)}
                    onBlur={() => validateField('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? `${uid}-phone-error` : `${uid}-phone-hint`}
                    required
                  />
                  {errors.phone ? (
                    <span className={styles.error} id={`${uid}-phone-error`}>
                      <Icon name="close" size={13} />
                      {errors.phone}
                    </span>
                  ) : (
                    <span className="micro" id={`${uid}-phone-hint`}>
                      We only call about your trial
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={`${uid}-goal`}>
                    Your goal{' '}
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id={`${uid}-goal`}
                    className={cx(styles.select, errors.goal && styles.inputInvalid)}
                    name="goal"
                    value={values.goal}
                    onChange={(event) => update('goal')(event.target.value)}
                    aria-invalid={Boolean(errors.goal)}
                    aria-describedby={errors.goal ? `${uid}-goal-error` : undefined}
                    required
                  >
                    <option value="">Choose one</option>
                    {siteConfig.lead.goals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                  {errors.goal ? (
                    <span className={styles.error} id={`${uid}-goal-error`}>
                      <Icon name="close" size={13} />
                      {errors.goal}
                    </span>
                  ) : null}
                </div>
              </div>

              <fieldset className={styles.field} style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className={styles.fieldLabel}>When do you train?</legend>
                <div className={styles.options}>
                  {siteConfig.lead.timeSlots.map((slot) => (
                    <label className={styles.option} key={slot}>
                      <input
                        type="radio"
                        name="preferredTime"
                        value={slot}
                        checked={values.preferredTime === slot}
                        onChange={() => update('preferredTime')(slot)}
                      />
                      <span className={styles.optionMark}>
                        <span className={styles.optionDot} />
                      </span>
                      {slot}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Honeypot. Clamped, never display:none — bots skip hidden fields. */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor={`${uid}-company`}>Company (leave blank)</label>
                <input
                  id={`${uid}-company`}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={(event) => update('company')(event.target.value)}
                />
              </div>

              {status === 'error' ? (
                <p className={styles.formError} role="alert">
                  <Icon name="close" size={15} />
                  <span>{resultMessage}</span>
                </p>
              ) : null}

              <p className={styles.consent}>
                <Icon name="shield" size={14} />
                <span>{siteConfig.lead.consent}</span>
              </p>

              <div className={styles.submitRow}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  block
                  icon={status === 'loading' ? undefined : 'arrow-right'}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Claim free trial'}
                </Button>
                <span className="micro">No card. No joining fee. No commitment.</span>
              </div>
            </form>
          )}
        </div>

        <aside className={styles.aside} aria-label="Club contact details">
          <div className={styles.infoList}>
            <div className={styles.info}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Icon name="pin" size={17} />
              </span>
              <span>
                <span className={styles.infoLabel}>Where</span>
                <span className={styles.infoValue}>
                  {isReal(siteConfig.location.streetLine)
                    ? `${siteConfig.location.streetLine}, ${siteConfig.location.area}`
                    : `${siteConfig.business.area}`}
                  {', '}
                  {siteConfig.location.city}, {siteConfig.location.state}
                  {isReal(siteConfig.location.pin) ? ` ${siteConfig.location.pin}` : null}
                </span>
              </span>
            </div>

            <div className={styles.info}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Icon name="clock" size={17} />
              </span>
              <span>
                <span className={styles.infoLabel}>Hours</span>
                <span className={styles.infoValue}>{hoursLine}</span>
              </span>
            </div>

            <div className={styles.info}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Icon name="phone" size={17} />
              </span>
              <span>
                <span className={styles.infoLabel}>Call</span>
                <span className={styles.infoValue}>
                  {hasPhone ? (
                    <a href={`tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}`}>
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  ) : (
                    siteConfig.contact.phoneDisplay
                  )}
                </span>
              </span>
            </div>

            <div className={styles.info}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Icon name="mail" size={17} />
              </span>
              <span>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>
                  <a href={`mailto:${siteConfig.business.email}`}>{siteConfig.business.email}</a>
                </span>
              </span>
            </div>
          </div>

          {/* Map: never loaded until asked for. On a 4G phone in Bhubaneswar an
              embedded map is normally a megabyte the visitor did not ask for. */}
          <div className={styles.mapSlot}>
            {isReal(siteConfig.location.mapsEmbedUrl) ? (
              /* An embed URL is configured, but it is still only loaded on a tap:
                 a third-party iframe costs the visitor data before they have
                 decided whether they are coming. */
              mapLoaded ? (
                <div>
                  <iframe
                    className={styles.mapFrame}
                    src={siteConfig.location.mapsEmbedUrl}
                    title={`Map showing ${siteConfig.business.spokenName} in ${siteConfig.business.city}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <p className={styles.mapNote}>
                    {siteConfig.business.area}, {siteConfig.business.city}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.mapButton}
                  onClick={() => {
                    setMapLoaded(true);
                    trackEvent('map_load', { where: 'trial-form' });
                  }}
                >
                  <span className={styles.mapButtonIcon} aria-hidden="true">
                    <Icon name="pin" size={18} />
                  </span>
                  <span className="micro">Load map</span>
                  <span style={{ maxWidth: '34ch', color: 'var(--text-faint)' }}>
                    We only load the map if you ask for it — it saves your data until then.
                  </span>
                </button>
              )
            ) : isReal(siteConfig.location.mapsDirectionsUrl) ? (
              /* No embed URL: hand the visitor the club's own Google listing
                 instead of framing a map we cannot point at a pin. */
              <a
                className={styles.mapButton}
                href={siteConfig.location.mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('cta_click', { source: 'trial-form', kind: 'maps' })}
              >
                <span className={styles.mapButtonIcon} aria-hidden="true">
                  <Icon name="pin" size={18} />
                </span>
                <span className="micro">Open in Google Maps</span>
                <span style={{ maxWidth: '34ch', color: 'var(--text-faint)' }}>
                  {siteConfig.location.streetLine}, {siteConfig.location.area},{' '}
                  {siteConfig.location.city} {siteConfig.location.pin}
                </span>
              </a>
            ) : (
              <p className={styles.mapNote}>
                {siteConfig.location.landmark}, {siteConfig.location.area},{' '}
                {siteConfig.location.city}
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
