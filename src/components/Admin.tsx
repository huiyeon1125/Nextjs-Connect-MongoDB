"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Trash2, Shield, BarChart3, Users, Package, Flag, TrendingUp, Calendar } from "lucide-react";

interface Report {
  id: string;
  type: "product" | "user";
  targetId: string;
  targetTitle: string;
  reporter: string;
  reason: string;
  createdAt: string;
  status: "pending" | "resolved" | "dismissed";
}

export function Admin() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"reports" | "stats">("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    dailySignups: [] as { date: string; count: number }[],
    dailyTransactions: [] as { date: string; count: number }[],
    totalUsers: 156,
    totalProducts: 1234,
    totalReports: 23,
  });

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);

    // 실제로는 관리자 권한 체크
    if (parsedUser.username !== "admin") {
      alert("관리자 권한이 필요합니다");
      router.push("/");
      return;
    }

    // 임시 신고 목록
    const mockReports: Report[] = [
      {
        id: "1",
        type: "product",
        targetId: "prod1",
        targetTitle: "사기 의심 상품",
        reporter: "user123",
        reason: "사기 의심",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "pending",
      },
      {
        id: "2",
        type: "user",
        targetId: "user456",
        targetTitle: "악성 사용자",
        reporter: "user789",
        reason: "욕설 및 비방",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "pending",
      },
      {
        id: "3",
        type: "product",
        targetId: "prod2",
        targetTitle: "허위 광고 상품",
        reporter: "user321",
        reason: "허위 광고",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: "resolved",
      },
    ];

    setReports(mockReports);

    // 임시 통계 데이터
    const mockDailySignups = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (6 - i)).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
      count: Math.floor(Math.random() * 20) + 5,
    }));

    const mockDailyTransactions = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (6 - i)).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
      count: Math.floor(Math.random() * 30) + 10,
    }));

    setStats({
      ...stats,
      dailySignups: mockDailySignups,
      dailyTransactions: mockDailyTransactions,
    });
  }, [router]);

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

  const handleDeleteProduct = (reportId: string, productId: string) => {
    const confirmed = confirm("이 상품을 삭제하시겠습니까?");
    if (confirmed) {
      // 실제로는 서버에 요청
      alert("상품이 삭제되었습니다");
      setReports(reports.map(r => r.id === reportId ? { ...r, status: "resolved" as const } : r));
    }
  };

  const handleUnbanUser = (userId: string) => {
    const confirmed = confirm("이 사용자의 이용제한을 해제하시겠습니까?");
    if (confirmed) {
      // 실제로는 서버에 요청
      alert("이용제한이 해제되었습니다");
    }
  };

  const handleDismissReport = (reportId: string) => {
    const confirmed = confirm("이 신고를 기각하시겠습니까?");
    if (confirmed) {
      setReports(reports.map(r => r.id === reportId ? { ...r, status: "dismissed" as const } : r));
    }
  };

  const pendingReports = reports.filter(r => r.status === "pending");
  const resolvedReports = reports.filter(r => r.status === "resolved");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">관리자 페이지</h1>
          <p className="text-gray-600">사이트 관리 및 통계를 확인할 수 있습니다</p>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500">총 회원수</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500">총 상품수</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Flag className="w-8 h-8 text-red-500" />
              <span className="text-sm text-gray-500">미처리 신고</span>
            </div>
            <p className="text-3xl font-bold">{pendingReports.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-500">오늘 가입자</span>
            </div>
            <p className="text-3xl font-bold">
              {stats.dailySignups[stats.dailySignups.length - 1]?.count || 0}
            </p>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 ${
                  activeTab === "reports"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Flag className="w-5 h-5" />
                신고 관리
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 ${
                  activeTab === "stats"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                통계
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "reports" ? (
              <div>
                <h2 className="text-xl font-bold mb-4">신고 목록</h2>
                
                {/* 미처리 신고 */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    미처리 신고 ({pendingReports.length})
                  </h3>
                  
                  {pendingReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">미처리 신고가 없습니다</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingReports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  report.type === "product"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}>
                                  {report.type === "product" ? "상품 신고" : "사용자 신고"}
                                </span>
                                <span className="text-sm text-gray-500">{getTimeAgo(report.createdAt)}</span>
                              </div>
                              <p className="font-medium mb-1">{report.targetTitle}</p>
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">신고 사유:</span> {report.reason}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">신고자:</span> {report.reporter}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {report.type === "product" ? (
                              <button
                                onClick={() => handleDeleteProduct(report.id, report.targetId)}
                                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                상품 삭제
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnbanUser(report.targetId)}
                                className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                              >
                                <Shield className="w-4 h-4" />
                                제재 해제
                              </button>
                            )}
                            <button
                              onClick={() => handleDismissReport(report.id)}
                              className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                              기각
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 처리된 신고 */}
                <div>
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    처리 완료 ({resolvedReports.length})
                  </h3>
                  
                  {resolvedReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">처리된 신고가 없습니다</p>
                  ) : (
                    <div className="space-y-3">
                      {resolvedReports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  report.type === "product"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}>
                                  {report.type === "product" ? "상품 신고" : "사용자 신고"}
                                </span>
                                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                  처리완료
                                </span>
                                <span className="text-sm text-gray-500">{getTimeAgo(report.createdAt)}</span>
                              </div>
                              <p className="font-medium mb-1">{report.targetTitle}</p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">신고 사유:</span> {report.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ℹ️ 동일한 사용자에 대한 신고가 3회 누적되면 자동으로 글이 숨김/삭제 처리됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-6">통계</h2>
                
                {/* 일별 가입자 */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    일별 가입자 수
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end justify-between h-48 gap-2">
                      {stats.dailySignups.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{
                              height: `${(data.count / Math.max(...stats.dailySignups.map(d => d.count))) * 100}%`,
                              minHeight: "20px",
                            }}
                          />
                          <p className="text-xs mt-2 text-center">{data.date}</p>
                          <p className="text-sm font-bold">{data.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 일별 거래 건수 */}
                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    일별 거래 건수
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end justify-between h-48 gap-2">
                      {stats.dailyTransactions.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                            style={{
                              height: `${(data.count / Math.max(...stats.dailyTransactions.map(d => d.count))) * 100}%`,
                              minHeight: "20px",
                            }}
                          />
                          <p className="text-xs mt-2 text-center">{data.date}</p>
                          <p className="text-sm font-bold">{data.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
