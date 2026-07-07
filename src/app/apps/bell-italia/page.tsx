const days = [
  ['Thu Jul 9', 'Arrival in Italy', 'Venice Region', 'Travel to the Venice region. Hotel: Hotel Garden in Noale. Tip: relax, espresso, walk, and fight jet lag.'],
  ['Fri Jul 10', 'The Magic of Venice', 'Venice and Burano', 'Ferry to Venice, water taxi to Burano, gondola ride, guided Venice tour, and glass-blowing demonstration.'],
  ['Sat Jul 11', 'Leaning Towers', 'Pisa and Tuscany', 'Travel to Florence region. Afternoon Pisa excursion: Field of Miracles, Leaning Tower, Cathedral, and Baptistery.'],
  ['Sun Jul 12', 'Renaissance Masterpieces', 'Florence', 'Guided Florence tour: Signoria, Ponte Vecchio, Santa Croce, and Gates of Paradise. Look for real gelato in covered tubs.'],
  ['Mon Jul 13', 'The Umbrian Countryside', 'Assisi to Rome', 'Travel via Assisi. Tour Basilica of St. Francis. Continue to Rome. Hotel: Roma Torvergata.'],
  ['Tue Jul 14', 'Ancient and Romantic Rome', 'Rome', 'Roman Forum, Colosseum, and walking route: Spanish Steps, Trevi Fountain, Pantheon, Piazza Navona.'],
  ['Wed Jul 15', 'Vatican and Papal Retreats', 'Vatican City and Castel Gandolfo', 'Castel Gandolfo, Papal Palace, Vatican Museums, Sistine Chapel, and St. Peter\'s Basilica. Dress code: shoulders and knees covered.'],
];

export default function BellItaliaPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <section className="mx-auto min-h-screen max-w-md bg-stone-100">
        <header className="sticky top-0 z-10 rounded-b-3xl bg-emerald-800 px-5 pb-6 pt-10 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">EF Tours</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">Bell&apos; Italia</h1>
          <p className="mt-2 text-sm text-emerald-50">July 9 - July 16, 2026</p>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100">Open in Safari, tap Share, then Add to Home Screen.</p>
        </header>
        <div className="space-y-4 px-4 py-6">
          <h2 className="px-1 text-lg font-black text-stone-700">Daily Itinerary</h2>
          {days.map(([date, title, place, plan], index) => (
            <details key={date} open={index === 0} className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <summary className="cursor-pointer list-none p-5">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{date}</p>
                <h3 className="mt-1 text-xl font-black text-stone-800">{title}</h3>
                <p className="mt-1 text-sm text-stone-500">{place}</p>
              </summary>
              <div className="border-t border-stone-100 bg-stone-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-stone-400">Schedule and Tips</p>
                <p className="mt-3 rounded-xl border border-stone-100 bg-white p-4 text-sm leading-relaxed text-stone-700">{plan}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
