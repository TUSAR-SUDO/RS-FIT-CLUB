import { Suspense, lazy } from 'react';
import { Link, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LeadProvider } from './context/LeadProvider';
import { Layout } from './components/layout/Layout';
import { Button } from './components/ui/Button';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

/* ---------------------------------------------------------------------------
   Routing.

   Home is imported eagerly and everything else is lazily code-split: the home
   page is the entry point for essentially all traffic (people arrive from a
   WhatsApp or Instagram link), so making it wait on a second network round trip
   would trade real LCP for nothing. The eight stub routes are one click away at
   worst, and by then the curtain transition covers the fetch.
   --------------------------------------------------------------------------- */

const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Trainers = lazy(() => import('./pages/Trainers'));
const Transformations = lazy(() => import('./pages/Transformations'));
const Membership = lazy(() => import('./pages/Membership'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));

/** Reserves the page's height while a route chunk is in flight, so the scroll
 *  position and ScrollTrigger measurements never jump. */
function RouteFallback() {
  return <div style={{ minHeight: '78svh' }} aria-busy="true" />;
}

/** Shown if a route throws. Deliberately does not use the app's contexts — it
 *  has to work when something inside them has already failed. */
function RouteError() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
        <p className="micro micro--accent">Something broke</p>
        <h1 className="display-3" style={{ maxWidth: '24ch' }}>
          The page dropped a set.
        </h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '46ch' }}>
          Reload and it will usually come back. If it does not, call or WhatsApp the gym and we will
          sort you out directly.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
          <Link
            to="/"
            className="link-underline"
            style={{ alignSelf: 'center', fontSize: '0.875rem' }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

const withFallback = (element: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

/* React Router v7 behaviour, opted into early so this codebase does not break
   on upgrade. Declared as its own value rather than an inline literal because
   `v7_startTransition` exists at runtime in 6.30 but is missing from its type
   definitions — a fresh literal would fail excess-property checking. */
const FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <LeadProvider>
          <Layout />
        </LeadProvider>
      ),
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: withFallback(<About />) },
        { path: 'programs', element: withFallback(<Programs />) },
        { path: 'trainers', element: withFallback(<Trainers />) },
        { path: 'transformations', element: withFallback(<Transformations />) },
        { path: 'membership', element: withFallback(<Membership />) },
        { path: 'schedule', element: withFallback(<Schedule />) },
        { path: 'gallery', element: withFallback(<Gallery />) },
        { path: 'contact', element: withFallback(<Contact />) },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { future: FUTURE_FLAGS },
);

export function App() {
  return <RouterProvider router={router} />;
}
