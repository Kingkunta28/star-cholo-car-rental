import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useNavigate, useLocation, useParams } from 'react-router-dom'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const SITE_URL = 'https://zanzibarride.com'

const locationMeta = {
  'stone-town': {
    name: 'Stone Town',
    title: 'Car Rental Stone Town Zanzibar | Find Your Ride',
    h1: 'Car Rental in Stone Town, Zanzibar',
    description: 'Looking for a car rental in Stone Town, Zanzibar? Explore available cars near Stone Town and connect directly with local owners for your island trip.',
    overview: 'Stone Town is the cultural heart of Zanzibar, with historic streets, markets and a perfect base for exploring the island by car.',
  },
  nungwi: {
    name: 'Nungwi',
    title: 'Car Rental Nungwi Zanzibar | Rent a Car',
    h1: 'Car Rental in Nungwi, Zanzibar',
    description: 'Find cars for rent in Nungwi, Zanzibar and explore beaches, coastal roads and island day trips with ease.',
    overview: 'Nungwi is one of Zanzibar’s most popular beach areas, ideal for travelers who want a relaxed northern getaway and easy road access.',
  },
  kendwa: {
    name: 'Kendwa',
    title: 'Car Rental Kendwa Zanzibar | Find Your Ride',
    h1: 'Car Rental in Kendwa, Zanzibar',
    description: 'Explore Kendwa and the northern coast with a reliable rental car for beach days, village visits and day trips around Zanzibar.',
    overview: 'Kendwa offers a beautiful coastline and a laid-back atmosphere, making it a popular stop for travelers who want flexibility.',
  },
  paje: {
    name: 'Paje',
    title: 'Car Rental Paje Zanzibar | Find a Car',
    h1: 'Car Rental in Paje, Zanzibar',
    description: 'Looking for a car rental in Paje, Zanzibar? Explore available cars and connect directly with local owners for your east-coast adventure.',
    overview: 'Paje is a favorite for beach lovers and travelers who want to explore Zanzibar’s east coast with convenience and freedom.',
  },
  jambiani: {
    name: 'Jambiani',
    title: 'Car Rental Jambiani Zanzibar | Rent a Car',
    h1: 'Car Rental in Jambiani, Zanzibar',
    description: 'Rent a car in Jambiani, Zanzibar for relaxed beach travel, village stops and easy access to nearby destinations.',
    overview: 'Jambiani is known for its quiet beaches and relaxed island feel, making it a great base for road trips and scenic coastal drives.',
  },
  matemwe: {
    name: 'Matemwe',
    title: 'Car Rental Matemwe Zanzibar | Zanzibar Car Hire',
    h1: 'Car Rental in Matemwe, Zanzibar',
    description: 'Find a car rental in Matemwe, Zanzibar and enjoy quick access to beaches, villages and scenic driving routes across the island.',
    overview: 'Matemwe is a peaceful coastal area that suits travelers looking for an easygoing place to stay while exploring Zanzibar.',
  },
  kiwengwa: {
    name: 'Kiwengwa',
    title: 'Car Rental Kiwengwa Zanzibar | Travel by Car',
    h1: 'Car Rental in Kiwengwa, Zanzibar',
    description: 'Discover available cars for rent in Kiwengwa, Zanzibar and plan your beachside getaway with local car owners.',
    overview: 'Kiwengwa is a beautiful stretch of coast that works well for visitors who want a quieter setting and flexible transport options.',
  },
}

const defaultForm = {
  title: '',
  make: '',
  model: '',
  year: '',
  registration_number: '',
  price_per_day: '',
  location: '',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  seats: 5,
  description: '',
  availability: 'Available',
}

