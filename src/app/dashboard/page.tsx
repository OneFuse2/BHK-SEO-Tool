import UrlForm from './url-form';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Analyze Your Website's SEO
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter any URL to get an instant, AI-powered SEO report. Discover keywords, check performance, and unlock insights to improve your ranking.
        </p>
        <div className="mt-8">
          <UrlForm />
        </div>
      </div>
    </div>
  );
}
