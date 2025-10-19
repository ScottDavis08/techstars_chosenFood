# MVP Tasks - Foodback Loop

## Current Status ✅
- [x] Basic Next.js app structure with TypeScript
- [x] Supabase integration and database schema
- [x] Recipe swiping interface
- [x] Cart management system
- [x] Recipe-inventory matching algorithm
- [x] Initial UI components with shadcn/ui

## Weekend MVP Goals 🎯

### Phase 1: User Preferences & Categories (High Priority)
- [ ] **Create user preferences page** 
  - Household size selection (1-8 people)
  - Dietary restrictions checkboxes (vegetarian, vegan, gluten-free, dairy-free)
  - Point allocation display based on household size
  - Food category preferences (produce, dairy, protein, grains, etc.)

- [ ] **Update database schema**
  - Add `user_preferences` table
  - Add `categories` table for food classification
  - Update `inventory_items` to include category references
  - Add point values to inventory items

- [ ] **Modify app navigation**
  - Convert current 2-tab system to 4-tab system
  - Order: Preferences → Recipes → Inventory → Cart
  - Add proper tab icons and navigation

### Phase 2: Enhanced Recipe Flow (High Priority)  
- [ ] **Filter recipes by preferences**
  - Apply dietary restriction filters to recipe queries
  - Show only recipes matching user's category preferences
  - Display household size-appropriate serving suggestions

- [ ] **Improve recipe matching**
  - Weight match scores by user preferences
  - Show category badges on recipe cards
  - Add "Why this recipe?" explanation (dietary match, ingredient availability)

### Phase 3: Individual Inventory Selection (Medium Priority)
- [ ] **Build inventory browsing page**
  - Category-based filtering (tabs or dropdown)
  - Search functionality for item names
  - Grid/list view toggle
  - Real-time stock quantity display

- [ ] **Add individual item selection**
  - Quantity selector with +/- buttons
  - "Add to Cart" functionality for individual items
  - Point calculation and budget validation
  - Visual feedback for point usage

### Phase 4: Enhanced Cart & Validation (Medium Priority)
- [ ] **Upgrade cart interface**
  - Show both recipe-based and individual items
  - Display total points used vs. allocation
  - Allow removal and quantity adjustment
  - Point validation with warnings/errors

- [ ] **Add checkout confirmation**
  - Final review screen with itemized breakdown
  - Points summary and validation
  - Export functionality to external system
  - Success/confirmation feedback

### Phase 5: Polish & UX (Low Priority - If Time Permits)
- [ ] **Improve visual design**
  - Better loading states and animations
  - Recipe card improvements (better images, ratings display)
  - Category icons and visual hierarchy
  - Mobile responsiveness optimization

- [ ] **Add helpful features**
  - Recipe save/favorite functionality (session-based)
  - Recently viewed recipes
  - Ingredient substitution suggestions
  - Cooking time and difficulty indicators

## Technical Implementation Notes

### Database Changes Needed
```sql
-- Add to migration file
ALTER TABLE inventory_items ADD COLUMN category_id bigint REFERENCES categories(id);
ALTER TABLE inventory_items ADD COLUMN point_value integer DEFAULT 1;
ALTER TABLE recipes ADD COLUMN category_tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE recipes ADD COLUMN dietary_flags jsonb DEFAULT '[]'::jsonb;
```

### Component Structure
```
components/
├── preferences/
│   ├── household-size-selector.tsx
│   ├── dietary-restrictions.tsx
│   └── category-preferences.tsx
├── inventory/
│   ├── category-filter.tsx
│   ├── item-card.tsx
│   └── quantity-selector.tsx
└── cart/
    ├── points-tracker.tsx
    ├── cart-item.tsx
    └── checkout-summary.tsx
```

### Key Functions to Implement
- `filterRecipesByPreferences(recipes, preferences)`
- `calculateCartPoints(cartItems, inventoryItems)`
- `validatePointAllocation(cartTotal, userAllocation)`
- `exportCartToExternalSystem(cartData)`

## Success Criteria
1. **User can set preferences** and see them reflected in recipe recommendations
2. **Recipe filtering works** based on dietary restrictions and category preferences
3. **Inventory page allows** individual item selection with point tracking
4. **Cart validates** point allocation and shows clear breakdown
5. **Export functionality** works with external food bank system
6. **Mobile-friendly** experience for food bank customers

## Risk Mitigation
- **Database changes**: Test migrations thoroughly before deployment
- **Complex state management**: Use React Context if prop drilling becomes unwieldy
- **Performance**: Implement pagination for large recipe/inventory lists
- **User experience**: Add loading states and error handling for all async operations

## Post-MVP Considerations
- User account system for preference persistence
- Recipe rating and review system
- Nutrition information integration
- Multi-language support
- Admin dashboard for food bank staff