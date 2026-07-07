'use client';

import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  MapPin,
  Clock,
  Calendar,
  Info,
  Bed,
  ChevronDown,
  ChevronUp,
  Camera,
  Coffee,
  Utensils,
  Train,
  Map as MapIcon,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

type EventItem = {
  time: string;
  desc: string;
};

type TipItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  mapsUrl?: string;
};

type HotelItem = {
  name: string;
  address: string;
  mapsUrl: string;
};

type TripDay = {
  id: string;
  date: string;
  title: string;
  location: string;
  hotel: HotelItem;
  events: EventItem[];
  tips: TipItem[];
};

const directionsUrl = (destination: string, travelmode = 'walking') =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${travelmode}`;

const tripData: TripDay[] = [
  {
    id: 'jul-9',
    date: 'Thursday, July 9',
    title: 'Arrival in Italy',
    location: 'Venice Region',
    hotel: {
      name: 'Hotel Garden (Day 1 of 2)',
      address: 'Via G. Tempesta 124, Noale - Venezia, IT 30033',
      mapsUrl: directionsUrl('Hotel Garden, Via G. Tempesta 124, Noale, Italy'),
    },
    events: [{ time: '', desc: 'Travel to Venice Region' }],
    tips: [
      {
        icon: Coffee,
        title: 'Relax in Noale',
        desc: 'Noale is a charming, quieter town on the mainland with a medieval fortress. It is the perfect place to grab a quiet espresso, stretch your legs, and fight off jet lag.',
        mapsUrl: directionsUrl('Piazza Castello, Noale, Italy'),
      },
    ],
  },
  {
    id: 'jul-10',
    date: 'Friday, July 10',
    title: 'The Magic of Venice',
    location: 'Venice & Burano',
    hotel: {
      name: 'Hotel Garden (Day 2 of 2)',
      address: 'Via G. Tempesta 124, Noale - Venezia, IT 30033',
      mapsUrl: directionsUrl('Hotel Garden, Via G. Tempesta 124, Noale, Italy'),
    },
    events: [
      { time: '8:45 AM', desc: 'Take a ferry to Venice' },
      { time: '1:00 PM', desc: 'Travel by water taxi to the island of Burano' },
      { time: '2:30 PM', desc: 'Enjoy a classic gondola ride' },
      { time: '3:15 PM', desc: "Guided tour of Venice: St. Mark's Square & Grand Canal" },
      { time: 'Afternoon', desc: 'See a glass-blowing demonstration' },
    ],
    tips: [
      {
        icon: Camera,
        title: 'Burano Photos',
        desc: 'Burano is famous for its hyper-colorful fisherman houses. Keep your camera ready!',
        mapsUrl: directionsUrl('Burano, Venice, Italy'),
      },
      {
        icon: Utensils,
        title: 'Eat like a Venetian',
        desc: 'Skip the tourist traps and find a bacaro wine bar to try cicchetti, Venetian tapas like crostini with whipped salt cod.',
        mapsUrl: directionsUrl('Piazza San Marco, Venice, Italy'),
      },
    ],
  },
  {
    id: 'jul-11',
    date: 'Saturday, July 11',
    title: 'Leaning Towers',
    location: 'Pisa & Tuscany',
    hotel: {
      name: 'Hotel Tamerici & Principe (Day 1 of 2)',
      address: 'Viale IV Novembre, 2B, Montecatini Terme, 51016',
      mapsUrl: directionsUrl('Hotel Tamerici & Principe, Viale IV Novembre 2B, Montecatini Terme, Italy'),
    },
    events: [
      { time: 'Morning', desc: 'Travel to Florence region' },
      {
        time: '2:00 PM',
        desc: 'Half-day excursion to Pisa: Guided tour of the Field of Miracles, Leaning Tower, Cathedral, and Baptistery.',
      },
    ],
    tips: [
      {
        icon: Train,
        title: 'Montecatini Alto Funicular',
        desc: 'You are staying in a famous thermal spa town. Take the historic red funicular railway up to the medieval village at the top of the hill for an incredible view and dinner.',
        mapsUrl: directionsUrl('Funicolare di Montecatini Terme, Stazione di Valle'),
      },
    ],
  },
  {
    id: 'jul-12',
    date: 'Sunday, July 12',
    title: 'Renaissance Masterpieces',
    location: 'Florence',
    hotel: {
      name: 'Hotel Tamerici & Principe (Day 2 of 2)',
      address: 'Viale IV Novembre, 2B, Montecatini Terme, 51016',
      mapsUrl: directionsUrl('Hotel Tamerici & Principe, Viale IV Novembre 2B, Montecatini Terme, Italy'),
    },
    events: [
      {
        time: '10:00 AM',
        desc: 'Guided tour of Florence: Piazza della Signoria, Ponte Vecchio, Basilica of Santa Croce, and Gates of Paradise.',
      },
    ],
    tips: [
      {
        icon: MapIcon,
        title: 'Lucky Boar (Porcellino)',
        desc: 'Head to the Mercato Nuovo and rub the snout of Il Porcellino, the bronze boar statue, for good luck and to guarantee a return to Florence.',
        mapsUrl: directionsUrl('Fontana del Porcellino, Florence, Italy'),
      },
      {
        icon: Utensils,
        title: 'Authentic Gelato Stop',
        desc: 'Look for shops where the gelato is kept in covered metal tubs. Try walking toward Piazza del Duomo to find top-rated local gelaterias.',
        mapsUrl: directionsUrl('Piazza del Duomo, Florence, Italy'),
      },
    ],
  },
  {
    id: 'jul-13',
    date: 'Monday, July 13',
    title: 'The Umbrian Countryside',
    location: 'Assisi to Rome',
    hotel: {
      name: 'Roma Torvergata (Day 1 of 3)',
      address: 'Via Vico Vigano, 24, Roma, IT 00133',
      mapsUrl: directionsUrl('Hotel Roma Tor Vergata, Via Vico Vigano 24, Rome, Italy'),
    },
    events: [
      { time: 'Morning', desc: 'Travel via Assisi to Rome' },
      {
        time: '2:00 PM',
        desc: 'Tour Assisi with an expert local guide and visit the Basilica of St. Francis.',
      },
    ],
    tips: [
      {
        icon: Camera,
        title: 'Breathtaking Views',
        desc: 'The Basilica houses stunning 13th-century frescoes by Giotto. Outside, take a moment to look out over the sweeping, peaceful views of the Umbrian valley.',
        mapsUrl: directionsUrl("Basilica di San Francesco d'Assisi, Assisi, Italy"),
      },
    ],
  },
  {
    id: 'jul-14',
    date: 'Tuesday, July 14',
    title: 'Ancient & Romantic Rome',
    location: 'Rome',
    hotel: {
      name: 'Roma Torvergata (Day 2 of 3)',
      address: 'Via Vico Vigano, 24, Roma, IT 00133',
      mapsUrl: directionsUrl('Hotel Roma Tor Vergata, Via Vico Vigano 24, Rome, Italy'),
    },
    events: [
      { time: '1:30 PM', desc: 'Guided tour of Rome: Roman Forum & Colosseum' },
      { time: 'Afternoon', desc: 'Self-guided walking tour of Rome' },
    ],
    tips: [
      {
        icon: MapIcon,
        title: 'Custom Walking Route',
        desc: 'Link together the free sights: Spanish Steps, Trevi Fountain, Pantheon, and Piazza Navona.',
        mapsUrl:
          'https://www.google.com/maps/dir/?api=1&destination=Piazza+Navona,+Rome,+Italy&waypoints=Piazza+di+Spagna,+Rome%7CTrevi+Fountain,+Rome%7CPantheon,+Rome&travelmode=walking',
      },
    ],
  },
  {
    id: 'jul-15',
    date: 'Wednesday, July 15',
    title: 'Vatican & Papal Retreats',
    location: 'Vatican City & Castel Gandolfo',
    hotel: {
      name: 'Roma Torvergata (Day 3 of 3)',
      address: 'Via Vico Vigano, 24, Roma, IT 00133',
      mapsUrl: directionsUrl('Hotel Roma Tor Vergata, Via Vico Vigano 24, Rome, Italy'),
    },
    events: [
      {
        time: 'Morning',
        desc: 'Excursion: Castel Gandolfo, summer residence of the Pope. Stroll the village, Barberini Gardens, Papal Palace, and included lunch.',
      },
      {
        time: '3:00 PM',
        desc: "Guided tour of Vatican City: Sistine Chapel & Vatican Museums. Free time to explore St. Peter's Basilica.",
      },
    ],
    tips: [
      {
        icon: AlertTriangle,
        title: 'Strict Dress Code',
        desc: 'Shoulders and knees MUST be covered for everyone. No tank tops or short shorts, or you may be denied entry to the Vatican.',
        mapsUrl: directionsUrl('Vatican Museums, Vatican City'),
      },
      {
        icon: Info,
        title: 'Barberini Gardens',
        desc: 'These pristine gardens at Castel Gandolfo offer a quiet, serene contrast to the heavy crowds you will experience at the Vatican.',
        mapsUrl: directionsUrl('Palazzo Apostolico, Castel Gandolfo, Italy'),
      },
    ],
  },
];

function DirectionsButton({ href, label, warning = false }: { href: string; label: string; warning?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
        warning ? 'bg-amber-600 active:bg-amber-700' : 'bg-sky-600 active:bg-sky-700'
      }`}
    >
      <Navigation size={14} />
      <span>{label}</span>
    </a>
  );
}

