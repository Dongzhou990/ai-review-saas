import { NextRequest, NextResponse } from "next/server";

const QQ_APP_ID = process.env.QQ_APP_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/qq/callback`
  : "https://reviewai.chat/api/auth/qq/callback";

export async function GET(request: NextRequest) {
  if (!QQ_APP_ID) {
    return NextResponse.json(
      { error: "QQ 登录暂未配置" },
      { status: 501 }
    );
  }

  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: QQ_APP_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: "get_user_info",
  });

  const url = `https://graph.qq.com/oauth2.0/authorize?${params.toString()}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
  });

  return response;
}