const sampleCars = [
  {
    id: 1,
    title: 'Toyota Corolla for Stone Town trips',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    registration_number: 'KLM-2022',
    price_per_day: '45',
    location: 'Stone Town',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    description: 'Easy to drive around Stone Town, beach roads and day trips. Clean, comfortable and ideal for couples or small families visiting Zanzibar.',
    availability: 'Available',
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    owner: { id: 1, full_name: 'Default Owner', phone: '+255700000001' },
  },
  {
    id: 2,
    title: 'Honda Civic for North Coast drives',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    registration_number: 'TZA-1987',
    price_per_day: '52',
    location: 'Nungwi',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    description: 'Perfect for exploring northern Zanzibar beaches and scenic coastal routes. Spacious interior, smooth drive and excellent comfort for holiday travel.',
    availability: 'Available',
    image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    owner: { id: 1, full_name: 'Default Owner', phone: '+255700000002' },
  },
  {
    id: 3,
    title: 'Ford Ranger for beach and island adventures',
    make: 'Ford',
    model: 'Ranger',
    year: 2020,
    registration_number: 'TZM-6644',
    price_per_day: '70',
    location: 'Paje',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    seats: 5,
    description: 'Designed for longer island drives, luggage-heavy trips and flexible family travel. Comfortable, reliable and ready for your Zanzibar getaway.',
    availability: 'Available',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    owner: { id: 1, full_name: 'Default Owner', phone: '+255700000003' },
  },
]

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    maximumFractionDigits: 0,
  }).format(value)

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getCanonicalUrl = (path = '/') => `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`

const getWhatsAppLink = (phone, title) => {
  const normalizedPhone = String(phone || '').replace(/\D/g, '')
  const message = encodeURIComponent(
    `Hello, I am interested in renting your ${title} listed on the car rental platform.`
  )
  return `https://wa.me/${normalizedPhone}?text=${message}`
}

