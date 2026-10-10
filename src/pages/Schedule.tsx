import { PlaceholderPage } from './PlaceholderPage';

export default function Schedule() {
  return (
    <PlaceholderPage
      index="06"
      label="Schedule"
      title={['Every class,', 'every hour.']}
      lead="The full weekly timetable — weights, cardio, Zumba, aerobics and one-to-one slots."
      ghost="Week"
      seoTitle="Class Schedule & Timetable — RS Fit Club, Bhubaneswar"
      seoDescription="Weekly class timetable for RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar."
      path="/schedule"
      coming={[
        'Confirmed session times for all seven days',
        'One colour code per programme, consistent across the site',
        'Coach name against each session',
        'Capacity and whether booking is needed',
        'Holiday and festival closures',
        'A printable version for the desk',
      ]}
      note="Real times replace the [TIME] tokens on the home page the moment the club sends its slots."
    />
  );
}