function DayCard({ day, isExpanded, onToggle }: { day: TripDay; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between bg-white p-5 text-left active:bg-stone-50"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            <Calendar size={16} />
            <span>{day.date}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-800">{day.title}</h2>
          <div className="flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin size={14} />
            <span>{day.location}</span>
          </div>
        </div>
        <div className="rounded-full bg-stone-100 p-2 text-stone-400">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-stone-100 bg-stone-50/50 px-5 pb-6 pt-2">
          <div className="mb-6">
            <h3 className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-stone-400">Schedule</h3>
            <div className="flex flex-col gap-3">
              {day.events.map((event, index) => (
                <div key={`${day.id}-event-${index}`} className="flex gap-3 rounded-xl border border-stone-100 bg-white p-3 shadow-sm">
                  {event.time ? (
                    <div className="min-w-[70px] pt-0.5 text-sm font-semibold text-emerald-600">{event.time}</div>
                  ) : (
                    <div className="flex min-w-[70px] items-start justify-center pt-0.5 text-sm text-stone-400">
                      <Clock size={16} className="mt-0.5" />
                    </div>
                  )}
                  <div className="text-sm leading-relaxed text-stone-700">{event.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-stone-400">Family Highlights & Tips</h3>
            <div className="flex flex-col gap-3">
              {day.tips.map((tip, index) => {
                const TipIcon = tip.icon;
                const isWarning = tip.title.includes('Dress Code');
                return (
                  <div
                    key={`${day.id}-tip-${index}`}
                    className={`flex flex-col gap-3 rounded-xl border p-4 ${isWarning ? 'border-amber-200 bg-amber-50' : 'border-sky-100 bg-sky-50'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex-shrink-0 ${isWarning ? 'text-amber-600' : 'text-sky-600'}`}>
                        <TipIcon size={20} />
                      </div>
                      <div>
                        <h4 className={`mb-1 text-sm font-bold ${isWarning ? 'text-amber-900' : 'text-sky-900'}`}>{tip.title}</h4>
                        <p className={`text-sm leading-relaxed ${isWarning ? 'text-amber-800' : 'text-sky-800'}`}>{tip.desc}</p>
                      </div>
                    </div>
                    {tip.mapsUrl && <DirectionsButton href={tip.mapsUrl} label="Open Walking Directions" warning={isWarning} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-stone-400">Accommodation</h3>
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 rounded-full bg-stone-100 p-2.5 text-stone-600">
                  <Bed size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-stone-800">{day.hotel.name}</h4>
                  <p className="mt-0.5 break-words text-xs leading-relaxed text-stone-500">{day.hotel.address}</p>
                </div>
              </div>
              <a
                href={day.hotel.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm active:scale-[0.98] active:bg-emerald-800"
              >
                <Navigation size={14} />
                <span>Open Hotel in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BellItaliaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(tripData[0].id);

  const toggleDay = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 antialiased selection:bg-emerald-200">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-stone-100 shadow-2xl">
        <header className="sticky top-0 z-10 overflow-hidden rounded-b-3xl bg-emerald-800 px-5 pb-6 pt-12 text-white shadow-lg">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 opacity-10">
            <MapIcon size={150} />
          </div>
          <div className="relative z-10">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-emerald-200">EF Tours</p>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Bell&apos; Italia</h1>
            <p className="flex items-center gap-2 text-sm text-emerald-50 opacity-90">
              <Calendar size={14} /> July 9 - July 16
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 pb-12 pt-6">
          <div className="mb-6 flex items-end justify-between px-2">
            <h2 className="text-lg font-bold text-stone-700">Daily Itinerary</h2>
            <button
              type="button"
              onClick={() => setExpandedId(null)}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors active:bg-emerald-100"
            >
              Collapse All
            </button>
          </div>

          <div className="space-y-4">
            {tripData.map((day) => (
              <DayCard key={day.id} day={day} isExpanded={expandedId === day.id} onToggle={() => toggleDay(day.id)} />
            ))}
          </div>

          <div className="mb-6 mt-10 px-8 text-center text-xs leading-relaxed text-stone-400">
            Tap any day for schedule, tips, hotel details, and Google Maps directions.
          </div>
        </main>
      </div>
    </div>
  );
}