const parseJsonResponse = async (response) => {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function useOwnerSession() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ownerUser') || 'null'))

  useEffect(() => {
    if (user) {
      localStorage.setItem('ownerUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('ownerUser')
    }
  }, [user])

  return [user, setUser]
}

function SeoMeta({ title, description, canonical, image, type = 'website', structuredData }) {
  const location = useLocation()

  useEffect(() => {
    const pageTitle = title || 'Car Rental Zanzibar | Rent a Car & Explore Zanzibar'
    const pageDescription = description || 'Find cars for rent in Zanzibar and connect directly with local car owners. Explore Stone Town, Nungwi, Paje, Jambiani, Kendwa and more.'
    const finalCanonical = canonical || getCanonicalUrl(location.pathname)
    const finalImage = image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'

    document.title = pageTitle

    const setMeta = (selector, value, attribute = 'name') => {
      let element = document.head.querySelector(`meta[${attribute}="${selector}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, selector)
        document.head.appendChild(element)
      }
      element.setAttribute('content', value)
    }

    setMeta('description', pageDescription)
    setMeta('og:title', pageTitle, 'property')
    setMeta('og:description', pageDescription, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:image', finalImage, 'property')
    setMeta('twitter:title', pageTitle, 'name')
    setMeta('twitter:description', pageDescription, 'name')
    setMeta('twitter:image', finalImage, 'name')

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = finalCanonical

    const previousScript = document.getElementById('seo-json-ld')
    if (previousScript) previousScript.remove()

    if (structuredData) {
      const script = document.createElement('script')
      script.id = 'seo-json-ld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [canonical, description, image, location.pathname, structuredData, title, type])

  return null
}

function Layout({ children, user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error(error)
    } finally {
      setUser(null)
      navigate('/')
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" to="/">
            ZANZIBAR RIDE
          </Link>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/cars">Explore Cars</Link>
            <Link to="/about">About Zanzibar</Link>
            <Link to="/faq">FAQ</Link>
          </nav>
          {user ? (
            <div className="nav-actions owner-nav">
              <Link to="/dashboard" className="nav-cta-link">Dashboard</Link>
              <button type="button" className="ghost-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-actions owner-nav" />
          )}
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}

function HomePage({ cars, filters, setFilters }) {
  const featured = cars.filter((car) => car.availability === 'Available').slice(0, 3)
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    navigate('/cars')
  }

  return (
    <>
      <SeoMeta
        title="Car Rental Zanzibar | Rent a Car & Explore Zanzibar"
        description="Find cars for rent in Zanzibar and connect directly with local car owners. Explore Stone Town, Nungwi, Paje, Jambiani, Kendwa and more."
        canonical="/"
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Zanzibar Ride',
          url: SITE_URL,
          description: 'Car rental Zanzibar marketplace for travelers looking to explore the island by car.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/cars?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Zanzibar car rental</span>
            <h1>Explore Zanzibar Your Way.</h1>
            <p>
              Find the right car for your island adventure and connect directly with local car owners.
            </p>
            <div className="hero-actions">
              <Link to="/cars" className="primary-btn big-btn">Explore Cars</Link>
            </div>
            <ul className="hero-points">
              <li>✔ Easy WhatsApp and phone contact</li>
              <li>✔ Flexible daily travel plans</li>
              <li>✔ Direct connection with local owners</li>
            </ul>
          </div>
          <div className="hero-card">
            <div className="stat-card">
              <strong>Island-ready</strong>
              <span>explore Zanzibar with freedom</span>
            </div>
            <div className="stat-card muted">
              <strong>Local</strong>
              <span>talk directly to the owner</span>
            </div>
            <div className="mini-badge-row">
              <span>Stone Town</span>
              <span>Nungwi</span>
              <span>Paje</span>
            </div>
          </div>
        </div>
      </section>

      <section className="search-panel container">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search Stone Town, Nungwi, Paje..."
          />
          <button type="submit" className="primary-btn">Find My Car</button>
        </form>
      </section>

      <section className="container section-block destination-block">
        <div className="section-header">
          <div>
            <span className="eyebrow">Where will Zanzibar take you?</span>
            <h2>Popular destinations for your island trip</h2>
          </div>
        </div>
        <div className="destination-row">
          <Link to="/location/stone-town">Stone Town</Link>
          <Link to="/location/nungwi">Nungwi</Link>
          <Link to="/location/kendwa">Kendwa</Link>
          <Link to="/location/paje">Paje</Link>
          <Link to="/location/jambiani">Jambiani</Link>
          <Link to="/location/matemwe">Matemwe</Link>
          <Link to="/location/kiwengwa">Kiwengwa</Link>
        </div>
      </section>

      <section className="container section-block destination-showcase">
        <div className="destination-grid">
          <Link to="/location/stone-town" className="destination-card">
            <h3>Stone Town</h3>
            <p>Historic streets, culture, markets and city energy.</p>
          </Link>
          <Link to="/location/nungwi" className="destination-card">
            <h3>Nungwi</h3>
            <p>Coastal roads and beachside escapes in the north.</p>
          </Link>
          <Link to="/location/paje" className="destination-card">
            <h3>Paje</h3>
            <p>East-coast beaches and an easygoing island vibe.</p>
          </Link>
          <Link to="/location/jambiani" className="destination-card">
            <h3>Jambiani</h3>
            <p>Quiet village roads and laid-back travel days.</p>
          </Link>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-header">
          <div>
            <span className="eyebrow">Featured rides</span>
            <h2>Popular cars for your Zanzibar adventure</h2>
          </div>
        </div>
        <div className="car-grid">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section className="how-it-works section-block">
        <div className="container">
          <div className="section-header center">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Discover → Choose → Connect → Explore</h2>
            </div>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Discover</h3>
              <p>Explore cars available across Zanzibar.</p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Choose</h3>
              <p>Find a ride that fits your trip, group and daily budget.</p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Connect</h3>
              <p>Talk directly with the owner through WhatsApp or phone.</p>
            </div>
            <div className="step-card">
              <span className="step-number">04</span>
              <h3>Explore</h3>
              <p>Pick up your car and enjoy Zanzibar your way.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block cta-banner">
        <div>
          <span className="eyebrow">Ready for your island trip?</span>
          <h2>Ready to explore Zanzibar?</h2>
          <p>Find a car and start planning your island adventure.</p>
        </div>
        <Link to="/cars" className="primary-btn big-btn">Explore Cars</Link>
      </section>

      <section className="container section-block faq-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Common questions about Zanzibar car rental</h2>
          </div>
          <Link to="/faq">Read full FAQ</Link>
        </div>

        <div className="faq-grid">
          <div className="faq-item">
            <h3>How can I rent a car in Zanzibar?</h3>
            <p>Browse available cars, compare the price and location, then contact the owner directly through WhatsApp or phone.</p>
          </div>
          <div className="faq-item">
            <h3>Can I contact the owner directly?</h3>
            <p>Yes. Each listing includes direct phone and WhatsApp contact options so travelers can arrange the rental quickly.</p>
          </div>
          <div className="faq-item">
            <h3>Are automatic cars available?</h3>
            <p>Yes, the available listings include different transmission options depending on what owners have listed.</p>
          </div>
          <div className="faq-item">
            <h3>Do I need an account to browse cars?</h3>
            <p>No. You can browse public listings and contact owners without creating an account.</p>
          </div>
        </div>
      </section>
    </>
  )
}

function CarCard({ car }) {
  const image = car.image_url || 'https://placehold.co/600x400/0f172a/ffffff?text=Car+Image'

  return (
    <article className="car-card">
      <div className="car-image-wrap">
        <img src={image} alt={`${car.title} available for rent in ${car.location}, Zanzibar`} />
      </div>
      <div className="car-card-body">
        <h3>{car.title}</h3>
        <p className="meta-line">Perfect for exploring the island</p>
        <p className="location-line">📍 {car.location}</p>
        <p className="meta-line detail-line">{car.transmission} • {car.fuel_type} • {car.seats} Seats</p>
        <div className="price-row">
          <strong>{formatPrice(Number(car.price_per_day))}</strong>
          <span>/ day</span>
        </div>
        <Link to={`/cars/${car.id}/${slugify(car.title)}`} className="secondary-btn">View Details</Link>
      </div>
    </article>
  )
}

function CarsPage({ cars, filters, setFilters }) {
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = !filters.search || `${car.title} ${car.make} ${car.model} ${car.location}`
        .toLowerCase()
        .includes(filters.search.toLowerCase())

      const matchesLocation = !filters.location || car.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesTransmission = !filters.transmission || car.transmission === filters.transmission
      const matchesFuel = !filters.fuel_type || car.fuel_type === filters.fuel_type
      const matchesSeats = !filters.seats || Number(car.seats) >= Number(filters.seats)
      const matchesPrice = !filters.max_price || Number(car.price_per_day) <= Number(filters.max_price)

      return matchesSearch && matchesLocation && matchesTransmission && matchesFuel && matchesSeats && matchesPrice
    })
  }, [cars, filters])

  const resetFilters = () => {
    setFilters({ search: '', location: '', transmission: '', fuel_type: '', seats: '', max_price: '' })
  }

  return (
    <section className="container catalog-wrap">
      <SeoMeta
        title="Cars for Rent in Zanzibar | Zanzibar Car Hire"
        description="Browse cars for rent in Zanzibar, including options in Stone Town, Nungwi, Paje, Jambiani, Kendwa and more."
        canonical="/cars"
      />

      <div className="filters-panel">
          <h3>Find your ride in Zanzibar</h3>
          <div className="filter-grid">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search Stone Town, Nungwi, Paje..."
            />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Where are you staying?"
            />
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => setFilters((prev) => ({ ...prev, max_price: e.target.value }))}
              placeholder="What's your daily budget?"
            />
            <select value={filters.transmission} onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}>
              <option value="">Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <select value={filters.fuel_type} onChange={(e) => setFilters((prev) => ({ ...prev, fuel_type: e.target.value }))}>
              <option value="">What kind of car do you need?</option>
          </select>
          <select value={filters.seats} onChange={(e) => setFilters((prev) => ({ ...prev, seats: e.target.value }))}>
            <option value="">Seats</option>
            <option value="4">4+ Seats</option>
            <option value="5">5+ Seats</option>
            <option value="7">7+ Seats</option>
          </select>
        </div>
      </div>

      <div className="results-block">
        <div className="section-header">
          <div>
            <span className="eyebrow">Ready to go</span>
            <h2>{filteredCars.length} rides ready to explore Zanzibar</h2>
          </div>
          <button type="button" className="secondary-btn small-btn" onClick={resetFilters}>Clear Filters</button>
        </div>

        {filteredCars.length === 0 ? (
          <div className="empty-state">
            <strong>No rides found for your search.</strong>
            <span>Try another location, price range, or vehicle type.</span>
          </div>
        ) : (
          <div className="car-grid">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BookingForm({ car }) {
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    startDate: '',
    endDate: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const totalDays = (() => {
    if (!booking.startDate || !booking.endDate) return 0
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  })()

  const totalPrice = Number(car.price_per_day || 0) * totalDays

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!booking.name || !booking.phone || !booking.startDate || !booking.endDate || totalDays <= 0) {
      return
    }

    const message = `Hello, I would like to book ${car.title}. Name: ${booking.name}. Phone: ${booking.phone}. Start date: ${booking.startDate}. End date: ${booking.endDate}. Total rental days: ${totalDays}. Estimated total: ${formatPrice(totalPrice)}.`

    window.open(getWhatsAppLink(car.owner.phone, message), '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <div className="booking-box">
      <h3>Plan your Zanzibar trip</h3>
      {submitted ? (
        <div className="success-box">Your message is ready to send to the owner.</div>
      ) : (
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-grid">
            <input
              type="text"
              placeholder="Your name"
              value={booking.name}
              onChange={(event) => setBooking((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={booking.phone}
              onChange={(event) => setBooking((prev) => ({ ...prev, phone: event.target.value }))}
              required
            />
            <input
              type="date"
              value={booking.startDate}
              onChange={(event) => setBooking((prev) => ({ ...prev, startDate: event.target.value }))}
              required
            />
            <input
              type="date"
              value={booking.endDate}
              onChange={(event) => setBooking((prev) => ({ ...prev, endDate: event.target.value }))}
              required
            />
          </div>

          <div className="booking-summary">
            <span>Rental days: {totalDays || 0}</span>
            <strong>Total: {totalDays > 0 ? formatPrice(totalPrice) : formatPrice(0)}</strong>
          </div>

          <button type="submit" className="primary-btn full-width">Send My Inquiry</button>
        </form>
      )}
    </div>
  )
}

function CarDetailsPage({ cars }) {
  const { id } = useParams()
  const carId = Number(id)
  const car = cars.find((item) => item.id === carId)

  if (!car) {
    return (
      <>
        <SeoMeta title="Car Not Found | Zanzibar Car Rental" description="The requested car listing could not be found." canonical="/cars" />
        <div className="container empty-state">Car not found.</div>
      </>
    )
  }

  const image = car.image_url || 'https://placehold.co/1200x800/0f172a/ffffff?text=Car+Image'
  const title = `${car.make || 'Vehicle'} ${car.model || car.title} for Rent in ${car.location}, Zanzibar`
  const description = `Rent a ${car.make || ''} ${car.model || car.title} in ${car.location}, Zanzibar from ${formatPrice(Number(car.price_per_day))}/day. View vehicle details and contact the owner directly.`
  const canonical = `/cars/${car.id}/${slugify(car.title)}`

  return (
    <>
      <SeoMeta title={title} description={description} canonical={canonical} image={image} type="article" structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Car',
        name: car.title,
        brand: { '@type': 'Brand', name: car.make },
        model: car.model,
        vehicleType: 'Car',
        description: car.description,
        offers: {
          '@type': 'Offer',
          price: Number(car.price_per_day || 0),
          priceCurrency: 'TZS',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${canonical}`,
        },
        image,
        areaServed: car.location,
      }} />

      <section className="container details-wrap">
        <div className="details-image">
          <img src={image} alt={`${car.title} available for rent in ${car.location}, Zanzibar`} />
        </div>
        <div className="details-content">
          <span className="eyebrow">{car.availability === 'Available' ? 'Ready for your journey' : 'Currently unavailable'}</span>
          <h1>{car.title}</h1>
          <p className="detail-price">From {formatPrice(Number(car.price_per_day))} / day</p>
          <div className="detail-grid">
            <div><strong>Make:</strong> {car.make}</div>
            <div><strong>Model:</strong> {car.model}</div>
            <div><strong>Year:</strong> {car.year}</div>
            <div><strong>Location:</strong> {car.location}</div>
            <div><strong>Transmission:</strong> {car.transmission}</div>
            <div><strong>Fuel type:</strong> {car.fuel_type}</div>
            <div><strong>Seats:</strong> {car.seats}</div>
            <div><strong>Registration:</strong> {car.registration_number}</div>
          </div>

          <div className="detail-note-box">
            <h3>Why this car could be right for your trip</h3>
            <p className="description">{car.description}</p>
          </div>

          <div className="contact-actions">
            <a className="primary-btn" href={`tel:${car.owner.phone}`}>📞 Call Owner</a>
            <a className="secondary-btn" href={getWhatsAppLink(car.owner.phone, car.title)} target="_blank" rel="noreferrer">
              💬 WhatsApp Owner
            </a>
          </div>

          <BookingForm car={car} />

          <div className="owner-box">
            <h3>Meet Your Car Owner</h3>
            <p><strong>Name:</strong> {car.owner.full_name}</p>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Phone:</strong> {car.owner.phone}</p>
            <p className="owner-copy">Connect directly with the owner to discuss your rental and travel plans.</p>
          </div>
        </div>
      </section>
    </>
  )
}

function OwnerLoginPage({ setUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })

      const data = await parseJsonResponse(response)
      if (!response.ok) {
        throw new Error(Object.values(data)[0]?.[0] || data.message || 'Login failed')
      }

      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Owner Login</h2>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="primary-btn full-width">Login</button>
        </form>
      </div>
    </section>
  )
}

