import { getBlogPosts, BlogPost } from '@/lib/blog-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-28 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            BHK SEO Tools Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Insights, trends, and strategies on SEO, content marketing, and AI.
          </p>
          <div className="mt-8 max-w-lg mx-auto relative">
            <Input placeholder="Search articles..." className="pr-10 h-12 text-base" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    data-ai-hint={post.dataAiHint}
                    className="w-full h-48 object-cover"
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <h2 className="text-xl font-bold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {post.author} • {post.date}
                </p>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="link" className="p-0">
                  <Link href={`/blog/${post.slug}`}>Read More →</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
