import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 임시 데이터를 서버에서 불러오는 함수입니다.
async function getLocalInfo() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  // 데이터를 가져옵니다.
  const data = await getLocalInfo();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. 상단 헤더 영역 - 시원한 파란색 */}
      <header className="bg-blue-600 text-white py-5 px-4 shadow-md sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-sm hover:opacity-90 transition">
            <span>🌊</span> 성남시 생활 정보
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="text-white hover:text-blue-200 font-medium pb-1 border-b-2 border-white">홈</Link>
            <Link href="/blog" className="text-white hover:text-blue-200 font-medium">블로그</Link>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 (화면 가운데 정렬) */}
      <main className="max-w-4xl mx-auto p-4 py-10 space-y-14">
        
        {/* 2. 이번 달 행사/축제 카드 목록 */}
        <section>
          <div className="flex flex-col mb-6">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              🎉 이번 달 행사/축제
            </h2>
            <p className="text-slate-500 mt-1 font-medium">놓치면 아쉬운 우리 동네 즐길 거리 모음</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.events.map((event: any) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100 overflow-hidden flex flex-col group">
                <div className="p-5 flex-grow">
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mb-3 border border-blue-100">
                    {event.category}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800 break-keep group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-5 line-clamp-2 break-keep">{event.summary}</p>
                  
                  <div className="space-y-2 mb-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold w-12 shrink-0">기간</span>
                      <span className="text-slate-700">{event.startDate} ~ {event.endDate}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold w-12 shrink-0">장소</span>
                      <span className="text-slate-700">{event.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold w-12 shrink-0">대상</span>
                      <span className="text-slate-700">{event.target}</span>
                    </div>
                  </div>
                </div>
                
                {/* 블로그로 이동하도록 링크를 수정합니다. */}
                <div className="px-5 py-3 bg-blue-50/50 border-t border-blue-100 mt-auto opacity-90 hover:opacity-100">
                  <Link href="/blog" className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center justify-center transition-colors">
                    자세히 보기 &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 카드 목록 */}
        <section>
          <div className="flex flex-col mb-6">
            <h2 className="text-2xl font-bold text-sky-600 flex items-center gap-2">
              💰 챙겨야 할 혜택
            </h2>
            <p className="text-slate-500 mt-1 font-medium">우리 가족에게 딱 맞는 맞춤형 지원금</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benefits.map((benefit: any) => (
              <div key={benefit.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-sky-100 overflow-hidden flex flex-col group">
                <div className="p-5 flex-grow">
                  <div className="text-xs font-bold text-sky-600 bg-sky-50 inline-block px-3 py-1 rounded-full mb-3 border border-sky-100">
                    {benefit.category}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800 break-keep group-hover:text-sky-600 transition-colors">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 mb-5 break-keep">{benefit.summary}</p>
                  
                  <div className="space-y-2 text-sm bg-sky-50/50 p-4 rounded-xl border border-sky-50">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold w-12 shrink-0">기간</span>
                      <span className="text-slate-700">{benefit.startDate}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold w-12 shrink-0">대상</span>
                      <span className="text-slate-700">{benefit.target}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold w-12 shrink-0">방법</span>
                      <span className="text-slate-700">{benefit.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-sky-50/50 border-t border-sky-100 mt-auto opacity-90 hover:opacity-100">
                  <Link href="/blog" className="text-sm font-bold text-sky-700 hover:text-sky-900 flex items-center justify-center transition-colors">
                    신청 안내 보기 &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 (꼬리말) */}
      <footer className="bg-slate-100 py-10 text-center text-sm text-slate-500 mt-10 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="font-medium text-slate-600">정보 출처: 공공데이터포털 (현재는 화면 구성을 위한 임시 데이터입니다)</p>
          <p className="opacity-80">마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </footer>
    </div>
  );
}
