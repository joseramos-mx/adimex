"use client"

import * as React from "react"
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "motion/react";
import { Separator } from "@/components/ui/separator";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ArrowUpRightIcon,
  PaletteIcon,
  FilePlus2Icon,
  LayoutTemplateIcon,
  SearchIcon,
  PenToolIcon,
} from "lucide-react"

const menuItems = [
  { name: "Home", href: "#link" },
  { name: "Nosotros", href: "#link" },
  { name: "Blog", href: "#link" },
  { name: "Catálogo", href: "#link" },
  { name: "Tienda", href: "#link" },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full h-14 border-b border-[#0d1a2d]/20 transition-colors duration-150 font-mono",
          scrolled && " backdrop-blur-xl"
        )}
      >
        <div className="px-3 h-full transition-all duration-300">
          <div className="relative flex h-full flex-wrap items-center justify-between gap-3 lg:gap-0">
            <div className="flex w-full h-full items-center justify-between gap-6 lg:w-auto">
              <a
                href="#"
                aria-label="home"
                className="flex gap-2 -mr-3 whitespace-nowrap items-center"
              >
                <img
                  src="/logo.svg"
                  alt="Design Logo"
                  height={10}
                  width={10}
                  className="h-4 z-10 w-full object-contain"
                />
              </a>

              <Separator className="hidden lg:block" orientation="vertical" />

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 mr-2 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-10 text-xs ">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-white hover:text-[#0d1a2d] block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background lg:h-14 in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator orientation="vertical" />
              <Search />
              <Separator orientation="vertical" />
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit text-xs">
                <Button asChild variant="outline" size="sm">
                  <Link href="#">
                    <span className="text-xs">Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="#">
                    <span className="text-xs">Sign Up</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export function Search() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <>
      <button
        className="cursor-text border-input max-w-md hidden bg-black/20 text-foreground placeholder:text-muted-foreground/20 focus-visible:border-ring focus-visible:ring-ring/50 lg:inline-flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]" style={{ fontFamily: 'var(--font-geist-sans)' }}
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-white/50 font-normal text-xs">
            Buscar mis componentes...
          </span>
        </span>
        <kbd className="bg-white/20 text-white/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          Ctrl + K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search components, assets, or docs..." />
        <CommandList>
          <CommandEmpty>No matches found.</CommandEmpty>
          <CommandGroup heading="Create">
            <CommandItem className="cursor-pointer">
              <FilePlus2Icon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">New project</span>
              <CommandShortcut className="justify-center">⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <LayoutTemplateIcon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">New template</span>
              <CommandShortcut className="justify-center">⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <PenToolIcon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">Start design</span>
              <CommandShortcut className="justify-center">⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            <CommandItem className="cursor-pointer">
              <ArrowUpRightIcon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">Go to workspace</span>
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <ArrowUpRightIcon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">Go to assets</span>
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <ArrowUpRightIcon size={16} className="opacity-60" aria-hidden="true" />
              <span className="pl-2">Go to documentation</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Themes">
            <CommandItem>
              <PaletteIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Switch theme</span>
              <CommandShortcut>⌘⇧T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
