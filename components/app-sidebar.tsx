"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { homeCategories } from "@/constants/home-categories";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center justify-center px-1 py-1">
          <Image
            src="/logo-vertical-principal.svg"
            alt="Zeen Hardware"
            width={283}
            height={120}
            priority
            className="h-4 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/icon-hardware-zeen.svg"
            alt="Zeen Hardware"
            width={108}
            height={48}
            className="hidden h-6 w-auto group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/" />} isActive={pathname === "/"} tooltip="Dashboard">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeCategories.map((category) => {
                const Icon = category.icon;
                const isActive = pathname === category.href || pathname.startsWith(`${category.href}/`);
                return (
                  <SidebarMenuItem key={category.name}>
                    <SidebarMenuButton
                      render={<Link href={category.href} />}
                      isActive={isActive}
                      tooltip={category.name}
                    >
                      <Icon />
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                    {!category.enabled && <SidebarMenuBadge>Em breve</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
