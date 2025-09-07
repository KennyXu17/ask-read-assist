import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Menu, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// 延迟加载ChatWidget组件
const ChatWidget = lazy(() => import("./ChatWidget").then(module => ({ default: module.ChatWidget })));

interface Chapter {
  id: string;
  title: string;
  content: string; // Markdown content
  filename?: string;
  chapter_number?: number;
}

export function BlogLayout() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting to load chapters from https://jenny-capital-300348180421.us-central1.run.app/chapters");
      
      const response = await fetch("https://jenny-capital-300348180421.us-central1.run.app/chapters");
      
      console.log("Load chapters response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.text();
          console.error("Error response body:", errorData);
          errorMessage += errorData ? ` - ${errorData}` : '';
        } catch (parseErr) {
          console.error("Could not parse error response:", parseErr);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Chapters data received:", data);
      
      if (data.chapters && data.chapters.length > 0) {
        setChapters(data.chapters);
        console.log(`Successfully loaded ${data.chapters.length} chapters`);
      } else {
        const message = data.message || "No chapters found. Please generate them first.";
        console.log("No chapters available:", message);
        setError(message);
      }
    } catch (err) {
      console.error("Failed to load chapters:", err);
      
      // 提供更详细的错误信息
      let errorMessage = "Failed to load chapters. ";
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage += "Cannot connect to the backend server at https://jenny-capital-300348180421.us-central1.run.app. Please ensure the server is running on port 8080.";
      } else if (err instanceof Error) {
        errorMessage += `Error: ${err.message}`;
      } else {
        errorMessage += "Unknown error occurred.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const regenerateChapters = async () => {
    try {
      setRegenerating(true);
      setError(null); // 清除之前的错误
      
      // 首先检查服务器是否可达
      console.log("Attempting to regenerate chapters...");
      
      const response = await fetch("https://jenny-capital-300348180421.us-central1.run.app/chapters/regenerate", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));
      
      if (!response.ok) {
        // 尝试获取错误响应的详细信息
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.text();
          console.error("Error response body:", errorData);
          errorMessage += errorData ? ` - ${errorData}` : '';
        } catch (parseErr) {
          console.error("Could not parse error response:", parseErr);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Regeneration result:", data);
      
      // Reload chapters after regeneration
      await loadChapters();
    } catch (err) {
      console.error("Failed to regenerate chapters:", err);
      
      // 提供更详细的错误信息
      let errorMessage = "Failed to regenerate chapters. ";
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage += "Cannot connect to the backend server at https://jenny-capital-300348180421.us-central1.run.app. Please ensure the server is running.";
      } else if (err instanceof Error) {
        errorMessage += `Error: ${err.message}`;
      } else {
        errorMessage += "Unknown error occurred. Please check the console for details.";
      }
      
      setError(errorMessage);
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>📖 Loading chapters...</p>
      </div>
    );
  }

  if (error || chapters.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-lg mb-4">⚠️ {error || "No chapters available."}</p>
          <Button onClick={regenerateChapters} disabled={regenerating} className="gap-2">
            {regenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate Chapters
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-serif font-semibold text-heading-color">
              Rule 144 Deep Dive
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={regenerateChapters}
              disabled={regenerating}
              className="gap-2"
            >
              {regenerating ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevChapter}
              disabled={currentChapter === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextChapter}
              disabled={currentChapter === chapters.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside
          className={`w-80 flex-shrink-0 ${sidebarOpen ? "block" : "hidden"} md:block`}
        >
          <div className="sticky top-20 py-6">
            <h3 className="text-lg font-semibold text-heading-color mb-4">
              Table of Contents
            </h3>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <nav className="space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setCurrentChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentChapter === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-sm font-medium">
                      Chapter {chapter.chapter_number || index + 1}
                    </div>
                    <div className="text-xs truncate">{chapter.title}</div>
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 max-w-4xl">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <header className="mb-8">
              <div className="text-sm text-caption-color mb-2">
                Chapter {chapters[currentChapter].chapter_number || currentChapter + 1} of {chapters.length}
              </div>
              <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>
            </header>

            {/* Markdown Content */}
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1 className="text-4xl font-bold mb-6 text-heading-color border-b pb-4" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-3xl font-semibold mt-12 mb-6 text-heading-color" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-2xl font-semibold mt-8 mb-4 text-heading-color" {...props}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4 className="text-xl font-semibold mt-6 mb-3 text-heading-color" {...props}>
                      {children}
                    </h4>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="mb-4 text-base leading-7 text-body-color" {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside mb-6 space-y-2 text-body-color" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside mb-6 space-y-2 text-body-color" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="mb-1 leading-7" {...props}>{children}</li>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-muted-foreground" {...props}>
                      {children}
                    </blockquote>
                  ),

                  code: ({ node, className, children, ...props }: any) => {
                    const inline = (props as any)?.inline;
                    const isInline = inline;
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                        {children}
                      </code>
                    );
                  },

                  pre: ({ children, ...props }) => (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6" {...props}>
                      {children}
                    </pre>
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="font-semibold text-heading-color" {...props}>
                      {children}
                    </strong>
                  ),
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse border border-border" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="border border-border p-3 bg-muted font-semibold text-left" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="border border-border p-3" {...props}>
                      {children}
                    </td>
                  ),
                }}
              >
                {chapters[currentChapter].content}
              </ReactMarkdown>
            </div>

            {/* Chapter Navigation */}
            <footer className="flex justify-between items-center pt-12 mt-12 border-t">
              <Button
                variant="outline"
                onClick={prevChapter}
                disabled={currentChapter === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Chapter
              </Button>

              <span className="text-sm text-caption-color">
                {currentChapter + 1} / {chapters.length}
              </span>

              <Button
                onClick={nextChapter}
                disabled={currentChapter === chapters.length - 1}
                className="gap-2"
              >
                Next Chapter
                <ChevronRight className="h-4 w-4" />
              </Button>
            </footer>
          </article>
        </main>
      </div>

      {/* Chat Widget - 延迟加载 */}
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}