import { PlaceholderPage } from './PlaceholderPage';

export default function Membership() {
  return (
    <PlaceholderPage
      index="05"
      label="Membership"
      title={['Priced plainly,', 'once you tell us.']}
      lead="Monthly, quarterly and annual plans, what each includes, and which add-ons exist."
      ghost="Join"
      seoTitle="Membership & Pricing — RS Fit Club, Bhubaneswar"
      seoDescription="Membership plans and pricing at RS Fit Club, Mahavir Bazar, Bhubaneswar. Diet planning and personal training add-ons."
      path="/membership"
      coming={[
        'Confirmed plan lengths and prices, with any joining fee stated',
        'A full inclusion comparison per plan',
        'Add-on rates for personal training and diet consults',
        'Couple, student and corporate rates if the club offers them',
        'Freeze and cancellation terms, written plainly',
        'Payment methods accepted at the desk',
      ]}
      note="No price is published until the club confirms it. Until then the cards read ₹ --- rather than a number somebody guessed."
    />
  );
}
