import { CircuitBoardIcon, CpuIcon, GpuIcon, HardDriveIcon, MemoryStickIcon, ZapIcon } from "lucide-react";

export const homeCategories = [
  {
    name: "Placas de Vídeo",
    description: "GPUs de todas as marcas, com preços de várias lojas.",
    href: "/placas-de-video",
    icon: GpuIcon,
    enabled: true,
  },
  {
    name: "Processadores",
    description: "CPUs Intel e AMD.",
    href: "/processadores",
    icon: CpuIcon,
    enabled: false,
  },
  {
    name: "Placas-mãe",
    description: "Motherboards para todos os sockets.",
    href: "/placas-mae",
    icon: CircuitBoardIcon,
    enabled: false,
  },
  {
    name: "Memória RAM",
    description: "Módulos DDR4 e DDR5.",
    href: "/memoria-ram",
    icon: MemoryStickIcon,
    enabled: false,
  },
  {
    name: "Fontes",
    description: "Fontes de alimentação certificadas.",
    href: "/fontes",
    icon: ZapIcon,
    enabled: false,
  },
  {
    name: "Armazenamento",
    description: "SSDs e HDs.",
    href: "/armazenamento",
    icon: HardDriveIcon,
    enabled: false,
  },
] as const;
