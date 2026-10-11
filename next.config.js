/** @type {import('next').NextConfig} */
module.exports = {
  images: { domains: ["res.cloudinary.com"] },
  experimental: { serverActions: { bodySizeLimit: "20mb" } },
};
