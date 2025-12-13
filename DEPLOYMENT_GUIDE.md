# Deployment Guide - Fixing "Not Found" on Refresh

## Problem
When refreshing the page or navigating back, you get a "Not Found" error. This happens because the server doesn't know how to handle client-side routes.

## Solution by Server Type

### ✅ Apache Server (Most Common)
The `.htaccess` file is already included in your `dist` folder. Make sure:
1. **mod_rewrite is enabled** on your server
2. **AllowOverride is set to All** in your Apache configuration
3. The `.htaccess` file is in the root of your deployed directory

If it still doesn't work, contact your hosting provider to:
- Enable `mod_rewrite` module
- Set `AllowOverride All` for your directory

### ✅ Netlify
The `_redirects` file is already included. Netlify will automatically use it.

### ✅ Vercel
Your `vercel.json` is already configured correctly. No additional steps needed.

### ✅ IIS (Windows Server)
The `web.config` file is already included. Make sure:
- URL Rewrite module is installed on IIS
- The `web.config` file is in the root of your deployed directory

### ✅ Nginx
Use the `nginx.conf` file as a reference. Add this to your Nginx server block:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Deployment Checklist

1. ✅ Build the project: `npm run build`
2. ✅ Upload the entire `dist` folder to your server
3. ✅ Ensure the configuration file for your server type is in the root of `dist`
4. ✅ Verify the file is actually on the server (check via FTP/cPanel)
5. ✅ Test by refreshing a route like `/dashboard` or `/login`

## Common Issues

### Issue: `.htaccess` not working
**Solution**: 
- Check if `mod_rewrite` is enabled: Create a `phpinfo.php` file and check for `mod_rewrite`
- Check server error logs
- Try the alternative `.htaccess` configuration below

### Issue: App is in a subdirectory
If your app is deployed to `https://example.com/myapp/`, update `.htaccess`:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /myapp/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Issue: Still getting 404
**Alternative `.htaccess` configuration** (try this if the current one doesn't work):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Testing

After deployment, test these scenarios:
1. Navigate to `/login` - should work
2. Refresh the page on `/login` - should still work (not 404)
3. Navigate to `/dashboard` - should work
4. Refresh the page on `/dashboard` - should still work (not 404)
5. Use browser back button - should work

## Still Having Issues?

1. **Check server logs** - Look for errors related to mod_rewrite or routing
2. **Verify file permissions** - `.htaccess` should be readable (644 permissions)
3. **Contact hosting support** - Ask them to verify mod_rewrite is enabled
4. **Try HashRouter** - As a last resort, you can switch to HashRouter (URLs will have `#` in them)

