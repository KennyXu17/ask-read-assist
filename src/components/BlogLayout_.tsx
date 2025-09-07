import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { ChatWidget } from "./ChatWidget";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const sampleChapters: Chapter[] = [
  {
    id: "1",
    title: "Introduction to Modern Web Development",
    content: `
      <p>Welcome to the fascinating world of modern web development. In this comprehensive guide, we'll explore the fundamental concepts, tools, and technologies that shape today's digital landscape.</p>
      
      <p>Web development has evolved tremendously over the past decade. What started as simple HTML pages has transformed into complex, interactive applications that power everything from social networks to enterprise software.</p>
      
      <p>In this chapter, we'll cover the essential building blocks of modern web development, including HTML5, CSS3, and JavaScript ES6+. We'll also discuss the importance of responsive design, accessibility, and performance optimization.</p>
      
      <p>Whether you're a complete beginner or looking to update your skills, this guide will provide you with the knowledge and practical examples you need to succeed in web development.</p>
    `
  },
  {
    id: "2",
    title: "Understanding React and Component Architecture",
    content: `
      <p>React has revolutionized the way we build user interfaces. This component-based library allows developers to create reusable, maintainable, and efficient web applications.</p>
      
      <p>In this chapter, we'll dive deep into React's core concepts:</p>
      
      <ul>
        <li><strong>Components:</strong> The building blocks of React applications</li>
        <li><strong>JSX:</strong> JavaScript XML syntax for describing UI elements</li>
        <li><strong>Props:</strong> How data flows between components</li>
        <li><strong>State:</strong> Managing component data and interactions</li>
        <li><strong>Hooks:</strong> Modern React features for state and lifecycle management</li>
      </ul>
      
      <p>We'll also explore best practices for component design, including composition patterns, prop validation, and performance optimization techniques.</p>
      
      <p>By the end of this chapter, you'll have a solid understanding of how to build scalable React applications using modern development patterns.</p>
    `
  },
  {
    id: "3",
    title: "Styling with Tailwind CSS",
    content: `
      <p>Tailwind CSS has emerged as one of the most popular utility-first CSS frameworks. It provides a comprehensive set of utility classes that enable rapid UI development without writing custom CSS.</p>
      
      <p>This chapter covers everything you need to know about Tailwind CSS:</p>
      
      <p><strong>Core Concepts:</strong> Understanding utility classes, responsive design, and the mobile-first approach. Learn how to use spacing, typography, colors, and layout utilities effectively.</p>
      
      <p><strong>Customization:</strong> Tailwind's configuration system allows you to customize colors, fonts, spacing, and more to match your design system perfectly.</p>
      
      <p><strong>Advanced Features:</strong> Explore dark mode support, custom utilities, component extraction, and optimization strategies for production builds.</p>
      
      <p>We'll build practical examples showcasing how Tailwind CSS can accelerate your development workflow while maintaining design consistency across your applications.</p>
    `
  }
];

export function BlogLayout() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nextChapter = () => {
    if (currentChapter < sampleChapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

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
              Modern Web Development Guide
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
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
              disabled={currentChapter === sampleChapters.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside className={`w-80 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-20 py-6">
            <h3 className="text-lg font-semibold text-heading-color mb-4">Table of Contents</h3>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <nav className="space-y-2">
                {sampleChapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setCurrentChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentChapter === index
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm font-medium">Chapter {index + 1}</div>
                    <div className="text-xs truncate">{chapter.title}</div>
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <div className="text-sm text-caption-color mb-2">
                Chapter {currentChapter + 1} of {sampleChapters.length}
              </div>
              <h1 className="blog-title mb-4">
                {sampleChapters[currentChapter].title}
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </header>
            
            <div 
              className="blog-body space-y-6"
              dangerouslySetInnerHTML={{ 
                __html: sampleChapters[currentChapter].content 
              }}
            />
            
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
                {currentChapter + 1} / {sampleChapters.length}
              </span>
              
              <Button
                onClick={nextChapter}
                disabled={currentChapter === sampleChapters.length - 1}
                className="gap-2"
              >
                Next Chapter
                <ChevronRight className="h-4 w-4" />
              </Button>
            </footer>
          </article>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}