import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Heart,
  HelpCircle,
  Home,
  Info,
  Loader2,
  LogIn,
  LogOut,
  type LucideIcon,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Trash,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

// Map of icon names to components - only import what we use
const iconMap = {
  // Navigation
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  menu: Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,

  // Common actions
  check: Check,
  'check-circle': CheckCircle,
  x: X,
  'x-circle': XCircle,
  plus: Plus,
  edit: Edit,
  trash: Trash,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  search: Search,
  filter: Filter,
  share: Share,
  send: Send,

  // Status/Info
  'alert-circle': AlertCircle,
  info: Info,
  'help-circle': HelpCircle,
  loader: Loader2,
  sparkles: Sparkles,
  'trending-up': TrendingUp,
  award: Award,
  shield: Shield,

  // User/Account
  user: User,
  users: Users,
  'log-in': LogIn,
  'log-out': LogOut,
  settings: Settings,
  eye: Eye,
  'eye-off': EyeOff,

  // Communication
  bell: Bell,
  mail: Mail,
  'message-square': MessageSquare,
  phone: Phone,
  mic: Mic,

  // Location
  map: Map,
  'map-pin': MapPin,
  globe: Globe,

  // Commerce/Rating
  star: Star,
  heart: Heart,
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,

  // Layout/Home
  home: Home,
  calendar: Calendar,
  clock: Clock,

  // Zoom
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
} as const

export type IconName = keyof typeof iconMap

type IconProps = {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  strokeWidth?: number
  'aria-hidden'?: boolean
  'aria-label'?: string
}

export function Icon({
  name,
  size = 'md',
  className = '',
  strokeWidth,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}: IconProps) {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    return null
  }

  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  }

  return (
    <IconComponent
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={`${sizeClasses[size]} ${className}`}
      strokeWidth={strokeWidth}
    />
  )
}

// Export individual icons for backward compatibility
export const Icons = iconMap

// Helper to get icon by name dynamically
export function getIcon(name: IconName): LucideIcon {
  return iconMap[name]
}
