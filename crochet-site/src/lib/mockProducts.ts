export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cozy Strawberry Cow",
    description: "A squishy, handmade strawberry cow plushie made from chenille blanket yarn. Super soft and cuddly!",
    price: 35.00,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1620077839352-731336c535cc?w=800&q=80"
  },
  {
    id: "2",
    name: "Pastel Frog Bucket Hat",
    description: "Keep the sun out while keeping it cute. Mint green bucket hat with little frog eyes sticking out on top.",
    price: 40.00,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1627916568853-34e8d3cbfa20?w=800&q=80"
  },
  {
    id: "3",
    name: "Chunky Bee Amigurumi",
    description: "The classic crochet bumblebee! Super soft and perfect for hugging during cozy movie nights.",
    price: 25.00,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1615783321584-60dd65f8f537?w=800&q=80"
  },
  {
    id: "4",
    name: "Sunflower Granny Square Bag",
    description: "A durable, bright, and incredibly stylish tote bag constructed from vibrant sunflower granny squares.",
    price: 55.00,
    stock: 2,
    image_url: "https://images.unsplash.com/photo-1598532213005-5603ca85aabc?w=800&q=80"
  }
];
