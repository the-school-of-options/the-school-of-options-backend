module.exports = {
  apps: [
    {
      name: "the-school-of-options-backend",
      script: "dist/server.js",
      env: { NODE_ENV: "production", PORT: 8000 }
    }
  ],
  deploy: {
    production: {
      // CHANGE THESE:
      user: "ubuntu",
      host: "3.109.71.187",
      ref: "origin/main",
      repo: "git@github.com:the-school-of-options/the-school-of-options-backend.git",
      path: "/home/ubuntu/apps/the-school-of-options-backend",  
      'post-deploy': 'npm install --production && npm run build && pm2 startOrReload ecosystem.config.js --env production'
    }
  }
}
