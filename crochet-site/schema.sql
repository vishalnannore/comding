-- DDL SCHEMA FOR COZY/CROCHET
-- Apply this entirely in your Supabase SQL Editor

-- 1. Create the `products` table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  stock integer not null default 0,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: We are allowing anon access for reading products globally
alter table public.products enable row level security;
create policy "Allow public read access on products" 
  on public.products for select using (true);
create policy "Allow ALL for authenticated admins on products" 
  on public.products for all using (auth.role() = 'authenticated');

-- Insert initial dummy data into the database so the frontend doesn't break
insert into public.products (id, name, description, price, stock, image_url)
values 
  ('123e4567-e89b-12d3-a456-426614174001', 'Cozy Strawberry Cow', 'A squishy, handmade strawberry cow plushie made from chenille blanket yarn. Super soft and cuddly!', 35.00, 5, 'https://images.unsplash.com/photo-1620077839352-731336c535cc?w=800&q=80'),
  ('123e4567-e89b-12d3-a456-426614174002', 'Pastel Frog Bucket Hat', 'Keep the sun out while keeping it cute. Mint green bucket hat with little frog eyes sticking out on top.', 40.00, 12, 'https://images.unsplash.com/photo-1627916568853-34e8d3cbfa20?w=800&q=80'),
  ('123e4567-e89b-12d3-a456-426614174003', 'Chunky Bee Amigurumi', 'The classic crochet bumblebee! Super soft and perfect for hugging during cozy movie nights.', 25.00, 20, 'https://images.unsplash.com/photo-1615783321584-60dd65f8f537?w=800&q=80'),
  ('123e4567-e89b-12d3-a456-426614174004', 'Sunflower Granny Square Bag', 'A durable, bright, and incredibly stylish tote bag constructed from vibrant sunflower granny squares.', 55.00, 2, 'https://images.unsplash.com/photo-1598532213005-5603ca85aabc?w=800&q=80');

-- 2. Create the `custom_orders` table
create table public.custom_orders (
  id uuid default gen_random_uuid() primary key,
  size text not null,
  color_hex text not null,
  details text not null,
  status text not null default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Anyone can insert custom orders, but only admins can read all of them
alter table public.custom_orders enable row level security;
create policy "Allow public insert on custom_orders" 
  on public.custom_orders for insert with check (true);
create policy "Allow ALL for authenticated admins on custom_orders" 
  on public.custom_orders for all using (auth.role() = 'authenticated');
