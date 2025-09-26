'use client'

import * as React from 'react'

type DropdownMenuProps = {
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
          : child
      )}
    </div>
  )
}

type DropdownMenuTriggerProps = {
  children: React.ReactNode
  asChild?: boolean
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
  setIsOpen = () => {},
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    })
  }

  return <div onClick={handleClick}>{children}</div>
}

type DropdownMenuContentProps = {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) {
    return null
  }

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-800 ${alignmentClasses[align]}`}
      ref={ref}
    >
      {children}
    </div>
  )
}

type DropdownMenuItemProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className = '',
}) => (
  <div
    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
)

export const DropdownMenuSeparator: React.FC = () => (
  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
)

type DropdownMenuLabelProps = {
  children: React.ReactNode
}

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ children }) => (
  <div className="px-2 py-1.5 font-semibold text-sm">{children}</div>
)
