import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID || "";
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=微信授权失败", request.url)
    );
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://api.weixin.qq.com/sns/oauth2/access_token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.errcode) {
      console.error("WeChat token error:", tokenData);
      return NextResponse.redirect(
        new URL("/login?error=微信登录失败", request.url)
      );
    }

    const { access_token, openid, unionid } = tokenData;

    // 2. Get user info
    const userRes = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`
    );
    const userData = await userRes.json();

    const wechatName = userData.nickname || "微信用户";
    const avatarUrl = userData.headimgurl || "";

    // 3. Sign in to Supabase with OAuth identity
    const supabase = await createServerSupabase();

    // Use admin API to create/find user by OAuth identity
    const email = `${openid}@wechat.kuki.ai`;
    const password = crypto.randomUUID() + crypto.randomUUID();

    // Try sign up first; if user already exists, proceed to sign in
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: wechatName,
          avatar_url: avatarUrl,
          oauth_provider: "wechat",
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
    console.error("WeChat callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=登录失败，请重试", request.url)
    );
  }
}
