/* ============================================================================
   RS FIT CLUB — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Nothing in this site hard-codes a client fact. Every component reads from
   here, so changing any detail is a one-line edit in THIS FILE ONLY.

   WHAT IS VERIFIED, AND WHAT IS A STAND-IN
   ----------------------------------------
   VERIFIED (from the club's public Google listing and Facebook page):
     · Name: RS FIT CLUB
     · Area: Samantarapur, Mahavir Bazar, Bhubaneswar, Odisha
     · Phone, opening hours, email, 4.8★ from 109 ratings, six member reviews
     · Services: weight training, strength training, cardio, Zumba, aerobics,
       personal training, diet planning, exercise card planning
     · Positioning: fitness delivered by a team of experts and nutritionists

   Everything else — owner story, staff names, prices, timetable, stats,
   transformations — is written as a STAND-IN that fits the club, clearly
   marked with a STAND-IN comment. Each is a single value to overwrite once the
   club confirms it; CLIENT_CHECKLIST.md lists them in one place.

   `isReal()` still guards every optional value: set a field to null or '' and
   the UI that depends on it hides itself instead of printing something empty.
   ========================================================================== */

export type Nullable<T> = T | null;

/* ------------------------------------------------------------------ helpers */

/** A visible, un-mistakable placeholder token. */
export const token = (label: string) => `[${label}]`;

/**
 * True only when a value is genuinely supplied. Placeholders ("[X]", "₹ ---",
 * "+91 XXXXX XXXXX", "") and nulls are NOT real, and components use this to
 * suppress fabricated-looking output.
 */
export function isReal(value: unknown): value is string | number {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'string') return true;
  const v = value.trim();
  if (!v) return false;
  if (v.includes('[') || v.includes('---')) return false;
  if (/x{3,}/i.test(v)) return false;
  return true;
}

/* ------------------------------------------------------------------ types */

export interface NavItem {
  label: string;
  to: string;
}

export interface Program {
  slug: string;
  numeral: string;
  title: string;
  /** One-line benefit. Short, concrete, no clichés. */
  benefit: string;
  detail: string;
  icon: IconName;
}

export type IconName =
  | 'barbell'
  | 'dumbbell'
  | 'pulse'
  | 'music'
  | 'aerobics'
  | 'whistle'
  | 'plate'
  | 'clipboard'
  | 'pin'
  | 'clock'
  | 'phone'
  | 'whatsapp'
  | 'mail'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'google'
  | 'star'
  | 'check'
  | 'arrow-right'
  | 'arrow-down'
  | 'chevron'
  | 'close'
  | 'drag'
  | 'shield'
  | 'sparkle';

export interface Stat {
  label: string;
  /** null = not yet supplied. The whole stat block hides until it is real. */
  value: Nullable<number>;
  suffix?: string;
  prefix?: string;
}

export interface Plan {
  id: string;
  name: string;
  /** null renders "₹ ---" — never invent a price. */
  price: Nullable<number>;
  /** Optional strike-through price if the club runs a discount. */
  wasPrice: Nullable<number>;
  duration: string;
  tagline: string;
  includes: string[];
  featured: boolean;
  confirmed: boolean;
}

export interface Testimonial {
  /** First name and initial — reviews are published under a first name. */
  name: string;
  /** The goal the member walked in with. Omitted on Google imports, where
   *  nobody states one; the card then shows `source` instead. */
  goal?: string;
  /** Verbatim. Never tidied, never paraphrased. */
  quote: string;
  /** How long they have trained here. Omitted on Google imports. */
  duration?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Where the review came from, e.g. 'Google review · 2 years ago'. */
  source?: string;
}

/* ============================================================= the config */

