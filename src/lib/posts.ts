import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// Ensure directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data } = matter(fileContents);
      
      let formattedDate = data.date || '';
      if (data.date instanceof Date) {
        formattedDate = data.date.toISOString().split('T')[0];
      } else if (typeof data.date === 'string') {
        formattedDate = data.date;
      }

      return {
        slug,
        title: data.title || 'Untitled',
        date: formattedDate,
        summary: data.summary || '',
        category: data.category || 'Uncategorized',
        tags: data.tags || [],
      };
    });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    let formattedDate = data.date || '';
    if (data.date instanceof Date) {
      formattedDate = data.date.toISOString().split('T')[0];
    } else if (typeof data.date === 'string') {
      formattedDate = data.date;
    }

    return {
      slug,
      title: data.title || 'Untitled',
      date: formattedDate,
      summary: data.summary || '',
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      content,
    };
  } catch (e) {
    return null;
  }
}
