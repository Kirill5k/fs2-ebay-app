'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {TrendingUp, Package, Tag} from 'lucide-react'
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from '@/components/ui/navigation-menu'
import {cn} from '@/lib/utils'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: TrendingUp,
    description: 'Overview of deals and stock',
    href: '/',
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: Package,
    description: 'Monitor current stock items',
    href: '/stock',
  },
  {
    id: 'deals',
    label: 'Deals',
    icon: Tag,
    description: 'Browse and filter found deals',
    href: '/deals',
  },
]

const NavBar = () => {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo/Title and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo/Title */}
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Deals Monitor</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Automated deal finder & stock tracker</p>
              </div>
            </div>
            {/* Navigation Links */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2',
                        pathname === item.href && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        pathname !== item.href && 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden px-2">
        <div className="flex h-12 items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 relative h-9 px-3',
                pathname === item.href && 'bg-primary text-primary-foreground',
                pathname !== item.href && 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default NavBar
