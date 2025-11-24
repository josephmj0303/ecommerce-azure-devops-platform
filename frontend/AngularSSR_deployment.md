# MarketPro SSR Angular Deployment

This document provides step-by-step instructions for deploying the **MarketPro SSR Angular** project on Alma Linux 9 using **Node.js**, **PM2**, and **Nginx**.

---

## Project Details

- **Project:** MarketPro (SSR Angular)  
- **Server Path:** `/var/www/ecommerce-staging`  
- **Node Version:** v20.19.5  
- **Nginx Version:** 1.20.1  

---

## 1. Clone the Repository

```bash
cd /var/www
git clone <repository-url> ecommerce-staging
cd ecommerce-staging
```
Repository Structure:
```bash
frontend/       → Angular project (browser build, package.json)
frontend-ssr/   → SSR server files (server.mjs, prerendered-routes.json)
public/
README.md
```

2. Install Node Modules

```bash
cd frontend
npm install
```
Installs all dependencies required for Angular build.

3. Build the Angular Application

```bash
npm run build  # Creates dist/marketpro/browser
```
Verify build output:
```bash
cd dist/marketpro/browser
ls -l
```
Expected contents:
```bash
assets/ → images, icons, CSS
media/ → product images, banners
JS/CSS bundles (main.js, styles.css, etc.)
index.html
```

4. Start SSR Server Directly (Optional Test)
```bash
cd ../../frontend-ssr
node server/server.mjs
```
Test SSR server: http://localhost:4000
If working, proceed to PM2 setup.

5. Start SSR Server with PM2

Install PM2 globally:
```bash
npm install -g pm2
```
Start the SSR server:
```bash
cd /var/www/ecommerce-staging/frontend-ssr
pm2 start server/server.mjs --name marketpro-ssr
```
Check status and logs:
```bash
pm2 status
pm2 logs marketpro-ssr --lines 50
```
Enable PM2 to start on reboot:
```bash
pm2 startup
pm2 save
```

6. Configure Nginx to Proxy SSR & Serve Static Assets

Create or edit /etc/nginx/conf.d/jaysltd.conf:
```bash
server {
    listen 443 ssl;
    server_name jaysltd.mtgapps.in;

    # Serve Angular static assets directly
    location /assets/ {
        alias /var/www/ecommerce-staging/frontend/dist/marketpro/browser/assets/;
    }

    location /media/ {
        alias /var/www/ecommerce-staging/frontend/dist/marketpro/browser/media/;
    }

    # Proxy all other requests to SSR Node server
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/jaysltd.mtgapps.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jaysltd.mtgapps.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name jaysltd.mtgapps.in;
    return 301 https://$host$request_uri;
}
```
Test and reload Nginx:
```bash
nginx -t
systemctl reload nginx
```
Verify in browser: https://jaysltd.mtgapps.in

Check static assets:
```bash
https://jaysltd.mtgapps.in/assets/images/logo/logo1.png
https://jaysltd.mtgapps.in/media/images/banner1.jpg
```

7. Debugging & Observations

502 Bad Gateway after reboot:
Fixed by enabling PM2 startup:
```bash
pm2 startup
pm2 save
```
Images not showing:
Fixed by configuring alias in Nginx for /assets/ and /media/.

Placeholder images:
Some images intentionally missing by developer; not a server issue.

8. Verify SSR & Assets
```bash
pm2 status
ss -tulpn | grep 4000
```
Nginx proxies SSR correctly.

Static assets served via Nginx.

9. Maintaining Deployment

Pull updates:
```bash
cd /var/www/ecommerce-staging/frontend
git pull
npm install
npm run build
```
Restart SSR server:
```bash
cd ../frontend-ssr
pm2 restart marketpro-ssr --update-env
```
Reload Nginx if config changed:
```bash
nginx -t
systemctl reload nginx
```
Ensure PM2 auto-start is saved:
```bash
pm2 save
```


✅ Outcome

SSR Angular app runs on Node (PM2)

Nginx proxies traffic and serves static assets

HTTPS works with Let’s Encrypt

Site survives reboots without manual intervention




