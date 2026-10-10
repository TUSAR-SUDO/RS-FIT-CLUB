import { PlaceholderPage } from './PlaceholderPage';

export default function Gallery() {
  return (
    <PlaceholderPage
      index="07"
      label="Gallery"
      title={['The floor,', 'as it is.']}
      lead="Photographs of the gym, the equipment, the classes and the people who show up for them."
      ghost="Look"
      seoTitle="Gallery — RS Fit Club, Bhubaneswar"
      seoDescription="Photographs of the gym floor, equipment and classes at RS Fit Club, Samantarapur, Bhubaneswar."
      path="/gallery"
      coming={[
        'A wide shot of the floor with the lights on',
        'Equipment galleries, honestly lit and uncluttered',
        'Class photos with members who have consented',
        'A short clip of the floor during an evening session',
        'Before/after pairing rules so nothing looks staged',
        'Alt text written for every image, not generated filler',
      ]}
      note="The home page runs on licensed sample photography, credited in IMAGE_CREDITS.md, until the club's own shoot replaces it."
    />
  );
}
