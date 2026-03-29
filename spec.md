# Specification

## Summary
**Goal:** Build a full-stack animated candles e-commerce web app ("Luminary Candles") with an elegant blue/white/pink/violet theme, complete shopping features, loyalty rewards, and an AI chatbot widget.

**Planned changes:**

**Theme & Layout**
- Apply blue, white, pink, and violet color palette with soft gradients, glowing/flicker micro-animations, and refined typography
- Fully responsive layout for mobile (375px), tablet (768px), and desktop (1280px+)

**Authentication**
- Login page with email+password and Google OAuth (UI pattern), animated candle background
- Registration page with name, email, phone number, password, and Google OAuth, animated candle background
- Form validation with inline error messages

**Product Catalog (Backend)**
- Product records: name, description, price (INR), stock quantity, category, photo URLs
- Admin CRUD endpoints for products
- Public paginated product listing/filter endpoint

**Product Listing & Detail Pages**
- Home/listing page with product cards showing photo, name, price, animated candle flame effect, and Add-to-Cart button
- Product detail page with full description, photos, price, stock status, reviews & ratings, Add-to-Cart, and Add-to-Wishlist actions

**Shopping Cart & Checkout**
- Cart page with quantity controls, item removal, and order total calculation
- Checkout page with shipping address form and order summary
- Simulated Stripe payment integration (INR), order confirmation on success

**Wishlist / Favorites**
- Add/remove products to wishlist via heart icon on cards and detail pages
- Wishlist page showing saved products with Move-to-Cart option
- Wishlist persisted per user account

**Loyalty / Rewards Program**
- Award points per completed purchase (1 point per ₹10 spent)
- Rewards page showing point balance, points history, and at least one redemption option (discount coupon)

**AI Chatbot Widget**
- Floating chatbot button visible on all pages
- Chat panel with scripted/rule-based responses for common queries (candle types, orders, delivery)
- Panel styled in blue/white/pink/violet theme

**Customer Care / Support Page**
- Contact form (name, email, subject, message) stored in backend
- FAQ section with at least 5 relevant Q&As
- Business contact details and live chat section with support availability hours
- Accessible from main navigation

**Reviews & Ratings (Backend)**
- Review submission: user ID, product ID, star rating (1–5), text, timestamp
- Only users with a completed purchase can submit a review
- Reviews returned sorted by newest first; average rating computed per product

**User-visible outcome:** Users can browse animated candle product listings, register/log in, add items to cart or wishlist, checkout with Stripe, earn loyalty points, read and write reviews, chat with an AI assistant, and reach customer support — all within a polished, fully responsive romantic candle-themed UI.
