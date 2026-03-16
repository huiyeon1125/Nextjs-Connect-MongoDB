"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { X, Upload, ImageIcon } from "lucide-react";

const categories = [
  "디지털/가전",
  "가구/인테리어",
  "의류",
  "도서",
  "스포츠/레저",
  "생활용품",
  "기타"
];

export function ProductRegister() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: categories[0],
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));

    // 하루 등록 개수 체크
    const today = new Date().toDateString();
    const todayProducts = JSON.parse(localStorage.getItem("todayProducts") || "{}");
    const count = todayProducts[today] || 0;
    
    if (count >= 3) {
      alert("하루 최대 3개까지만 상품 등록이 가능합니다");
      router.push("/");
    }
  }, [router]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "title":
        if (value.length < 2 || value.length > 30) {
          return "제목은 2자 이상 30자 이하로 입력해주세요";
        }
        return "";
      
      case "price":
        if (!/^\d+$/.test(value)) {
          return "가격은 숫자만 입력 가능합니다";
        }
        return "";
      
      case "description":
        if (value.length > 1000) {
          return "설명은 최대 1000자까지 입력 가능합니다";
        }
        return "";
      
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 10) {
      alert("최대 10장까지만 첨부 가능합니다");
      return;
    }

    // 실제로는 서버에 업로드하고 URL을 받아옴
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (images.length === 0) {
      newErrors.images = "최소 1장의 사진을 첨부해주세요";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("입력 내용을 확인해주세요");
      return;
    }

    // 상품 등록
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      price: parseInt(formData.price),
      images,
      seller: currentUser.username,
      location: currentUser.neighborhood || "역삼동",
      createdAt: new Date().toISOString(),
      status: "판매중",
      views: 0,
      lastBoosted: new Date().toISOString(),
    };
    
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // 오늘 등록 개수 증가
    const today = new Date().toDateString();
    const todayProducts = JSON.parse(localStorage.getItem("todayProducts") || "{}");
    todayProducts[today] = (todayProducts[today] || 0) + 1;
    localStorage.setItem("todayProducts", JSON.stringify(todayProducts));

    alert("상품이 등록되었습니다");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8">상품 등록</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사진 첨부 */}
            <div>
              <label className="block mb-2 font-medium">
                사진 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  (최소 1장 ~ 최대 10장)
                </span>
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {/* 업로드 버튼 */}
                {images.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">{images.length}/10</span>
                  </label>
                )}
                
                {/* 이미지 프리뷰 */}
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={img}
                      alt={`상품 사진 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        대표
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images}</p>}
            </div>

            {/* 제목 */}
            <div>
              <label className="block mb-2 font-medium">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="상품 제목을 입력하세요 (2~30자)"
                maxLength={30}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.title.length}/30</p>
              </div>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block mb-2 font-medium">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* 가격 */}
            <div>
              <label className="block mb-2 font-medium">
                가격 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(0원 입력 시 나눔)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="가격을 입력하세요"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.price ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  원
                </span>
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            {/* 설명 */}
            <div>
              <label className="block mb-2 font-medium">
                설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="상품 설명을 입력하세요 (최대 1000자)"
                rows={8}
                maxLength={1000}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                  errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/1000</p>
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ 하루 최대 3개까지만 상품 등록이 가능합니다<br />
                ℹ️ 등록 후 24시간에 1회 끌어올리기가 가능합니다
              </p>
            </div>

            {/* 등록 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
