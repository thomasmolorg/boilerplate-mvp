import { auth } from '$lib/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect, type Handle } from '@sveltejs/kit';

const betterAuthHandler = (async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
}) satisfies Handle;

const authorizationHandler = (async ({ event, resolve }) => {
	const routeId = event.route.id;
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (routeId!.startsWith('/app') && !session) {
		redirect(302, '/signin');
	}

	if (routeId!.startsWith('/(auth)') && session) {
		redirect(302, '/app');
	}

	return resolve(event);
}) satisfies Handle;

export const handle = sequence(betterAuthHandler, authorizationHandler);
