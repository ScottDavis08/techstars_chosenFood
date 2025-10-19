# Food Bank Recipe Matcher - Architecture

## Overview
A Next.js application that helps food bank customers discover recipes based on available inventory and their dietary preferences, with a points-based allocation system for fair distribution.

## System Architecture

### Frontend (Next.js 14 + TypeScript)
- **App Router**: File-based routing with layout support
- **UI Components**: shadcn/ui component library with Tailwind CSS
- **State Management**: React hooks for local state, Supabase for data persistence
- **Authentication**: Session-based (no accounts required for MVP)

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **API**: Auto-generated REST API and real-time subscriptions
- **Storage**: Supabase storage for recipe images (future enhancement)

### Database Schema
Based on `supabase/migrations/20251018184405_initial_schema.sql`:

#### Core Tables
- **`recipes`**: Recipe storage with ingredients and directions as JSONB
- **`inventory_items`**: Current food bank stock with quantities
- **`recipe_swipes`**: User recipe interactions (like/dislike) with match scores
- **`cart_recipes`**: Selected recipes with serving adjustments

#### Planned Extensions
- **`user_preferences`**: Dietary restrictions, household size, point allocation
- **`categories`**: Food categories for filtering (produce, dairy, protein, etc.)
- **`recipe_categories`**: Many-to-many relationship for recipe classification

## Application Flow

### 1. User Preferences (New)
- Household size selection
- Dietary restrictions (vegetarian, gluten-free, etc.)
- Point allocation display
- Category preferences

### 2. Recipe Discovery
- Swipe interface for recipe matching
- Filtered by preferences and available inventory
- Match score based on ingredient availability

### 3. Inventory Selection (New)
- Browse all available items by category
- Add individual items to cart
- Real-time stock quantity display

### 4. Cart & Checkout (Enhanced)
- Review selected recipes and individual items
- Point allocation validation
- Quantity adjustments within limits
- Export to external food bank system

## Key Features

### Session Management
- UUID-based sessions (no user accounts)
- Temporary preference storage
- Cart persistence during session

### Recipe Matching Algorithm
- Ingredient availability scoring
- Preference-based filtering
- Category-based recommendations

### Points System
- Household-based point allocation
- Item point values
- Budget constraint validation

## Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, REST API)
- **State Management**: React hooks, Supabase client
- **Deployment**: Vercel (recommended for Next.js)

## File Structure
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx               # Main app with tab navigation
├── preferences/
│   └── page.tsx           # User preferences form
└── api/                   # API routes (if needed)

components/
├── ui/                    # shadcn/ui components
├── swipe-interface.tsx    # Recipe swiping interface
├── cart-interface.tsx     # Shopping cart management
├── inventory-item.tsx     # Individual inventory items
└── preference-form.tsx    # User preference collection

lib/
├── supabase.ts           # Database client and types
├── recipe-matcher.ts     # Recipe matching algorithm
└── cart-adapter.ts       # External system integration
```

## Security Considerations
- RLS policies for data isolation
- Session-based access control
- No sensitive user data storage
- Anonymous usage supported

## Performance Optimizations
- Database indexes on frequently queried fields
- JSONB for flexible ingredient storage
- Client-side state management for UI responsiveness
- Optimistic updates for better UX