"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "./Header";
import { Package, Clock, CheckCircle, XCircle, Star, MessageCircle, User, Settings, MapPin } from "lucide-react";

type TabType = "selling" | "reserved" | "completed" | "expired";

export function MyPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("selling");
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));

    // 임시 데이터
    const mockProducts = [
      {
        id: "1",
        title: "아이폰 14 Pro 256GB",
        price: 850000,
        status: "판매중",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        views: 45,
      },
      {
        id: "2",
        title: "맥북 프로 2022",
        price: 1500000,
        status: "예약중",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        views: 120,
        reservedBy: "buyer123",
      },
      {
        id: "3",
        title: "에어팟 프로 2세대",
        price: 180000,
        status: "거래완료",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        views: 89,
        buyer: "buyer456",
        reviewed: false,
      },
      {
        id: "4",
        title: "오래된 상품",
        price: 50000,
        status: "만료됨",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toISOString(),
        views: 12,
      },
    ];

    setProducts(mockProducts);

    const mockReviews = [
      {
        id: "1",
        reviewer: "buyer1",
        rating: 5,
        comment: "친절하고 좋았어요!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
      {
        id: "2",
        reviewer: "buyer2",
        rating: 4,
        comment: "좋은 거래였습니다",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
    ];

    setReviews(mockReviews);
  }, [router]);

  const getFilteredProducts = () => {
    switch (activeTab) {
      case "selling":
        return products.filter(p => p.status === "판매중");
      case "reserved":
        return products.filter(p => p.status === "예약중");
      case "completed":
        return products.filter(p => p.status === "거래완료");
      case "expired":
        return products.filter(p => p.status === "만료됨");
      default:
        return [];
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "나눔";
    return `${price.toLocaleString()}원`;
  };

  const handleAcceptReservation = (productId: string) => {
    const confirmed = confirm("예약을 확정하시겠습니까? 확정 시 다른 사람은 예약할 수 없습니다.");
    if (confirmed) {
      alert("예약이 확정되었습니다");
      // 실제로는 서버에 요청
    }
  };

  const handleCompleteTransaction = (productId: string) => {
    const confirmed = confirm("거래를 완료하시겠습니까?");
    if (confirmed) {
      alert("거래가 완료되었습니다. 7일 이내에 평가를 남겨주세요!");
      // 실제로는 서버에 요청
    }
  };

  const handleReview = (productId: string) => {
    router.push(`/review/${productId}`);
  };

  const handleChangeNeighborhood = () => {
    if (!currentUser) return;

    const changes = currentUser.neighborhoodChangeCount || 0;
    const lastChange = currentUser.lastNeighborhoodChange 
      ? new Date(currentUser.lastNeighborhoodChange) 
      : new Date(0);
    const now = new Date();
    const daysSinceChange = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceChange < 30 && changes >= 2) {
      const daysRemaining = Math.ceil(30 - daysSinceChange);
      alert(`1개월에 2회까지만 변경 가능합니다. ${daysRemaining}일 후에 다시 시도해주세요.`);
      return;
    }

    // GPS 동네 인증
    const confirmed = confirm("현재 위치로 동네를 변경하시겠습니까?");
    if (confirmed) {
      alert("동네가 변경되었습니다: 서울시 강남구 삼성동");
      // 실제로는 서버에 요청
    }
  };

  const calculateMannerScore = () => {
    if (reviews.length === 0) return 36.5;
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return Math.round(36.5 + (avgRating - 3) * 20);
  };

  const mannerScore = calculateMannerScore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {currentUser?.nickname?.[0] || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentUser?.nickname || "사용자"}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser?.neighborhood || "역삼동"}</span>
                  <button
                    onClick={handleChangeNeighborhood}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    변경
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${mannerScore >= 80 ? 'text-green-600' : mannerScore >= 50 ? 'text-blue-600' : 'text-gray-600'}`}>
                    {mannerScore}°C
                  </span>
                  <span className="text-sm text-gray-500">매너온도</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("설정 페이지는 추후 구현 예정입니다")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{products.filter(p => p.status === "판매중").length}</p>
              <p className="text-sm text-gray-600">판매중</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.status === "예약중").length}</p>
              <p className="text-sm text-gray-600">예약중</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === "거래완료").length}</p>
              <p className="text-sm text-gray-600">거래완료</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{reviews.length}</p>
              <p className="text-sm text-gray-600">받은 평가</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 내 상품 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* 탭 */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("selling")}
                    className={`flex-1 min-w-[100px] px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "selling"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span className="hidden sm:inline">판매중</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("reserved")}
                    className={`flex-1 min-w-[100px] px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "reserved"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    <span className="hidden sm:inline">예약중</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`flex-1 min-w-[100px] px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "completed"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">거래완료</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("expired")}
                    className={`flex-1 min-w-[100px] px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "expired"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">만료됨</span>
                  </button>
                </div>
              </div>

              {/* 상품 목록 */}
              <div className="p-4">
                {getFilteredProducts().length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    등록된 상품이 없습니다
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredProducts().map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                            이미지
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${product.id}`} className="font-medium hover:text-blue-600 line-clamp-1">
                              {product.title}
                            </Link>
                            <p className="text-lg font-bold mt-1">{formatPrice(product.price)}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{getTimeAgo(product.createdAt)}</span>
                              <span>조회 {product.views}</span>
                            </div>
                          </div>
                        </div>

                        {/* 상태별 액션 버튼 */}
                        <div className="mt-3 flex gap-2">
                          {activeTab === "reserved" && (
                            <>
                              <button
                                onClick={() => handleAcceptReservation(product.id)}
                                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                예약 확정
                              </button>
                              <button
                                onClick={() => handleCompleteTransaction(product.id)}
                                className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                              >
                                거래 완료
                              </button>
                            </>
                          )}
                          {activeTab === "completed" && !product.reviewed && (
                            <button
                              onClick={() => handleReview(product.id)}
                              className="flex-1 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm flex items-center justify-center gap-2"
                            >
                              <Star className="w-4 h-4" />
                              평가하기 (7일 이내)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 받은 평가 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">받은 평가</h3>
              
              {reviews.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  아직 받은 평가가 없습니다
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {review.reviewer[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{review.reviewer}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(review.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 채팅 바로가기 */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <button
                onClick={() => router.push("/chat")}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                채팅 목록 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
