import {
  CircuitBoardIcon,
  CpuIcon,
  GpuIcon,
  HardDriveIcon,
  MemoryStickIcon,
  PcCaseIcon,
  ZapIcon,
} from "lucide-react";

export const homeCategories = [
  {
    name: "Placas de Vídeo",
    description: "GPUs de todas as marcas, com preços de várias lojas.",
    href: "/products/gpus",
    icon: GpuIcon,
    enabled: true,
  },
  {
    name: "Processadores",
    description: "CPUs Intel e AMD.",
    href: "/products/cpus",
    icon: CpuIcon,
    enabled: true,
  },
  {
    name: "Placas-mãe",
    description: "Motherboards para todos os sockets.",
    href: "/products/motherboard",
    icon: CircuitBoardIcon,
    enabled: true,
  },
  {
    name: "Memória RAM",
    description: "Módulos DDR4 e DDR5.",
    href: "/products/memory",
    icon: MemoryStickIcon,
    enabled: true,
  },
  {
    name: "Fontes",
    description: "Fontes de alimentação certificadas.",
    href: "/products/power-supply",
    icon: ZapIcon,
    enabled: true,
  },
  {
    name: "Armazenamento",
    description: "SSDs e HDs.",
    href: "/products/ssd",
    icon: HardDriveIcon,
    enabled: true,
  },
  {
    name: "Gabinetes",
    description: "Cases para todos os estilos de build.",
    href: "/products/case",
    icon: PcCaseIcon,
    enabled: true,
  },
] as const;
