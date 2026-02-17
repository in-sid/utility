
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* 
     Enable static export for GitHub Pages.
     This generates a standalone 'out' folder with HTML/CSS/JS.
  */
  output: 'export',
  
  /* 
     GitHub Pages doesn't handle clean URLs well. 
     This ensures /about becomes /about/index.html 
  */
  trailingSlash: true,

  /* Image optimization must be disabled for static exports */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
