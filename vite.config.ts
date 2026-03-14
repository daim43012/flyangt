import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [sveltekit()],
		define: {
			'process.env.POLYGON_RPC_URL': JSON.stringify(env.POLYGON_RPC_URL || ''),
		},
	};
});
