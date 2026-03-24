import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-blue-600 text-white py-5 px-4 shadow-md sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-sm hover:opacity-90">
            <span>🌊</span> 성남시 생활 정보
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="text-white hover:text-blue-200 font-medium">홈</Link>
            <Link href="/blog" className="text-white hover:text-blue-200 font-medium pb-1 border-b-2 border-white">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 py-10 flex-grow space-y-10">
        <div className="flex flex-col mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-blue-700">블로그</h1>
          <p className="text-slate-500 mt-2 font-medium">우리 동네의 가장 생생한 이야기들을 전해드려요.</p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 text-lg">아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden group">
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {post.category}
                    </span>
                    <time className="text-sm text-slate-400">{post.date}</time>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                  <p className="text-slate-600 leading-relaxed mb-4">{post.summary}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">#{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-100 py-10 text-center text-sm text-slate-500 mt-auto border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="font-medium text-slate-600">정보 출처: 공공데이터포털 (현재는 화면 구성을 위한 임시 데이터입니다)</p>
        </div>
      </footer>
    </div>
  );
}
