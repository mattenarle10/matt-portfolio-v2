"use client"

import { Command } from "cmdk"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Command as CommandIcon,
  Copy,
  FileText,
  Folder,
  Home,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Sun,
  User,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useChat } from "@/components/chat/chat-provider"
import { useTheme } from "@/context"

const CommandContext = createContext({ openMenu: () => {} })

export function CommandTrigger({ compact = false }: { compact?: boolean }) {
  const { openMenu } = useContext(CommandContext)
  return (
    <button
      type="button"
      onClick={openMenu}
      className={`command-trigger ${compact ? "command-trigger-compact" : ""}`}
      aria-label="Open command menu"
      data-command-trigger
      aria-keyshortcuts="Meta+K Control+K"
    >
      <CommandIcon size={14} aria-hidden="true" />
      {!compact && <span>Commands</span>}
      <kbd className="hidden md:inline">K</kbd>
    </button>
  )
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [notice, setNotice] = useState("")
  const returnFocus = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { openChat, closeChat } = useChat()

  function openMenu() {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    closeChat()
    setQuery("")
    setOpen(true)
  }

  function closeMenu(restoreFocus = true) {
    setOpen(false)
    if (restoreFocus) {
      requestAnimationFrame(() => {
        const target = returnFocus.current
        if (target?.isConnected && target.getClientRects().length)
          target.focus()
        else {
          Array.from(
            document.querySelectorAll<HTMLButtonElement>(
              "[data-command-trigger]"
            )
          )
            .find((button) => button.getClientRects().length)
            ?.focus()
        }
      })
    }
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey ||
        event.shiftKey ||
        event.isComposing ||
        event.repeat
      )
        return
      event.preventDefault()
      if (open) closeMenu()
      else openMenu()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, closeChat])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(""), 3000)
    return () => clearTimeout(timer)
  }, [notice])

  function run(action: () => void, restoreFocus = true) {
    closeMenu(restoreFocus)
    action()
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("matthew.enarle@outlook.com")
      setNotice("Email copied")
    } catch {
      setNotice("Couldn't copy. Email: matthew.enarle@outlook.com")
    }
  }

  const pages = [
    { label: "Home", href: "/", icon: Home, description: "Back to the start" },
    {
      label: "About",
      href: "/about",
      icon: User,
      description: "Experience, education & life",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: Folder,
      description: "Things I've built",
    },
    {
      label: "Writing",
      href: "/writing",
      icon: BookOpen,
      description: "Notes from the work",
    },
  ]

  return (
    <CommandContext.Provider value={{ openMenu }}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={(value) => (value ? openMenu() : closeMenu())}
        label="Command menu"
        loop
        className="command-menu"
        contentClassName="command-dialog"
        overlayClassName="command-overlay"
        aria-describedby={undefined}
      >
        <div className="command-search">
          <Search size={18} aria-hidden="true" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Run a command..."
            aria-label="Search pages and actions"
          />
          <button
            type="button"
            className="command-close"
            onClick={() => closeMenu()}
            aria-label="Close command menu"
          >
            <X size={16} />
          </button>
        </div>
        <Command.List>
          <Command.Empty>No commands found.</Command.Empty>
          <Command.Group heading="Explore">
            {pages.map(({ label, href, icon: Icon, description }) => (
              <Command.Item
                key={href}
                value={label}
                keywords={[description]}
                onSelect={() => run(() => router.push(href))}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="command-item-copy">
                  <span>{label}</span>
                </span>
                <ArrowRight
                  size={14}
                  className="command-trailing"
                  aria-hidden="true"
                />
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Ask & connect">
            <Command.Item
              value="Ask about Matt"
              keywords={[
                "ai",
                "chat",
                "assistant",
                "agent",
                "experience",
                "skills",
              ]}
              onSelect={() => run(openChat, false)}
            >
              <MessageCircle size={17} aria-hidden="true" />
              <span className="command-item-copy">
                <span>Ask about Matt</span>
              </span>
              <span className="command-badge">AI</span>
            </Command.Item>
            <Command.Item
              value="Open resume"
              keywords={["cv", "download", "pdf"]}
              onSelect={() =>
                run(() =>
                  window.open("/resume.pdf", "_blank", "noopener,noreferrer")
                )
              }
            >
              <FileText size={17} aria-hidden="true" />
              <span>Open resume</span>
              <ArrowUpRight
                size={14}
                className="command-trailing"
                aria-hidden="true"
              />
            </Command.Item>
            <Command.Item
              value="Send an email"
              keywords={["contact", "hire"]}
              onSelect={() =>
                run(() => {
                  window.location.href = "mailto:matthew.enarle@outlook.com"
                })
              }
            >
              <Mail size={17} aria-hidden="true" />
              <span>Send an email</span>
            </Command.Item>
            <Command.Item
              value="Copy email address"
              onSelect={() =>
                run(() => {
                  void copyEmail()
                })
              }
            >
              <Copy size={17} aria-hidden="true" />
              <span>Copy email address</span>
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Preferences">
            <Command.Item
              value={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              keywords={["theme", "appearance"]}
              onSelect={() => run(toggleTheme)}
            >
              {theme === "dark" ? (
                <Sun size={17} aria-hidden="true" />
              ) : (
                <Moon size={17} aria-hidden="true" />
              )}
              <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="command-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span className="ml-auto">
            <kbd>esc</kbd> close
          </span>
        </div>
      </Command.Dialog>
      {notice && (
        <div className="action-notice" role="status">
          <Check size={14} aria-hidden="true" />
          {notice}
        </div>
      )}
    </CommandContext.Provider>
  )
}
