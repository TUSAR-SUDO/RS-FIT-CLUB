import { PlaceholderPage } from './PlaceholderPage';

export default function Trainers() {
  return (
    <PlaceholderPage
      index="03"
      label="Trainers"
      title={['The people', 'counting your reps.']}
      lead="Names, specialities, certifications and the programmes each coach runs."
      ghost="Crew"
      seoTitle="Our Trainers & Nutritionists — RS Fit Club, Bhubaneswar"
      seoDescription="Meet the coaches and nutritionists at RS Fit Club, Mahavir Bazar, Bhubaneswar."
      path="/trainers"
      coming={[
        'Full team grid with real portraits and specialities',
        'Certifications and years on the floor for each coach',
        'Which programmes each coach runs',
        'Nutritionist profiles and how diet consults are booked',
        'Personal training availability per coach',
        'A short first-person paragraph from each of them',
      ]}
      note="Nothing here will be a stock portrait. Until real photos and names arrive, the home page keeps labelled placeholders."
    />
  );
}
