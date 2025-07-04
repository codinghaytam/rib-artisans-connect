# RIB Artisans Connect - Database Schema

This document describes the comprehensive database schema for the RIB Artisans Connect platform.

## Overview

The database is designed to support a full-featured artisan marketplace with the following core functionalities:

- User management (clients and artisans)
- Project posting and management
- Proposal system
- Review and rating system
- Messaging system
- Notifications
- Analytics and tracking

## Database Tables

### Core Tables

#### `profiles`
Base user profiles table that extends Supabase auth.users
- Stores basic user information for both clients and artisans
- Links to auth.users via foreign key
- Includes role-based access (client/artisan)

#### `categories`
Service categories for artisans
- Pre-populated with common Moroccan artisan categories
- Includes icons and emojis for UI display
- Supports hierarchical categorization

#### `cities`
Moroccan cities for location-based services
- Pre-populated with major Moroccan cities
- Includes regional information
- Supports location-based search and filtering

### Artisan System

#### `artisan_profiles`
Extended profiles for artisans
- Links to base profiles table
- Stores business information, specialties, certifications
- Includes rating system, portfolio images
- Supports verification system
- Featured listing capabilities

#### `artisan_views`
Analytics for artisan profile views
- Tracks who viewed which artisan profile
- Includes IP and user agent for analytics
- Supports anonymous and authenticated views

### Project System

#### `projects`
Client project postings
- Comprehensive project information
- Budget ranges, location, urgency levels
- Status tracking (draft → published → assigned → completed)
- Image attachments support
- Geolocation support

#### `proposals`
Artisan proposals for projects
- Links artisans to specific projects
- Detailed pricing and timeline estimates
- Status tracking (pending → accepted/rejected)
- Featured proposal capabilities

#### `project_views`
Analytics for project views
- Similar to artisan_views but for projects
- Helps track project engagement

### Communication System

#### `messages`
Direct messaging between users
- Conversation-based messaging
- Support for different message types (text, image, document)
- Read status tracking
- Project-related messaging

#### `notifications`
System notifications
- Multiple notification types (proposal, project, review, etc.)
- Read status tracking
- Action URLs for deep linking

### Review System

#### `reviews`
Comprehensive review system
- Overall rating plus detailed ratings (quality, communication, timeliness)
- Written reviews with titles and comments
- Verification system for authentic reviews
- Featured review capabilities

### Additional Features

#### `favorites`
Client favorites for artisans
- Allows clients to save preferred artisans
- Simple many-to-many relationship

#### `contact_messages`
Contact form submissions
- Handles general inquiries and support requests
- Admin management system
- Status tracking

#### `admin_settings`
Platform configuration
- JSON-based flexible configuration system
- Commission rates, pricing, feature flags
- Maintenance mode support

## Security (Row Level Security)

All tables implement Row Level Security (RLS) policies:

### Public Access
- `categories` and `cities` are publicly readable
- Published `projects` and `artisan_profiles` are publicly viewable
- `reviews` are publicly readable

### User-Based Access
- Users can only manage their own `profiles`
- Artisans can only manage their own `artisan_profiles`
- Clients can only manage their own `projects`
- Users can only view/manage their own `messages` and `notifications`

### Role-Based Access
- Only artisans can create `proposals`
- Only users involved in completed projects can create `reviews`
- Admin-only access to `admin_settings`

## Triggers and Functions

### Automated Updates
- `updated_at` timestamp triggers on relevant tables
- Artisan rating calculations when reviews are added
- Project proposal counts when proposals are created
- Notification creation for important events (new proposals, etc.)

### Data Integrity
- Foreign key constraints ensure data consistency
- Check constraints for valid enum values (status, urgency, etc.)
- Unique constraints prevent duplicate relationships

## Indexes

Performance indexes are created for:
- Foreign key relationships
- Commonly queried fields (rating, status, created_at)
- Search and filtering fields
- Analytics queries

## Migration Usage

To apply the database schema:

1. Ensure you have Supabase CLI installed
2. Run the migration:
   ```bash
   supabase db reset
   ```
   or
   ```bash
   supabase migration up
   ```

The migration will:
- Create all tables with proper relationships
- Set up Row Level Security policies
- Create indexes for performance
- Insert seed data for categories and cities
- Set up triggers and functions

## Default Data

The migration includes seed data for:

### Categories
- Maçonnerie, Plomberie, Peinture, Électricité
- Menuiserie, Carrelage, Couture, Ferronnerie
- Jardinage, Nettoyage

### Cities
- All major Moroccan cities with regional information
- Casablanca, Rabat, Fès, Marrakech, Agadir, etc.

### Admin Settings
- Default commission rates
- Featured listing pricing
- Platform configuration defaults

## TypeScript Integration

The schema is fully typed with the generated `types.ts` file, providing:
- Type-safe database operations
- IntelliSense support in IDEs
- Compile-time error checking
- Auto-completion for table and column names

## Scalability Considerations

The schema is designed to handle growth:
- Efficient indexing for common queries
- Normalized data structure to prevent redundancy
- Analytics tables for performance tracking
- Flexible JSON fields for future feature additions
- Proper foreign key relationships for data integrity

## Future Enhancements

The schema supports future features like:
- Multi-language support (already has language arrays)
- Advanced scheduling (availability_schedule JSON field)
- Geolocation services (latitude/longitude fields)
- File attachments (arrays for multiple files)
- Advanced analytics (view tracking tables)
- Admin management system (admin_settings table)
