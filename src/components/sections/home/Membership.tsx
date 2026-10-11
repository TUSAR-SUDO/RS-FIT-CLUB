import { siteConfig, isReal } from '../../../data/siteConfig';
import type { Plan } from '../../../data/siteConfig';
import { useLead } from '../../../context/lead';
import { SectionHead } from '../../ui/SectionHead';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Membership.module.css';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

function PlanCard({ plan }: { plan: Plan }) {
  const { startLead } = useLead();

  return (
    <article className={cx(styles.plan, plan.featured && styles.planFeatured)}>
      {plan.featured ? <span className={styles.tag}>Most chosen</span> : null}

      <div className={styles.planHead}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <span className={cx('micro', styles.planDuration)}>{plan.duration}</span>
      </div>

      {/* Rates print straight from siteConfig.membership.plans. Remove a price
          and that card just drops the line — never a figure nobody quoted. */}
      <p className={styles.price}>
        {isReal(plan.price) ? (
          <>
            <span className={styles.priceValue}>₹{formatPrice(Number(plan.price))}</span>
            {isReal(plan.wasPrice) ? (
              <span className={styles.priceWas}>₹{formatPrice(Number(plan.wasPrice))}</span>
            ) : null}
            <span className={styles.priceUnit}>/ {plan.duration}</span>
          </>
        ) : null}
      </p>

      <p className={styles.tagline}>{plan.tagline}</p>

      <ul className={styles.includes}>
        {plan.includes.map((item) => (
          <li className={styles.include} key={item}>
            <Icon name="check" size={14} />
            <span>
              {item.replace(/\s\*$/, '')}
              {item.endsWith('*') ? <span className="tag-soft">Add-on</span> : null}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.planFoot}>
        <Button
          variant={plan.featured ? 'primary' : 'secondary'}
          block
          icon="arrow-right"
          onClick={() => startLead({ plan: plan.name, source: `plan:${plan.id}` })}
        >
          Ask about {plan.name.toLowerCase()}
        </Button>
      </div>
    </article>
  );
}

export function Membership() {
  const { plans, note } = siteConfig.membership;

  return (
    <section className={cx('section', styles.section)} aria-labelledby="membership-title">
      <div className="shell">
        <SectionHead
          id="membership-title"
          index="07"
          label="Membership"
          title={['Pick a length.', 'Not a lock-in.']}
          lead="All plans include the gym floor and the group classes. Personal training and diet consults can be added to any of them."
          ghost="Join"
        />

        <div className={styles.plans}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className={styles.footnote}>
          <Icon name="check" size={15} />
          <span>{note}</span>
        </p>
      </div>
    </section>
  );
}
