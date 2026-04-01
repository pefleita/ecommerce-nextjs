'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

interface Suggestion {
  id: string
  name: string
  slug: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&perPage=5`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setSuggestions(data.data ?? [])
      })
      .catch(() => setSuggestions([]))
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSearch} role="search">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            aria-expanded={open && suggestions.length > 0}
            aria-autocomplete="list"
            className="w-64 h-9 pl-9 pr-4 text-sm bg-neutral-100 border border-transparent
              rounded-lg focus:bg-white focus:border-neutral-200 focus:ring-1
              focus:ring-accent-500 outline-none transition-all placeholder:text-neutral-400"
          />
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl
            border border-neutral-200 shadow-md overflow-hidden z-50"
          role="listbox"
        >
          {suggestions.map(s => (
            <a
              key={s.id}
              href={`/products/${s.slug}`}
              role="option"
              className="flex items-center px-4 py-2.5 text-sm text-neutral-700
                hover:bg-neutral-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Search className="w-3.5 h-3.5 text-neutral-400 mr-2.5" aria-hidden />
              {s.name}
            </a>
          ))}
          <a
            href={`/search?q=${encodeURIComponent(query)}`}
            className="flex items-center px-4 py-2.5 text-sm text-accent-600
              font-medium border-t border-neutral-100 hover:bg-accent-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Ver todos los resultados para &quot;{query}&quot;
          </a>
        </div>
      )}
    </div>
  )
}
