"use client"
import React from 'react'
import { Logo, MobileLogo } from './Logo'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

const navLinks = [
    {
        label: 'Dashboard',
        link: '/'
    },
    {
        label: 'Trasactions',
        link: '/transactions'
    },
    {
        label: 'Manage',
        link: '/manage'
    }
]

const Navbar = () => {
    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
        </>
    )
}

const DesktopNavbar = () => {
    return (
        <div className='hidden border-separate border-b bg-background md:block'>
            <nav className='container flex items-center justify-between px-8'>
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                    <div className='flex h-full'>
                        {
                            navLinks.map(navLink => (
                                <NavbarItem
                                    key={navLink.label}
                                    link={navLink.link}
                                    label={navLink.label}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
        </div>
    )
}

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="block border-separate bg-background md:hidden">
            <nav className="container flex items-center justify-between px-8 gap-x-4">
                <Sheet
                    open={isOpen}
                    onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} size={'icon'}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-[400px] sm:w-[540px]' side={'left'}>
                        <Logo />
                        <div className="flex flex-col gap-1 pt-4">
                            {
                                navLinks.map(navlink => (
                                    <NavbarItem
                                        key={navlink.link}
                                        label={navlink.label}
                                        link={navlink.link}
                                        clickCallback = {() => setIsOpen(prev=>!prev)}
                                    />
                                ))
                            }
                        </div>
                    </SheetContent>
                </Sheet>
                <MobileLogo />
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <div className="flex items-center gap-2">
                        <ThemeSwitcherBtn />
                        <UserButton afterSignOutUrl='/sign-in' />
                    </div>
                </div>
            </nav>
        </div>
    )
}

const NavbarItem = ({ label, link,clickCallback }: { label: string, link: string,clickCallback?:()=>void }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link href={link}
                className={cn(buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
                    isActive && "text-foreground")}
                    onClick={()=>{
                        if(clickCallback) clickCallback();
                    }}>
                {label}
            </Link>
            {
                isActive && (
                    <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block' />
                )
            }
        </div>
    )
}

export default Navbar