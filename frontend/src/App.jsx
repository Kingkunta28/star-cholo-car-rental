import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './App.css'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://zanzibarride.com').replace(/\/+$/, '')
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || ''
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || ''
const CURRENT_YEAR = new Date().getFullYear()

const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

// Locally hosted photography lives in /public/images as <name>-960.jpg, -1280.jpg and -1920.jpg.
// Every file is credited in PHOTO_CREDITS, which the footer renders.
const LOCAL_WIDTHS = [960, 1280, 1920]
const isLocal = (image) => image.startsWith('local:')
const imageUrl = (image, width = 1280) => {
  if (!isLocal(image)) return photo(image, width)
  const size = LOCAL_WIDTHS.find((step) => step >= width) || LOCAL_WIDTHS.at(-1)
  return `/images/${image.slice(6)}-${size}.jpg`
}
const imageSrcSet = (image, widths) => (isLocal(image)
  ? LOCAL_WIDTHS.map((width) => `${imageUrl(image, width)} ${width}w`)
  : widths.map((width) => `${photo(image, width)} ${width}w`)).join(', ')

const destinations = [
  {
    slug: 'stone-town', name: 'Stone Town', area: 'Zanzibar City',
    image: 'local:stone-town-forodhani', alt: 'The domed pavilion in Forodhani Gardens on the Stone Town waterfront',
    description: 'Wind through coral-stone lanes, lively markets and carved wooden doorways in the island’s historic heart.',
    overview: 'Stone Town is a living cultural centre shaped by African, Arab, Indian and European influences. Its lanes are best explored on foot, with a driver making arrival, hotel connections and onward trips simple.',
    experience: 'Spend time around the Old Fort and Forodhani Gardens, browse the market and pause for Swahili coffee in the old quarter.',
    activities: ['Walk the historic lanes with a local guide', 'Visit the Old Fort and House of Wonders area', 'Browse Darajani Market', 'Arrange a sunset pickup from Forodhani Gardens'],
    location: 'West coast of Unguja, beside Zanzibar City and the harbour.',
  },
  {
    slug: 'nungwi-beach', name: 'Nungwi Beach', area: 'North Zanzibar',
    image: 'local:nungwi-beach', alt: 'Turquoise water and white sand at Nungwi Beach',
    description: 'Clear northern waters, dhow-building traditions and lively evenings make Nungwi a favourite island escape.',
    overview: 'At Zanzibar’s northern tip, Nungwi is known for its broad beach and swimming conditions that are less affected by the tide than many east-coast shores.',
    experience: 'Enjoy a beach day, see traditional dhow craft or plan a boat outing. A private driver makes the north-coast journey comfortable from the airport or Stone Town.',
    activities: ['Swim and relax on the northern shore', 'See local dhow-building workshops', 'Book a sunset dhow cruise', 'Connect to nearby Kendwa by road'],
    location: 'Northern tip of Unguja, around 60 km from Stone Town by road.',
  },
  {
    slug: 'kendwa-beach', name: 'Kendwa Beach', area: 'North Zanzibar',
    image: 'local:kendwa-beach', alt: 'The long, tree-lined sweep of Kendwa Beach',
    description: 'A wide sweep of pale sand and calm blue water on Zanzibar’s much-loved north coast.',
    overview: 'Kendwa offers a relaxed beach setting with open views across the Indian Ocean. It sits just south of Nungwi and works well as a full-day outing or a hotel transfer stop.',
    experience: 'Settle in for a swim, enjoy the beach at an easy pace and stay for the changing colours near sunset.',
    activities: ['Spend a day by the water', 'Take a northern-coast beach walk', 'Arrange a sunset return transfer', 'Combine Kendwa with a Nungwi visit'],
    location: 'North-west coast of Unguja, just south of Nungwi.',
  },
  {
    slug: 'paje-beach', name: 'Paje Beach', area: 'South-east Zanzibar',
    image: 'local:paje-low-tide', alt: 'Rippled sand flats at Paje Beach at low tide',
    description: 'A breezy east-coast village known for its long beach, kite-surfing scene and relaxed cafés.',
    overview: 'Paje pairs a long, tide-shaped shoreline with a welcoming village atmosphere. It is a popular base for water sports and for exploring Zanzibar’s south-east coast.',
    experience: 'Watch kite surfers in season, take a beach walk at low tide or settle into one of the village cafés between swims.',
    activities: ['Try kite surfing with a local school', 'Walk the shoreline at low tide', 'Explore village cafés and shops', 'Travel onward to Jambiani or The Rock'],
    location: 'East coast of Unguja, south of the island’s central area.',
  },
  {
    slug: 'jambiani', name: 'Jambiani', area: 'South-east Zanzibar',
    image: 'local:jambiani-beach', alt: 'Shallow turquoise water off the beach at Jambiani',
    description: 'A string of coastal villages where seaweed farming, turquoise shallows and unhurried days meet.',
    overview: 'Jambiani stretches along the south-east coast, where village life sits close to the shore. Its wide tidal flats reveal a different view of the ocean throughout the day.',
    experience: 'Walk between village and beach, learn about local seaweed farming and take time to enjoy the quiet rhythm of the coast.',
    activities: ['Walk the village shoreline', 'Learn about seaweed farming', 'Swim around high tide', 'Pair a visit with Paje or Jozani Forest'],
    location: 'South-east coast of Unguja, below Paje.',
  },
  {
    slug: 'kizimkazi', name: 'Kizimkazi', area: 'South Zanzibar',
    image: 'local:kizimkazi-mosque', alt: 'Carved calligraphy inside the historic Kizimkazi mosque',
    description: 'A quiet southern coast with fishing-village roots, historic mosques and boat trips on the water.',
    overview: 'Kizimkazi is a collection of southern-coast villages with a strong maritime character. Visitors come for the scenery, local history and boat excursions.',
    experience: 'Discover the old mosque and coastal villages, or arrange a locally operated boat trip. Wildlife sightings are never guaranteed, so choose responsible operators.',
    activities: ['Visit the historic Kizimkazi mosque', 'Arrange a responsible boat excursion', 'Explore the southern coastline', 'Stop at a village restaurant'],
    location: 'South-west coast of Unguja, around 60 km from Stone Town.',
  },
  {
    slug: 'the-rock-restaurant', name: 'The Rock Restaurant', area: 'Michamvi, South-east Zanzibar',
    image: 'local:the-rock', alt: 'The Rock Restaurant on its coral outcrop at Michamvi',
    description: 'A memorable dining stop set above the water on the Michamvi peninsula.',
    overview: 'The Rock is a small restaurant in a striking sea setting off Michamvi. Tide conditions affect how guests reach it, and reservations are advisable before travelling.',
    experience: 'Enjoy the coastal setting and a seafood-focused menu, then take in the views across the lagoon. Check opening times and table availability directly before your visit.',
    activities: ['Reserve a table in advance', 'Check tide and access arrangements', 'Explore nearby Michamvi beaches', 'Arrange a return pickup after dinner'],
    location: 'Michamvi Pingwe, on the south-east peninsula of Unguja.',
  },
  {
    slug: 'prison-island', name: 'Prison Island', area: 'Off Stone Town',
    image: 'local:changuu-from-stone-town', alt: 'Boats off Stone Town with Changuu (Prison) Island on the horizon',
    description: 'A short boat ride from Stone Town brings you to a small island with history and coastal views.',
    overview: 'Also known as Changuu Island, Prison Island is reached by boat from Stone Town. Visitors can explore the island and its tortoise sanctuary; the boat crossing is arranged separately from road transport.',
    experience: 'Pair a boat excursion with time in Stone Town. Your driver can coordinate a convenient pickup and drop-off near the harbour.',
    activities: ['Take a boat from Stone Town', 'Visit the island’s tortoise sanctuary', 'Walk the shoreline and historic grounds', 'Combine with a Stone Town afternoon'],
    location: 'A few kilometres offshore from Stone Town; reached by boat.',
  },
  {
    slug: 'nakupenda-sandbank', name: 'Nakupenda Sandbank', area: 'Off Stone Town',
    image: 'local:sandbank-prison-island', alt: 'Clear water over a sandbank in the channel off Stone Town',
    description: 'A shifting ribbon of white sand and clear water, reached by boat from Stone Town.',
    overview: 'Nakupenda is a sandbank off the west coast that appears and changes with the tide. Boat trips are weather- and tide-dependent, so confirm conditions with your operator.',
    experience: 'Swim, snorkel and relax on the sand when conditions allow. Road transfer can take you to the departure point; the excursion itself is by boat.',
    activities: ['Book a boat trip with a local operator', 'Swim or snorkel when conditions permit', 'Check tide and weather before departure', 'Add a Stone Town visit to the same day'],
    location: 'Off the west coast of Unguja, accessed by boat from Stone Town.',
  },
  {
    slug: 'jozani-forest', name: 'Jozani Forest', area: 'Central-east Zanzibar',
    image: 'local:jozani-colobus', alt: 'Zanzibar red colobus monkeys among the trees',
    description: 'Walk beneath a forest canopy and look for the island’s distinctive red colobus monkeys.',
    overview: 'Jozani Chwaka Bay National Park protects a rare coastal forest and mangrove ecosystem. The red colobus monkey is native to Zanzibar, though wildlife sightings can vary.',
    experience: 'Follow marked trails with a local guide, learn about the forest habitat and continue through the mangrove boardwalk.',
    activities: ['Walk the forest trails with a guide', 'Look for Zanzibar red colobus monkeys', 'Visit the mangrove boardwalk', 'Combine with Paje or Jambiani'],
    location: 'Central-east Unguja, between Stone Town and the south-east coast.',
  },
  {
    slug: 'matemwe', name: 'Matemwe', area: 'North-east Zanzibar',
    image: 'local:matemwe-beach', alt: 'Palm-fringed white sand at Matemwe',
    description: 'A peaceful north-east coast village facing the reef-fringed waters near Mnemba Island.',
    overview: 'Matemwe is a quieter coastal destination with long views over the reef. Excursions to nearby marine areas are operated by local providers and depend on sea conditions.',
    experience: 'Enjoy a slower beach day, visit village cafés or arrange a locally operated snorkelling trip after checking conditions and conservation guidance.',
    activities: ['Relax along the north-east coast', 'Arrange a responsible snorkelling trip', 'Explore nearby village life', 'Connect by road with Nungwi or Kiwengwa'],
    location: 'North-east coast of Unguja, opposite Mnemba Atoll.',
  },
  {
    slug: 'pwani-mchangani', name: 'Pwani Mchangani', area: 'North-east Zanzibar',
    image: 'local:kiwengwa-coast', alt: 'Clear shallows on the north-east coast at neighbouring Kiwengwa',
    description: 'A tranquil stretch of north-east coastline with palm-lined shores and small village paths.',
    overview: 'Pwani Mchangani offers a quieter alternative on the north-east coast, with a long beach and easy connections to nearby Kiwengwa and Matemwe.',
    experience: 'Spend an unhurried day by the sea, explore the neighbouring coast and plan around the east coast’s changing tides.',
    activities: ['Enjoy a quiet beach day', 'Walk the coast at low tide', 'Visit nearby Kiwengwa', 'Arrange hotel-to-hotel transport'],
    location: 'North-east coast of Unguja, between Kiwengwa and Matemwe.',
  },
]

