import {paths} from 'src/routes/paths';


export const HOST = process.env.NEXT_PUBLIC_HOST;
export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;


export const AUTH0_API = {
	clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
	domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
	callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
	scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE,
	audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
	logout_url: process.env.NEXT_PUBLIC_AUTH0_LOGOUT_URL,
};


export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
