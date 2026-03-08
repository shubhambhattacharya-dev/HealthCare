"use client"

import { ArrowLeft } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const PageHeader = ({
  icon,
  title = "",
  description = "",
  backLink = "/",
  backLabel = "Back to Home",
}) => {
  return (
    <div className="flex flex-col gap-5 mb-8">

      {/* ── Back button ── */}
      <div>
        <Link href={backLink}>
          <Button
            variant="outline"
            size="sm"
            className="group border-emerald-900/30 hover:border-emerald-600/50 hover:bg-emerald-900/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {backLabel}
          </Button>
        </Link>
      </div>

      {/* ── Heading row ── */}
      <div className="flex items-end gap-4">

        {/* Icon block */}
        {icon && (
          <div className="shrink-0 p-3.5 bg-emerald-900/20 rounded-2xl ring-1 ring-emerald-600/40 mb-1 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="text-emerald-400 relative z-10">
              {React.cloneElement(icon, {
                className: "h-8 w-8 md:h-10 md:w-10",
              })}
            </div>
          </div>
        )}

        {/* Title + description */}
        <div className="flex flex-col gap-1.5">
          {title && (
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold gradient-title leading-tight">
                {title}
              </h1>
              <div className="mt-1.5 h-0.5 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-transparent" />
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mt-1">
              {description}
            </p>
          )}
        </div>

      </div>

    </div>
  )
}

export default PageHeader