import { useMemo, useState } from 'react'
import CategoryGrid from '../components/firstaid/CategoryGrid'
import GuideDetail from '../components/firstaid/GuideDetail'
import firstAidData from '../data/firstaid.json'

function FirstAid() {
  const categories = useMemo(() => firstAidData, [])
  const [selectedCategory, setSelectedCategory] = useState(null)

  return selectedCategory ? (
    <GuideDetail category={selectedCategory} onBack={() => setSelectedCategory(null)} />
  ) : (
    <CategoryGrid categories={categories} onSelectCategory={setSelectedCategory} />
  )
}

export default FirstAid
