-- Create the orders table for Build-A-Meal application
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    meal VARCHAR NOT NULL,
    meal_name VARCHAR NOT NULL,
    spices TEXT[],
    spice_names TEXT[],
    ingredients JSONB,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations" ON orders
    FOR ALL USING (true);

-- Insert some sample data
INSERT INTO orders (meal, meal_name, spices, spice_names, ingredients, status) VALUES
('jollof-rice', 'Jollof Rice', ARRAY['curry-blend', 'garlic-herb'], ARRAY['Curry Blend', 'Garlic & Herb'], 
 '[{"name": "Rice", "description": "Long grain parboiled rice"}, {"name": "Tomatoes", "description": "Fresh ripe tomatoes"}]', 'pending'),
('shawarma', 'Shawarma', ARRAY['lemon-pepper'], ARRAY['Lemon Pepper'], 
 '[{"name": "Chicken Breast", "description": "Marinated chicken breast"}, {"name": "Pita Bread", "description": "Fresh pita bread"}]', 'completed');

-- Grant necessary permissions
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO authenticated; 