const services = [
  { number: '01', name: 'Airport Transfers', description: 'A reliable pickup or drop-off at Abeid Amani Karume International Airport, arranged around your arrival details.', image: 'local:airport-terminal', alt: 'The terminal at Abeid Amani Karume International Airport' },
  { number: '02', name: 'Hotel Transfers', description: 'Travel between hotels, resorts and guesthouses without the hassle of arranging transport on arrival.', image: 'local:nungwi-palms', alt: 'Palm-shaded beachfront seating at Nungwi' },
  { number: '03', name: 'Private Island Tours', description: 'Explore the places on your list with a private driver and a day shaped around your interests.', image: 'local:fuoni-road', alt: 'Cars and motorbikes on a sunlit road in Fuoni, Zanzibar' },
  { number: '04', name: 'Beach Transfers', description: 'Reach the coast comfortably, from a quick swim near town to a full day on the northern beaches.', image: 'local:nungwi-shoreline', alt: 'Clear water washing onto the sand at Nungwi' },
  { number: '05', name: 'Full-Day Transportation', description: 'Connect several stops in one day with flexible timing and space for the plans that matter to you.', image: 'local:forodhani-waterfront', alt: 'Aerial view of Forodhani Gardens and the Stone Town waterfront road' },
  { number: '06', name: 'Family & Group Transfers', description: 'Tell us your passenger count and luggage needs so we can discuss a suitable vehicle for your group.', image: 'local:stone-town-seafront', alt: 'People gathered along the Stone Town seafront' },
]

