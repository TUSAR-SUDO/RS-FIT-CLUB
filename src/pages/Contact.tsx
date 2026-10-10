import { PlaceholderPage } from './PlaceholderPage';

export default function Contact() {
  return (
    <PlaceholderPage
      index="08"
      label="Contact"
      title={['Find us on', 'Mahavir Bazar.']}
      lead="Address, phone, WhatsApp, opening hours and the map — plus the same free-trial form as the home page."
      ghost="Visit"
      seoTitle="Contact RS Fit Club — Samantarapur, Bhubaneswar"
      seoDescription="Address, phone and opening hours for RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar."
      path="/contact"
      coming={[
        'The exact street address and a Google Maps embed',
        'Tap-to-call and tap-to-WhatsApp links',
        'Confirmed opening hours, including holidays',
        'The full free-trial form, not just a mailto link',
        'Directions from Samantarapur and the nearest landmark',
        'Parking and access notes for first-time visitors',
      ]}
      note="Until a verified phone number exists the site does not render a tel: link. A wrong number is worse than no number."
    />
  );
}
