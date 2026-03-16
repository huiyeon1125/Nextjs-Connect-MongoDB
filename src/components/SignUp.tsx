"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "./Header";
import { MapPin, Check } from "lucide-react";

export function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    address: "",
    addressDetail: "",
    neighborhood: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [neighborhoodVerified, setNeighborhoodVerified] = useState(false);
  const firstErrorRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        const byteLength = new Blob([value]).size;
        if (byteLength < 2 || byteLength > 15) {
          return "이름은 2byte 이상 15byte 이하로 입력해주세요";
        }
        return "";
      
      case "phone":
        if (!/^\d+$/.test(value)) {
          return "숫자만 입력 가능합니다";
        }
        return "";
      
      case "birthdate":
        if (!/^\d{8}$/.test(value)) {
          return "생년월일은 8자리 숫자로 입력해주세요 (예: 19900101)";
        }
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        const day = parseInt(value.substring(6, 8));
        if (year < 1900 || year > 2026 || month < 1 || month > 12 || day < 1 || day > 31) {
          return "올바른 생년월일을 입력해주세요";
        }
        return "";
      
      case "username":
        if (!/^[a-zA-Z0-9]{1,10}$/.test(value)) {
          return "아이디는 영문자와 숫자 조합 최대 10글자입니다";
        }
        return "";
      
      case "password":
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(value)) {
          return "비밀번호는 대소문자, 숫자, 특수기호를 포함한 8~20자입니다";
        }
        return "";
      
      case "passwordConfirm":
        if (value !== formData.password) {
          return "비밀번호가 일치하지 않습니다";
        }
        return "";
      
      case "nickname":
        if (value.length < 2 || value.length > 10) {
          return "닉네임은 2자 이상 10자 이하로 입력해주세요";
        }
        // 중복 체크는 실제로는 서버에서 해야 함
        return "";
      
      case "address":
        if (!value) {
          return "주소를 검색해주세요";
        }
        return "";
      
      case "neighborhood":
        if (!neighborhoodVerified) {
          return "동네 인증을 완료해주세요";
        }
        return "";
      
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 실시간 유효성 검사
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAddressSearch = () => {
    setIsAddressModalOpen(true);
  };

  const selectAddress = (roadAddress: string, jibunAddress: string) => {
    setFormData(prev => ({
      ...prev,
      address: `${roadAddress} (지번: ${jibunAddress})`,
    }));
    setIsAddressModalOpen(false);
    setErrors(prev => ({ ...prev, address: "" }));
  };

  const handleNeighborhoodVerify = () => {
    // 실제로는 GPS 정보를 받아와서 처리
    const mockNeighborhood = "서울시 강남구 역삼동";
    setFormData(prev => ({ ...prev, neighborhood: mockNeighborhood }));
    setNeighborhoodVerified(true);
    setErrors(prev => ({ ...prev, neighborhood: "" }));
    alert(`동네 인증이 완료되었습니다: ${mockNeighborhood}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "name", "phone", "birthdate", "username", "password", 
      "passwordConfirm", "nickname", "address"
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // 동네 인증 체크
    if (!neighborhoodVerified) {
      newErrors.neighborhood = "동네 인증을 완료해주세요";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("입력되지 않은 항목이 있습니다");
      return;
    }

    // 회원가입 처리 (실제로는 서버로 전송)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      neighborhoodChangeCount: 0,
      lastNeighborhoodChange: new Date().toISOString(),
    });
    localStorage.setItem("users", JSON.stringify(users));

    router.push("/signup-complete");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block mb-2 font-medium">이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="본명을 입력하세요 (2~15byte)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block mb-2 font-medium">전화번호 *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="숫자만 입력 (예: 01012345678)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block mb-2 font-medium">생년월일 *</label>
              <input
                type="text"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                placeholder="8자리 입력 (예: 19900101)"
                maxLength={8}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.birthdate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.birthdate && <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>}
            </div>

            {/* 아이디 */}
            <div>
              <label className="block mb-2 font-medium">아이디 *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="영문자와 숫자 조합 최대 10글자"
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="대소문자, 숫자, 특수기호 포함 8~20자"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block mb-2 font-medium">비밀번호 확인 *</label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.passwordConfirm ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block mb-2 font-medium">닉네임 *</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="2자 이상 10자 이하"
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.nickname ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
            </div>

            {/* 주소 */}
            <div>
              <label className="block mb-2 font-medium">주소 *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  readOnly
                  placeholder="주소 검색 버튼을 클릭하세요"
                  className={`flex-1 px-4 py-2 border rounded-lg bg-gray-50 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  주소 검색
                </button>
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* 상세주소 */}
            {formData.address && (
              <div>
                <label className="block mb-2 font-medium">상세주소</label>
                <input
                  type="text"
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  placeholder="상세주소를 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* 동네 인증 */}
            <div>
              <label className="block mb-2 font-medium">동네 인증 *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  readOnly
                  placeholder="GPS 기반 동네 인증"
                  className={`flex-1 px-4 py-2 border rounded-lg bg-gray-50 ${
                    errors.neighborhood ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleNeighborhoodVerify}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    neighborhoodVerified
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={neighborhoodVerified}
                >
                  {neighborhoodVerified ? (
                    <>
                      <Check className="w-4 h-4" />
                      인증완료
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      인증하기
                    </>
                  )}
                </button>
              </div>
              {errors.neighborhood && <p className="mt-1 text-sm text-red-500">{errors.neighborhood}</p>}
              <p className="mt-1 text-sm text-gray-500">1개월에 2회까지만 변경 가능합니다</p>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-lg"
            >
              회원가입
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500 hover:underline">
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">주소 검색</h3>
            <p className="text-sm text-gray-600 mb-4">
              실제 환경에서는 주소기반 산업지원 서비스 API를 사용합니다
            </p>
            <div className="space-y-2 mb-4">
              <button
                onClick={() => selectAddress("서울특별시 강남구 테헤란로 123", "역삼동 456-78")}
                className="w-full text-left p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-medium">서울특별시 강남구 테헤란로 123</p>
                <p className="text-sm text-gray-500">지번: 역삼동 456-78</p>
              </button>
              <button
                onClick={() => selectAddress("서울특별시 서초구 서초대로 456", "서초동 789-12")}
                className="w-full text-left p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-medium">서울특별시 서초구 서초대로 456</p>
                <p className="text-sm text-gray-500">지번: 서초동 789-12</p>
              </button>
            </div>
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
