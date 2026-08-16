import { FIFO_PATHS, type FifoPath } from "./fifo-paths"
import { PLANT_EQUIPMENT_PATHS } from "./plant-equipment-paths"

export const ALL_FIFO_PATHS: readonly FifoPath[] = [
  ...FIFO_PATHS.filter((path) => path.slug === "drillers-offsider"),
  ...PLANT_EQUIPMENT_PATHS,
  ...FIFO_PATHS.filter((path) => path.slug !== "drillers-offsider"),
]

export const HOME_FIFO_PATHS = ALL_FIFO_PATHS.filter((path) =>
  ["drillers-offsider", "dump-truck-operator", "scaffolder"].includes(path.slug),
)

export function getAllFifoPath(slug: string) {
  return ALL_FIFO_PATHS.find((path) => path.slug === slug)
}
