module.exports = {
  apps: [
    {
      name: "logistics-frontend",
      script: "dist/logistics-frontend/server/server.mjs",
      exec_mode: "cluster",
      instances: "max",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};