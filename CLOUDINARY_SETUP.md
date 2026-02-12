# Cloudinary Setup Guide for FASTag Product Images

## Why Cloudinary?

✅ **Free tier**: 25GB storage, 25GB bandwidth/month  
✅ **Fast CDN**: Images load quickly worldwide  
✅ **Reliable**: 99.9% uptime  
✅ **Image optimization**: Automatic format conversion and compression  
✅ **Easy to use**: Simple upload interface and API  

## Step 1: Create a Cloudinary Account

1. **Go to** https://cloudinary.com
2. **Click** "Sign Up Free"
3. **Fill in** your details:
   - Email
   - Password
   - Choose a cloud name (e.g., "nh360fastag" or "fastag-products")
4. **Verify** your email
5. **Log in** to your dashboard

## Step 2: Get Your Credentials

After logging in, you'll see your dashboard:

1. **Click** on the "Dashboard" tab (top left)
2. **Find** your credentials in the "Account Details" section:
   - **Cloud Name**: (e.g., "nh360fastag")
   - **API Key**: (e.g., "123456789012345")
   - **API Secret**: (click "Reveal" to see it)

## Step 3: Update Your .env File

Open your `.env` file and replace the placeholder values:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
CLOUDINARY_UPLOAD_PRESET=fastag_products
```

**Example:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nh360fastag
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
CLOUDINARY_UPLOAD_PRESET=fastag_products
```

## Step 4: Create an Upload Preset

An upload preset allows unsigned uploads from your admin panel.

1. **Go to** Settings → Upload (in Cloudinary dashboard)
2. **Scroll down** to "Upload presets"
3. **Click** "Add upload preset"
4. **Configure**:
   - **Preset name**: `fastag_products`
   - **Signing Mode**: "Unsigned" (important!)
   - **Folder**: `products` (optional, helps organize)
   - **Access Mode**: "Public"
5. **Click** "Save"

## Step 5: Upload Your Product Images

### Option A: Upload via Cloudinary Dashboard (Recommended for Bulk Upload)

1. **Go to** Media Library in Cloudinary dashboard
2. **Click** "Upload" button (top right)
3. **Select** all your product images
4. **Wait** for upload to complete
5. **Copy** the image URLs

### Option B: Upload via URL

For each image:
1. **Click** on the uploaded image
2. **Copy** the "Secure URL" (looks like: `https://res.cloudinary.com/nh360fastag/image/upload/v1234567890/sample.jpg`)

## Step 6: Update Your Database

You need to update the `image_url` field in your `products` table with the new Cloudinary URLs.

### Method 1: Update via Admin Panel

1. Go to `/admin/dashboard`
2. Click "Products" tab
3. For each product:
   - Click "Edit"
   - Paste the new Cloudinary URL in the image field
   - Save

### Method 2: Update via SQL (Faster for Multiple Products)

```sql
-- Example: Update product ID 1
UPDATE products 
SET image_url = 'https://res.cloudinary.com/nh360fastag/image/upload/v1234567890/paytm-fastag.jpg'
WHERE id = 1;

-- Example: Update product ID 2
UPDATE products 
SET image_url = 'https://res.cloudinary.com/nh360fastag/image/upload/v1234567890/icici-fastag.jpg'
WHERE id = 2;

-- Repeat for all products
```

## Step 7: Test Your Images

1. **Restart** your development server:
   ```bash
   npm run dev
   ```

2. **Visit** http://localhost:3000/products

3. **Check** if images load properly

4. **Verify** in browser DevTools:
   - Press F12 → Network tab
   - Refresh page
   - Look for image requests
   - Should see `res.cloudinary.com` URLs

## Cloudinary URL Format

Cloudinary URLs look like this:

```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
```

**Example:**
```
https://res.cloudinary.com/nh360fastag/image/upload/v1707734400/products/paytm-fastag.jpg
```

### With Transformations (Optional)

You can add transformations to optimize images:

```
https://res.cloudinary.com/nh360fastag/image/upload/w_500,h_380,c_fill,q_auto,f_auto/products/paytm-fastag.jpg
```

