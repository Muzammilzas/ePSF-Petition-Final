# Enhanced Signature Collection

This document provides instructions on how to set up and use the enhanced signature collection features in the petition system.

## Overview

The enhanced signature collection system now captures additional information about signers, including:

- Basic information:
  - First Name
  - Last Name
  - Email
  - Phone
  - Zip Code

- Geolocation data:
  - IP Address
  - City
  - Region/State
  - Country
  - Latitude/Longitude

- Device information:
  - Browser
  - Device Type (Mobile/Desktop)
  - Screen Resolution
  - Language
  - Timezone

## Setup Instructions

### 1. Update Database Schema

Run the SQL script to update the database schema:

1. Log in to the Supabase SQL Editor
2. Copy and paste the contents of `update_signatures_table.sql` into the SQL Editor
3. Run the script

Alternatively, you can use the "Update Database Schema" button in the Admin Dashboard.

### 2. Create Required Functions

To enable all features, you need to create two SQL functions:

#### SQL Execution Function

1. Log in to the Supabase SQL Editor
2. Copy and paste the contents of `create_exec_sql_function.sql` into the SQL Editor
3. Run the script

This enables the "Update Database Schema" button in the Admin Dashboard.

#### Table Columns Function

1. Log in to the Supabase SQL Editor
2. Copy and paste the contents of `create_get_table_columns_function.sql` into the SQL Editor
3. Run the script

This enables dynamic column detection for the signatures table.

### 3. Deploy Updated Components

Ensure the following files are updated and deployed:

- `src/components/SignPetitionForm.tsx` - Collects additional data
- `src/components/AdminDashboard.tsx` - Displays the additional data
- `update_signatures_table.sql` - Updates the database schema
- `create_exec_sql_function.sql` - Creates the SQL execution function
- `create_get_table_columns_function.sql` - Creates the table columns function

## Privacy Considerations

The system now includes a consent checkbox that allows users to opt-in to data collection. Make sure to:

1. Update your privacy policy to reflect the additional data being collected
2. Ensure compliance with relevant privacy regulations (GDPR, CCPA, etc.)
3. Implement data retention policies for sensitive information

## Using the Enhanced Dashboard

The Admin Dashboard now displays:

- Split First Name and Last Name columns
- Location information with tooltips showing detailed location data
- Device information with tooltips showing detailed device data
- Additional sorting options for the new fields
- View button for petitions to access the share page

You can:

- Sort by any of the new fields
- Search across all fields
- View detailed information by hovering over the Location and Device columns
- View petitions by clicking the "View" button, which takes you to the share page

## Analyzing Signature Data

The database now includes a function to analyze signature locations:

```sql
SELECT * FROM get_signature_locations();
```

This will return a list of locations and the number of signatures from each location.

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify that the database schema has been updated correctly
3. Ensure the SQL execution function has been created
4. Confirm that the user has admin privileges

### Common Issues

- **"column signatures.phone does not exist"**: Run the `update_signatures_table.sql` script to add the missing columns
- **Missing columns in the dashboard**: The system now dynamically detects available columns, so it will work even if some columns are missing

For any persistent issues, please contact the system administrator. 