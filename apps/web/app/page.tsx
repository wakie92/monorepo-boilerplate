'use client';

import { Router } from 'next/router';
import NProgress from 'nprogress';

import Landing from 'src/components/Landing';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Home = () => {
  return <Landing />;
};

export default Home;
