import { useMemo, useState } from 'react'

function GuideDetail({ category, onBack }) {
  const hasSubtypes = Array.isArray(category.subtypes) && category.subtypes.length > 0
  const [activeSubtypeId, setActiveSubtypeId] = useState(category.subtypes?.[0]?.id ?? null)

  const activeGuide = useMemo(() => {
    if (!hasSubtypes) return category
    return (
      category.subtypes.find((subtype) => subtype.id === activeSubtypeId) ?? category.subtypes[0]
    )
  }, [activeSubtypeId, category, hasSubtypes])

  const isLifeThreatening = (activeGuide.warning || '')
    .toLowerCase()
    .includes('life threatening')

  return (
    <section className="animate-[slideUp_250ms_ease-out]">
      <header className="bg-surface shadow-sm sticky top-16 z-30 w-full flex justify-between items-center px-margin h-16 -mx-margin mb-md border-b border-outline-variant/50">
        <button
          type="button"
          className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors min-w-[44px] min-h-[44px]"
          onClick={onBack}
          aria-label="Back to first aid categories"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-h1 font-h1 font-extrabold text-primary flex items-center gap-2">
          {category.name} <span className="text-2xl">{category.icon}</span>
        </h1>
        <div className="w-10" />
      </header>

      {hasSubtypes && (
        <div className="flex gap-sm mb-lg overflow-x-auto pb-sm">
          {category.subtypes.map((subtype) => {
            const isActive = subtype.id === activeGuide.id
            const isDangerSubtype = (subtype.warning || '').toLowerCase().includes('life threatening')
            return (
              <button
                key={subtype.id}
                type="button"
                className={`whitespace-nowrap px-md py-sm rounded-full text-small font-small transition-colors min-h-[44px] ${
                  isActive
                    ? isDangerSubtype
                      ? 'bg-error-container text-on-error-container border border-error font-semibold shadow-sm'
                      : 'bg-primary text-on-primary font-semibold shadow-[0px_4px_12px_rgba(13,148,136,0.12)]'
                    : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                }`}
                onClick={() => setActiveSubtypeId(subtype.id)}
              >
                {isDangerSubtype && isActive ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error block" />
                    {subtype.label}
                  </span>
                ) : (
                  subtype.label
                )}
              </button>
            )
          })}
        </div>
      )}

      {isLifeThreatening && (
        <div className="bg-error text-on-error rounded-xl p-md flex items-start gap-md shadow-sm border border-error-container mb-lg">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div className="w-full">
            <h2 className="text-h2 font-h2 mb-sm">LIFE THREATENING</h2>
            <p className="text-body font-body opacity-90">{activeGuide.warning}</p>
            <a
              href="tel:108"
              className="mt-md bg-surface-container-lowest text-error font-h3 text-h3 py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined">call</span>
              Call Emergency Services Now
            </a>
          </div>
        </div>
      )}

      <section className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm mb-lg">
        <h2 className="text-h2 font-h2 mb-sm text-primary">
          {hasSubtypes ? activeGuide.label : category.name}
        </h2>
        <p className="text-body font-body text-on-surface-variant">{activeGuide.description}</p>
      </section>

      <section className="bg-green-50 rounded-xl p-md border border-green-600/20 shadow-sm mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <span
            className="material-symbols-outlined text-green-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h3 className="text-h3 font-h3 text-green-600">What to DO</h3>
        </div>
        <ul className="space-y-sm">
          {activeGuide.dos.map((item) => (
            <li key={item} className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-green-600 text-[20px] mt-[2px]">
                medication
              </span>
              <span className="text-body font-body text-on-surface">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-red-50 rounded-xl p-md border border-red-600/20 shadow-sm mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <span
            className="material-symbols-outlined text-red-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cancel
          </span>
          <h3 className="text-h3 font-h3 text-red-600">What NOT to Do</h3>
        </div>
        <ul className="space-y-sm">
          {activeGuide.donts.map((item) => (
            <li key={item} className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-red-600 text-[20px] mt-[2px]">
                block
              </span>
              <span className="text-body font-body text-on-surface">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {!isLifeThreatening && activeGuide.warning && (
        <section className="bg-error-container rounded-xl p-md border border-error/20 shadow-sm mb-lg">
          <div className="flex items-start gap-sm">
            <span
              className="material-symbols-outlined text-on-error-container mt-[2px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <p className="text-body font-body text-on-error-container">{activeGuide.warning}</p>
          </div>
        </section>
      )}
    </section>
  )
}

export default GuideDetail
