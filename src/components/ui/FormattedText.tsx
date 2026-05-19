'use client'

import React from 'react'

export default function FormattedText({ text }: { text: string }) {
  if (!text) return null
  const parts = text.split(/(@[a-zA-Z]+\s[a-zA-Z]+)/g)
  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return <span key={index} className="inline-block px-2 py-0.5 rounded-md bg-primary-light text-primary-dark font-medium border border-primary/10">{part}</span>
        }
        return <React.Fragment key={index}>{part}</React.Fragment>
      })}
    </div>
  )
}
