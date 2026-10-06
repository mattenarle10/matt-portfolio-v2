"use client"

import { ArrowUpRight, Folder, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useChat } from "@/components/chat/chat-provider"
import { CommandTrigger } from "@/components/layout/command-menu"

export function QuickActions() {
  const { openChat } = useChat()
  return (
    <nav className="quick-actions" aria-label="Quick actions">
      <Link href="/projects" className="quick-action">
        <Folder size={14} aria-hidden="true" />
        Projects
        <ArrowUpRight size={12} aria-hidden="true" />
      </Link>
      <button type="button" className="quick-action" onClick={openChat}>
        <MessageCircle size={14} aria-hidden="true" />
        Ask Matt<span className="command-badge">AI</span>
      </button>
      <CommandTrigger />
    </nav>
  )
}
