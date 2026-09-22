import React from 'react'

type Word = {
  word: string
  meaning: string
  discoveredAt: string
}

const stats = {
  wordsDiscovered: 128,
  dailyStreak: 14,
  score: 2340,
}

const recentWords: Word[] = [
  { word: 'Ephemeral', meaning: 'Lasting for a very short time.', discoveredAt: 'Today' },
  { word: 'Serendipity', meaning: 'Finding something good without looking for it.', discoveredAt: 'Yesterday' },
  { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere.', discoveredAt: '2 days ago' },
  { word: 'Mellifluous', meaning: 'Sweet or musical; pleasant to hear.', discoveredAt: '3 days ago' },
  { word: 'Ineffable', meaning: 'Too great or extreme to be expressed in words.', discoveredAt: '4 days ago' },
]

const todayTask = {
  title: 'Learn 5 new words',
  description: 'Pick 5 words from your saved list or discover new ones using Ask AI and add them to your vocabulary.',
  progress: 3,
  target: 5,
}

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Keep discovering, your streak depends on it.</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">New Words Discovered</span>
          <span className="text-4xl font-bold text-primary">{stats.wordsDiscovered}</span>
          <span className="text-xs text-muted-foreground">+12 this week</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Daily Streak</span>
          <span className="text-4xl font-bold text-warning">{stats.dailyStreak} days</span>
          <span className="text-xs text-muted-foreground">Best: 21 days</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="text-4xl font-bold text-accent">{stats.score.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">+180 today</span>
        </div>
      </section>

      {/* Recent words + Today's task */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Recent words */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">Recent New Words</h2>
          <ul className="flex flex-col divide-y divide-border">
            {recentWords.map(word => (
              <li key={word.word} className="flex items-center justify-between py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{word.word}</span>
                  <span className="text-sm text-muted-foreground">{word.meaning}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-3">{word.discoveredAt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Today's task */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground">Today&apos;s Task</h2>

          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">{todayTask.title}</span>
            <span className="text-sm text-muted-foreground">{todayTask.description}</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{todayTask.progress}/{todayTask.target}</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${(todayTask.progress / todayTask.target) * 100}%` }}
              />
            </div>
          </div>

          <a
            href="/new-word"
            className="mt-auto bg-primary text-primary-foreground py-2 px-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
          >
            {todayTask.progress >= todayTask.target ? 'Task Complete' : 'Add New Words'}
          </a>
        </div>
      </section>
    </div>
  )
}

export default Dashboard