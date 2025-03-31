import { Sidebar } from '@/components/sidebar';
import { ImportedProjects } from '@/components/imported-projects';

export default function ImportedProjectsPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 border-l border-gray-200">
        <header className="px-6 py-3 border-b flex flex-row justify-between items-center border-gray-200 bg-white">
          <h1 className="text-xl font-medium">Imported Projects</h1>
        </header>
        <div className="p-6 overflow-y-auto">
          <ImportedProjects />
        </div>
      </div>
    </main>
  );
}
