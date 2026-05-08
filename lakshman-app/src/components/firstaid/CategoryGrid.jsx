function CategoryGrid({ categories, onSelectCategory }) {
  return (
    <main className="w-full max-w-7xl mx-auto py-lg">
      <div className="mb-lg">
        <h2 className="text-h1 font-h1 text-on-surface">First Aid Guide</h2>
        <p className="text-body font-body text-on-surface-variant mt-xs">
          Select an emergency for step-by-step instructions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col items-center justify-center gap-sm hover:bg-surface-container-low transition-colors min-h-[120px] active:scale-[0.97]"
            style={{ boxShadow: '0px 4px 12px rgba(13,148,136,0.05)' }}
            onClick={() => onSelectCategory(category)}
            aria-label={`Open ${category.name} first aid guide`}
          >
            <div className="text-[32px]" aria-hidden="true">
              {category.icon}
            </div>
            <span className="text-h3 font-h3 text-on-surface text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </main>
  )
}

export default CategoryGrid
