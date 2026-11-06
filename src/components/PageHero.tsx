import type { ReactNode } from 'react'
import { LogoMark } from './Logo'
import './PageHero.css'

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="page-hero">
      <LogoMark className="page-hero__mark" />
      <div className="container page-hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="lead page-hero__lead">{lead}</p>}
        {children && <div className="page-hero__actions">{children}</div>}
      </div>
    </section>
  )
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="faq__item">
          <summary>{q}</summary>
          <div className="faq__answer">{a}</div>
        </details>
      ))}
    </div>
  )
}
