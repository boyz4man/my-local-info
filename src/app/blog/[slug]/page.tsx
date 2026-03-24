import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-blue-600 text-white py-5 px-4 shadow-md sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-sm hover:opacity-80 transition">
            <span>🌊</span> 성남시 생활 정보
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="text-white hover:text-blue-200 font-medium">홈</Link>
            <Link href="/blog" className="text-white hover:text-blue-200 font-medium pb-1 border-b-2 border-white">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full p-4 py-10 flex-grow text-slate-800">
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <header className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {post.category}
              </span>
              <time className="text-sm text-slate-500 font-medium">{post.date}</time>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-keep">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-sm text-slate-600 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="p-8 md:p-12 prose prose-slate prose-lg max-w-none prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
          
          <div className="bg-slate-50 p-6 flex justify-center items-center border-t border-slate-100">
            <Link href="/blog" className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 text-lg font-bold rounded-xl shadow-sm border border-slate-200 transition flex items-center justify-center">
              블로그 목록으로 돌아가기
            </Link>
          </div>
        </article>
      </main>

      <footer className="bg-slate-100 py-10 text-center text-sm text-slate-500 mt-auto border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="font-medium text-slate-600">정보 출처: 공공데이터포털 (현재는 화면 구성을 위한 임시 데이터입니다)</p>
        </div>
      </footer>
    </div>
  );
}
