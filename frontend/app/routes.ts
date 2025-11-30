import { type RouteConfig, route, layout } from '@react-router/dev/routes';

export default [
  route('/', 'pages/index.tsx'),
  layout('layouts/main.tsx', [
    layout('layouts/guest.tsx', [
      route('/auth/sign-in', 'pages/auth/sign-in.tsx'),

      route('/auth/sign-up', 'pages/auth/sign-up.tsx'),
      route('/verify/:token', 'pages/auth/verified.tsx'),
      route('/auth/change-password', 'pages/auth/change-password.tsx'),
      route('/auth/forgot-password', 'pages/auth/forgot-password.tsx'),
      route('/auth/verify-otp', 'pages/auth/verify-otp.tsx'),
    ]),

    // Protected routes: dashboard and other app pages
    layout('layouts/protected.tsx', [
      route('/dashboard', 'pages/dashboard/overview.tsx'),
      // route('/dashboard/overview', 'pages/dashboard/overview.tsx'),
      // route('/projects', 'pages/projects/index.tsx'),
      // route('/settings', 'pages/settings/index.tsx'),
    ]),

    // layout('layouts/index.ts', [
    //   route('/about', 'pages/about.tsx'),
    //   route('/terms', 'pages/terms.tsx'),
    // ]),
  ]),
] satisfies RouteConfig;
