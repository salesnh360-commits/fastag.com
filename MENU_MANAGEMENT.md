# Dynamic Menu Management System

## Overview
The menu system has been updated to be fully dynamic. Admin users can now add, edit, and manage all menu items through the admin panel. Static menus have been removed.

## Changes Made

### 1. Header Component (`components/saas/Header.tsx`)
- **Removed**: Static `defaultNav` array with hardcoded menu items
- **Updated**: Menu state now initializes as an empty array `[]`
- **Updated**: Removed fallback to static menu when database menu is empty
- **Result**: The header will only display menus that have been added by the admin through the database

### 2. How It Works

#### For Admin Users:
1. Navigate to `/admin` (redirects to `/admin/dashboard`)
2. Click on the **"Menus"** tab in the Operations section
3. Use the Menu Manager interface to:
   - Set the menu slug (default: "main")
   - Add menu items with:
     - Label (display text)
     - Href (URL/path)
     - Target (optional, e.g., "_blank" for new tab)
     - Active status (show/hide)
   - Create nested submenus (up to 3 levels deep)
   - Reorder items using Up/Down buttons
   - Delete items as needed
4. Click **"Save Menu"** to persist changes

#### Menu Structure:
- **Slug**: Identifier for the menu (e.g., "main", "footer")
- **Items**: Can have parent-child relationships
  - Top-level items appear in the main navigation
  - Child items appear in dropdown menus
  - Supports up to 3 levels of nesting

#### Environment Variables:
- `NEXT_PUBLIC_MENU_SLUG`: Defines which menu to load (default: "main")
- `NEXT_PUBLIC_MENU_SUB_BUYFASTAG`: Optional submenu for "Buy FASTag" item

### 3. Database Tables

The system uses two tables:

**`menus` table:**
- `id`: Auto-increment primary key
- `slug`: Unique identifier (e.g., "main")
- `name`: Display name for the menu
- `created_at`, `updated_at`: Timestamps

**`menu_items` table:**
- `id`: Auto-increment primary key
- `menu_id`: Foreign key to menus table
- `label`: Display text
- `href`: URL/path
- `target`: Optional (e.g., "_blank")
- `sort_order`: Display order
- `parent_id`: For nested menus (null for top-level)
- `active`: Boolean (1=visible, 0=hidden)
- `created_at`, `updated_at`: Timestamps

### 4. API Endpoints

**GET `/api/menus?slug=main`**
- Fetches menu and its items by slug
- Returns hierarchical structure with parent-child relationships

**POST `/api/menus`**
- Saves/updates menu and all its items
- Requires admin authentication
- Replaces all existing items for the menu

**DELETE `/api/menus`**
- Deletes a menu by slug
- Requires admin authentication

## Getting Started

### Initial Setup:
1. Log in as an admin user
2. Go to `/admin/dashboard`
3. Click the "Menus" tab
4. Start adding your menu items:
   - Home page: Label="Home", Href="/"
   - Products: Label="Products", Href="/products"
   - Contact: Label="Contact Us", Href="/contact"
   - etc.

### Example Menu Structure:
```
Home (/)
Buy FASTag (/#buy)
  ├─ Paytm FASTag (/buy/paytm)
  ├─ ICICI FASTag (/buy/icici)
  └─ HDFC FASTag (/buy/hdfc)
Recharge (/#recharge)
Support (/support)
  ├─ KYC Update (/support/kyc-update)
  ├─ Blacklist Removal (/support/blacklist-removal)
  └─ Tag Replacement (/support/tag-replacement)
Products (/products)
Locations (/locations)
Blog (/#blog)
Contact (/contact)
```

## Benefits

1. **Full Control**: Admin can modify navigation without code changes
2. **No Deployments**: Menu changes are instant
3. **Flexible**: Support for multi-level nested menus
4. **Active/Inactive**: Hide items without deleting them
5. **Reorderable**: Easy drag-and-drop style reordering
6. **Multiple Menus**: Support for different menus (header, footer, etc.)

## Notes

- The header will be empty until you add menu items through the admin panel
- Make sure to set items as "Active" for them to appear
- Use the sort order or Up/Down buttons to control the display order
- Changes take effect immediately after saving