function DashboardPage({ user, cars, setCars }) {
  const navigate = useNavigate()

  const activeUser = user || { id: 1, full_name: 'Owner' }

  const myCars = cars.filter((car) => car.owner.id === activeUser.id)
  const availableCount = myCars.filter((car) => car.availability === 'Available').length
  const unavailableCount = myCars.filter((car) => car.availability === 'Unavailable').length

  const handleDelete = async (carId) => {
    const confirmed = window.confirm('Are you sure you want to remove this car?')
    if (!confirmed) return

    const response = await fetch(`${API_BASE}/cars/${carId}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (response.ok) {
      setCars((prev) => prev.filter((car) => car.id !== carId))
    }
  }

  return (
    <section className="container dashboard-wrap">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Owner dashboard</span>
          <h2>Welcome, {user.full_name}</h2>
        </div>
        <Link to="/dashboard/add-car" className="primary-btn">+ Add New Car</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-box"><span>My Cars</span><strong>{myCars.length}</strong></div>
        <div className="stat-box"><span>Available</span><strong>{availableCount}</strong></div>
        <div className="stat-box"><span>Unavailable</span><strong>{unavailableCount}</strong></div>
      </div>

      <div className="dashboard-list">
        {myCars.length === 0 ? (
          <div className="empty-state">No cars listed yet.</div>
        ) : (
          myCars.map((car) => (
            <div key={car.id} className="dashboard-row">
              <div>
                <span className="dash-title">{car.title}</span>
                <span className={`status-pill ${car.availability === 'Available' ? 'status-pill--available' : 'status-pill--unavailable'}`}>{car.availability}</span>
              </div>
              <div className="row-actions">
                <Link to={`/dashboard/edit-car/${car.id}`} className="secondary-btn small-btn">Edit</Link>
                <button type="button" className="danger-btn small-btn" onClick={() => handleDelete(car.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

function AddCarPage({ user, setCars }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          payload.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE}/cars/`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(Object.values(data)[0]?.[0] || 'Unable to add car')
      }

      setCars((prev) => [data, ...prev])
      setSuccess('Car added successfully.')
      setForm(defaultForm)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="container form-page">
      <div className="auth-card wide-card">
        <h2>Add New Car</h2>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form className="auth-form form-grid" onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" placeholder="Car Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input type="text" placeholder="Make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
          <input type="text" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
          <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          <input type="text" placeholder="Registration Number" value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} required />
          <input type="number" placeholder="Price Per Day" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} required />
          <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          <select value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} required>
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>
          <input type="number" placeholder="Number of Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} required />
          <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <textarea rows="4" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          <button type="submit" className="primary-btn full-width">Save Car</button>
        </form>
      </div>
    </section>
  )
}

