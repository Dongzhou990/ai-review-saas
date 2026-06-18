import { NextRequest, NextResponse } from "next/server";

const WECHAT_APP_ID = process.env.WECHAT_APP_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/wechat/callback`
  : "https://reviewai.chat/api/auth/wechat/callback";

export async function GET(request: NextRequest) {
  if (!WECHAT_APP_ID) {
    return NextResponse.json(
      { error: "微信登录暂未配置" },
      { status: 501 }
    );
  }

  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    appid: WECHAT_APP_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "snsapi_login",
    state,
  });

  const url = `https://open.weixin.qq.com/connect/qrconnect?${params.toString()}#wechat_redirect`;

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
  });

  return response;
}
