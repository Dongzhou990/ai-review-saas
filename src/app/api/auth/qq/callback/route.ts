import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const QQ_APP_ID = process.env.QQ_APP_ID || "";
const QQ_APP_SECRET = process.env.QQ_APP_SECRET || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=QQ授权失败", request.url)
    );
  }

  try {
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/qq/callback`
      : "https://reviewai.chat/api/auth/qq/callback";

    // 1. Exchange code for access token
    const tokenUrl = `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${QQ_APP_ID}&client_secret=${QQ_APP_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&fmt=json`;
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("QQ token error:", tokenData);
      return NextResponse.redirect(
        new URL("/login?error=QQ登录失败", request.url)
      );
    }

    const { access_token } = tokenData;

    // 2. Get OpenID
    const openIdRes = await fetch(
      `https://graph.qq.com/oauth2.0/me?access_token=${access_token}&fmt=json`
    );
    const openIdData = await openIdRes.json();
    const openid = openIdData.openid;

    // 3. Get user info
    const userRes = await fetch(
      `https://graph.qq.com/user/get_user_info?access_token=${access_token}&oauth_consumer_key=${QQ_APP_ID}&openid=${openid}`
    );
    const userData = await userRes.json();

    const qqName = userData.nickname || "QQ用户";
    const avatarUrl = userData.figureurl_qq_2 || userData.figureurl_qq_1 || "";

    // 4. Sign in to Supabase
    const supabase = await createServerSupabase();
    const email = `${openid}@qq.kuki.ai`;
    const password = `${openid}_qq_kuki`;

    // Upsert user
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: qqName,
          avatar_url: avatarUrl,
          oauth_provider: "qq",
          oauth_id: openid,
        },
      },
    });

    // Sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase sign in error:", error);
      return NextResponse.redirect(
        new URL("/login?error=登录失败", request.url)
      );
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("QQ callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=登录失败，请重试", request.url)
    );
  }
}
