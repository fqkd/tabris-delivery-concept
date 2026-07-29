import type { DinnerSet } from '../types'

export const dinnerSets: DinnerSet[] = [
  {
    id: 'dinner-for-two',
    name: 'Ужин на двоих',
    description: 'Паста, свежий салат, домашний лимонад и десерт к спокойному вечеру.',
    people: 2,
    servingTime: '12 минут',
    items: [
      { productId: 'chicken-mushroom-pasta', quantity: 2, role: 'Основное блюдо', summaryLabel: 'паста' },
      { productId: 'salad-roast-beef', quantity: 1, role: 'Салат', summaryLabel: 'салат' },
      { productId: 'pear-sage-lemonade', quantity: 1, role: 'Напиток', summaryLabel: 'лимонад' },
      { productId: 'signature-dessert', quantity: 2, role: 'Десерт', summaryLabel: 'десерт' },
    ],
  },
  {
    id: 'quick-evening',
    name: 'Быстрый ужин после работы',
    description: 'Сытное горячее, сырники, ягодный морс и свежая выпечка без долгой готовки.',
    people: 2,
    servingTime: '8 минут',
    items: [
      { productId: 'korean-beef-rice', quantity: 2, role: 'Основное блюдо', summaryLabel: 'горячее' },
      { productId: 'syrniki', quantity: 1, role: 'Закуска', summaryLabel: 'сырники' },
      { productId: 'berry-mors', quantity: 1, role: 'Напиток', summaryLabel: 'морс' },
      { productId: 'butter-croissant', quantity: 2, role: 'Выпечка', summaryLabel: 'выпечка' },
    ],
  },
  {
    id: 'no-cooking',
    name: 'Вечер без готовки',
    description: 'Роллы, буррата, прохладный лимонад и авторский десерт для лёгкого вечера.',
    people: 2,
    servingTime: 'Подать сразу',
    items: [
      { productId: 'salmon-roll', quantity: 1, role: 'Основное блюдо', summaryLabel: 'роллы' },
      { productId: 'burrata', quantity: 1, role: 'Закуска', summaryLabel: 'буррата' },
      { productId: 'pear-sage-lemonade', quantity: 1, role: 'Напиток', summaryLabel: 'лимонад' },
      { productId: 'signature-dessert', quantity: 2, role: 'Десерт', summaryLabel: 'десерт' },
    ],
  },
]
