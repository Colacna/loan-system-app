// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx
export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">대여품 관리 시스템</h1>
      <p className="mt-2">고객 이름을 검색해 대여 기록을 관리할 수 있습니다.</p>
    </main>
  );
}

// 기존 코드
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";

const items = ["우산", "충전기", "아답터", "무선 마우스", "HDMI 케이블"];

export default function GuestSearch() {
  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [staff, setStaff] = useState("");
  const [loanList, setLoanList] = useState([]);
  const [returningStaff, setReturningStaff] = useState("");
  const [nameMapping, setNameMapping] = useState({
    "김민서": ["minseo kim", "kimminseo", "kim minseo", "minseokim"],
    "최민아": ["choi mina", "min a choi", "choimina"],
    "이선화": ["lee seonhwa", "seonhwa lee"]
  });
  const [newKoreanName, setNewKoreanName] = useState("");
  const [newEnglishAlias, setNewEnglishAlias] = useState("");

  const handleSearch = () => {
    const aliases = nameMapping[searchName] || [];
    const lowerAliases = aliases.map((n) => n.toLowerCase());
    const filtered = guests.filter((g) =>
      lowerAliases.some((alias) => g.name.toLowerCase().includes(alias))
    );
    setResults(filtered);
  };

  const handleLoanRegister = (guest) => {
    if (!selectedItem || !serialNumber || !staff) return;
    const newLoan = {
      guest: guest.name,
      room: guest.room,
      item: selectedItem,
      serial: serialNumber,
      staff,
      date: new Date().toISOString().slice(0, 10),
      returned: false,
      returnedBy: "",
      returnDate: ""
    };
    setLoanList([...loanList, newLoan]);
    setSelectedItem("");
    setSerialNumber("");
    setStaff("");
  };

  const handleReturn = (index) => {
    const updated = [...loanList];
    updated[index].returned = true;
    updated[index].returnedBy = returningStaff;
    updated[index].returnDate = new Date().toISOString().slice(0, 10);
    setLoanList(updated);
    setReturningStaff("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const roomNodes = xml.querySelectorAll("G_ROOM");

    const newGuests = Array.from(roomNodes).map((node) => ({
      name: node.querySelector("GUEST_NAME")?.textContent || "",
      room: node.querySelector("ROOM")?.textContent || "",
      checkout: node.querySelector("DEPARTURE")?.textContent || ""
    }));

    setGuests(newGuests);
    alert(`총 ${newGuests.length}명의 고객 정보가 업로드되었습니다.`);
  };

  const handleAddAlias = () => {
    if (!newKoreanName || !newEnglishAlias) return;
    setNameMapping((prev) => {
      const existing = prev[newKoreanName] || [];
      return {
        ...prev,
        [newKoreanName]: [...existing, newEnglishAlias]
      };
    });
    setNewKoreanName("");
    setNewEnglishAlias("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">고객 이름(한글)으로 검색</h2>
          <input type="file" accept=".xml" onChange={handleFileUpload} className="block" />
          <div className="flex gap-2">
            <Input
              placeholder="예: 김민서"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>

          <div className="pt-4 space-y-2">
            <h3 className="text-lg font-semibold">이름 매핑 추가</h3>
            <Input
              placeholder="한글 이름 (예: 김민서)"
              value={newKoreanName}
              onChange={(e) => setNewKoreanName(e.target.value)}
            />
            <Input
              placeholder="영문 이름 (예: kimminseo)"
              value={newEnglishAlias}
              onChange={(e) => setNewEnglishAlias(e.target.value)}
            />
            <Button onClick={handleAddAlias}>매핑 추가</Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">검색 결과</h3>
          {results.map((guest, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-2">
                <p>이름: {guest.name}</p>
                <p>객실: {guest.room}</p>
                <p>체크아웃: {guest.checkout}</p>

                <div className="space-y-2">
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectItem disabled value="">
                      물품 선택
                    </SelectItem>
                    {items.map((item, idx) => (
                      <SelectItem key={idx} value={item}>{item}</SelectItem>
                    ))}
                  </Select>

                  <Input
                    placeholder="일련번호"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />

                  <Input
                    placeholder="대여 직원 이름"
                    value={staff}
                    onChange={(e) => setStaff(e.target.value)}
                  />

                  <Button onClick={() => handleLoanRegister(guest)}>
                    대여 등록
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loanList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">대여 리스트</h3>
          {loanList.map((loan, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-1">
                <p>고객: {loan.guest} (객실 {loan.room})</p>
                <p>물품: {loan.item} (일련번호: {loan.serial})</p>
                <p>직원: {loan.staff} / 대여일: {loan.date}</p>
                {loan.returned ? (
                  <p className="text-green-600">반납됨 - {loan.returnedBy} / {loan.returnDate}</p>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="반납 직원 이름"
                      value={returningStaff}
                      onChange={(e) => setReturningStaff(e.target.value)}
                    />
                    <Button onClick={() => handleReturn(index)}>
                      반납 처리
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
