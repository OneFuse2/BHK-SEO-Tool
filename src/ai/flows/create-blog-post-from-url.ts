'use server';

/**
 * @fileOverview A flow for creating a blog post from a URL and a title.
 *
 * - createBlogPostFromUrl - A function that takes a URL and title, and returns a full blog post.
 * - CreateBlogPostFromUrlInput - The input type for the function.
 * - CreateBlogPostFromUrlOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CreateBlogPostFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to base the blog post on.'),
  title: z.string().describe('The title for the new blog post.'),
});
export type CreateBlogPostFromUrlInput = z.infer<typeof CreateBlogPostFromUrlInputSchema>;

export const CreateBlogPostFromUrlOutputSchema = z.object({
  slug: z.string().describe('The URL-friendly slug for the blog post.'),
  title: z.string().describe('The title of the generated blog post.'),
  content: z.string().describe('The full HTML content of the generated blog post.'),
  excerpt: z.string().describe('A short summary of the blog post.'),
  tags: z.array(z.string()).describe('A list of relevant tags for the post.'),
  author: z.string().describe('An appropriate author name for the content (e.g., "AI Content Team").'),
  image: z.string().url().describe('A placeholder image URL for the blog post.'),
  dataAiHint: z.string().describe('A hint for AI to generate a relevant image.'),
});
export type CreateBlogPostFromUrlOutput = z.infer<typeof CreateBlogPostFromUrlOutputSchema>;

export async function createBlogPostFromUrl(input: CreateBlogPostFromUrlInput): Promise<CreateBlogPostFromUrlOutput> {
  return createBlogPostFromUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createBlogPostFromUrlPrompt',
  input: { schema: CreateBlogPostFromUrlInputSchema },
  output: { schema: CreateBlogPostFromUrlOutputSchema },
  prompt: `You are an expert content creator and SEO specialist. Your task is to create a full, high-quality blog post based on the content of a given URL and a provided title.

URL: {{{url}}}
Blog Post Title: {{{title}}}

Analyze the content at the URL and write an engaging, well-structured, and SEO-optimized blog post. The post should be at least 500 words long.

- The output should be a single string of HTML content for the 'content' field.
- Generate a URL-friendly slug based on the title.
- Create a concise excerpt (around 150 characters).
- Suggest 3-5 relevant tags.
- The author should be "AI Content Team".
- Provide a relevant placeholder image URL from picsum.photos.
- Provide a 1-2 word AI hint for image generation related to the topic.

Format the output as a JSON object matching the defined schema.`,
});

const createBlogPostFromUrlFlow = ai.defineFlow(
  {
    name: 'createBlogPostFromUrlFlow',
    inputSchema: CreateBlogPostFromUrlInputSchema,
    outputSchema: CreateBlogPostFromUrlOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
