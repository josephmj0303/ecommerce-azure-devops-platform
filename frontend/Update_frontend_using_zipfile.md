Update frontend using zipfile


1️⃣ Prepare the new update

Upload the FE1.zip to the server,

e.g., /var/www/ecommerce-staging/temp_update_FE1/.

Extract it:
```bash
cd /var/www/ecommerce-staging
unzip FE1.zip -d temp_update_FE1
```

Verify the folder structure:
```bash
ls -l temp_update_FE1
```
Check that it contains browser/, server/, prerendered-routes.json, etc.


2️⃣ Backup existing frontend-ssr
Before replacing anything, make a backup:
```bash
cd /var/www/ecommerce-staging
cp -r frontend-ssr frontend-ssr-backup-$(date +%F_%T)
cp -r frontend frontend-backup-$(date +%F_%T)
```
This ensures you can roll back if something goes wrong.


3️⃣ Copy the new files
Use rsync to update the current frontend-ssr safely.

Option A – Merge, keeping existing files not in update:
```bash
rsync -av --progress temp_update_FE1/ frontend-ssr/
```
Option B – Force overwrite everything (replace existing files):
```bash
rsync -av --progress --ignore-times temp_update_FE1/ frontend-ssr/
```
This will copy all files, including images and modified files, and overwrite the old ones.


4️⃣ Check assets (images & media)
Verify that the new images and assets are in the right location:
```bash
ls -l frontend-ssr/browser/assets/images/
ls -l frontend-ssr/browser/media/
```
If some folders like bg, logo, icon, etc., were removed in the update, make sure you have the backup if you need them.


5️⃣ Restart SSR server
After updating files, restart the Node/SSR server via PM2:
```bash
cd /var/www/ecommerce-staging/frontend-ssr
pm2 restart marketpro-ssr
```
Check logs to ensure no errors:
```bash
pm2 logs marketpro-ssr --lines 50
```

6️⃣ Reload Nginx (if needed)
If you didn’t touch Nginx config, a reload is optional, but safe:
```bash
systemctl reload nginx
```


7️⃣ Test website

Open your website and verify pages and images.

Confirm the new changes from the developer appear as expected.

If any images are missing, check the assets/images/ and media/ folders.


