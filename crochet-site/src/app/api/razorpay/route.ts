import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
       return NextResponse.json({ error: 'INVALID PAYLOAD' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Calculate total securely against the database
    let secureTotal = 0;
    for (const item of items) {
       const { data: product } = await supabase.from('products').select('price, stock').eq('id', item.id).single();
       if (!product || product.stock < item.quantity) {
           return NextResponse.json({ error: `OBJECT MISSING OR DEPLETED: ${item.id}` }, { status: 400 });
       }
       secureTotal += product.price * item.quantity;
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock mode for local dev if keys are missing
      return NextResponse.json({ orderId: 'mock_order_' + Math.floor(Math.random() * 1000000), verifiedTotal: secureTotal });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: Math.round(secureTotal * 100),
      currency: "USD",
      receipt: "rcpt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id, verifiedTotal: secureTotal });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
