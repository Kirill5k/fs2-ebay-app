'use client';

import {useState} from "react";
import {Clock, TrendingUp, Package, Tag, Bell, Settings, User} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: TrendingUp,
    description: 'Overview of deals and stock'
  },
  {
    id: 'deals',
    label: 'Deals',
    icon: Tag,
    description: 'Browse and filter found deals'
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: Package,
    description: 'Monitor current stock items'
  }
];

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
      <>
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo/Title and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo/Title */}
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <TrendingUp className="h-4 w-4 text-primary-foreground"/>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Deals Monitor</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Automated deal finder & stock tracker
                  </p>
                </div>
              </div>
              {/* Navigation Links */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {navItems.map((item) => (
                      <NavigationMenuItem key={item.id}>
                        <Button
                            variant={activeTab === item.id ? "default" : "ghost"}
                            className="h-9 px-4 py-2"
                            onClick={() => setActiveTab(item.id)}
                        >
                          <item.icon className="mr-2 h-4 w-4"/>
                          {item.label}
                        </Button>
                      </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </header>

        <div className="sticky px-2 top-16 z-40 w-full border-b bg-background md:hidden">
          <div className="container">
            <div className="flex h-12 items-center justify-around">
              {navItems.map((item) => (
                  <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      size="sm"
                      className="flex-1 relative"
                      onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
              ))}
            </div>
          </div>
        </div>
      </>
  )
}

export default NavBar