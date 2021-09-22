import adapter from "@sveltejs/adapter-netlify";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: "#svelte",
		prerender: {
			crawl: true,
			enabled: true,
			onError: "continue",
			entries: ["*"]
		}
	}
};

export default config;
