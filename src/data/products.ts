import type { Product } from '../types'

export const products: Product[] = [
  {
    id: 'salad-roast-beef',
    name: 'Салат с ростбифом и печёным перцем',
    weight: '220 г',
    price: 359,
    oldPrice: 419,
    image: '/images/products/salad-roast-beef.webp',
    description:
      'Нежный ростбиф средней прожарки, свежая руккола и сладкий печёный перец под лёгкой горчичной заправкой.',
    ingredients:
      'Ростбиф из говядины, руккола, томаты черри, перец печёный, горчичная заправка, оливковое масло.',
    shelfLife: '12 часов при +2…+6 °C',
    bonus: 18,
    sections: ['own', 'sale'],
    ownProduction: true,
    subcategory: 'Салаты',
  },
  {
    id: 'syrniki',
    name: 'Сырники домашние со сметаной',
    weight: '240 г',
    price: 279,
    image: '/images/products/syrniki.webp',
    description:
      'Румяные сырники из фермерского творога с мягкой сливочной серединой и густой сметаной.',
    ingredients: 'Творог, яйцо, мука пшеничная, сахар, ваниль, сметана.',
    shelfLife: '24 часа при +2…+6 °C',
    bonus: 14,
    sections: ['own', 'ready'],
    ownProduction: true,
    subcategory: 'Десерты',
  },
  {
    id: 'korean-beef-rice',
    name: 'Рис с говядиной и овощами по-корейски',
    weight: '300 г',
    price: 349,
    image: '/images/products/korean-beef-rice.webp',
    description:
      'Рассыпчатый рис, пряная говядина и хрустящие овощи с кунжутом в сбалансированном соусе.',
    ingredients:
      'Рис, говядина, морковь, огурец, шпинат, кунжут, соевый соус, чеснок, специи.',
    shelfLife: '18 часов при +2…+6 °C',
    bonus: 17,
    sections: ['own', 'ready'],
    ownProduction: true,
    subcategory: 'Горячее',
  },
  {
    id: 'chicken-mushroom-pasta',
    name: 'Паста с курицей и лесными грибами',
    weight: '300 г',
    price: 329,
    image: '/images/products/chicken-mushroom-pasta.webp',
    description:
      'Свежая паста с обжаренной курицей и грибами в деликатном сливочном соусе.',
    ingredients:
      'Паста, куриное филе, шампиньоны, сливки, пармезан, чеснок, зелень.',
    shelfLife: '18 часов при +2…+6 °C',
    bonus: 16,
    sections: ['own', 'ready'],
    ownProduction: true,
    subcategory: 'Горячее',
  },
  {
    id: 'salmon-roll',
    name: 'Ролл с лососем и свежим огурцом',
    weight: '230 г · 8 шт.',
    price: 429,
    oldPrice: 479,
    image: '/images/products/salmon-roll.webp',
    description:
      'Свежий лосось, сливочный сыр и хрустящий огурец в тонком слое риса с кунжутом.',
    ingredients:
      'Рис, лосось, огурец, сливочный сыр, нори, кунжут, рисовый уксус.',
    shelfLife: '12 часов при +2…+6 °C',
    bonus: 21,
    sections: ['own', 'ready', 'sale'],
    ownProduction: true,
    subcategory: 'Роллы',
  },
  {
    id: 'butter-croissant',
    name: 'Круассан на французском масле',
    weight: '90 г',
    price: 99,
    oldPrice: 129,
    image: '/images/products/croissant.webp',
    description:
      'Воздушный круассан с тонкими хрустящими слоями и насыщенным сливочным ароматом.',
    ingredients: 'Мука пшеничная, сливочное масло, молоко, сахар, дрожжи, соль.',
    shelfLife: '24 часа',
    bonus: 5,
    sections: ['own', 'sale'],
    ownProduction: true,
    subcategory: 'Выпечка',
  },
  {
    id: 'burrata',
    name: 'Буррата со сливочной сердцевиной',
    weight: '200 г',
    price: 459,
    oldPrice: 529,
    image: '/images/products/burrata.webp',
    description:
      'Молодой сыр с нежной сливочной сердцевиной — для салатов, брускетт и тёплого хлеба.',
    ingredients: 'Молоко коровье, сливки, закваска, фермент, соль.',
    shelfLife: '5 суток при +2…+6 °C',
    bonus: 23,
    sections: ['sale'],
    ownProduction: false,
    subcategory: 'Салаты',
  },
  {
    id: 'artisan-bread',
    name: 'Хлеб ремесленный на закваске',
    weight: '420 г',
    price: 189,
    image: '/images/products/artisan-bread.webp',
    description:
      'Хлеб длительной ферментации с хрустящей корочкой и влажным пористым мякишем.',
    ingredients: 'Мука пшеничная, вода, пшеничная закваска, соль.',
    shelfLife: '36 часов',
    bonus: 9,
    sections: ['own'],
    ownProduction: true,
    unavailable: true,
    subcategory: 'Выпечка',
  },
  {
    id: 'signature-dessert',
    name: 'Авторский десерт с шоколадом и ягодами',
    weight: '120 г',
    price: 289,
    oldPrice: 329,
    image: '/images/products/signature-dessert.webp',
    description:
      'Шоколадный мусс, ягодное конфи и тонкий хрустящий слой в зеркальной глазури.',
    ingredients:
      'Шоколад, сливки, ягодное пюре, миндальная мука, яйцо, сахар, какао-масло.',
    shelfLife: '48 часов при +2…+6 °C',
    bonus: 14,
    sections: ['own', 'sale'],
    ownProduction: true,
    subcategory: 'Десерты',
  },
]

export const ownProductionProducts = products.filter(
  (product) => product.ownProduction,
)

export const getProduct = (id: string) =>
  products.find((product) => product.id === id)
