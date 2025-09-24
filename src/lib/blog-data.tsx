
import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  dataAiHint: string;
  tags: string[];
  content: string;
}

const postsFilePath = path.join(process.cwd(), 'src', 'lib', 'blog-posts.json');

function readPosts(): BlogPost[] {
  try {
    const postsJson = fs.readFileSync(postsFilePath, 'utf-8');
    return JSON.parse(postsJson);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function writePosts(posts: BlogPost[]): void {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}


export function getBlogPosts(): BlogPost[] {
  const posts = readPosts();
  // sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function addBlogPost(post: BlogPost) {
  const posts = getBlogPosts();
  // Remove any existing post with the same slug
  const filteredPosts = posts.filter(p => p.slug !== post.slug);
  const newPosts = [post, ...filteredPosts];
  writePosts(newPosts);
}
