"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import Image from 'next/image'

type NavLink = {
  id: number
  title: string
  href: string
}

type NavSection = {
  label?: string
  links: NavLink[]
}

const navSections: NavSection[] = [
  {
    links: [
      { id: 1, title: "Your Words", href: "/dashboard" },
      { id: 2, title: "New Word", href: "/new-word" },
      { id: 3, title: "Ask AI", href: "/ai" },
    ],
  },
  {
    label: "Learning",
    links: [
      { id: 4, title: "Flashcards", href: "/dashboard/flashcards" },
      { id: 5, title: "Practice", href: "/dashboard/practice" },
      { id: 6, title: "Review", href: "/dashboard/review" },
    ],
  },
  {
    label: "Collections",
    links: [
      { id: 7, title: "Collections", href: "/dashboard/collections" },
      { id: 8, title: "Favorites", href: "/dashboard/favorites" },
    ],
  },
  {
    label: "More",
    links: [
      { id: 9, title: "Leaderboard", href: "/dashboard/leaderboard" },
      { id: 10, title: "Settings", href: "/dashboard/settings" },
    ],
  },
]

const Sidebar = () => {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();

  return (
    <aside className='flex flex-col h-full w-60 shrink-0 bg-card text-card-foreground border-r border-border'>

      {/* Head */}
      <div className="px-5 py-5">
        <h1 className='text-2xl font-bold tracking-tight'>
          Vocab<span className='text-primary'>UP</span>
        </h1>
      </div>

      {/* Navs */}
      <nav className='flex-1 flex flex-col gap-5 px-3 pb-5 overflow-y-auto'>

        {navSections.map(section => (
          <div key={section.label ?? section.links[0].id} className='flex flex-col'>
            {section.label && (
              <p className='px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                {section.label}
              </p>
            )}
            <div className='flex flex-col gap-0.5'>
              {section.links.map(link => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={active
                      ? 'bg-primary/10 text-primary font-medium px-3 py-2 rounded-md text-sm transition-colors'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md text-sm transition-colors'
                    }
                  >
                    {link.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className='flex items-center gap-3'>
          {session?.user.image ? (
            <Image src={session.user.image} alt='profile' width={32} height={32} className='rounded-full shrink-0'/>
          ) : (
            <Image src={"/profile.webp"} alt='profile' width={32} height={32} className='rounded-full shrink-0'/>
            // <div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0'>
            //   {session?.user.name?.charAt(0).toUpperCase() ?? 'U'}
            // </div>
          )}
          <div className='flex flex-col min-w-0'>
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user.name ?? 'Loading...'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user.email ?? ''}
            </p>
          </div>
        </div>
        </div>
    </aside>
  )
}

export default Sidebar