import { isReal, siteConfig } from '../data/siteConfig';

/* ---------------------------------------------------------------------------
   JSON-LD. Every field is emitted only when the underlying config value is
   real, so a placeholder never leaks into schema.org markup (which would be a
   rich-results violation and could get the site penalised).
   --------------------------------------------------------------------------- */

export function healthClubSchema(): Record<string, unknown> {
  const { business, location, contact, social, seo, hours, ratingAverage, ratingCount } =
    siteConfig;

  const telephone = isReal(contact.phoneDisplay) ? contact.phoneDisplay : undefined;

  /* Opening hours, one entry per row that carries a machine-readable spec.
     Sunday has neither, so it is left out rather than guessed at. */
  const openingHours = hours.rows
    .filter((row) => row.confirmed && row.spec)
    .map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.spec?.days,
      opens: row.spec?.opens,
      closes: row.spec?.closes,
    }));

  /* 4.8 from 109 ratings, straight off the club's Google listing. Only emitted
     when both halves are real — half a rating is worse than none. */
  const aggregateRating =
    isReal(ratingAverage) && isReal(ratingCount)
      ? {
          '@type': 'AggregateRating',
          ratingValue: Number(ratingAverage),
          reviewCount: Number(ratingCount),
          bestRating: 5,
          worstRating: 1,
        }
      : null;

  const sameAs = [social.facebook, social.instagram, social.youtube].filter(
    (url) => typeof url === 'string' && url.startsWith('http'),
  );

  const hasAddress = isReal(location.streetLine) || isReal(location.city);

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: business.name,
    alternateName: business.spokenName,
    description: seo.defaultDescription,
    url: seo.siteUrl,
    image: `${seo.siteUrl}${seo.ogImage}`,
    email: business.email,
    ...(isReal(business.foundedIso) ? { foundingDate: business.foundedIso } : {}),
    ...(telephone ? { telephone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(isReal(location.streetLine) ? { streetAddress: location.streetLine } : {}),
            addressLocality: location.city,
            addressRegion: location.state,
            ...(isReal(location.pin) ? { postalCode: location.pin } : {}),
            addressCountry: business.country,
          },
        }
      : {}),
    ...(location.lat !== null && location.lng !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng } }
      : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
    areaServed: {
      '@type': 'City',
      name: `${business.city}, ${business.state}`,
    },
    /** Only the eight services the club publicly lists. */
    makesOffer: siteConfig.programs.map((program) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: program.title, description: program.benefit },
      ...(isReal(program.slug) ? { url: `${seo.siteUrl}/programs#${program.slug}` } : {}),
    })),
  };
}

export function breadcrumbSchema(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.seo.siteUrl.replace(/\/$/, '')}${item.path}`,
    })),
  };
}
