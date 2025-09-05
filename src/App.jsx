import React, { useMemo, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [bank, setBank] = useState("국민은행");
  const [accountNo, setAccountNo] = useState("93800201135927");
  const [holder, setHolder] = useState("전효준");
  const [amount, setAmount] = useState(15000);
  const [memo, setMemo] = useState("");
  const [useOriginQR, setUseOriginQR] = useState(true);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  function buildTossDeepLink({ amount, bank, accountNo, memo }) {
    const params = new URLSearchParams();
    if (amount) params.set("amount", String(amount));
    if (bank) params.set("bank", bank);
    if (accountNo) params.set("accountNo", accountNo);
    if (useOriginQR) params.set("origin", "qr");
    if (memo) params.set("message", memo); // not guaranteed
    return `supertoss://send?${params.toString()}`;
  }

  const deepLink = useMemo(
    () => buildTossDeepLink({ amount, bank, accountNo, memo }),
    [amount, bank, accountNo, memo, useOriginQR]
  );

  const [qrSize, setQrSize] = useState(240);
  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth, 480);
      setQrSize(Math.max(180, Math.floor(w * 0.6)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const openInToss = () => {
    window.location.href = deepLink;
    setTimeout(() => {
      // window.location.href = "https://toss.im/";
    }, 1200);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      alert("딥링크가 복사되었습니다. 모바일 브라우저 주소창에 붙여넣어 테스트해 보세요.");
    } catch (e) {
      alert("복사에 실패했습니다. 수동으로 복사해주세요.\n" + deepLink);
    }
  };

  const errors = [];
  if (!bank.trim()) errors.push("은행명을 입력하세요.");
  if (!accountNo.trim()) errors.push("계좌번호를 입력하세요.");
  if (!amount || amount <= 0) errors.push("금액은 1원 이상이어야 합니다.");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <header className="py-4">
          <h1 className="text-2xl font-bold">Toss 송금 QR · MVP</h1>
          <p className="text-sm text-gray-600 mt-1">
            입력값으로 토스 앱 딥링크를 생성하고, QR/버튼으로 바로 실행합니다.
          </p>
        </header>

        <details className="mb-4 bg-white rounded-2xl shadow p-4">
          <summary className="font-semibold cursor-pointer">서비스 기획 / 구조도 (간단 요약)</summary>
          <ol className="list-decimal pl-5 space-y-2 mt-3 text-sm leading-6">
            <li><b>입력 레이어</b>: 은행/계좌/예금주/금액/메모(선택) → 클라이언트 상태로만 보관.</li>
            <li><b>링크 생성기</b>: <code>supertoss://send?amount=...&bank=...&accountNo=...</code> 조합.</li>
            <li><b>QR 렌더러</b>: 딥링크 문자열을 QR로 생성(브라우저 내 생성, 외부 전송 없음).</li>
            <li><b>실행 컨트롤</b>: "토스로 열기" 클릭 시 딥링크 호출 → 앱 실행. 미설치 시 안내.</li>
            <li><b>보안</b>: 민감정보는 네트워크 전송 금지. 화면 표시 & QR만 제공.</li>
            <li><b>운영 고려</b>: supertoss 스킴은 비공식. 앱/OS별 호환 확인 및 대체수단 준비 권장.</li>
          </ol>
        </details>

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">은행명</label>
            <input className="mt-1 w-full rounded-xl border p-3" value={bank} onChange={(e)=>setBank(e.target.value)} placeholder="국민은행"/>
          </div>
          <div>
            <label className="text-sm font-medium">계좌번호</label>
            <input className="mt-1 w-full rounded-xl border p-3" value={accountNo} onChange={(e)=>setAccountNo(e.target.value)} placeholder="숫자만 입력"/>
          </div>
          <div>
            <label className="text-sm font-medium">예금주</label>
            <input className="mt-1 w-full rounded-xl border p-3" value={holder} onChange={(e)=>setHolder(e.target.value)} placeholder="전효준"/>
            <p className="text-xs text-gray-500 mt-1">* 예금주는 토스 화면에 항상 반영되는 것은 아닐 수 있습니다.</p>
          </div>
          <div>
            <label className="text-sm font-medium">금액 (원)</label>
            <input type="number" className="mt-1 w-full rounded-xl border p-3" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} min={1} step={1}/>
          </div>
          <div>
            <label className="text-sm font-medium">메모 (선택)</label>
            <input className="mt-1 w-full rounded-xl border p-3" value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder="예: 모임회비"/>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input id="originQR" type="checkbox" checked={useOriginQR} onChange={(e)=>setUseOriginQR(e.target.checked)} />
            <label htmlFor="originQR" className="text-sm text-gray-700">origin=qr 파라미터 사용</label>
          </div>

          {errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-sm">
              {errors.map((err, i)=> <div key={i}>• {err}</div>)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mt-4 flex flex-col items-center">
          <div className="mb-3 text-center">
            <div className="text-sm text-gray-500">딥링크</div>
            <div className="text-xs break-all bg-gray-100 rounded-xl p-2 mt-1">{deepLink}</div>
          </div>

          <QRCodeCanvas value={deepLink} size={qrSize} includeMargin={true} />
          <div className="flex gap-2 mt-4 w-full">
            <button onClick={openInToss} disabled={errors.length>0} className="flex-1 rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-50">토스로 열기</button>
            <button onClick={copyLink} className="flex-1 rounded-xl border py-3 font-semibold">링크 복사</button>
          </div>

          <div className="text-xs text-gray-500 mt-3 text-center">
            {isMobile ? "모바일 환경으로 감지되었습니다. 앱이 열리지 않으면 토스 설치 여부를 확인하세요." : "PC에선 앱 열기가 제한될 수 있습니다. 모바일에서 테스트하세요."}
          </div>
        </div>

        <div className="mt-4 p-4 text-xs text-gray-600">
          <p>• 이 MVP는 supertoss 스킴을 이용한 송금 직전 화면 호출을 시도합니다. 최종 송금은 사용자 인증이 필요합니다.</p>
          <p>• 운영 환경에선 토스페이먼츠의 정식 결제 링크/QR을 함께 고려해 안정성과 정산 체계를 갖추는 것을 권장합니다.</p>
        </div>
      </div>
    </div>
  </div>
  );
}
