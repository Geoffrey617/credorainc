# Reviews Table Setup for Supabase

## Create Reviews Table

**In your Supabase dashboard:**

1. **Go to Database** → **Tables**
2. **Click "New Table"**
3. **Table name:** `reviews`
4. **Add these columns:**

| Column Name | Data Type | Settings |
|-------------|-----------|----------|
| `id` | `bigint` | Primary Key, Auto-increment |
| `created_at` | `timestamptz` | Default: now() |
| `apartment_id` | `bigint` | Foreign Key to apartments.id |
| `reviewer_name` | `text` | Required |
| `reviewer_email` | `text` | Required |
| `rating` | `integer` | Required (1-5) |
| `title` | `text` | Required |
| `comment` | `text` | Required |
| `verified_tenant` | `boolean` | Default: false |
| `helpful_count` | `integer` | Default: 0 |
| `move_in_date` | `date` | Optional |
| `lease_duration` | `text` | Optional |
| `would_recommend` | `boolean` | Default: true |

## Create RLS Policy for Reviews

**In Authentication → Policies:**

1. **Create Policy:** `reviews_policy`
2. **Table:** `reviews`
3. **Operation:** `ALL`
4. **Target roles:** `public`
5. **USING expression:** `true`
6. **WITH CHECK expression:** `true`

## SQL Commands (Alternative)

If you prefer SQL, run these in the SQL Editor:

```sql
-- Create reviews table
CREATE TABLE reviews (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  apartment_id bigint REFERENCES apartments(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  reviewer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  verified_tenant boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  move_in_date date,
  lease_duration text,
  would_recommend boolean DEFAULT true
);

-- Create RLS policy
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to reviews" ON reviews
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

**Let me know when you've created the reviews table and I'll continue with the API routes and UI!**
