"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon } from "lucide-react";

interface ChatRoom {
  id: string;
  otherUser: string;
  otherUserNickname: string;
  productTitle: string;
  productPrice: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "text" | "image";
}

export function Chat() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));

    // 임시 채팅방 목록
    const mockChatRooms: ChatRoom[] = [
      {
        id: "1",
        otherUser: "seller1",
        otherUserNickname: "판매왕",
        productTitle: "아이폰 14 Pro 256GB",
        productPrice: 850000,
        lastMessage: "네, 직거래 가능합니다",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        unread: 2,
      },
      {
        id: "2",
        otherUser: "buyer2",
        otherUserNickname: "구매자123",
        productTitle: "맥북 프로 2022",
        productPrice: 1500000,
        lastMessage: "언제 만날 수 있을까요?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        unread: 0,
      },
      {
        id: "3",
        otherUser: "seller3",
        otherUserNickname: "동네마트",
        productTitle: "에어팟 프로 2세대",
        productPrice: 180000,
        lastMessage: "사진 보내드렸어요",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        unread: 1,
      },
    ];

    setChatRooms(mockChatRooms);
  }, [router]);

  useEffect(() => {
    if (selectedRoom && currentUser) {
      // 임시 메시지 목록
      const mockMessages: Message[] = [
        {
          id: "1",
          sender: selectedRoom.otherUser,
          content: "안녕하세요! 상품 문의드립니다",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: "text",
        },
        {
          id: "2",
          sender: currentUser.username,
          content: "네 안녕하세요",
          timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
          type: "text",
        },
        {
          id: "3",
          sender: selectedRoom.otherUser,
          content: "직거래 가능한가요?",
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          type: "text",
        },
        {
          id: "4",
          sender: currentUser.username,
          content: "네, 직거래 가능합니다",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          type: "text",
        },
      ];

      setMessages(mockMessages);
      scrollToBottom();
    }
  }, [selectedRoom, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "나눔";
    return `${price.toLocaleString()}원`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRoom || !currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    // 채팅방 목록의 마지막 메시지 업데이트
    setChatRooms(rooms =>
      rooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, lastMessage: newMessage, lastMessageTime: message.timestamp }
          : room
      )
    );

    setTimeout(scrollToBottom, 100);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const handleDeleteChat = (roomId: string) => {
    const confirmed = confirm("채팅방을 나가시겠습니까?");
    if (confirmed) {
      setChatRooms(rooms => rooms.filter(room => room.id !== roomId));
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
      }
      alert("채팅방에서 나갔습니다");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
          <div className="flex h-full">
            {/* 채팅방 목록 (왼쪽) */}
            <div className={`${selectedRoom ? "hidden md:block" : "block"} w-full md:w-80 border-r flex flex-col`}>
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">채팅</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {chatRooms.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    채팅 내역이 없습니다
                  </div>
                ) : (
                  chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedRoom?.id === room.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {room.otherUserNickname[0]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium truncate">{room.otherUserNickname}</p>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {getTimeAgo(room.lastMessageTime)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {room.productTitle}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate flex-1">
                              {room.lastMessage}
                            </p>
                            {room.unread > 0 && (
                              <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                                {room.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t text-xs text-gray-500">
                거래 완료 후 30일 뒤 자동 삭제됩니다
              </div>
            </div>

            {/* 채팅 내용 (오른쪽) */}
            <div className={`${selectedRoom ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
              {selectedRoom ? (
                <>
                  {/* 채팅 헤더 */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBack}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedRoom.otherUserNickname[0]}
                      </div>
                      
                      <div>
                        <p className="font-medium">{selectedRoom.otherUserNickname}</p>
                        <p className="text-sm text-gray-500">{selectedRoom.productTitle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteChat(selectedRoom.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 상품 정보 */}
                  <div className="p-3 bg-gray-50 border-b flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                      상품
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{selectedRoom.productTitle}</p>
                      <p className="text-sm font-bold">{formatPrice(selectedRoom.productPrice)}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/product/${selectedRoom.id}`)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white flex-shrink-0"
                    >
                      상품보기
                    </button>
                  </div>

                  {/* 메시지 목록 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isMyMessage = message.sender === currentUser?.username;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%] ${isMyMessage ? "items-end" : "items-start"} flex flex-col`}>
                            {!isMyMessage && (
                              <p className="text-xs text-gray-500 mb-1">{selectedRoom.otherUserNickname}</p>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isMyMessage
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-900"
                              }`}
                            >
                              {message.content}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 메시지 입력 */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      </button>
                      
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          newMessage.trim()
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Send className="w-5 h-5" />
                        <span className="hidden sm:inline">전송</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  채팅방을 선택해주세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
