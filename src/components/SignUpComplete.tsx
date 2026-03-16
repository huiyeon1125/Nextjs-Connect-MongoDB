"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export function SignUpComplete() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">환영합니다!</h1>
        <p className="text-gray-600 mb-8">
          동네마켓 회원가입이 완료되었습니다.<br />
          이제 우리 동네의 다양한 상품을 만나보세요!
        </p>
        
        <Link
          href="/"
          className="inline-block w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          쇼핑 계속하기
        </Link>
        
        <Link
          href="/login"
          className="inline-block w-full mt-3 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-medium"
        >
          로그인하기
        </Link>
      </div>
    </div>
  );
}
