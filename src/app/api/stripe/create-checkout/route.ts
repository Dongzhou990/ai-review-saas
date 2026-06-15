import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { plan, successUrl, cancelUrl } = await request.json();

    const priceId =
      plan === "pro" ? PRICE_IDS.pro : plan === "enterprise" ? PRICE_IDS.enterprise : null;

    if (!priceId) {
      return NextResponse.json({ error: "无效的方案" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "alipay"],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { userId: user.id, plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${request.nextUrl.origin}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message || "创建支付失败" }, { status: 500 });
  }
}
