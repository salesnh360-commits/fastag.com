# Setting Up Product Links in Menu

## Understanding Your Product URL Structure

Your application has the following product-related URLs:

### 1. **Products List Page**
- **URL**: `/products`
- **What it shows**: All available FASTag products from the database
- **Use in menu**: Link to browse all products

### 2. **Individual Product Pages**
- **URL**: `/product/{id}` (e.g., `/product/1`, `/product/2`)
- **What it shows**: Detailed view of a specific product
- **Use in menu**: Link to specific products

### 3. **Shop Page** (Alternative)
- **URL**: `/shop`
- **What it shows**: Shop interface with categories and filters
- **Use in menu**: Alternative shopping experience

## How to Add Product Links to Your Menu

### Option 1: Link to All Products Page
In the admin menu manager, add:
- **Label**: `Products` or `All Products`
- **Href**: `/products`
- **Target**: (leave empty)

### Option 2: Link to Specific Products
To link to a specific product, you need to know its ID from the database:

1. Go to `/admin/dashboard`
2. Click on the **"Products"** tab to see all products and their IDs
3. In the menu manager, add:
   - **Label**: `Paytm FASTag` (or product name)
   - **Href**: `/product/1` (replace `1` with actual product ID)
   - **Target**: (leave empty)

### Option 3: Create a Products Menu with Submenus
Create a hierarchical menu structure:

**Main Menu Item:**
- **Label**: `Products`
- **Href**: `/products`

**Add Sub-items** (click "Add Sub" button):
- **Label**: `Paytm FASTag`
- **Href**: `/product/1`

- **Label**: `ICICI FASTag`
- **Href**: `/product/2`

- **Label**: `HDFC FASTag`
- **Href**: `/product/3`

## Getting Product IDs

### Method 1: From Admin Dashboard
1. Navigate to `/admin/dashboard`
2. Click the **"Products"** tab
3. You'll see a table with all products and their IDs

### Method 2: From Database API
Products are stored in the database and can be accessed via:
- **API Endpoint**: `/api/products`
- **Returns**: List of all products with their IDs

### Method 3: Check the Products Page
1. Go to `/products` on your site
2. Click on any product
3. Look at the URL - it will be `/product/{id}`
4. The number at the end is the product ID

## URL Structure for Different Environments

### Development (localhost)
- Products page: `http://localhost:3000/products`
- Specific product: `http://localhost:3000/product/1`

### Production (your actual domain)
- Products page: `https://yourdomain.com/products`
- Specific product: `https://yourdomain.com/product/1`

**Important**: In your menu, use **relative URLs** (without the domain):
- ✅ Correct: `/products` or `/product/1`
- ❌ Wrong: `http://localhost:3000/products`
- ❌ Wrong: `https://yourdomain.com/products`

Using relative URLs ensures your menu works on both localhost and production!

## Example Menu Setup

Here's a complete example of a menu with products:

```
Home (/)
Products (/products)
  ├─ Paytm FASTag (/product/1)
  ├─ ICICI FASTag (/product/2)
  ├─ HDFC FASTag (/product/3)
  └─ View All (/products)
Buy FASTag (/#buy)
Recharge (/#recharge)
Support (/support)
Contact (/contact)
```

## Step-by-Step: Adding Products to Menu

1. **Log in to Admin Panel**
   - Go to `/admin/dashboard`

2. **Check Your Products**
   - Click the **"Products"** tab
   - Note down the product IDs you want to link

3. **Go to Menu Manager**
   - Click the **"Menus"** tab
   - Slug should be `main` (or your menu slug)

4. **Add Main Products Link**
   - Label: `Products`
   - Href: `/products`
   - Click **"Add"**

5. **Add Specific Product Links** (Optional)
   - Click **"Add Sub"** on the Products item
   - For each product:
     - Label: Product name (e.g., `Paytm FASTag`)
     - Href: `/product/{id}` (e.g., `/product/1`)

6. **Save Menu**
   - Click **"Save Menu"** button
   - Changes will appear immediately on your site

## Common Mistakes to Avoid

1. ❌ **Using absolute URLs with localhost**
   - Don't use: `http://localhost:3000/products`
   - Use: `/products`

2. ❌ **Wrong product ID**
   - Make sure the product ID exists in your database
   - Check the Products tab in admin to verify IDs

3. ❌ **Forgetting the slash**
   - Don't use: `products` or `product/1`
   - Use: `/products` or `/product/1`

4. ❌ **Using hash links for products**
   - Don't use: `/#products`
   - Use: `/products`

## Testing Your Links

After adding product links to your menu:

1. **On Localhost**:
   - Click the menu link
   - Should navigate to `http://localhost:3000/products`

2. **On Production**:
   - Click the menu link
   - Should navigate to `https://yourdomain.com/products`

Both should work because you're using relative URLs!

## Dynamic Product Menu (Advanced)

If you want the menu to automatically update when products change, you would need to:
1. Create a custom component that fetches products
2. Generate menu items dynamically
3. This is more complex and requires code changes

For now, manually adding product links in the admin panel is the recommended approach.
