import { PlaceholderPage } from './PlaceholderPage';

export default function Transformations() {
  return (
    <PlaceholderPage
      index="04"
      label="Transformations"
      title={['Real members.', 'Real timelines.']}
      lead="Before-and-after comparisons, the goal each member started with, and how long it actually took."
      ghost="Proof"
      seoTitle="Member Transformations — RS Fit Club, Bhubaneswar"
      seoDescription="Before and after photos and timelines from members training at RS Fit Club, Bhubaneswar."
      path="/transformations"
      coming={[
        'One draggable before/after comparison per member',
        'Consented photos, shot in the same light and the same spot',
        'The goal each member started with, in their own words',
        'Honest timelines — including the plateaus',
        'Which programme and coach each member worked with',
        'A clear line on variance: results differ from person to person',
      ]}
      note="Photos publish only with written consent. No borrowed transformations, and no medical claims of any kind."
    />
  );
}
