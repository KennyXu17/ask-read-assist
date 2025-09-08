import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 👇 使用自定义域名时设置为根路径
  base: "/",

  server: {
    host: "::", // 允许局域网访问
    port: 8080,
    open: true, // 本地开发时自动打开浏览器
  },

  build: {
    sourcemap: true, // 👈 开启 Source Map，方便定位生产环境报错
    outDir: "dist",  // 默认就是 dist，可以手动指定
    emptyOutDir: true, // 构建前清理 dist
    chunkSizeWarningLimit: 1000, // 提高警告阈值到1MB
    assetsInlineLimit: 0, // 禁用内联资源，确保所有文件都有正确的扩展名
    rollupOptions: {
      output: {
        // 确保输出文件有正确的扩展名
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // 将React相关库分离到单独的chunk
          react: ['react', 'react-dom'],
          // 将路由相关库分离
          router: ['react-router-dom'],
          // 将Radix UI组件库分离
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-label',
            '@radix-ui/react-switch',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip'
          ],
          // 将Markdown相关库分离
          markdown: ['react-markdown', 'remark-gfm', 'rehype-raw'],
          // 将图标库分离
          icons: ['lucide-react'],
          // 将其他工具库分离
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // 将查询库分离
          query: ['@tanstack/react-query'],
        },
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
