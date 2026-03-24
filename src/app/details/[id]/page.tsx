import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 임시 데이터를 서버에서 불러오는 함수
async function getLocalInfo() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// --------------------------------------------------------------------------
// 상세 페이지들의 주소(id)를 미리 생성해두는 함수입니다. (output: export 에러 해결)
// 정적 웹사이트로 만들 때(build/export), 몇 번 id 페이지들을 만들어야 할지 Next.js에게 알려줍니다.
export async function generateStaticParams() {
  const data = await getLocalInfo();
  const allItems = [...data.events, ...data.benefits];
  
  // 모든 행사와 혜택의 id를 가져와서 목록으로 만들어 전달합니다.
  return allItems.map((item) => ({
    id: item.id.toString(),
  }));
}
// --------------------------------------------------------------------------

// Next.js App Router 동적 라우팅 설정
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 최신 Next.js 규칙에 따라 params가 비동기 형태이므로 await로 확인해줍니다.
  const resolvedParams = await params;
  const data = await getLocalInfo();
  
  // 전체 데이터 합치기 (행사 + 혜택)
  const allItems = [...data.events, ...data.benefits];
  
  // URL 주소로 전달된 ID와 일치하는 항목 찾기
  const item = allItems.find((info) => info.id.toString() === resolvedParams.id);
  
  // 만약 주소가 잘못되었거나 데이터에 없는 ID라면 '페이지를 찾을 수 없습니다' 화면을 띄웁니다
  if (!item) {
    notFound();
  }

  // 테마 색상 지정 (행사는 메인 화면처럼 Blue, 혜택은 Sky 색상)
  const isEvent = item.category.includes('행사');
  
  // Tailwind CSS에서 색상을 안정적으로 불러오기 위해서 클래스 이름을 통째로 적어줍니다.
  const theme = isEvent ? {
    headerBg: 'bg-blue-600',
    badgeBg: 'bg-blue-800/60',
    badgeBorder: 'border-blue-500',
    cardBorder: 'border-blue-100',
    labelColor: 'text-blue-500',
    titleColor: 'text-blue-700',
    footerBg: 'bg-blue-50',
    footerBorder: 'border-blue-100',
    btnBg: 'bg-blue-600',
    btnHover: 'hover:bg-blue-700'
  } : {
    headerBg: 'bg-sky-600',
    badgeBg: 'bg-sky-800/60',
    badgeBorder: 'border-sky-500',
    cardBorder: 'border-sky-100',
    labelColor: 'text-sky-600',
    titleColor: 'text-sky-700',
    footerBg: 'bg-sky-50',
    footerBorder: 'border-sky-100',
    btnBg: 'bg-sky-600',
    btnHover: 'hover:bg-sky-700'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* 1. 상단 헤더 영역 - 목록으로 돌아가기 버튼 포함 */}
      <header className={`${theme.headerBg} text-white py-5 px-4 shadow-md sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-sm hover:opacity-80 transition">
            <span className="text-2xl">⬅️</span> 상세 정보
          </Link>
          <span className={`text-sm ${theme.badgeBg} px-3 py-1 rounded-full font-medium border ${theme.badgeBorder}`}>
            {item.category}
          </span>
        </div>
      </header>

      {/* 2. 상세 콘텐츠 영역 */}
      <main className="max-w-3xl mx-auto w-full p-4 py-8 flex-grow">
        <div className={`bg-white rounded-3xl shadow-sm border ${theme.cardBorder} overflow-hidden`}>
          
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 break-keep leading-tight">
              {item.title}
            </h1>
            
            {/* 기본 안내 정보 박스 */}
            <div className={`space-y-4 text-base bg-slate-50 p-6 rounded-2xl border border-slate-100`}>
              <div className="flex items-start gap-4">
                <span className={`${theme.labelColor} font-bold w-12 shrink-0 md:text-lg`}>기간</span>
                <span className="text-slate-700 font-medium md:text-lg">
                  {item.startDate} {item.endDate !== '상시' && item.endDate !== '예산 소진 시까지' ? `~ ${item.endDate}` : (item.endDate !== item.startDate ? `~ ${item.endDate}` : '')}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className={`${theme.labelColor} font-bold w-12 shrink-0 md:text-lg`}>장소</span>
                <span className="text-slate-700 font-medium md:text-lg">{item.location}</span>
              </div>
              <div className="flex items-start gap-4">
                <span className={`${theme.labelColor} font-bold w-12 shrink-0 md:text-lg`}>대상</span>
                <span className="text-slate-700 font-medium md:text-lg">{item.target}</span>
              </div>
            </div>

            {/* 본문 상세 설명 영역 */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className={`text-xl font-bold ${theme.titleColor} mb-6 flex items-center gap-2`}>
                📝 상세 내용
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg break-keep whitespace-pre-line">
                {item.summary}
              </p>
            </div>
          </div>
          
          {/* 하단 버튼 영역 */}
          <div className={`${theme.footerBg} p-6 flex flex-col sm:flex-row gap-4 justify-center items-center border-t ${theme.footerBorder}`}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-8 py-4 ${theme.btnBg} ${theme.btnHover} text-white text-lg font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2`}
            >
              원본 사이트에서 자세히 보기 &rarr;
            </a>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-bold rounded-xl shadow-sm border border-slate-200 transition flex items-center justify-center"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      {/* 3. 하단 푸터 (꼬리말) */}
      <footer className="bg-slate-100 py-10 text-center text-sm text-slate-500 mt-auto border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="font-medium text-slate-600">정보 출처: 공공데이터포털 (현재는 화면 구성을 위한 임시 데이터입니다)</p>
        </div>
      </footer>
    </div>
  );
}
