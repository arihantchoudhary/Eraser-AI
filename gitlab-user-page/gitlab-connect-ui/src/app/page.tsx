import { Sidebar } from '@/components/sidebar';
import { GitLabConnect } from '@/components/gitlab-connect';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 border-l border-gray-200">
        <header className="px-6 py-3 border-b flex flex-row justify-between items-center border-gray-200 bg-white">
          <h1 className="text-xl font-medium">Settings</h1>
        </header>
        <div className="p-6 overflow-y-auto">
          <GitLabConnect />
        </div>
      </div>
    </main>
  );
}
