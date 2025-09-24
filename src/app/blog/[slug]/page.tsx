
import { getBlogPost, getBlogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Ensure new posts can be rendered on demand
export const dynamic = 'force-dynamic';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getBlogPosts().filter(p => p.slug !== params.slug).slice(0, 2);

  return (
    <div className="bg-background">
        <div className="container mx-auto px-4 py-12 md:py-20">
            <article className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="flex justify-center gap-2 mb-4">
                        {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        {post.title}
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        By {post.author} on {post.date}
                    </p>
                </header>
                <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={600}
                    data-ai-hint={post.dataAiHint}
                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                    priority
                />
                <div 
                  className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
            </article>
        </div>

        <aside className="w-full py-16 bg-primary/5">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {relatedPosts.map((relatedPost) => (
                        <Card key={relatedPost.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <Link href={`/blog/${relatedPost.slug}`}>
                                <Image
                                    src={relatedPost.image}
                                    alt={relatedPost.title}
                                    width={400}
                                    height={200}
                                    data-ai-hint={relatedPost.dataAiHint}
                                    className="w-full h-48 object-cover"
                                />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">
                                <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                                    {relatedPost.title}
                                </Link>
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">{relatedPost.excerpt}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </aside>
    </div>
  );
}

// remove generateStaticParams to make the page dynamic
/*
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
*/
