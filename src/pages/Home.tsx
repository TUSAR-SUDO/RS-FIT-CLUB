import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { healthClubSchema } from '../utils/structuredData';
import { Hero } from '../components/sections/home/Hero';
import { MarqueeBand } from '../components/sections/home/MarqueeBand';
import { Founder } from '../components/sections/home/Founder';
import { Programs } from '../components/sections/home/Programs';
import { WhyRs } from '../components/sections/home/WhyRs';
import { Transformations } from '../components/sections/home/Transformations';
import { Trainers } from '../components/sections/home/Trainers';
import { Timetable } from '../components/sections/home/Timetable';
import { Membership } from '../components/sections/home/Membership';
import { Testimonials } from '../components/sections/home/Testimonials';
import { TrialForm } from '../components/sections/home/TrialForm';

/**
 * Phase 1 home page. The section order is the pitch:
 * attention → what the club does → who is behind it → the programmes →
 * why this floor → proof → the team → the week → price → reviews → the form.
 * Every route out of the page lands on the trial form.
 */
export default function Home() {
  useSeo({
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '/',
    jsonLd: healthClubSchema(),
  });

  return (
    <>
      <Hero />
      <MarqueeBand />
      <Founder />
      <Programs />
      <WhyRs />
      <Transformations />
      <Trainers />
      <Timetable />
      <Membership />
      <Testimonials />
      <TrialForm />
    </>
  );
}
