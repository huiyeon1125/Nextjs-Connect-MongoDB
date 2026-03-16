"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "./Header";
import { MapPin, Clock, Eye, Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, Flag, ArrowUp } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // 실제로는 서버에서 상품 정보를 가져옴
    // 임시로 목업 데이터 사용
    const mockProduct = {
      id,
      title: "아이폰 14 Pro 256GB 판매합니다",
      price: 850000,
      description: "깨끗하게 사용했습니다.\n직거래 환영합니다.\n상태 매우 좋아요!\n\n서울 강남구에서 직거래 가능합니다.",
      images: [],
      seller: "user1",
      sellerNickname: "판매왕",
      sellerScore: 85,
      location: "역삼동",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: "판매중",
      views: 45,
      category: "디지털/가전",
      lastBoosted: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    };
    
    setProduct(mockProduct);

    // 조회수 증가
    if (mockProduct.seller !== user) {
      mockProduct.views += 1;
    }
  }, [id]);

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

  const handleReservation = () => {
    if (!currentUser) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }

    if (currentUser.username === product.seller) {
      alert("본인이 등록한 상품은 예약할 수 없습니다");
      return;
    }

    if (product.status === "예약중") {
      alert("이미 예약된 상품입니다");
      return;
    }

    if (product.status === "거래완료") {
      alert("이미 거래가 완료된 상품입니다");
      return;
    }

    const confirmed = confirm("이 상품을 예약하시겠습니까?");
    if (confirmed) {
      // 실제로는 서버에 요청
      alert("예약 요청이 전송되었습니다. 판매자의 승인을 기다려주세요.");
    }
  };

  const handleChat = () => {
    if (!currentUser) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }

    if (currentUser.username === product.seller) {
      alert("본인이 등록한 상품입니다");
      return;
    }

    router.push("/chat");
  };

  const handleBoost = () => {
    if (!currentUser || currentUser.username !== product.seller) {
      return;
    }

    const lastBoost = new Date(product.lastBoosted).getTime();
    const now = new Date().getTime();
    const hoursSinceBoost = (now - lastBoost) / 1000 / 60 / 60;

    if (hoursSinceBoost < 24) {
      const remainingHours = Math.ceil(24 - hoursSinceBoost);
      alert(`끌어올리기는 24시간에 1회만 가능합니다. ${remainingHours}시간 후에 다시 시도해주세요.`);
      return;
    }

    alert("게시글이 끌어올려졌습니다!");
    setProduct({ ...product, lastBoosted: new Date().toISOString() });
  };

  const handleReport = () => {
    if (!currentUser) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요");
      return;
    }

    // 실제로는 서버에 신고 접수
    alert("신고가 접수되었습니다. 검토 후 조치하겠습니다.");
    setShowReportModal(false);
    setReportReason("");
  };

  const nextImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">로딩 중...</div>
      </div>
    );
  }

  const isMyProduct = currentUser && currentUser.username === product.seller;
  const canBoost = isMyProduct && product.status === "판매중";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 이미지 영역 */}
          <div className="relative bg-gray-900 aspect-video md:aspect-[16/9]">
            {product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                이미지 없음
              </div>
            )}

            {product.status !== "판매중" && (
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg font-bold text-lg">
                {product.status}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* 상단 정보 */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">{product.category}</span>
                  <span>•</span>
                  <span>{getTimeAgo(product.createdAt)}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>
                <p className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(product.price)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-lg ${isLiked ? "bg-red-50 text-red-500" : "bg-gray-100"}`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button className="p-2 bg-gray-100 rounded-lg">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 판매자 정보 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {product.sellerNickname[0]}
                </div>
                <div>
                  <p className="font-medium">{product.sellerNickname}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{product.location}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`font-medium ${product.sellerScore >= 80 ? 'text-green-600' : product.sellerScore >= 50 ? 'text-blue-600' : 'text-gray-600'}`}>
                      매너온도 {product.sellerScore}°C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">상품 설명</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* 기타 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>조회 {product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getTimeAgo(product.createdAt)}</span>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              {isMyProduct ? (
                <>
                  <button
                    onClick={handleBoost}
                    disabled={!canBoost}
                    className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                      canBoost
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                    끌어올리기
                  </button>
                  <button
                    onClick={() => router.push("/mypage")}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  >
                    내 상품 관리
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleChat}
                    className="flex-1 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    채팅하기
                  </button>
                  <button
                    onClick={handleReservation}
                    disabled={product.status !== "판매중"}
                    className={`flex-1 py-3 rounded-lg font-medium ${
                      product.status === "판매중"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.status === "판매중" ? "예약하기" : product.status}
                  </button>
                </>
              )}
              
              <button
                onClick={handleReport}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Flag className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">상품 신고</h3>
            <p className="text-sm text-gray-600 mb-4">
              신고 사유를 선택해주세요. 허위 신고 시 제재를 받을 수 있습니다.
            </p>
            
            <div className="space-y-2 mb-6">
              {["사기 의심", "허위 광고", "부적절한 내용", "중복 게시물", "기타"].map((reason) => (
                <label key={reason} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mr-3"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-500 mb-4">
              동일한 사용자에 대한 신고가 3회 누적되면 자동으로 글이 숨김/삭제 처리됩니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={submitReport}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
