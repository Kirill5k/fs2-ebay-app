import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api--core--j6xvqz9kpswd.code.run/api/:path*',
      },
    ]
  },
}

export default nextConfig
