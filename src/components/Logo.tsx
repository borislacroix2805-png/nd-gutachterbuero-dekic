import { useId } from 'react'
import './Logo.css'

/** ND-Bildmarke, nachgezeichnet aus der Designvorlage (weißes N, türkises D). */
export function LogoMark({ className = '', light = false }: { className?: string; light?: boolean }) {
  const id = useId()
  return (
    <svg className={className} viewBox="40 55 945 340" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#b9f8fa" />
          <stop offset="0.35" stopColor="#3fe6ee" />
          <stop offset="1" stopColor="#0fd0dc" />
        </linearGradient>
      </defs>
      <path
        fill={light ? '#14232a' : '#f7fafa'}
        d="M50 385 L205 75 Q210 65 222 65 L300 65 L455 270 L520 150 L605 150 L525 385 L395 385 L265 160 L150 385 Z"
      />
      <path
        fill={`url(#${id})`}
        d="M560 65 L840 65 C930 65 975 140 975 225 C975 315 920 385 830 385 L540 385 L575 320 L800 320 C850 320 880 282 880 235 C880 186 850 140 805 140 L527 140 Z"
      />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo${light ? ' logo--light' : ''}`}>
      <LogoMark className="logo__mark" light={light} />
      <span className="logo__divider" aria-hidden="true" />
      <span className="logo__text">
        <span className="logo__small">Gutachterbüro</span>{" "}
        <span className="logo__big">Dekic</span>
      </span>
    </span>
  )
}
