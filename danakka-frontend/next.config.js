/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
	async rewrites() {
		return [
			{
				source: "/:path*",
				destination: "http://newsoft.kr:8500/:path*",
			},
		];
	},
}