Transformations:
- `w_500` - Width 500px
- `h_380` - Height 380px
- `c_fill` - Crop to fill
- `q_auto` - Auto quality
- `f_auto` - Auto format (WebP for supported browsers)

## Organizing Your Images

### Folder Structure in Cloudinary

Create folders to organize your images:

```
products/
  ├── paytm/
  │   └── paytm-fastag.jpg
  ├── icici/
  │   └── icici-fastag.jpg
  ├── hdfc/
  │   └── hdfc-fastag.jpg
  └── ...
```

### Naming Convention

Use consistent naming:
- `{bank}-{vehicle-class}.jpg`
- Example: `paytm-class4.jpg`, `icici-class7.jpg`

## Migrating from Google Drive

### Step-by-Step Migration

1. **Download** all images from Google Drive to your computer

2. **Rename** images with consistent naming (e.g., `paytm-class4.jpg`)

3. **Upload** to Cloudinary:
   - Via dashboard (drag and drop)
   - Or use Cloudinary's upload widget

4. **Get** the new URLs for each image

5. **Create** a mapping file (Excel/CSV):
   ```
   Product ID | Old Google Drive URL | New Cloudinary URL
   1          | https://drive.google.com/... | https://res.cloudinary.com/...
   2          | https://drive.google.com/... | https://res.cloudinary.com/...
   ```

6. **Update** database using SQL:
   ```sql
   UPDATE products SET image_url = 'new_cloudinary_url' WHERE id = 1;
   ```

## Troubleshooting

### Images Not Loading?

**Check 1: Verify .env variables**
```bash
# Make sure these are set correctly
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Check 2: Check Next.js config**
```javascript
// next.config.mjs should have:
domains: ['res.cloudinary.com']
```

**Check 3: Restart dev server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Check 4: Check image URLs in database**
- URLs should start with `https://res.cloudinary.com/`
- No typos in cloud name

### Upload Preset Not Working?

1. Make sure signing mode is "Unsigned"
2. Preset name matches exactly: `fastag_products`
3. Access mode is "Public"

### Images Load Slowly?

Use Cloudinary transformations:
```
https://res.cloudinary.com/nh360fastag/image/upload/w_500,q_auto,f_auto/products/image.jpg
```

## Best Practices

### 1. Use Transformations

Instead of storing:
```
https://res.cloudinary.com/nh360fastag/image/upload/products/image.jpg
```

Use:
```
https://res.cloudinary.com/nh360fastag/image/upload/w_500,h_380,c_fill,q_auto,f_auto/products/image.jpg
```

### 2. Optimize for Web

- **Format**: Use `f_auto` for automatic format selection (WebP, AVIF)
- **Quality**: Use `q_auto` for automatic quality optimization
- **Size**: Specify exact dimensions needed

### 3. Use Folders

Organize images in folders:
- `/products/` - Product images
- `/banners/` - Banner images
- `/logos/` - Logo images

### 4. Backup

- Keep original images on your computer
- Cloudinary is reliable, but always have backups

## Cost Considerations

### Free Tier Limits:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

### Typical Usage:
- **Average image size**: 100-200 KB
- **Products**: 50 products = ~10 MB
- **Monthly views**: 10,000 views = ~1-2 GB bandwidth

**You'll likely stay within the free tier!**

### If You Exceed Free Tier:
- **Paid plans** start at $99/month
- **Or** optimize images more aggressively
- **Or** use multiple Cloudinary accounts

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Get credentials and update .env
3. ✅ Create upload preset
4. ✅ Upload product images
5. ✅ Update database with new URLs
6. ✅ Test on localhost
7. ✅ Deploy to production
8. ✅ Verify images load on live site

## Summary

**Before (Google Drive):**
- ❌ Slow loading
- ❌ Permission issues
- ❌ Not reliable
- ❌ No optimization

**After (Cloudinary):**
- ✅ Fast CDN delivery
- ✅ Always accessible
- ✅ 99.9% uptime
- ✅ Auto optimization
- ✅ Free tier sufficient

---

**Need Help?**
- Cloudinary Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com

**Your images will load perfectly on both localhost and production! 🚀**
