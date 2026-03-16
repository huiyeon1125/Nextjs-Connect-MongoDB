"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "./Header";
import { Plus, MapPin, Clock, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  seller: string;
  location: string;
  createdAt: string;
  status: "판매중" | "예약중" | "거래완료";
  views: number;
  category: string;
}

const categories = [
  "전체",
  "디지털/가전",
  "가구/인테리어",
  "의류",
  "도서",
  "스포츠/레저",
  "생활용품",
  "기타"
];

const mockProducts: Product[] = [
  {
    id: "1",
    title: "아이폰 14 Pro 256GB 판매합니다",
    price: 850000,
    description: "깨끗하게 사용했습니다. 직거래 환영합니다.",
    images: [],
    seller: "user1",
    location: "역삼동",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "판매중",
    views: 45,
    category: "디지털/가전"
  },
  {
    id: "2",
    title: "북유럽 스타일 원목 책상",
    price: 120000,
    description: "이사가면서 판매합니다",
    images: [],
    seller: "user2",
    location: "서초동",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "판매중",
    views: 120,
    category: "가구/인테리어"
  },
  {
    id: "3",
    title: "나이키 에어맥스 270 (260)",
    price: 70000,
    description: "2번 신었어요",
    images: [],
    seller: "user3",
    location: "역삼동",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "예약중",
    views: 89,
    category: "의류"
  },
  {
    id: "4",
    title: "자바스크립트 완벽 가이드 책 나눔",
    price: 0,
    description: "필요하신 분 가져가세요",
    images: [],
    seller: "user4",
    location: "역삼동",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    status: "판매중",
    views: 234,
    category: "도서"
  },
  {
    id: "5",
    title: "캠핑용 테이블 세트",
    price: 45000,
    description: "의자 4개 포함",
    images: [],
    seller: "user5",
    location: "서초동",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "판매중",
    views: 67,
    category: "스포츠/레저"
  },
  {
    id: "6",
    title: "공기청정기 (거의 새것)",
    price: 150000,
    description: "한 달 사용",
    images: [],
    seller: "user6",
    location: "역삼동",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "거래완료",
    views: 156,
    category: "생활용품"
  }
];

export function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high">("recent");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    let filtered = [...mockProducts];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // 차단된 사용자 필터 (실제로는 서버에서 처리)
    // filtered = filtered.filter(p => !blockedUsers.includes(p.seller));

    // 정렬
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  }, [searchParams, selectedCategory, sortBy]);

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

  const handleRegister = () => {
    if (!currentUser) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 카테고리 바 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* 모바일 카테고리 드롭다운 */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {showCategoryMenu && (
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      selectedCategory === cat ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 데스크톱 카테고리 */}
          <div className="hidden md:flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1 text-sm rounded ${
                  sortBy === "recent" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                최근 등록순
              </button>
              <button
                onClick={() => setSortBy("price-low")}
                className={`px-3 py-1 text-sm rounded ${
                  sortBy === "price-low" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                낮은 가격순
              </button>
              <button
                onClick={() => setSortBy("price-high")}
                className={`px-3 py-1 text-sm rounded ${
                  sortBy === "price-high" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                높은 가격순
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <MapPin className="inline w-4 h-4 mr-1" />
              내 동네 반경 3km
            </div>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-20">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-square bg-gray-200 relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
                {product.status !== "판매중" && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-lg font-medium">
                      {product.status}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-lg font-bold mb-2">{formatPrice(product.price)}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(product.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {/* 글쓰기 버튼 (플로팅) */}
      <button
        onClick={handleRegister}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
