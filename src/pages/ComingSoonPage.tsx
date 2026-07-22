import { Leaf } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

const sectionNames: Record<string, string> = {
  search: 'Поиск',
  favorites: 'Избранное',
  profile: 'Профиль',
  bonus: 'Табрис Бонус',
  'ready-meals': 'Готовые блюда',
  cheese: 'Сыры',
  bakery: 'Выпечка',
  fish: 'Рыба',
  desserts: 'Десерты',
  sale: 'Выгодно сегодня',
}

export function ComingSoonPage() {
  const navigate = useNavigate()
  const { sectionId = '' } = useParams()
  const title = sectionNames[sectionId] ?? 'Раздел'

  return (
    <main className="screen screen--coming has-bottom-nav">
      <PageHeader title={title} showCart={false} />
      <div className="coming-state">
        <span>
          <Leaf aria-hidden="true" />
        </span>
        <h2>Раздел появится на следующем этапе</h2>
        <p>Сейчас можно пройти основной сценарий от выбора адреса до корзины.</p>
        <button type="button" className="primary-button" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    </main>
  )
}