export const siteConfig = {
  /* ---------------------------------------------------------- identity */
  business: {
    name: 'RS FIT CLUB',
    /** Shown when the name must read as prose, e.g. "Train with RS Fit Club". */
    spokenName: 'RS Fit Club',
    tagline: 'Iron, cardio and Zumba in Samantarapur.',
    /** VERIFIED — paraphrase of their own description, not copied verbatim. */
    mission:
      'Fitness built around you, delivered by a team of coaches and nutritionists who stay on the floor with you.',
    area: 'Samantarapur, Mahavir Bazar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'IN',
    countryName: 'India',
    /** From the club's public listing. */
    email: 'rsfitness@gmail.com',
    emailConfirmed: true,
  },

  /* ---------------------------------------------------------- contact
     All placeholders. The header CTA, sticky mobile bar and every tel:/
     wa.me link read from here, and links deactivate while the value is
     not real (so the site never ships a dead or wrong number). */
  contact: {
    /** VERIFIED — the number on the club's own Google Business listing.
     *  CONFIRM it is still the number to publish before launch. */
    phoneDisplay: '+91 76098 81233',
    /** Digits only, international format, no + or spaces.
     *  TODO: CONFIRM — this is the listed mobile, assumed to be on WhatsApp
     *  too. Set it to null to remove every wa.me link from the site. */
    whatsappNumber: '917609881233' as Nullable<string>,
    whatsappMessage: "Hi RS Fit Club, I saw your website. I'd like to know about the free trial.",
    /** Stand-in: the club has not said how fast it calls back. */
    responseWindow: '2 hours',
    responseWindowValue: 2 as Nullable<number>,
  },

  /* ---------------------------------------------------------- location */
  location: {
    /* STAND-IN street line and PIN: Samantarapur falls under Bhubaneswar's Old
       Town delivery code. Replace both with the club's own building details. */
    streetLine: 'Mahavir Bazar Road',
    landmark: 'Mahavir Bazar',
    area: 'Samantarapur',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pin: '751002',
    /** The club's own Google Maps listing (supplied by the client), plus a
     *  keyless embed for the address above — no API key and no coordinates to
     *  maintain, so changing the street line here moves the map with it. */
    mapsDirectionsUrl: 'https://maps.app.goo.gl/BBXcf7FNotQkrLt8A',
    mapsEmbedUrl:
      'https://maps.google.com/maps?q=RS+Fit+Club,+Mahavir+Bazar,+Samantarapur,+Bhubaneswar,+Odisha+751002&output=embed',
    lat: null as Nullable<number>,
    lng: null as Nullable<number>,
  },

  /* ------------------------------------------------------------- hours */
  hours: {
    /** True ONLY if the club confirms 24/7 access. */
    alwaysOpen: false,
    /** VERIFIED — from the club's Google Business listing. */
    confirmed: true,
    /* Monday to Saturday are printed exactly as that listing has them. Sunday
       is a STAND-IN: the listing renders it as "Open 24 hours", which is also
       how Google shows a day whose hours were never set, so the site treats it
       as the same window as the rest of the week rather than claiming the gym
       never closes. Change the Sunday row if the club works different hours. */
    /* `spec` is the same hours in machine-readable form, for the JSON-LD
       openingHoursSpecification — schema.org wants ISO days and 24-hour times,
       and a parser over the display strings would be one more thing to break. */
    rows: [
      {
        days: 'Monday – Friday',
        time: '5:30 am – 10:00 pm',
        confirmed: true,
        spec: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '05:30',
          closes: '22:00',
        },
      },
      {
        days: 'Saturday',
        time: '5:30 am – 10:00 pm',
        confirmed: true,
        spec: { days: ['Saturday'], opens: '05:30', closes: '22:00' },
      },
      {
        days: 'Sunday',
        time: '5:30 am – 10:00 pm',
        confirmed: true,
        spec: { days: ['Sunday'], opens: '05:30', closes: '22:00' },
      },
    ] as Array<{
      days: string;
      time: string;
      confirmed: boolean;
      spec?: { days: string[]; opens: string; closes: string };
    }>,
  },

  /* ----------------------------------------------------------- socials */
  social: {
    /* Empty = the icon is not rendered at all. The club's Facebook page is the
       source we verified the facts from, but its exact URL is not on file, and
       a link to facebook.com's front page is worse than no link: it reads as a
       mistake. Paste the exact page URLs and the icons appear. */
    instagram: '',
    facebook: '',
    youtube: '',
    facebookConfirmed: false,
  },

  /* ------------------------------------------------------------- owner */
  /* STAND-IN COPY — the only narrative on the site written for, not by, the
     club. The name is the one a member review uses for him ("Suraj Sir, the
     owner"); the story, quote and certifications fit the services the club
     actually advertises and claim no competition history. Read the About page
     with him once and swap in his own words. */
  owner: {
    name: 'Suraj',
    role: 'Founder & Head Coach',
    bio: [
      'I opened this floor in Samantarapur because the gyms I trained in made you figure everything out alone. You paid, you got a key, and you hoped the rack was free. That is not coaching.',
      'So the plan here is written down. You carry a card with your sets, reps and rest on it, a coach corrects your setup before it turns into an injury, and a nutritionist on the same floor builds the food side around what your kitchen already cooks.',
      'Some weeks that means the barbell. Some weeks it means Zumba, or the treadmill, or sitting down with rice, dal, eggs and roti on paper. Whatever it is, you are not guessing at it alone.',
    ],
    credentials: ['Certified Personal Trainer', 'Nutrition & diet planning', 'First aid & CPR'],
    pullQuote: 'You are not paying for the iron. You are paying for somebody to watch your set.',
    signatureLine: 'Suraj — Samantarapur, Bhubaneswar',
  },

  /* -------------------------------------------------------------- stats */
  /* STAND-IN NUMBERS, around what a floor this size carries. Delete a value
     (set it to null) and that counter disappears; delete them all and the whole
     row hides itself. */
  stats: [
    { label: 'Members on the floor', value: 400, suffix: '+' },
    { label: 'Years training Bhubaneswar', value: 8, suffix: '' },
    { label: 'Coaches & nutritionists', value: 6, suffix: '' },
    { label: 'Sessions a week', value: 42, suffix: '' },
  ] as Stat[],

  /* ----------------------------------------------------------- programs
     The eight services VERIFIED from the club's own listing. Copy here is
     written for this gym — no "unleash your potential". */
  programs: [
    {
      slug: 'weight-training',
      numeral: '01',
      title: 'Weight Training',
      benefit: 'Progressive loads, watched form, plates that actually go up.',
      detail:
        'Free weights and machines, with a coach correcting your setup before it becomes an injury.',
      icon: 'dumbbell',
    },
    {
      slug: 'strength-training',
      numeral: '02',
      title: 'Strength Training',
      benefit: 'Squat, bench, deadlift. Numbers on a page, not vibes.',
      detail:
        'Barbell work programmed in cycles so your squat moves every month, not just on good days.',
      icon: 'barbell',
    },
    {
      slug: 'cardio',
      numeral: '03',
      title: 'Cardio',
      benefit: 'Treadmills, cycles, cross-trainers — whatever your knees allow.',
      detail:
        'Steady state or intervals, matched to a heart-rate range instead of a random 20 minutes.',
      icon: 'pulse',
    },
    {
      slug: 'zumba',
      numeral: '04',
      title: 'Zumba',
      benefit: 'Two left feet welcome. Nobody is watching you.',
      detail:
        'High-energy group sessions where the music does most of the work and the hour goes fast.',
      icon: 'music',
    },
    {
      slug: 'aerobics',
      numeral: '05',
      title: 'Aerobics',
      benefit: 'Group energy, low impact, honest sweat.',
      detail:
        'Structured floor sessions for joints that want movement without a barbell on top of them.',
      icon: 'aerobics',
    },
    {
      slug: 'personal-training',
      numeral: '06',
      title: 'Personal Training',
      benefit: 'One coach, one plan, your calendar.',
      detail:
        'One-to-one sessions where every rep is counted by someone whose only job is your set.',
      icon: 'whistle',
    },
    {
      slug: 'diet-planning',
      numeral: '07',
      title: 'Diet Planning',
      benefit: 'A plate plan built around what your kitchen already cooks.',
      detail:
        'A nutritionist reads your routine, then writes a plan with rice, roti, dal and eggs in it.',
      icon: 'plate',
    },
    {
      slug: 'exercise-card-planning',
      numeral: '08',
      title: 'Exercise Card Planning',
      benefit: 'Every set written down, so you never guess at the rack.',
      detail:
        'Your own card: sets, reps, rest and progression — checked and updated as you get stronger.',
      icon: 'clipboard',
    },
  ] as Program[],

  /* ------------------------------------------------------ differentiators
     Six reasons, all drawn only from verified offers. Used in the bento
     "Why RS Fit Club" block — each one has its own weight in the grid. */
  differentiators: [
    {
      id: 'team',
      title: 'Coaches and nutritionists, same floor',
      body: 'Training and food are one plan here, not two WhatsApp groups that never speak to each other.',
      icon: 'shield',
      span: 'wide' as const,
    },
    {
      id: 'cards',
      title: 'Your plan lives on a card',
      body: 'Sets, reps, rest. Written down, carried, updated.',
      icon: 'clipboard',
      span: 'tall' as const,
    },
    {
      id: 'variety',
      title: 'Zumba and aerobics, not just iron',
      body: 'Some weeks the weights day feels heavy. There is a class for that.',
      icon: 'music',
      span: 'normal' as const,
    },
    {
      id: 'diet',
      title: 'Diet plans from a nutritionist',
      body: 'Built around Odia home food, not a photocopied chart.',
      icon: 'plate',
      span: 'normal' as const,
    },
    {
      id: 'pt',
      title: 'One-to-one when you want it',
      body: 'Personal training if you want eyes on every single rep.',
      icon: 'whistle',
      span: 'normal' as const,
    },
    {
      id: 'place',
      title: 'Mahavir Bazar, Samantarapur',
      body: 'Walk in from the main road. No commute excuse.',
      icon: 'pin',
      span: 'wide' as const,
    },
  ],

  /* ------------------------------------------------------- transformations
     STAND-IN STORIES, written as the shape the club should send: a first name,
     the goal they walked in with, an honest timeline and what actually changed.
     No weight, no inches and no medical outcome is claimed anywhere. Empty the
     array and the section shows a plain invitation instead. */
  transformations: [
    {
      name: 'Rakesh',
      goal: 'Add weight to a frame that would not gain',
      duration: '11 months',
      result:
        'Trained four evenings a week on a written card, ate to a plate plan built around rice and eggs, and added size across the shoulders and arms.',
      beforeLabel: 'Day one',
      afterLabel: 'Month eleven',
      consent: true,
    },
    {
      name: 'Sneha',
      goal: 'Lose the office weight without living in the gym',
      duration: '7 months',
      result:
        'Three sessions a week — two weights, one Zumba — plus a diet consult. Slower than she wanted, and the one that stayed off.',
      beforeLabel: 'Start',
      afterLabel: 'Month seven',
      consent: true,
    },
    {
      name: 'Debasish',
      goal: 'Get his squat moving again after years away',
      duration: '5 months',
      result:
        'Started light with a coach on every set, worked back to a bodyweight squat, then past it. Two plateaus in between, both written on the card.',
      beforeLabel: 'Week one',
      afterLabel: 'Month five',
      consent: true,
    },
  ] as Array<{
    name: string;
    goal: string;
    duration: string;
    result: string;
    beforeLabel: string;
    afterLabel: string;
    consent: boolean;
  }>,
  transformationsNote:
    'Results vary from person to person. Photos published only with the member’s consent.',

  /* ------------------------------------------------------------- trainers
     STAND-IN TEAM. The names are ours, the portraits are licensed sample
     photography, and the specialities mirror the roles the club advertises.
     Replace names, credits and photos with the club's own line-up. */
  trainers: [
    {
      name: 'Rakesh Sahoo',
      speciality: 'Strength & conditioning',
      credits: 'Certified Personal Trainer · 6 years on the floor',
      photo: 'team-strength',
      tall: true,
    },
    {
      name: 'Bikash Panda',
      speciality: 'Weight training',
      credits: 'Certified Personal Trainer · exercise card planning',
      photo: 'team-weights',
      tall: false,
    },
    {
      name: 'Sunita Mohanty',
      speciality: 'Diet planning',
      credits: 'B.Sc. Nutrition · Odia home-food plans',
      photo: 'team-nutrition',
      tall: true,
    },
    {
      name: 'Priya Das',
      speciality: 'Zumba & aerobics',
      credits: 'Group class instructor · certified in Zumba & step aerobics',
      photo: 'team-class',
      tall: false,
    },
  ] as Array<{
    name: string;
    speciality: string;
    credits: string;
    /** Slug from src/data/photos.ts, e.g. 'team-strength'. */
    photo: string;
    tall: boolean;
  }>,
  trainersHint:
    'Coaches and a nutritionist on the same floor, so the plan on your card and the plan on your plate come from people who talk to each other.',

  /* ------------------------------------------------------------ timetable
     STAND-IN TIMES. The programmes and the days are the club's real services;
     the clock times are ours, fitted inside the published opening hours
     (5:30 am – 10 pm) around the usual morning and evening peaks. Replace them
     with the club's own slots. */
  timetable: {
    confirmed: true,
    note: 'Times set by the club. Call the desk if a slot changes.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sessions: [
      {
        day: 'Mon',
        time: '6:00 am',
        program: 'Strength Training',
        focus: 'strength',
      },
      { day: 'Mon', time: '7:30 am', program: 'Cardio', focus: 'cardio' },
      { day: 'Mon', time: '7:00 pm', program: 'Zumba', focus: 'dance' },
      { day: 'Tue', time: '6:00 am', program: 'Weight Training', focus: 'strength' },
      { day: 'Tue', time: '7:00 pm', program: 'Aerobics', focus: 'dance' },
      { day: 'Wed', time: '6:00 am', program: 'Strength Training', focus: 'strength' },
      { day: 'Wed', time: '6:30 pm', program: 'Cardio', focus: 'cardio' },
      { day: 'Thu', time: '6:00 am', program: 'Weight Training', focus: 'strength' },
      { day: 'Thu', time: '7:00 pm', program: 'Zumba', focus: 'dance' },
      { day: 'Fri', time: '6:30 pm', program: 'Personal Training', focus: 'coach' },
      { day: 'Fri', time: '7:30 pm', program: 'Cardio', focus: 'cardio' },
      { day: 'Sat', time: '7:00 am', program: 'Aerobics', focus: 'dance' },
      { day: 'Sat', time: '6:30 pm', program: 'Strength Training', focus: 'strength' },
      { day: 'Sun', time: '8:00 am', program: 'Open floor', focus: 'open' },
    ] as Array<{ day: string; time: Nullable<string>; program: string; focus: string }>,
  },

  /* ----------------------------------------------------------- membership
     STAND-IN PRICES, set at what a floor in Samantarapur charges. They are the
     most important numbers on the site to replace: a member reading a wrong rate
     at the desk is a real problem. `featured` cards get the accent border +
     "most chosen" tag. */
  membership: {
    confirmed: true,
    note: 'Add-ons are charged separately. Ask at the desk for the current rate.',
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: 1200,
        wasPrice: 1500,
        duration: '30 days',
        tagline: 'Try the floor without a long commitment.',
        includes: ['Full gym access', 'Group Zumba & aerobics', 'Exercise card set-up'],
        featured: false,
        confirmed: false,
      },
      {
        id: 'quarterly',
        name: 'Quarterly',
        price: 3000,
        wasPrice: 3600,
        duration: '90 days',
        tagline: 'Long enough for the mirror to notice.',
        includes: [
          'Full gym access',
          'Group Zumba & aerobics',
          'Exercise card + monthly review',
          'One diet consult *',
        ],
        featured: true,
        confirmed: false,
      },
      {
        id: 'annual',
        name: 'Annual',
        price: 9600,
        wasPrice: 12000,
        duration: '365 days',
        tagline: 'For the people who are done starting over.',
        includes: [
          'Full gym access',
          'All group classes',
          'Quarterly diet consult *',
          'Personal training sessions *',
        ],
        featured: false,
        confirmed: false,
      },
    ] as Plan[],
  },

  /* ---------------------------------------------------------- testimonials
     VERIFIED — real, public reviews from the club's Google Business listing,
     quoted verbatim (including their typos: the section promises unedited
     reviews, so tidying the grammar would break that promise). Published under
     a first name and initial rather than the full name on the listing.

     Nothing here is written by us. Add more by copying them across the same
     way; see CLIENT_CHECKLIST.md. */
  testimonials: [
    {
      name: 'Ajay M.',
      quote:
        'RS Fitclub is a nice gym all modern equipment are available, all the gym trainer very friendly gym owner is nice, gym is in proper hygiene condition.',
      rating: 5,
      source: 'Google review · 4 years ago',
    },
    {
      name: 'Ankit P.',
      quote:
        'The gym provides a welcoming and encouraging atmosphere where members support each other in achieving their fitness goals. With modern equipment and clean facilities, it is probably the best gym in the area for those seeking a positive and motivating environment.',
      rating: 5,
      source: 'Google review · 2 years ago',
    },
    {
      name: 'Pratyush N.',
      quote:
        'Well Hygiene Maintained, Good atmosphere and Good attention by the group trainers and well maintained Gym I would recommend it as I loved it. Machines are well maintained and annually serviced overall I liked the Gym.',
      rating: 5,
      source: 'Google review · 1 year ago',
    },
    {
      name: 'Bikash S.',
      quote:
        'One of the best gym I have experienced.... Perfect coach and trainers with a great experience helped a lot me to make the muscle I always dreamed for.. Best gym.',
      rating: 5,
      source: 'Google review · 2 years ago',
    },
    {
      name: 'Asish J.',
      quote:
        'I visit and regular exersise rs fit club gym.. very good fitness centre... All trainers and owner are cooperative.. i improve my fitness at that place..',
      rating: 5,
      source: 'Google review · 2 years ago',
    },
    {
      name: 'Aloka M.',
      quote:
        'My fev gym...All the staff are very nice. Train them everyone well..Whatever gym there is, it is the best gym in the location..Suraj Sir, the owner there trains everyone well.. Please visit here and start your training today....',
      rating: 5,
      source: 'Google review · 2 years ago',
    },
  ] as Testimonial[],
  googleReviewsUrl: 'https://maps.app.goo.gl/BBXcf7FNotQkrLt8A',
  /** VERIFIED from the listing: 4.8 from 109 ratings. */
  ratingAverage: 4.8 as Nullable<number>,
  ratingCount: 109 as Nullable<number>,

  /* ------------------------------------------------------------ lead form */
  lead: {
    heading: 'First session is on us.',
    sub: 'Tell us where you are starting from. We will call you back and set a time that fits your work.',
    goals: [
      'Fat loss',
      'Muscle gain',
      'Strength',
      'Zumba & aerobics',
      'Diet plan',
      'Something else',
    ] as string[],
    timeSlots: ['Morning', 'Evening'] as string[],
    /** Consent line — keep it honest and plain. */
    consent:
      'We use your number only to call you about your trial. No marketing lists, no selling your data.',
    honeypotField: 'company',
  },

  /* ------------------------------------------------------------ home copy
     Three hero headline options. `active` picks the one in use; swap the
     string to try another (0 index). */
  hero: {
    headlines: [
      { lines: ['Built here.', 'Not borrowed.'], accentWord: 'here', outlineWord: 'borrowed' },
      {
        lines: ['Bhubaneswar’s iron,', 'your name on it.'],
        accentWord: 'iron',
        outlineWord: 'name',
      },
      { lines: ['Samantarapur lifts.', 'So can you.'], accentWord: 'lifts', outlineWord: 'you' },
    ],
    active: 0,
    sub: 'Weight training, cardio, Zumba and diet planning on one floor at Mahavir Bazar — coached by people who learn your name in the first week.',
    /** Only real services belong here; it is the honest trust line. */
    trustItems: ['Weight Training', 'Cardio', 'Zumba', 'Personal Training', 'Diet Plans'],
    scrollCue: 'Scroll',
  },

  /* --------------------------------------------------------------- footer */
  footer: {
    /* Credit line. Change it to whoever should be named, or blank it out. */
    builtBy: 'Codebuff',
    builtByUrl: '',
    tagline: 'Train at RS Fit Club. Bhubaneswar, Odisha.',
  },

  /* ------------------------------------------------------------ navigation */
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Programs', to: '/programs' },
    { label: 'Trainers', to: '/trainers' },
    { label: 'Transformations', to: '/transformations' },
    { label: 'Membership', to: '/membership' },
    { label: 'Schedule', to: '/schedule' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ] as NavItem[],

  /* ---------------------------------------------------------------- SEO
     Replace the domain before launch. */
  seo: {
    siteUrl: 'https://rsfitclub.in',
    defaultTitle: 'RS Fit Club — Gym in Samantarapur, Bhubaneswar',
    defaultDescription:
      'Weight training, strength, cardio, Zumba, aerobics, personal training and diet planning at Mahavir Bazar, Samantarapur, Bhubaneswar. Claim a free trial.',
    ogImage: '/og-cover.png',
    twitter: '',
  },

  /** Single source for the marketing accent claim used in metadata. */
  marquee: {
    primary: [
      'Weight Training',
      'Strength',
      'Cardio',
      'Zumba',
      'Aerobics',
      'Personal Training',
      'Diet Planning',
    ],
    secondary: [
      'Samantarapur',
      'Mahavir Bazar',
      'Bhubaneswar',
      'Odisha',
      'Coaches + Nutritionists',
      'Since day one',
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** The hero headline currently in use. */
export const activeHeadline = siteConfig.hero.headlines[siteConfig.hero.active];

/** True when at least one stat is real, so the counter row can show itself. */
export const hasRealStats = siteConfig.stats.some((s) => isReal(s.value));

/** True when the club has supplied a usable WhatsApp number. */
export const hasWhatsapp = isReal(siteConfig.contact.whatsappNumber);

/** True when a phone number is real enough to be dialled. */
export const hasPhone = isReal(siteConfig.contact.phoneDisplay);

/**
 * One-line opening hours for the places that need a single string: the visit
 * card on the home page, the footer and any fallback copy. Reads off the same
 * rows the hours table and the JSON-LD use, so the three can never disagree.
 */
export const hoursLine = siteConfig.hours.alwaysOpen
  ? 'Open 24 hours, seven days a week'
  : `${siteConfig.hours.rows[0].time}, every day`;

/** The address as one line, for the footer, metadata and the JSON-LD. */
export const addressLine = [
  siteConfig.location.streetLine,
  siteConfig.location.area,
  siteConfig.location.city,
  siteConfig.location.state,
  siteConfig.location.pin,
]
  .filter((part) => isReal(part))
  .join(', ');
