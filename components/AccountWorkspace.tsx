'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Clock3, Heart, History, Trash2, ArrowRight, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { CalculationRecord, CalculatorWorkspace } from '@/types';
import { calculatorsData } from '@/data/calculators';

const emptyWorkspace: CalculatorWorkspace = { history: [], saved: [], favorites: [], recentlyUsed: [] };

type WorkspaceTab = 'overview' | 'history' | 'saved' | 'favorites';

export default function AccountWorkspace() {
  const { data: session } = useSession();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<CalculatorWorkspace>(emptyWorkspace);
  const [tab, setTab] = useState<WorkspaceTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  const loadWorkspace = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/workspace');
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data.workspace);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) void loadWorkspace();
  }, [session?.user]);

  const deleteItem = async (type: 'history' | 'saved' | 'clear-history', id: string) => {
    const response = await fetch('/api/user/workspace', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id }),
    });
    if (response.ok) setWorkspace((await response.json()).workspace);
  };

  const openCalculator = (record: CalculationRecord) => {
    window.localStorage.setItem('metricores_restore_calculation', JSON.stringify(record));
    router.push(`/calculators/${record.calculatorId}`);
  };

  const records = tab === 'saved' ? workspace.saved : workspace.history;
  const visibleRecords = records
    .filter((record) => `${record.name || ''} ${record.calculatorName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((first, second) => sortNewest ? second.createdAt.localeCompare(first.createdAt) : first.createdAt.localeCompare(second.createdAt));
  const favoriteNames = workspace.favorites.map((id) => calculatorsData[id]?.name).filter(Boolean);
  const recentNames = workspace.recentlyUsed.map((id) => calculatorsData[id]?.name).filter(Boolean);
  const currentMonth = new Date();
  const monthlyCalculationCount = workspace.history.filter((record) => {
    const createdAt = new Date(record.createdAt);
    return createdAt.getFullYear() === currentMonth.getFullYear() && createdAt.getMonth() === currentMonth.getMonth();
  }).length;

  if (!session?.user) return null;

  return (
    <section className="mx-auto mb-8 max-w-5xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
      <div className="flex flex-col gap-5 border-b border-zinc-200 px-6 py-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Personal workspace</p>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {session.user.name?.split(' ')[0] || 'there'}.</h2>
          <p className="mt-1 text-sm text-zinc-500">Your calculators, saved work, and return paths in one place.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(['overview', 'history', 'saved', 'favorites'] as WorkspaceTab[]).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={`whitespace-nowrap border px-3 py-2 text-xs font-semibold capitalize transition-colors ${tab === item ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 p-6 md:grid-cols-2" aria-busy="true" aria-label="Loading workspace">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-zinc-200 p-4" aria-hidden="true">
              <div className="flex items-center gap-2">
                <div className="workspace-skeleton-shimmer h-6 w-6 rounded-full" />
                <div className="workspace-skeleton-shimmer h-3 w-32" />
              </div>
              <div className="workspace-skeleton-shimmer mt-4 h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : tab === 'overview' ? (
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <OverviewBlock icon={<Clock3 />} title="Recently used" items={recentNames} empty="Calculators you use will appear here." onClick={() => setTab('history')} />
          <OverviewBlock icon={<Heart />} title="Favorites" items={favoriteNames} empty="Add your most-used calculators for quick access." onClick={() => setTab('favorites')} />
          <OverviewBlock icon={<Bookmark />} title="Saved calculations" items={workspace.saved.slice(0, 3).map((item) => item.name || item.calculatorName)} empty="Save calculations you want to revisit later." onClick={() => setTab('saved')} />
          <OverviewBlock icon={<History />} title="Activity" items={[`${monthlyCalculationCount} calculation${monthlyCalculationCount === 1 ? '' : 's'} this month`]} empty="Your calculation history will appear here." onClick={() => setTab('history')} />
        </div>
      ) : tab === 'favorites' ? (
        <div className="grid gap-3 p-6 md:grid-cols-2">
          {workspace.favorites.length === 0 ? <EmptyState text="Add your most-used calculators for quick access." action="Browse calculators" onClick={() => router.push('/')} /> : workspace.favorites.map((id) => (
            <button key={id} type="button" onClick={() => router.push(`/calculators/${id}`)} className="flex items-center justify-between border border-zinc-200 p-4 text-left hover:bg-zinc-50">
              <span><span className="block text-sm font-semibold text-zinc-900">{calculatorsData[id]?.name}</span><span className="mt-1 block text-xs text-zinc-500">{calculatorsData[id]?.category}</span></span><ArrowRight className="h-4 w-4 text-zinc-500" />
            </button>
          ))}
        </div>
      ) : (
        <div className="p-6">
          {records.length === 0 ? <EmptyState text={tab === 'saved' ? 'Save calculations you want to revisit later.' : 'Your calculation history will appear here.'} action="Start calculating" onClick={() => router.push('/')} /> : <>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`Search ${tab}`} aria-label={`Search ${tab}`} className="min-w-0 flex-1 border border-zinc-200 bg-transparent px-3 py-2 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900" />
              <button type="button" onClick={() => setSortNewest(!sortNewest)} className="border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">{sortNewest ? 'Newest first' : 'Oldest first'}</button>
              {tab === 'history' && <button type="button" onClick={() => deleteItem('clear-history', 'all')} className="border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Clear history</button>}
            </div>
            {visibleRecords.length === 0 ? <p className="py-8 text-center text-sm text-zinc-500">No matching calculations.</p> : <div className="space-y-2">{visibleRecords.map((record) => <RecordRow key={record.id} record={record} onOpen={() => openCalculator(record)} onDelete={() => deleteItem(tab, record.id)} />)}</div>}
          </>}
        </div>
      )}
    </section>
  );
}

function OverviewBlock({ icon, title, items, empty, onClick }: { icon: React.ReactNode; title: string; items: string[]; empty: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50"><div className="flex items-center gap-2 text-emerald-600">{icon}<span className="text-xs font-bold uppercase tracking-wider text-zinc-600">{title}</span></div>{items.length ? <div className="mt-4 space-y-1">{items.map((item) => <p key={item} className="text-sm text-zinc-900">{item}</p>)}</div> : <p className="mt-4 text-xs leading-relaxed text-zinc-500">{empty}</p>}</button>;
}

function EmptyState({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return <div className="border border-dashed border-zinc-300 px-5 py-10 text-center"><Calculator className="mx-auto mb-3 h-5 w-5 text-zinc-400" /><p className="text-sm text-zinc-500">{text}</p><button type="button" onClick={onClick} className="mt-4 inline-flex items-center gap-2 bg-zinc-900 px-3 py-2 text-xs font-bold text-white hover:bg-zinc-700">{action}<ArrowRight className="h-3.5 w-3.5" /></button></div>;
}

function RecordRow({ record, onOpen, onDelete }: { record: CalculationRecord; onOpen: () => void; onDelete: () => void }) {
  return <div className="flex flex-col gap-3 border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onOpen} className="text-left"><span className="block text-sm font-semibold text-zinc-900">{record.name || record.calculatorName}</span><span className="mt-1 block text-xs text-zinc-500">{record.calculatorName} · {new Date(record.createdAt).toLocaleString()}</span></button><div className="flex items-center gap-2"><button type="button" onClick={onOpen} className="border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">Reuse</button><button type="button" onClick={onDelete} aria-label={`Delete ${record.name || record.calculatorName}`} className="p-2 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></div>;
}