const reasons = [
  ['Professional local drivers', 'Travel with drivers who know Zanzibar’s roads and communities.'],
  ['Comfortable, clean vehicles', 'Tell us what your group needs and we will discuss an appropriate option.'],
  ['Reliable pickup planning', 'Share your flight, hotel or meeting point so pickup details are clear.'],
  ['Flexible arrangements', 'Plan a one-way transfer, a few stops or a full day on the road.'],
  ['Local destination knowledge', 'Get practical help with routes, timing and nearby places to visit.'],
  ['Personal transportation', 'Your trip is arranged for your party, not shared with a tour group.'],
  ['Clear pricing discussion', 'Confirm availability and the fare directly with the team before travel.'],
]

const travelNotes = [
  { label: 'Beaches', link: 'kendwa-beach', title: 'Choose your coast by the day', text: 'The north is known for swimming at different tide levels; the east coast changes dramatically with the tide. Check local conditions and plan beach time accordingly.', position: 'center 88%', image: 'local:kendwa-starfish', alt: 'A red cushion starfish on white sand at Kendwa' },
  { label: 'History', link: 'stone-town', title: 'Give Stone Town time', text: 'The old quarter is best explored on foot. Arrange a drop-off near the historic centre, then let its markets, carved doors and waterfront unfold at walking pace.', image: 'local:stone-town-door', alt: 'An ornately carved wooden door in Stone Town' },
  { label: 'Nature', link: 'jozani-forest', title: 'Make room for the forest', text: 'Jozani’s forest and mangrove habitats offer a different side of the island. A guide can explain the ecosystem and help visitors move through it respectfully.', image: 'local:red-colobus', alt: 'A Zanzibar red colobus monkey in Jozani Forest' },
  { label: 'Local life', link: 'jambiani', title: 'Travel with curiosity', text: 'Try Swahili food, ask before photographing people and leave time for village stops. A little flexibility often makes a day feel less like a checklist.', image: 'local:jambiani-fisherman', alt: 'A fisherman preparing his dhow on the shore at Jambiani' },
]

const HERO_PHOTO = { image: 'local:dhow-sunset', alt: 'Traditional dhows on the water at sunset off Zanzibar', position: '42% 55%' }
const CLOSING_PHOTO = { image: 'local:kendwa-shore', alt: 'Turquoise water and a long white-sand beach on Zanzibar', position: 'center 92%' }
// [file on Wikimedia Commons, author, licence]. Generated from the image download manifest.
const PHOTO_CREDITS = [
  ['Dhow Sunset, Zanzibar (10164046475).jpg', 'Rod Waddington from Kergunyah, Australia', 'CC BY-SA 2.0'],
  ['Zanzibar, Tanzania - panoramio (2).jpg', 'The Erica Chang', 'CC BY 3.0'],
  ['Parque Forodhani, Stone Town, Zanzíbar, Tanzania, 2024-05-31, DD 29-31 HDR.jpg', 'Diego Delso', 'CC BY-SA 4.0'],
  ['Nungwi,Zanzibar - panoramio.jpg', 'Jang Woo Lee', 'CC BY 3.0'],
  ['KB Beach.jpg', 'Kibabe', 'CC BY-SA 3.0'],
  ['Paje beach at low tide.jpg', 'Matt Kieffer from London, United Kingdom', 'CC BY-SA 2.0'],
  ['Jambiani beach.jpg', 'Jonathan Dalrymple', 'CC BY-SA 4.0'],
  ['Calligraphy at historic Kizimkazi Mosque, Kusini DC, South Zanzibar, Tanzania.jpg', 'Mnazini', 'CC BY 4.0'],
  ['The Rock Restaurant, Zanzibar (53801362304).jpg', 'Rod Waddington', 'CC BY-SA 2.0'],
  ['Changuu Island in far.jpg', 'Luganosamwel', 'CC BY-SA 4.0'],
  ['Red Colobus 7.jpg', 'Olivier Lejade from France', 'CC BY-SA 2.0'],
  ['Beach at Matemwe.jpg', 'Olivier Lejade from France', 'CC BY-SA 2.0'],
  ['Abeid Amani Karume International Airport.jpg', 'Jennifer Davies', 'CC BY 2.0'],
  ['Paradise at Nungwi, Kaskazini A, Unguja North, Zanzibar.jpg', 'Mangapwani', 'CC BY-SA 4.0'],
  ['FUONI ZANZIBAR.jpg', 'Rasheedhrasheed', 'CC BY-SA 4.0'],
  ['Nungwi Beach Zanzibar.jpg', 'Kamusiyakitaa', 'CC BY-SA 4.0'],
  ['Forodhani jubilee gardens Zanzibar.jpg', 'Moongateclimber', 'Public domain'],
  ['Forodhani Gardens (34023630713).jpg', 'David Stanley from Nanaimo, Canada', 'CC BY 2.0'],
  ['Carmen fiano kendwa zanzibar tanzania.jpg', 'Giuseppe palumbo', 'CC0'],
  ['Carved wooden door — in Stone Town, Zanzibar City.jpg', 'Nannarella', 'Public domain'],
  ['Piliocolobus kirkii.jpg', 'Riccardoariotti', 'CC BY-SA 4.0'],
  ['Fisherman maintaining his dhow.jpg', 'RichieRR', 'CC BY-SA 4.0'],
  ['Sandbank near Prison Island - panoramio.jpg', 'lazyweaver', 'CC BY 3.0'],
  ['Zanzibar kiwengwa.jpg', 'AliceMartinelli8', 'CC BY-SA 4.0'],
]

