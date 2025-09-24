'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Fragment } from 'react'

type BreadcrumbItem = {
  label: string
  href?: string
  current?: boolean
}

type BreadcrumbsProps = {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Remove locale from paths
    const pathsWithoutLocale = paths.filter((path) => path !== locale)

    // Always add home
    breadcrumbs.push({
      label: 'Home',
      href: `/${locale}`,
    })

    // Build up the path
    let currentPath = `/${locale}`
    pathsWithoutLocale.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === pathsWithoutLocale.length - 1

      // Format the label
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumbs if only home
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              />
            )}
            <li>
              <div className="flex items-center">
                {index === 0 && (
                  <Home
                    aria-hidden="true"
                    className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
                  />
                )}
                {item.current ? (
                  <span
                    aria-current="page"
                    className="font-medium text-gray-700 text-sm dark:text-gray-300"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    className="text-gray-500 text-sm transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm dark:text-gray-400">{item.label}</span>
                )}
              </div>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
