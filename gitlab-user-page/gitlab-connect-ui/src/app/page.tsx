import { SettingsDialog } from '@/components/settings-dialog';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <SettingsDialog defaultOpen={true} />
    </main>
  );
}