function EditCarPage({ user, cars, setCars }) {
  const navigate = useNavigate()
  const id = Number(window.location.pathname.split('/').at(-1))
  const car = cars.find((item) => item.id === id)
  const [form, setForm] = useState(car || defaultForm)

  useEffect(() => {
    if (car) setForm(car)
  }, [car])

  if (!car) return <div className="container empty-state">Car not found.</div>

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'owner' || key === 'gallery' || key === 'image_url' || key === 'created_at' || key === 'updated_at') return
      if (value !== null && value !== undefined && value !== '') payload.append(key, value)
    })

    const response = await fetch(`${API_BASE}/cars/${id}/`, {
      method: 'PUT',
      body: payload,
      headers: { Authorization: `Session ${localStorage.getItem('sessionid') || ''}` },
      credentials: 'include',
    })

    if (response.ok) {
      const updated = await response.json()
      setCars((prev) => prev.map((item) => (item.id === id ? updated : item)))
      navigate('/dashboard')
    }
  }

  return (
    <section className="container form-page">
      <div className="auth-card wide-card">
        <h2>Edit Car</h2>
        <form className="auth-form form-grid" onSubmit={handleSubmit}>
          <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input type="text" value={form.make || ''} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
          <input type="text" value={form.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
          <input type="number" value={form.year || ''} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          <input type="text" value={form.registration_number || ''} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} required />
          <input type="number" value={form.price_per_day || ''} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} required />
          <input type="text" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <select value={form.transmission || 'Automatic'} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          <select value={form.fuel_type || ''} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} required>
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>
          <input type="number" value={form.seats || ''} onChange={(e) => setForm({ ...form, seats: e.target.value })} required />
          <select value={form.availability || 'Available'} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <textarea rows="4" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <button type="submit" className="primary-btn full-width">Update Car</button>
        </form>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <>
      <SeoMeta
        title="About Zanzibar | Car Rental & Travel Guide"
        description="Learn more about Zanzibar, the best areas to explore and how a rental car helps you travel comfortably around the island."
        canonical="/about"
      />

      <section className="container simple-page about-page">
        <div className="about-intro">
          <span className="eyebrow">About Zanzibar</span>
          <h1>Explore Zanzibar with confidence.</h1>
          <p>
            Zanzibar is a dream island for travelers who want a mix of beachtime, culture, colorful markets and easy road trips.
            With a car, you can move at your own pace between historic Stone Town, the quieter east coast and the lively northern beaches without depending on fixed schedules.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h3>Why travelers love it</h3>
            <ul>
              <li>Warm beaches, clear water and a relaxed island pace.</li>
              <li>Historic streets, spice farms and local culture in every corner.</li>
              <li>Easy day trips between beaches, villages and coastal towns.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>Popular areas</h3>
            <ul>
              <li>Stone Town for culture, markets and old-city charm.</li>
              <li>Nungwi and Kendwa for sunsets and northern beach stays.</li>
              <li>Paje and Jambiani for laid-back east coast vibes.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>Travel tips</h3>
            <ul>
              <li>Plan flexible days to enjoy coastal roads and beach stops.</li>
              <li>Carry cash for small local shops, markets and roadside snacks.</li>
              <li>Ask local owners about the best routes and hidden beaches.</li>
            </ul>
          </div>
        </div>

        <div className="about-destination-grid">
          <article className="about-destination">
            <h3>Stone Town</h3>
            <p>A UNESCO-listed historic center with winding streets, local markets, cafés and rich Swahili heritage.</p>
          </article>
          <article className="about-destination">
            <h3>Nungwi</h3>
            <p>Known for long sandy beaches, clear water and beautiful sunsets along the island’s northern edge.</p>
          </article>
          <article className="about-destination">
            <h3>Paje</h3>
            <p>A popular beach destination for travelers who want a relaxed atmosphere and easy access to the coast.</p>
          </article>
          <article className="about-destination">
            <h3>Jambiani</h3>
            <p>Quiet, scenic and ideal for slower travel, village exploration and a more local island experience.</p>
          </article>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <SeoMeta
        title="Contact Zanzibar Car Rental Support"
        description="Need help planning your Zanzibar trip? Contact the local team for car rental questions and support."
        canonical="/contact"
      />

      <section className="container simple-page">
        <span className="eyebrow">Talk to us</span>
        <h1>Need help planning your trip?</h1>
        <p>Phone: +255 700 000 000</p>
        <p>Email: hello@zanzibarride.com</p>
      </section>
    </>
  )
}

