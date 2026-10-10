/* GSAP is registered exactly once, here. Import `gsap`, `ScrollTrigger` and
   `useGSAP` from this module rather than from the packages directly, so the
   plugin registration can never be lost to import order, and so the whole
   animation library lands in one split chunk. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ScrollTrigger's normal behaviour is fine for us, but allowing it to ignore
   mobile address-bar resizes avoids a very common source of layout jump on
   Android Chrome. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
