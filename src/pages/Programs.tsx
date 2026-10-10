import { PlaceholderPage } from './PlaceholderPage';

export default function Programs() {
  return (
    <PlaceholderPage
      index="02"
      label="Programs"
      title={['Eight programmes,', 'one floor.']}
      lead="Weight training, strength, cardio, Zumba, aerobics, personal training, diet planning and exercise cards — each with its own page."
      ghost="Iron"
      seoTitle="Programs & Classes — RS Fit Club, Bhubaneswar"
      seoDescription="Weight training, strength training, cardio, Zumba, aerobics, personal training, diet planning and exercise card planning at RS Fit Club, Bhubaneswar."
      path="/programs"
      coming={[
        'A section per programme, anchored to its own URL',
        'What a typical session looks like, minute by minute',
        'Who each programme suits, and who it does not',
        'Class timings per programme, pulled from the real timetable',
        'Coach bios attached to the programmes they run',
        'Enquiry CTA per programme with the goal pre-selected',
      ]}
      note="Programme names come straight from what the club already advertises. Timings stay placeholders until the timetable is confirmed."
    />
  );
}
