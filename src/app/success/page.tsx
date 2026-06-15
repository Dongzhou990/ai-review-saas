"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">支付成功！</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        感谢升级，你的账号已开通 Pro 权限。
      </p>
      <p className="text-sm text-gray-400 mb-8">
        {countdown} 秒后自动跳转到 Dashboard...
      </p>
      <Button variant="primary" size="lg" onClick={() => router.push("/dashboard")}>
        立即进入 Dashboard
        <ArrowRight className="w-4 h-4" />
      </Button>
    </>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-md mx-auto px-4">
        <Suspense fallback={<div className="w-16 h-16 mx-auto mb-6 animate-pulse bg-gray-200 rounded-full" />}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
