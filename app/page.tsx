import KanbanBoardClient from '@/src/components/KanbanBoardClient'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-screen-xl flex-col items-center gap-2 px-6 py-10">
        <KanbanBoardClient />
      </main>
    </div>
  )
}
