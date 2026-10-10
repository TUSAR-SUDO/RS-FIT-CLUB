import { PlaceholderPage } from './PlaceholderPage';

export default function About() {
  return (
    <PlaceholderPage
      index="01"
      label="About"
      title={['The story behind', 'the floor.']}
      lead="Where RS Fit Club came from, who runs it, and why a gym in Samantarapur looks like this one."
      ghost="Story"
      seoTitle="About RS Fit Club — Gym in Samantarapur, Bhubaneswar"
      seoDescription="The story behind RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar: the founder, the coaches and the floor."
      path="/about"
      coming={[
        'The founder’s story, in his own words, with a proper portrait',
        'How the floor was built, with photos from the fit-out',
        'The coaching team and their certifications',
        'What the club does not do — no fads, no crash promises',
        'A timeline: how many years the club has been open',
        'Press, partnerships and community work around Bhubaneswar',
      ]}
      note="Placeholder copy pending the founder interview. Nothing on this page will claim a result the club cannot back up."
    />
  );
}