function FaqPage() {
  const faqs = [
    {
      question: 'How can I rent a car in Zanzibar?',
      answer: 'Browse the available cars on the site, compare the price and location, and contact the owner directly by WhatsApp or phone to arrange the rental.',
    },
    {
      question: 'How much does it cost to rent a car in Zanzibar?',
      answer: 'Prices vary depending on the vehicle, location and owner, but each listing shows the daily rate so you can compare options quickly.',
    },
    {
      question: 'Can I contact the car owner directly?',
      answer: 'Yes. Every listing includes direct WhatsApp and phone contact options so you can confirm details with the owner before booking.',
    },
    {
      question: 'Where can I rent a car in Zanzibar?',
      answer: 'You can browse listings across popular destinations such as Stone Town, Nungwi, Paje, Jambiani, Kendwa and Matemwe.',
    },
    {
      question: 'Can I find automatic cars in Zanzibar?',
      answer: 'Yes, vehicle transmission varies by listing. You can filter and compare available cars to find the best option for your trip.',
    },
    {
      question: 'Do I need an account to browse cars?',
      answer: 'No. Public listings can be browsed without creating an account, and you can contact owners directly when you find a suitable car.',
    },
  ]

  return (
    <>
      <SeoMeta
        title="Zanzibar Car Rental FAQ | Rent a Car in Zanzibar"
        description="Learn how to rent a car in Zanzibar, compare prices and contact car owners directly for your island trip."
        canonical="/faq"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />

      <section className="container simple-page faq-page">
        <span className="eyebrow">FAQ</span>
        <h1>Zanzibar car rental FAQ</h1>
        <div className="faq-grid faq-grid--stacked">
          {faqs.map((item) => (
            <div key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function LocationPage({ cars }) {
  const { slug } = useParams()
  const meta = locationMeta[slug] || { name: 'Zanzibar', title: 'Car Rental Zanzibar', h1: 'Car Rental in Zanzibar', description: 'Explore available cars for rent around Zanzibar.' }
  const localCars = cars.filter((car) => car.location && car.location.toLowerCase().includes(meta.name.toLowerCase()))
  const relatedLocations = Object.entries(locationMeta)
    .filter(([key]) => key !== slug)
    .slice(0, 4)

  return (
    <>
      <SeoMeta
        title={meta.title}
        description={meta.description}
        canonical={`/location/${slug}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${meta.name} car rental listings`,
          itemListElement: localCars.slice(0, 10).map((car, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}/cars/${car.id}/${slugify(car.title)}`,
            name: car.title,
          })),
        }}
      />

      <section className="container simple-page location-page">
        <div className="location-intro">
          <span className="eyebrow">Car rental in {meta.name}</span>
          <h1>{meta.h1}</h1>
          <p>{meta.overview || meta.description}</p>
        </div>

        <div className="related-location-list">
          <strong>Nearby destinations:</strong>
          {relatedLocations.map(([key, item]) => (
            <Link key={key} to={`/location/${key}`}>{item.name}</Link>
          ))}
        </div>

        {localCars.length === 0 ? (
          <div className="empty-state">
            <strong>No cars available in {meta.name} right now.</strong>
            <p>Browse other Zanzibar locations or explore all available cars.</p>
            <Link className="primary-btn" to="/cars">Explore All Cars</Link>
          </div>
        ) : (
          <div className="car-grid location-car-grid">
            {localCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function App() {
  const [cars, setCars] = useState([])
  const [user, setUser] = useOwnerSession()
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    transmission: '',
    fuel_type: '',
    seats: '',
    max_price: '',
  })

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_BASE}/cars/`, { credentials: 'include' })
        const data = await parseJsonResponse(response)
        const results = Array.isArray(data) ? data : data.results || []
        setCars(results.length ? results : sampleCars)
      } catch {
        setCars(sampleCars)
      }
    }

    fetchCars()
  }, [])

  return (
    <Layout user={user} setUser={setUser}>
      <Routes>
        <Route path="/" element={<HomePage cars={cars} filters={filters} setFilters={setFilters} />} />
        <Route path="/cars" element={<CarsPage cars={cars} filters={filters} setFilters={setFilters} />} />
        <Route path="/cars/:id" element={<CarDetailsPage cars={cars} />} />
        <Route path="/cars/:id/:slug" element={<CarDetailsPage cars={cars} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/location/:slug" element={<LocationPage cars={cars} />} />
        <Route path="/dashboard" element={<DashboardPage user={user} cars={cars} setCars={setCars} />} />
        <Route path="/dashboard/add-car" element={<AddCarPage user={user} setCars={setCars} />} />
        <Route path="/dashboard/edit-car/:id" element={<EditCarPage user={user} cars={cars} setCars={setCars} />} />
      </Routes>
    </Layout>
  )
}

export default App
