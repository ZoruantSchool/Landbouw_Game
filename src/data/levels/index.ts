import type { LevelConfig } from './types'

// Vite automatically loads every `level-*.ts` file in this folder.
const levelModules = import.meta.glob<LevelConfig>('./level-*.ts', {
  eager: true,
  import: 'default',
})

export const levels = Object.values(levelModules).sort((a, b) => a.nummer - b.nummer)

export function vindLevel(nummer: number) {
  return levels.find((level) => level.nummer === nummer) ?? levels[0]!
}
