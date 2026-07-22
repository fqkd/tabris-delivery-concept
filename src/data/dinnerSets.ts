import type { DinnerSet } from '../types'

export const dinnerSets: DinnerSet[] = [
  {
    id: 'dinner-for-two',
    name: 'Ужин на двоих',
    description: 'Паста, свежий салат, домашний лимонад и десерт к спокойному вечеру.',
    people: 2,
    servingTime: '12 минут',
    items: [
      { productId: 'chicken-mushroom-pasta', quantity: 2, role: 'Основное блюдо' },
      { productId: 'salad-roast-beef', quantity: 1, role: 'Салат' },
      { productId: 'pear-sage-lemonade', quantity: 1, role: 'Напиток' },
      { productId: 'signature-dessert', quantity: 2, role: 'Десерт' },
    ],
  },
  {
    id: 'quick-evening',
    name: 'Быстрый ужин после работы',
    description: 'Сытное горячее, сырники, ягодный морс и свежая выпечка без долгой готовки.',
    people: 2,
    servingTime: '8 минут',
    items: [
      { productId: 'korean-beef-rice', quantity: 2, role: 'Основное блюдо' },
      { productId: 'syrniki', quantity: 1, role: 'Закуска' },
      { productId: 'berry-mors', quantity: 1, role: 'Напиток' },
      { productId: 'butter-croissant', quantity: 2, role: 'Выпечка' },
    ],
  },
  {
    id: 'no-cooking',
    name: 'Вечер без готовки',
    description: 'Роллы, буррата, прохладный лимонад и авторский десерт для лёгкого вечера.',
    people: 2,
    servingTime: 'Подать сразу',
    items: [
      { productId: 'salmon-roll', quantity: 1, role: 'Основное блюдо' },
      { productId: 'burrata', quantity: 1, role: 'Закуска' },
      { productId: 'pear-sage-lemonade', quantity: 1, role: 'Напиток' },
      { productId: 'signature-dessert', quantity: 2, role: 'Десерт' },
    ],
  },
]