const today = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function SeoMeta({ title, description, image, structuredData }) {
  const location = useLocation()

  useEffect(() => {
    const canonical = `${SITE_URL}${location.pathname}`
    document.title = title
    const setMeta = (selector, value, attribute = 'name') => {
      let meta = document.head.querySelector(`meta[${attribute}="${selector}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, selector)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', value)
    }
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

    document.getElementById('seo-json-ld')?.remove()
    if (structuredData) {
      const script = document.createElement('script')
      script.id = 'seo-json-ld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [description, image, location.pathname, structuredData, title])

  return null
}

const ICON_PATHS = {
  arrow: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  arrowDown: <path d="M12 5v14M6.5 13.5 12 19l5.5-5.5" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  driver: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.1" /><path d="M3.6 10.6h6.4M14 10.6h6.4M12 14.1v6.4" /></>,
  car: <><path d="M5.2 12 7 7.6A2.2 2.2 0 0 1 9 6.2h6a2.2 2.2 0 0 1 2 1.4l1.8 4.4" /><rect x="3.5" y="12" width="17" height="5" rx="1.6" /><path d="M6.5 17v2.2M17.5 17v2.2M7 14.5h1.2M15.8 14.5H17" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.2V12l3.2 2" /></>,
  route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8z" /></>,
  user: <><circle cx="12" cy="8.2" r="3.5" /><path d="M5 19.5a7 7 0 0 1 14 0" /></>,
  chat: <><path d="M20 11.5a7.8 7.8 0 0 1-11.4 6.9L4 19.6l1.2-4.2A7.8 7.8 0 1 1 20 11.5Z" /><path d="M8.8 10h6.4M8.8 13.2h3.8" /></>,
  pin: <><path d="M12 20.8s6.6-5.8 6.6-11a6.6 6.6 0 0 0-13.2 0c0 5.2 6.6 11 6.6 11Z" /><circle cx="12" cy="9.6" r="2.4" /></>,
  phone: <path d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11 11 0 0 0 5.2 5.2l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 6a2 2 0 0 1 2-2.2Z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 6.5 8 6.2 8-6.2" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.2M12 7.8v.1" /></>,
  whatsapp: <><path d="M20.4 11.7a8.4 8.4 0 0 1-12.4 7.4L3.6 20.4l1.3-4.2a8.4 8.4 0 1 1 15.5-4.5Z" /><path d="M9.1 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6a6.5 6.5 0 0 0 2.4 2.4c.2.1.4.1.6 0l.6-.5c.2-.1.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.4.8-.6.4-1.4.6-2.2.4a7.6 7.6 0 0 1-5.2-5.2c-.2-.8 0-1.6.3-2.2Z" fill="currentColor" stroke="none" /></>,
}

function Icon({ name, className = 'icon' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{ICON_PATHS[name]}</svg>
}

function ButtonContent({ children, icon = 'arrow' }) {
  return <><span className="button-label">{children}</span><span className="button-icon"><Icon name={icon} /></span></>
}

const reasonIcons = ['driver', 'car', 'clock', 'route', 'compass', 'user', 'chat']
const navLinks = [
  ['Our Services', 'services'], ['Destinations', 'destinations'],
  ['About Zanzibar', 'inspiration'], ['About Us', 'why-us'], ['Contact Us', 'contact'],
]
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function useReveal(key) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])
}

function useParallax(key) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const layers = [...document.querySelectorAll('[data-parallax]')]
    if (!layers.length) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      layers.forEach((layer) => {
        const box = layer.parentElement.getBoundingClientRect()
        if (box.bottom < 0 || box.top > viewport) return
        const speed = Number(layer.dataset.parallax) || 0.15
        const offset = (box.top + box.height / 2 - viewport / 2) * -speed
        layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
      })
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [key])
}

function Brand({ inverted = false, onClick }) {
  return <Link className={`brand${inverted ? ' brand-inverted' : ''}`} to="/" aria-label="Zanzibar Ride home" onClick={onClick}>
    <span className="brand-mark" aria-hidden="true">Z</span>
    <span className="brand-copy"><strong>ZANZIBAR RIDE</strong><small>ISLAND TRANSFERS</small></span>
  </Link>
}

function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const isHome = location.pathname === '/'
  const overHero = isHome || destinations.some((place) => location.pathname === `/destinations/${place.slug}`)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    if (!menuOpen) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    const onResize = () => { if (window.innerWidth > 960) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!isHome || !('IntersectionObserver' in window)) return undefined
    const sections = navLinks.map(([, id]) => document.getElementById(id)).filter(Boolean)
    const visible = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      })
      setActiveSection(navLinks.map(([, id]) => id).find((id) => visible.has(id)) || '')
    }, { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  const headerClass = ['site-header', scrolled || !overHero ? 'is-solid' : 'is-transparent', menuOpen ? 'menu-is-open' : ''].filter(Boolean).join(' ')

  return (
    <header className={headerClass}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="nav-wrap">
        <Brand onClick={closeMenu} />
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
          <div className="main-nav-links">
            <Link to="/" onClick={closeMenu} style={{ '--i': 0 }} aria-current={isHome && !activeSection && !scrolled ? 'page' : undefined}><span className="nav-index" aria-hidden="true">00</span>Home</Link>
            {navLinks.map(([label, id], index) => <a key={label} href={`/#${id}`} onClick={closeMenu} style={{ '--i': index + 1 }} aria-current={isHome && activeSection === id ? 'location' : undefined}><span className="nav-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
          </div>
          <div className="mobile-nav-footer">
            <a className="button button-light mobile-book" href="/#booking" onClick={closeMenu}><ButtonContent>Book your transfer</ButtonContent></a>
            <p>Karibu Zanzibar · Private island transfers</p>
          </div>
        </nav>
        <a className="nav-book desktop-book" href="/#booking"><span>Book your transfer</span><Icon name="arrow" /></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="menu-lines" aria-hidden="true"><i /><i /></span><span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  )
}

function SectionHeading({ eyebrow, title, text, light = false, split = false }) {
  return <div className={`section-heading${light ? ' section-heading-light' : ''}${split ? ' section-heading-split' : ''}`} data-reveal>
    <div className="section-heading-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    {text && <p>{text}</p>}
  </div>
}

function Field({ label, error, optional = false, marker = true, wide = false, children }) {
  return <label className={`field${wide ? ' form-wide' : ''}`}>
    <span className="field-label">{label}{optional && <span className="field-optional">Optional</span>}{!optional && marker && <span className="field-required" aria-hidden="true">*</span>}</span>
    {children}
    {error && <span className="field-error">{error}</span>}
  </label>
}

function TransferInquiry() {
  const location = useLocation()
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(location.search)
    return { fullName: '', whatsapp: '', pickup: '', destination: params.get('destination') || '', date: '', time: '', passengers: '1', type: params.get('service') || '', notes: '' }
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (location.hash === '#booking') {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setStatus('')
  }

  const submit = (event) => {
    event.preventDefault()
    if (!WHATSAPP_NUMBER) {
      setStatus('The business WhatsApp number has not been configured on this website yet.')
      return
    }
    const message = [
      'Hello Zanzibar Ride, I would like to enquire about a transfer.',
      '', `Name: ${form.fullName}`, `My WhatsApp: ${form.whatsapp}`,
      `Pickup location: ${form.pickup}`, `Destination: ${form.destination}`,
      `Pickup date: ${form.date}`, `Pickup time: ${form.time}`,
      `Passengers: ${form.passengers}`, `Transportation type: ${form.type}`,
      `Additional information: ${form.notes || 'None'}`,
      '', 'Please confirm availability and pricing. I understand this inquiry is not a confirmed booking.',
    ].join('\n')
    window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`)
  }

  return <section className="booking-section" id="booking">
    <div className="booking-layout container">
      <div className="booking-copy" data-reveal>
        <span className="eyebrow">A good journey starts here</span>
        <h2>Tell us where you’re <em>headed.</em></h2>
        <p>Share your travel details and we’ll continue the conversation on WhatsApp. Availability and pricing are confirmed directly with you.</p>
        {(PHONE_NUMBER || CONTACT_EMAIL || WHATSAPP_NUMBER) && <div className="booking-contact-links">
          {PHONE_NUMBER && <a href={`tel:${PHONE_NUMBER}`}><Icon name="phone" /><span>Call us</span><Icon name="arrow" className="icon icon-end" /></a>}
          {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}><Icon name="mail" /><span>Email us</span><Icon name="arrow" className="icon icon-end" /></a>}
          {WHATSAPP_NUMBER && <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" /><span>WhatsApp</span><Icon name="arrow" className="icon icon-end" /></a>}
        </div>}
        <p className="booking-note"><Icon name="info" />Your message is an inquiry, not an automatic confirmation.</p>
      </div>
      <form className="inquiry-form" onSubmit={submit} data-reveal>
        <fieldset className="form-group">
          <legend><span>01</span>Your details</legend>
          <div className="form-grid">
            <Field label="Full name" error="Please tell us your name."><input autoComplete="name" name="fullName" value={form.fullName} onChange={update} placeholder="Your name" required /></Field>
            <Field label="WhatsApp number" error="We need a number to reply on WhatsApp."><input autoComplete="tel" type="tel" name="whatsapp" value={form.whatsapp} onChange={update} placeholder="Include country code" required /></Field>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <legend><span>02</span>Your journey</legend>
          <div className="form-grid">
            <Field label="Pickup location" error="Add an airport, hotel or address."><input name="pickup" value={form.pickup} onChange={update} placeholder="Airport, hotel or address" required /></Field>
            <Field label="Destination" error="Where would you like to go?"><input name="destination" value={form.destination} onChange={update} placeholder="Where would you like to go?" required /></Field>
            <Field label="Pickup date" error="Choose a date from today onwards."><input type="date" min={today()} name="date" value={form.date} onChange={update} required /></Field>
            <Field label="Pickup time" error="Choose a pickup time."><input type="time" name="time" value={form.time} onChange={update} required /></Field>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <legend><span>03</span>Trip details</legend>
          <div className="form-grid">
            <Field label="Passengers" marker={false}><select name="passengers" value={form.passengers} onChange={update}>{Array.from({ length: 14 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}{index === 13 ? '+' : ''} {index === 0 ? 'passenger' : 'passengers'}</option>)}</select></Field>
            <Field label="Transportation type" error="Choose the service you need."><select name="type" value={form.type} onChange={update} required><option value="">Choose a service</option>{['Airport Transfers', 'Hotel Transfers', 'Private Island Tours', 'Beach Transfers', 'Full-Day Transportation', 'Half-Day Transportation', 'Hotel-to-Hotel Transfers', 'Family & Group Transfers', 'Customized Tourist Trip', 'Stone Town Transportation'].map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
            <Field label="Additional information" optional wide><textarea name="notes" value={form.notes} onChange={update} placeholder="Flight number, luggage, stops or anything else we should know" rows="3" /></Field>
          </div>
        </fieldset>
        <div className="form-footer">
          <button className="button button-primary form-submit" type="submit"><ButtonContent>Continue to WhatsApp</ButtonContent></button>
          <p className="form-hint"><Icon name="whatsapp" />Your details open in WhatsApp, ready to send.</p>
        </div>
        <p className="form-status" role="status" aria-live="polite">{status}</p>
      </form>
    </div>
  </section>
}

function PhotoCredits() {
  return <details className="photo-credits">
    <summary>Photo credits</summary>
    <ul>{PHOTO_CREDITS.map(([file, author, license]) => <li key={file}><a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`} target="_blank" rel="noreferrer">{file.replace(/\.(jpe?g|png)$/i, '')}</a> · {author} · {license}, via Wikimedia Commons</li>)}</ul>
  </details>
}

function Footer() {
  return <footer className="site-footer" id="contact">
    <div className="container">
      <div className="footer-top">
        <p className="footer-statement">Thoughtful private transportation for your time on the island.</p>
        <a className="button button-light" href="/#booking"><ButtonContent>Book your transfer</ButtonContent></a>
      </div>
      <div className="footer-main">
        <div className="footer-brand"><Brand inverted /><span className="footer-coords">06°09′ S · KARIBU · ZANZIBAR, TANZANIA</span></div>
        <div className="footer-col"><h3>Explore</h3><a href="/#services">Our services</a><a href="/#destinations">Destinations</a><a href="/#inspiration">Zanzibar guide</a></div>
        <div className="footer-col"><h3>Get in touch</h3>{PHONE_NUMBER ? <a href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a> : <span>Private transfers across Zanzibar</span>}{CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}{WHATSAPP_NUMBER && <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Message on WhatsApp</a>}</div>
      </div>
      <div className="footer-bottom"><span>© {CURRENT_YEAR} Zanzibar Ride</span><span>Availability and pricing are confirmed directly with our team.</span></div>
      <PhotoCredits />
    </div>
  </footer>
}

function WhatsAppFloat() {
  if (!WHATSAPP_NUMBER) return null
  return <a className="whatsapp-float" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Zanzibar Ride, I would like to arrange transportation in Zanzibar.')}`} target="_blank" rel="noreferrer" aria-label="Contact Zanzibar Ride on WhatsApp"><Icon name="whatsapp" /></a>
}

function MobileBookingBar() {
  const [bookingVisible, setBookingVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const bookingSection = document.getElementById('booking')
    if (!bookingSection || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(([entry]) => setBookingVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(bookingSection)
    return () => observer.disconnect()
  }, [location.pathname, location.search])

  return <a className={`mobile-booking-bar${bookingVisible ? ' is-hidden' : ''}`} href="#booking" aria-hidden={bookingVisible} tabIndex={bookingVisible ? -1 : 0}><span>Karibu Zanzibar</span><strong>Arrange your transfer</strong><span className="mobile-booking-icon" aria-hidden="true"><Icon name="arrow" /></span></a>
}

function HomePage() {
  useReveal('home')
  useParallax('home')
  const location = useLocation()
  const localBusiness = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Zanzibar Ride', url: SITE_URL,
    description: 'Private tourist transportation, airport transfers and hotel transfers across Zanzibar.', areaServed: { '@type': 'AdministrativeArea', name: 'Zanzibar, Tanzania' },
    image: imageUrl(HERO_PHOTO.image, 1280),
    ...(PHONE_NUMBER ? { telephone: PHONE_NUMBER } : {}), ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    makesOffer: services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name } })),
  }
  return <>
    <SeoMeta title="Zanzibar Airport Transfers & Private Island Transport | Zanzibar Ride" description="Arrange private Zanzibar airport transfers, hotel pickups, beach rides and island transportation with a local driver. Plan your journey directly with Zanzibar Ride." image={imageUrl(HERO_PHOTO.image, 1280)} structuredData={localBusiness} />
    <main id="main-content">
      <section className="hero-section">
        <div className="hero-media" data-parallax="0.22">
          <img className="hero-image" src={imageUrl(HERO_PHOTO.image, 1920)} srcSet={imageSrcSet(HERO_PHOTO.image, [960, 1280, 1920])} sizes="100vw" alt={HERO_PHOTO.alt} fetchPriority="high" style={{ objectPosition: HERO_PHOTO.position }} />
        </div>
        <div className="hero-shade" />
        <div className="hero-content container">
          <span className="hero-kicker"><i /> KARIBU ZANZIBAR · PRIVATE ISLAND TRANSFERS</span>
          <h1><span className="hero-line">Explore Zanzibar.</span> <em className="hero-line">We’ll take you there.</em></h1>
          <div className="hero-lower">
            <p>Discover the beauty of Zanzibar with comfortable, reliable and private transportation. From airport pickups to unforgettable island adventures, we make every journey easier.</p>
            <div className="hero-actions"><a className="button button-light" href="#booking"><ButtonContent>Book your transfer</ButtonContent></a><a className="button button-ghost" href="#destinations"><ButtonContent icon="arrowDown">Explore destinations</ButtonContent></a></div>
          </div>
        </div>
        <div className="hero-footer container">
          <div className="hero-trust"><span className="trust-rule" /><span>Your journey, your island, your experience.</span></div>
          <a className="hero-location" href="#destinations"><span>06°09′ S</span><span>KARIBU · ZANZIBAR, TANZANIA</span></a>
        </div>
      </section>

      <section className="intro-strip">
        <div className="container intro-inner" data-reveal>
          <div className="intro-aside"><span className="eyebrow">Karibu, welcome to Zanzibar</span><span className="intro-mark" aria-hidden="true">UNGUJA</span></div>
          <p>From the first airport pickup to the last sunset stop, get around Zanzibar with a driver who <em>knows the island.</em></p>
        </div>
      </section>

      <section className="section-block services-section" id="services">
        <div className="container">
          <SectionHeading split eyebrow="Move around with ease" title="A ride for every part of your stay" text="One airport pickup or a whole day exploring. Tell us what your trip needs." />
          <div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.number} data-reveal style={{ '--i': index % 3 }}>
            <Link to={`/?service=${encodeURIComponent(service.name)}#booking`} className="service-image" tabIndex={-1} aria-hidden="true"><img src={imageUrl(service.image, 960)} alt={service.alt} loading="lazy" style={{ objectPosition: service.position }} /></Link>
            <div className="service-body">
              <span className="service-number">{service.number}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <Link className="text-link" to={`/?service=${encodeURIComponent(service.name)}#booking`}>Ask about this service <Icon name="arrow" /></Link>
            </div>
          </article>)}</div>
        </div>
      </section>

      <section className="section-block destinations-section" id="destinations">
        <div className="container">
          <div className="destination-heading-row"><SectionHeading eyebrow="Find your Zanzibar" title="The island is yours to discover" text="From the old town to the far-reaching coast, plan a comfortable ride to the places you came to see." /><span className="destination-count" data-reveal><strong>12</strong> PLACES<br />ONE ISLAND</span></div>
          <div className="destination-grid">{destinations.map((destination, index) => <article className={`destination-card${index === 0 ? ' destination-card-featured' : ''}`} key={destination.slug} data-reveal style={{ '--i': index % 2 }}>
            <Link className="destination-photo" to={`/destinations/${destination.slug}`} tabIndex={-1} aria-hidden="true"><img src={imageUrl(destination.image, 960)} alt={destination.alt || `${destination.name}, ${destination.area}`} loading="lazy" style={{ objectPosition: destination.position }} /><span className="destination-area">{destination.area}</span><span className="photo-arrow"><Icon name="arrow" /></span></Link>
            <div className="destination-info">
              <span className="destination-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3><Link to={`/destinations/${destination.slug}`}>{destination.name}</Link></h3>
                <p>{destination.description}</p>
                <div className="destination-actions"><Link className="text-link" to={`/destinations/${destination.slug}`}>Explore destination <Icon name="arrow" /></Link><Link className="text-link text-link-muted" to={`/?destination=${encodeURIComponent(destination.name)}#booking`}>Arrange a ride</Link></div>
              </div>
            </div>
          </article>)}</div>
        </div>
      </section>

      <section className="why-section" id="why-us">
        <div className="container why-layout">
          <div className="why-intro" data-reveal>
            <span className="eyebrow eyebrow-light">Travel with a local perspective</span>
            <h2>Good journeys are about more than <em>the drive.</em></h2>
            <p>We keep the details straightforward, so you can spend less time figuring out how to get there and more time enjoying the island.</p>
            <a className="button button-light" href="#booking"><ButtonContent>Plan your journey</ButtonContent></a>
          </div>
          <div className="reasons-list">{reasons.map(([title, text], index) => <article className="reason-item" key={title} data-reveal>
            <span className="reason-icon"><Icon name={reasonIcons[index] || 'compass'} /></span>
            <div><h3>{title}</h3><p>{text}</p></div>
            <span className="reason-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </article>)}</div>
        </div>
      </section>

      <section className="section-block process-section">
        <div className="container">
          <SectionHeading split eyebrow="Simple by design" title="From your plans to the pickup" text="No account, no complicated checkout. Just a clear conversation about your trip." />
          <ol className="steps-grid">{[['01', 'Choose your destination', 'Pick a place, a route or the kind of journey you have in mind.'], ['02', 'Share your travel details', 'Send pickup, timing and passenger information directly to our team.'], ['03', 'Confirm and enjoy Zanzibar', 'We confirm availability and pricing with you before your transfer.']].map(([number, title, text], index) => <li className="step-item" key={number} data-reveal style={{ '--i': index }}><span className="step-number">{number}</span><div className="step-line" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>

      <section className="inspiration-section" id="inspiration">
        <div className="container">
          <SectionHeading split eyebrow="A little island knowledge" title="Make the most of your time here" text="A few useful ideas for shaping your days around the island." />
          <div className="inspiration-grid">{travelNotes.map((note, index) => <article className="inspiration-card" key={note.label} data-reveal style={{ '--i': index }}>
            <Link to={`/destinations/${note.link}`} className="inspiration-image" tabIndex={-1} aria-hidden="true"><img src={imageUrl(note.image, 960)} alt={note.alt} loading="lazy" style={{ objectPosition: note.position }} /><span className="inspiration-label">{note.label}</span></Link>
            <div className="inspiration-copy"><h3><Link to={`/destinations/${note.link}`}>{note.title}</Link></h3><p>{note.text}</p></div>
          </article>)}</div>
          <div className="guide-note" data-reveal><span className="guide-note-mark"><Icon name="info" /></span><p>First visit? Pack light layers, carry cash for small purchases and leave some room in the day for the island’s changing tides and pace.</p></div>
        </div>
      </section>

      <section className="closing-cta">
        <div className="closing-image" data-parallax="0.16" role="img" aria-label={CLOSING_PHOTO.alt} style={{ backgroundImage: `url('${imageUrl(CLOSING_PHOTO.image, 1920)}')`, backgroundPosition: CLOSING_PHOTO.position }} />
        <div className="closing-shade" />
        <div className="closing-copy container" data-reveal>
          <span className="eyebrow eyebrow-light">Your island, at your pace</span>
          <h2>Your Zanzibar adventure <em>starts here.</em></h2>
          <p>Whether you’re arriving at the airport, heading to the beach or exploring the island, let us make your journey comfortable and stress-free.</p>
          <a className="button button-light" href="#booking"><ButtonContent>Arrange your transfer</ButtonContent></a>
        </div>
      </section>
      <TransferInquiry key={location.search} />
    </main>
  </>
}

function DestinationPage() {
  const { slug } = useParams()
  useReveal(slug)
  useParallax(slug)
  const destination = destinations.find((place) => place.slug === slug)
  if (!destination) return <main className="not-found container" id="main-content"><span className="eyebrow">A different route?</span><h1>We can’t find that destination.</h1><p>Explore the island’s places and plan a transfer from there.</p><Link className="button button-primary" to="/#destinations"><ButtonContent>See destinations</ButtonContent></Link></main>

  const title = `${destination.name} Transfers, Zanzibar | Private Driver | Zanzibar Ride`
  const description = `Plan a private transfer to ${destination.name}, ${destination.area}. Explore what to see, where it is and arrange transportation with Zanzibar Ride.`
  const placeSchema = { '@context': 'https://schema.org', '@type': 'TouristDestination', name: destination.name, description: destination.overview, containedInPlace: { '@type': 'AdministrativeArea', name: 'Zanzibar, Tanzania' }, url: `${SITE_URL}/destinations/${destination.slug}` }
  const related = destinations.filter((place) => place.slug !== destination.slug).slice(0, 4)
  return <>
    <SeoMeta title={title} description={description} image={imageUrl(destination.image, 1280)} structuredData={placeSchema} />
    <main className="destination-detail" id="main-content">
      <section className="detail-hero">
        <div className="detail-media" data-parallax="0.18"><img src={imageUrl(destination.image, 1920)} srcSet={imageSrcSet(destination.image, [960, 1280, 1920])} sizes="100vw" alt={destination.alt || `${destination.name}, ${destination.area}, Zanzibar`} fetchPriority="high" style={{ objectPosition: destination.position }} /></div>
        <div className="detail-shade" />
        <div className="container detail-hero-copy" key={destination.slug}>
          <Link className="back-link" to="/#destinations"><Icon name="arrowLeft" /> All destinations</Link>
          <span className="eyebrow eyebrow-light">{destination.area} · Zanzibar</span>
          <h1>{destination.name}</h1>
          <p>{destination.description}</p>
          <Link className="button button-light" to={`/?destination=${encodeURIComponent(destination.name)}#booking`}><ButtonContent>Arrange transportation</ButtonContent></Link>
        </div>
      </section>
      <section className="detail-content container">
        <div className="detail-overview" data-reveal><span className="eyebrow">A place to explore</span><h2>Get to know {destination.name}</h2><p className="detail-lead">{destination.overview}</p><p>{destination.experience}</p></div>
        <aside className="location-panel" data-reveal><span className="location-icon"><Icon name="pin" /></span><span className="eyebrow">On the map</span><h3>Where you’ll find it</h3><p>{destination.location}</p><Link className="text-link" to={`/?destination=${encodeURIComponent(destination.name)}#booking`}>Plan a transfer here <Icon name="arrow" /></Link></aside>
      </section>
      <section className="detail-activities"><div className="container"><SectionHeading eyebrow="Make a day of it" title={`Things to do around ${destination.name}`} /><ol className="activity-list">{destination.activities.map((activity, index) => <li className="activity-item" key={activity} data-reveal style={{ '--i': index }}><span>{String(index + 1).padStart(2, '0')}</span><p>{activity}</p></li>)}</ol></div></section>
      <section className="detail-cta"><div className="container detail-cta-inner" data-reveal><div><span className="eyebrow eyebrow-light">Private driver Zanzibar</span><h2>Let’s get you to <em>{destination.name}.</em></h2><p>Send your pickup point and preferred time. We’ll confirm the details and pricing with you directly.</p></div><Link className="button button-light" to={`/?destination=${encodeURIComponent(destination.name)}#booking`}><ButtonContent>Arrange your transfer</ButtonContent></Link></div></section>
      <section className="related-destinations container"><SectionHeading eyebrow="Keep exploring" title="More of Zanzibar" /><div className="related-links">{related.map((place, index) => <Link key={place.slug} to={`/destinations/${place.slug}`} data-reveal style={{ '--i': index }}><span className="related-photo"><img src={imageUrl(place.image, 500)} alt="" loading="lazy" style={{ objectPosition: place.position }} /></span><span className="related-name">{place.name}<Icon name="arrow" /></span><span className="related-area">{place.area}</span></Link>)}</div></section>
      <TransferInquiry />
    </main>
  </>
}

function App() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.hash, location.pathname])
  return <><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/destinations/:slug" element={<DestinationPage />} /><Route path="*" element={<DestinationPage />} /></Routes><Footer /><MobileBookingBar /><WhatsAppFloat /></>
}

export default App
