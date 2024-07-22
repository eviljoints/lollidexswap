const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
  });
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
	reactStrictMode: true,
	images: {
	  domains: ['icons.llama.fi', 'assets.coingecko.com'],
	},
	compiler: {
	  styledComponents: true,
	},
	async headers() {
	  return [
		{
		  source: '/(.*)',
		  headers: [
			{
			  key: 'Access-Control-Allow-Origin',
			  value: '*',
			},
			{
			  key: 'Access-Control-Allow-Methods',
			  value: 'GET',
			},
			{
			  key: 'Access-Control-Allow-Headers',
			  value: 'X-Requested-With, content-type, Authorization',
			},
		  ],
		},
	  ];
	},
	experimental: {},
	env: {
	  NEXT_PUBLIC_1INCH_API_KEY: process.env.NEXT_PUBLIC_1INCH_API_KEY,
	  NEXT_PUBLIC_0X_API_KEY: process.env.NEXT_PUBLIC_0X_API_KEY,
	},
  };
  
  module.exports = withBundleAnalyzer(nextConfig);
  