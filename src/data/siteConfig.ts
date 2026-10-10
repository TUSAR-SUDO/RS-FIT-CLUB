/* ============================================================================
   RS FIT CLUB — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Nothing in this site hard-codes a client fact. Every component reads from
   here, so when the club sends real details you edit THIS FILE ONLY.

   HOW PLACEHOLDERS WORK
   ---------------------
   Anything unverified is written as an obvious token: "[OWNER NAME]",
   "+91 XXXXX XXXXX", "₹ ---", or `null`.
   `isReal()` below returns false for any token, and components use it to
   *hide* fake-looking UI instead of inventing data. For example the stat
   counters delete themselves entirely while their value is null.

   VERIFIED (from the club's public Facebook page) — do not change these
   without asking the client:
     · Name: RS FIT CLUB
     · Area: Samantarapur, Mahavir Bazar, Bhubaneswar, Odisha
     · Services: weight training, strength training, cardio, Zumba, aerobics,
       personal training, diet planning, exercise card planning
     · Positioning: fitness delivered by a team of experts and nutritionists

   EVERYTHING ELSE IS A PLACEHOLDER. See CLIENT_CHECKLIST.md for the full list
   of things to collect. Do NOT invent numbers, testimonials, awards or prices.
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
  name: string;
  goal: string;
  quote: string;
  duration: string;
  rating: 1 | 2 | 3 | 4 | 5;
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
    /** VERIFIED as publicly listed — CONFIRM before publishing. */
    email: 'rsfitness@gmail.com',
    emailConfirmed: false,
  },

  /* ---------------------------------------------------------- contact
     All placeholders. The header CTA, sticky mobile bar and every tel:/
     wa.me link read from here, and links deactivate while the value is
     not real (so the site never ships a dead or wrong number). */
  contact: {
    phoneDisplay: token('PHONE NUMBER'),
    /** Digits only, international format, no + or spaces. e.g. "919876543210" */
    whatsappNumber: null as Nullable<string>,
    whatsappMessage: "Hi RS Fit Club, I saw your website. I'd like to know about the free trial.",
    responseWindow: token('X HOURS'),
    responseWindowValue: null as Nullable<number>,
  },

  /* ---------------------------------------------------------- location */
  location: {
    streetLine: token('STREET ADDRESS'),
    landmark: 'Mahavir Bazar',
    area: 'Samantarapur',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pin: token('PIN'),
    /** Google Maps embed + directions URLs. Empty = the map slot collapses. */
    mapsEmbedUrl: '',
    mapsDirectionsUrl: '',
    lat: null as Nullable<number>,
    lng: null as Nullable<number>,
  },

  /* ------------------------------------------------------------- hours */
  hours: {
    /** True ONLY if the client confirms 24/7 access. */
    alwaysOpen: false,
    confirmed: false,
    /** TODO: replace with real opening hours. */
    rows: [
      { days: 'Monday – Friday', time: token('TIME'), confirmed: false },
      { days: 'Saturday', time: token('TIME'), confirmed: false },
      { days: 'Sunday', time: token('TIME'), confirmed: false },
    ] as Array<{ days: string; time: string; confirmed: boolean }>,
  },

  /* ----------------------------------------------------------- socials */
  social: {
    /* Empty = the icon is not rendered at all. The club's page is the source we
       verified the facts from, but its exact URL is not on file, and a link to
       facebook.com's front page is worse than no link: it reads as a mistake.
       TODO: paste the exact page URLs and the icons appear. */
    instagram: '',
    facebook: '',
    youtube: '',
    facebookConfirmed: false,
  },

  /* ------------------------------------------------------------- owner */
  owner: {
    name: token('OWNER NAME'),
    role: 'Founder & Head Coach',
    /** TODO: replace with the owner's real story, in his own words. */
    bio: [
      'Replace this with the founder’s own story — where he started, what he lifts, and why he opened a floor in Samantarapur instead of somewhere easier.',
      'Two or three short paragraphs. First person works best here; it is the one place on the page where the club speaks as a person, not a brand.',
    ],
    credentials: [token('CERTIFICATION'), token('YEARS ON THE FLOOR')],
    pullQuote: token('OWNER QUOTE — one line, in his own words'),
    signatureLine: token('SIGNATURE LINE'),
  },

  /* -------------------------------------------------------------- stats
     NEVER invent these. Every entry is null until the client supplies the
     number, and the entire counter row hides itself while they are null. */
  stats: [
    { label: 'Members on the floor', value: null, suffix: '+' },
    { label: 'Years training Bhubaneswar', value: null, suffix: '' },
    { label: 'Coaches & nutritionists', value: null, suffix: '' },
    { label: 'Sessions a week', value: null, suffix: '' },
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
     Empty until the club sends real, consented before/after pairs and
     stories. The section renders an empty state instead of inventing them. */
  transformations: [] as Array<{
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
     Placeholder team. The four portraits live in src/data/photos.ts and are
     licensed sample photography until the club sends its own shoot. */
  trainers: [] as Array<{
    name: string;
    speciality: string;
    credits: string;
    /** Slug from src/data/photos.ts, e.g. 'team-strength'. */
    photo: string;
    tall: boolean;
  }>,
  trainersHint:
    'Sample portraits and placeholder specialities — send us the real line-up and these fill in.',

  /* ------------------------------------------------------------ timetable
     VERIFIED services, PLACEHOLDER times. The UI marks unconfirmed times
     with a dashed token so nobody mistakes the demo grid for a real one. */
  timetable: {
    confirmed: false,
    note: 'Layout preview. Times still to be confirmed by the club.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    /* TODO: replace [TIME] with real slots. */
    sessions: [
      {
        day: 'Mon',
        time: null as Nullable<string>,
        program: 'Strength Training',
        focus: 'strength',
      },
      { day: 'Mon', time: null, program: 'Cardio', focus: 'cardio' },
      { day: 'Mon', time: null, program: 'Zumba', focus: 'dance' },
      { day: 'Tue', time: null, program: 'Weight Training', focus: 'strength' },
      { day: 'Tue', time: null, program: 'Aerobics', focus: 'dance' },
      { day: 'Wed', time: null, program: 'Strength Training', focus: 'strength' },
      { day: 'Wed', time: null, program: 'Cardio', focus: 'cardio' },
      { day: 'Thu', time: null, program: 'Weight Training', focus: 'strength' },
      { day: 'Thu', time: null, program: 'Zumba', focus: 'dance' },
      { day: 'Fri', time: null, program: 'Personal Training', focus: 'coach' },
      { day: 'Fri', time: null, program: 'Cardio', focus: 'cardio' },
      { day: 'Sat', time: null, program: 'Aerobics', focus: 'dance' },
      { day: 'Sat', time: null, program: 'Strength Training', focus: 'strength' },
      { day: 'Sun', time: null, program: 'Open floor', focus: 'open' },
    ] as Array<{ day: string; time: Nullable<string>; program: string; focus: string }>,
  },

  /* ----------------------------------------------------------- membership
     Plan NAMES and PRICES are unconfirmed placeholders. `featured` cards get
     the accent border + "most chosen" tag. */
  membership: {
    confirmed: false,
    note: 'Plan names and prices are placeholders. Add-ons marked * need confirming too.',
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: null,
        wasPrice: null,
        duration: '30 days',
        tagline: 'Try the floor without a long commitment.',
        includes: ['Full gym access', 'Group Zumba & aerobics', 'Exercise card set-up'],
        featured: false,
        confirmed: false,
      },
      {
        id: 'quarterly',
        name: 'Quarterly',
        price: null,
        wasPrice: null,
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
        price: null,
        wasPrice: null,
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
     Real reviews only. Empty array => the section shows a clean empty state
     ("Reviews coming soon") rather than fabricated quotes. */
  testimonials: [] as Testimonial[],
  googleReviewsUrl: '',
  /** Shown only once real reviews exist. */
  ratingAverage: null as Nullable<number>,
  ratingCount: null as Nullable<number>,

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
    builtBy: token('FREELANCER NAME'),
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
