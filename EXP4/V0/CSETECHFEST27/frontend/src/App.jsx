import { useEffect, useState } from 'react'
import { api, getAdminToken, setAdminToken, clearAdminToken } from './api'
import './App.css'

const ASSET = '/assets/'

const events = [
  { day: 1, date: '14 OCT 2027', title: 'ByteCraft Hackathon Kickoff', type: 'HACKATHON', time: '09:00', duration: '48H' },
  { day: 1, date: '14 OCT 2027', title: 'Architecting the Metaverse: Web3 & Beyond', type: 'TALK', time: '11:00', duration: '60 MIN' },
  { day: 1, date: '14 OCT 2027', title: 'UI/UX Figma Wars', type: 'COMPETITION', time: '14:00', duration: '120 MIN' },
  { day: 1, date: '14 OCT 2027', title: 'Neural Networks & Deep Learning Essentials', type: 'WORKSHOP', time: '15:30', duration: '90 MIN' },
  { day: 1, date: '14 OCT 2027', title: 'Algorithmic Combat (Speed Coding Sprint)', type: 'COMPETITION', time: '17:30', duration: '90 MIN' },
  { day: 2, date: '15 OCT 2027', title: 'Hackathon Judgement & Project Pitches', type: 'HACKATHON', time: '09:30', duration: '180 MIN' },
  { day: 2, date: '15 OCT 2027', title: 'Cyber Crypt (Capture The Flag)', type: 'CTF', time: '13:00', duration: '120 MIN' },
  { day: 2, date: '15 OCT 2027', title: 'The Quantum Leap: Next Gen AI', type: 'TALK', time: '15:00', duration: '60 MIN' },
  { day: 2, date: '15 OCT 2027', title: 'Prompt Engineering Masterclass', type: 'WORKSHOP', time: '16:30', duration: '90 MIN' },
  { day: 2, date: '15 OCT 2027', title: 'AI Prompt Battle Arena', type: 'COMPETITION', time: '19:00', duration: '90 MIN' },
  { day: 3, date: '16 OCT 2027', title: 'Robo-Code: Autonomous Maze Solvers', type: 'COMPETITION', time: '09:30', duration: '120 MIN' },
  { day: 3, date: '16 OCT 2027', title: 'Silicon Valley Mindset & Tech Startup Panel', type: 'PANEL', time: '12:00', duration: '75 MIN' },
  { day: 3, date: '16 OCT 2027', title: 'Bug Hunting Championship', type: 'COMPETITION', time: '14:00', duration: '120 MIN' },
  { day: 3, date: '16 OCT 2027', title: "HASH '27 Valedictory & Award Ceremony", type: 'CEREMONY', time: '17:30', duration: '90 MIN' },
]

const people = [
  { group: 'Faculty Coordinator', name: 'Ms. Chandrika Rajan', role: 'Computer Science & Engineering' },
  { group: 'Student Coordinator', name: 'E V Jishnu', role: 'Computer Science & Engineering', image: 'team-jishnu.jpg' },
  { group: 'Technical Team', name: 'Amaldev S S', role: 'Web & Infrastructure', image: 'team-amaldev.jpg' },
  { group: 'Technical Team', name: 'Harigovind S B', role: 'Backend & Systems', image: 'team-harigovind.jpg' },
  { group: 'Technical Team', name: 'Henok Anil Anton', role: 'Hardware & Networking' },
  { group: 'Event Management', name: 'Diya Mathews', role: 'Planning & Operations', image: 'team-diya.jpg' },
  { group: 'Event Management', name: 'Elza Sabu', role: 'Scheduling & Logistics', image: 'team-elza.png' },
  { group: 'Event Management', name: 'Nandini P Nair', role: 'Workshops & Talks' },
  { group: 'Creative & Design', name: 'Anna Jose', role: 'UI/UX & Visual Design' },
  { group: 'Creative & Design', name: 'Anna George', role: 'Graphics & Branding' },
  { group: 'Creative & Design', name: 'Aadarsh Narayan P S', role: 'Copy & Documentation' },
  { group: 'Outreach & Public Relations', name: 'Sara Robin Baby', role: 'Sponsorship & Outreach', image: 'team-sara.jpg' },
  { group: 'Outreach & Public Relations', name: 'Nayana Anna Binu', role: 'Social Media & Comms' },
  { group: 'Outreach & Public Relations', name: 'Danil R A', role: 'Photography & Coverage' },
  { group: 'Operations & Support', name: 'Aakash Chandran', role: 'Venue & Infrastructure' },
  { group: 'Operations & Support', name: 'Adithya P', role: 'Volunteers & Hospitality', image: 'team-adithya.jpg' },
]

const sponsors = [
  ['Title Sponsor', 'TechCorp International', 'Leading the future of innovation'],
  ['Platinum', 'CloudSys Technologies', 'Cloud infrastructure partner'],
  ['Platinum', 'DataForge Labs', 'AI & analytics partner'],
  ['Gold', 'NeuralNet Systems', 'Machine learning solutions'],
  ['Gold', 'CodeBase Ventures', 'Developer tools partner'],
  ['Gold', 'QuantumEdge Inc.', 'Cybersecurity partner'],
  ['Silver', 'PixelForge Studio', 'Design & creative partner'],
  ['Silver', 'DevStream Media', 'Streaming & content partner'],
  ['Silver', 'InnoCafe', 'Food & refreshments partner'],
  ['Silver', 'PrintWave', 'Merchandise & print partner'],
  ['Community', 'TechMeetup Kerala', 'Community outreach'],
  ['Community', 'StudentDev Hub', 'Student developer network'],
  ['Community', 'Campus Connect', 'Inter-college network'],
]

const gallery = ['gallery-teaser1.png','gallery-teaser2.png','gallery-teaser3.png','gallery-teaser4.png','gallery-teaser5.png','gallery-teaser6.png','gallery-teaser7.png']

const navItems = [
  ['/', 'HOME'], ['/events', 'EVENTS'], ['/register', 'REGISTER'], ['/gallery', 'GALLERY'],
  ['/team', 'TEAM'], ['/sponsors', 'SPONSORS'], ['/contact', 'CONTACT']
]

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    phone: <path d="M7 3.5 9.2 3c.6-.1 1.1.2 1.3.8l1.1 3c.2.5.1 1-.3 1.4L10 9.5c1 2 2.5 3.5 4.5 4.5l1.3-1.3c.4-.4.9-.5 1.4-.3l3 1.1c.6.2.9.7.8 1.3l-.5 2.2c-.1.7-.7 1.2-1.4 1.2C10.8 18.2 5.8 13.2 5.8 7c0-.7.5-1.3 1.2-1.5Z"/>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
    edit: <><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1"/></>,
    send: <><path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z"/><path d="M10 14 21 3"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const go = (to) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return [path, go]
}

function AppLink({ to, children, className = '', onClick, path, go }) {
  return <a href={to} className={`${className} ${path === to ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); go(to); onClick?.() }}>{children}</a>
}

function Shell({ children, path, go }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="app-shell">
      <div className="noise" aria-hidden="true" />
      <header className="nav-wrap">
        <nav className="nav">
          <AppLink to="/" path={path} go={go} className="brand" onClick={() => setMenuOpen(false)}>
            <img src={`${ASSET}Logo.png`} alt="" />
            <span>HASH<span className="brand-mark">'27</span></span>
          </AppLink>
          <button className={`menu-button ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <span /><span />
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map(([to, label]) => <AppLink key={to} to={to} path={path} go={go} onClick={() => setMenuOpen(false)}>{label}</AppLink>)}
            <button className="nav-cta" onClick={() => { go('/register'); setMenuOpen(false) }}>REGISTER <Icon name="arrow" size={16} /></button>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-line"><span>HASH '27 / MBCET</span><span>TECHFEST · 14—16 OCT 2027</span><span>© 2027 ALL RIGHTS RESERVED</span></div>
      </footer>
    </div>
  )
}

function Home({ go }) {
  return <>
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING · MBCET</p>
          <h1>Build what<br /><em>comes next.</em></h1>
          <p className="hero-lede">HASH '27 is three days of code, competition, ideas and people who would rather make the future than wait for it.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => go('/events')}>Explore events <Icon name="arrow" /></button>
            <button className="button button-text" onClick={() => go('/register')}>Secure your spot <Icon name="arrow" size={18} /></button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbital orbital-a" />
          <div className="orbital orbital-b" />
          <div className="orbital orbital-c" />
          <div className="signal-core"><span>H</span><small>27</small></div>
          <div className="axis axis-x" /><div className="axis axis-y" />
          <span className="coordinate c1">08° 29' 20"N</span>
          <span className="coordinate c2">76° 56' 24"E</span>
          <span className="coordinate c3">01 / 03</span>
        </div>
      </div>
      <div className="hero-meta"><span>THIRUVANANTHAPURAM / KERALA</span><span>14—16 OCTOBER 2027</span><span>01—03</span></div>
    </section>

    <section className="home-intro section">
      <div className="section-label">01 / THE IDEA</div>
      <div className="intro-content">
        <h2>Four domains.<br /><strong>Infinite directions.</strong></h2>
        <p>Hack. Learn. Compete. Connect. The old page called them pillars; the React edition treats them as routes into the festival — different ways to enter, one shared obsession with technology.</p>
      </div>
    </section>

    <section className="bento section">
      <article className="bento-feature">
        <span className="tile-type">01 / HACKATHONS</span>
        <p>48 hours of relentless coding, innovation and problem-solving. Start with a blank repo. Leave with something real.</p>
        <button className="inline-link" onClick={() => go('/events')}>View the schedule <Icon name="arrow" size={16} /></button>
      </article>
      <article className="bento-dark">
        <span className="tile-index">02 / WORKSHOPS</span>
        <p>Hands-on sessions with industry experts. Master cutting-edge tools and frameworks.</p>
      </article>
      <article className="bento-image">
        <div><span>03 / COMPETE</span><strong>COMPETITIONS</strong></div>
      </article>
      <article className="bento-stat"><span className="tile-type">04 / CONNECT</span><strong>Guest<br />Talks</strong><p>Insights from visionaries and tech leaders. Get inspired by the best in the industry.</p></article>
    </section>

    <section className="home-cta section">
      <div><span className="section-label">02 / YOUR MOVE</span><h2>Don't just attend.<br /><em>Leave a trace.</em></h2></div>
      <button className="button button-primary" onClick={() => go('/register')}>Register for HASH '27 <Icon name="arrow" /></button>
    </section>
  </>
}

function PageHero({ kicker, title, copy }) {
  return <header className="page-hero"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{copy && <p>{copy}</p>}</header>
}

function Events() {
  const [day, setDay] = useState(1)
  const visible = events.filter(e => e.day === day)
  return <><PageHero kicker="THE PROGRAMME / 03 DAYS" title="Event schedule" copy="A dense three-day programme of building, thinking, breaking and shipping." />
    <section className="schedule section">
      <div className="day-tabs">{[1,2,3].map(d => <button key={d} className={day===d?'selected':''} onClick={() => setDay(d)}><small>DAY 0{d}</small><strong>{14+d-1} OCT</strong></button>)}</div>
      <div className="schedule-list">
        {visible.map((event, i) => <article className="event-row" key={event.title}>
          <div className="event-time"><strong>{event.time}</strong><span>{event.duration}</span></div>
          <div className="event-main"><span className="event-type">{event.type}</span><h2>{event.title}</h2><p>{event.date}</p></div>
          <span className="event-number">{String(i+1).padStart(2,'0')}</span>
        </article>)}
      </div>
    </section>
  </>
}

const initialForm = { event:'', name:'', email:'', phone:'', year:'', dept:'', inst:'', team:'' }
function Register({ go, toast }) {
  const [form,setForm]=useState(initialForm); const [errors,setErrors]=useState({}); const [sent,setSent]=useState(false); const [busy,setBusy]=useState(false)
  const update=(key,val)=>{setForm(f=>({...f,[key]:val})); if(errors[key]) setErrors(e=>({...e,[key]:''}))}
  const validate=()=>{
    const e={}
    if(!form.event) e.event='Choose an event to continue.'
    if(!/^[a-zA-Z\s]{2,50}$/.test(form.name.trim())) e.name='Use 2–50 letters and spaces.'
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) e.email='Enter a valid email address.'
    if(!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone='Enter a valid 10-digit Indian mobile number.'
    if(!form.year) e.year='Select your year of study.'
    if(!/^[a-zA-Z\s]{2,30}$/.test(form.dept.trim())) e.dept='Department is required.'
    if(!/^[a-zA-Z\s.,'-]{2,100}$/.test(form.inst.trim())) e.inst='Institution name is required.'
    return e
  }
  const submit=async(ev)=>{
    ev.preventDefault(); const e=validate(); setErrors(e); if(Object.keys(e).length) return
    setBusy(true)
    try {
      const participant=await api('/registrations',{method:'POST',body:form})
      setSent(true); setForm(initialForm); toast(`Registration confirmed for ${participant.name}.`)
    } catch(err) { toast(err.message || 'Registration failed. Please try again.') }
    finally { setBusy(false) }
  }
  return <><PageHero kicker="03 / JOIN THE FESTIVAL" title="Register" copy="Your registration is securely stored in the TechFest database. The organiser desk can review and export it." />
    <section className="register-layout section">
      <aside className="register-aside">
        <div><span>DATES</span><strong>14—16<br/>OCT 2027</strong></div>
        <div><span>VENUE</span><strong>MBCET<br/>Nalanchira</strong></div>
        <div><span>REGISTRATION</span><strong>Closes 10<br/>Oct 2027</strong></div>
        <button className="inline-link" onClick={() => go('/events')}>View full schedule <Icon name="arrow" size={16}/></button>
      </aside>
      <div className="form-panel">
        {sent ? <div className="success-state"><div className="success-icon"><Icon name="check" size={28}/></div><span>REGISTRATION COMPLETE</span><h2>You're on the list.</h2><p>Your registration was saved to the TechFest database. See you at HASH '27.</p><button className="button button-primary" onClick={()=>setSent(false)}>Register another</button></div> :
        <form onSubmit={submit} noValidate>
          <div className="form-heading"><span>REGISTRATION FORM</span><h2>Tell us who you are.</h2></div>
          <Field label="Select event" error={errors.event}><select value={form.event} onChange={e=>update('event',e.target.value)}><option value="">Choose an event…</option>{events.map(e=><option key={e.title} value={e.title}>{e.title}</option>)}</select></Field>
          <div className="form-grid"><Field label="Full name" error={errors.name}><input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Your full name"/></Field><Field label="Email address" error={errors.email}><input type="email" value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></Field></div>
          <div className="form-grid"><Field label="Phone number" error={errors.phone}><input value={form.phone} onChange={e=>update('phone',e.target.value)} inputMode="numeric" placeholder="10-digit number"/></Field><Field label="Year of study" error={errors.year}><select value={form.year} onChange={e=>update('year',e.target.value)}><option value="">Select year…</option><option>S1 — First Year</option><option>S3 — Second Year</option><option>S5 — Third Year</option><option>S7 — Final Year</option><option>Postgraduate</option></select></Field></div>
          <div className="form-grid"><Field label="Department" error={errors.dept}><input value={form.dept} onChange={e=>update('dept',e.target.value)} placeholder="e.g. CSE, ECE, ME"/></Field><Field label="Institution" error={errors.inst}><input value={form.inst} onChange={e=>update('inst',e.target.value)} placeholder="College name"/></Field></div>
          <Field label={<>Team name <small>OPTIONAL / HACKATHON</small></>}><input value={form.team} onChange={e=>update('team',e.target.value)} placeholder="If registering as a team"/></Field>
          <button className="submit-button" type="submit" disabled={busy}>{busy?'Saving registration…':'Complete registration'} {!busy&&<Icon name="arrow"/>}</button>
        </form>}
      </div>
    </section>
  </>
}

function Field({label,error,children}) { return <label className={`field ${error?'has-error':''}`}><span>{label}</span>{children}{error&&<small>{error}</small>}</label> }

function Gallery() {
  const [active,setActive]=useState(null); const [playing,setPlaying]=useState(false)
  useEffect(()=>{if(!playing||active===null)return; const id=setInterval(()=>setActive(i=>(i+1)%gallery.length),3000); return()=>clearInterval(id)},[playing,active])
  useEffect(()=>{const onKey=e=>{if(active===null)return;if(e.key==='Escape'){setActive(null);setPlaying(false)} if(e.key==='ArrowRight')setActive(i=>(i+1)%gallery.length);if(e.key==='ArrowLeft')setActive(i=>(i-1+gallery.length)%gallery.length)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[active])
  return <><PageHero kicker="ARCHIVE / VISUAL MEMORY" title="Gallery" copy="Glimpses from HASH '25. The HASH '27 archive opens after the festival." />
    <section className="gallery-grid section">{gallery.map((src,i)=><button key={src} className={`gallery-item g${i+1}`} onClick={()=>setActive(i)}><img src={`${ASSET}${src}`} alt={`HASH archive glimpse ${i+1}`}/><span>0{i+1}</span></button>)}</section>
    {active!==null&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer" onClick={e=>e.target===e.currentTarget&&setActive(null)}>
      <button className="lightbox-close" onClick={()=>{setActive(null);setPlaying(false)}} aria-label="Close"><Icon name="close"/></button>
      <button className="lightbox-nav prev" onClick={()=>setActive(i=>(i-1+gallery.length)%gallery.length)} aria-label="Previous">←</button>
      <figure><img src={`${ASSET}${gallery[active]}`} alt={`HASH archive ${active+1}`}/><figcaption><span>HASH '25 / ARCHIVE {String(active+1).padStart(2,'0')}</span><button onClick={()=>setPlaying(v=>!v)}>{playing?'PAUSE':'PLAY SLIDESHOW'}</button></figcaption></figure>
      <button className="lightbox-nav next" onClick={()=>setActive(i=>(i+1)%gallery.length)} aria-label="Next">→</button>
    </div>}
  </>
}

function Team() {
  const groups=[...new Set(people.map(p=>p.group))]
  return <><PageHero kicker="PEOPLE / ORGANISING CREW" title="Meet the team" copy="The minds behind HASH '27 — building the festival before you ever see the first stage." />
    <section className="team section">{groups.map((group,gi)=><div className="team-group" key={group}><div className="team-group-head"><span>0{gi+1}</span><h2>{group}</h2></div><div className="people-grid">{people.filter(p=>p.group===group).map(p=><article className="person" key={p.name}>{p.image?<img src={`${ASSET}${p.image}`} alt="" />:<div className="person-placeholder">{p.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>}<div><h3>{p.name}</h3><p>{p.role}</p></div></article>)}</div></div>)}</section>
  </>
}

function Sponsors({go}) {
  const tiers=['Title Sponsor','Platinum','Gold','Silver','Community']
  return <><PageHero kicker="PARTNERS / BUILT TOGETHER" title="Our sponsors" copy="Powered by industry leaders and community partners who believe in making room for the next generation." />
    <section className="sponsors section">{tiers.map(t=><div className={`sponsor-tier tier-${t.toLowerCase().replace(' ','-')}`} key={t}><div className="tier-head"><span>{t==='Title Sponsor'?'✦':'//'} </span><h2>{t}</h2></div><div className="sponsor-grid">{sponsors.filter(s=>s[0]===t).map(([_,name,desc])=><article key={name} className="sponsor"><span className="sponsor-code">{name.split(' ').map(x=>x[0]).join('').slice(0,4)}</span><div><h3>{name}</h3><p>{desc}</p></div></article>)}</div></div>)}</section>
    <section className="partner-cta section"><span>PARTNER WITH HASH '27</span><h2>Put your name<br/>where ideas happen.</h2><button className="button button-primary" onClick={()=>go('/contact')}>Start a conversation <Icon name="arrow"/></button></section>
  </>
}

function Contact({toast}) {
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''}); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false)
  const submit=async(e)=>{
    e.preventDefault(); setBusy(true)
    try { await api('/contacts',{method:'POST',body:form}); setDone(true); toast('Message sent to the HASH team.'); setForm({name:'',email:'',subject:'',message:''}) }
    catch(err){ toast(err.message || 'Could not send message.') }
    finally { setBusy(false) }
  }
  return <><PageHero kicker="CONTACT / CSE DEPARTMENT" title="Get in touch" copy="Questions about events, partnerships, volunteering or the festival? Send us a line." />
    <section className="contact-layout section"><div className="contact-info">
      <ContactBlock icon="map" title="Visit us">Department of Computer Science & Engineering<br/>Mar Baselios College of Engineering and Technology<br/>Nalanchira, Thiruvananthapuram<br/>Kerala — 695015</ContactBlock>
      <ContactBlock icon="mail" title="Email us"><a href="mailto:hash2027@mbcet.ac.in">hash2027@mbcet.ac.in</a><br/><a href="mailto:cse@mbcet.ac.in">cse@mbcet.ac.in</a></ContactBlock>
      <ContactBlock icon="phone" title="Call us"><a href="tel:+914712545866">+91 471 254 5866</a><br/><a href="tel:+919876543210">+91 98765 43210</a></ContactBlock>
      <div className="social-note"><span>FOLLOW HASH '27</span><p>Instagram · LinkedIn · YouTube · Discord</p></div>
    </div>
    <div className="form-panel contact-form-panel">{done?<div className="success-state"><div className="success-icon"><Icon name="check"/></div><span>MESSAGE SENT</span><h2>We'll get back to you.</h2><p>Thanks for reaching out to the HASH team.</p><button className="button button-primary" onClick={()=>setDone(false)}>Send another</button></div>:
      <form onSubmit={submit}><div className="form-heading"><span>MESSAGE DESK</span><h2>Drop us a line.</h2></div><div className="form-grid"><Field label="Full name"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></Field><Field label="Email"><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></Field></div><Field label="Subject"><input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="What's this about?"/></Field><Field label="Message"><textarea required rows="6" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Write your message here…"/></Field><button className="submit-button" type="submit" disabled={busy}>{busy?'Sending…':'Send message'} {!busy&&<Icon name="send" size={18}/>}</button></form>}</div></section>
    <section className="visit-strip section"><div><Icon name="calendar"/><span>MONDAY — FRIDAY</span></div><strong>09:00 — 16:00</strong><span>CSE DEPARTMENT / MBCET</span></section>
  </>
}
function ContactBlock({icon,title,children}){return <div className="contact-block"><div className="contact-icon"><Icon name={icon}/></div><div><span>{title}</span><p>{children}</p></div></div>}

function Admin({toast}) {
  const [auth,setAuth]=useState(!!getAdminToken()); const [credentials,setCredentials]=useState({u:'',p:''}); const [error,setError]=useState(''); const [search,setSearch]=useState(''); const [refresh,setRefresh]=useState(0); const [task,setTask]=useState(''); const [data,setData]=useState({participants:[],tasks:[],logs:[],stats:{total:0,events:0,latest:'—'}}); const [loading,setLoading]=useState(false)
  useEffect(()=>{if(!auth)return; let cancelled=false; setLoading(true); api(`/admin/dashboard?search=${encodeURIComponent(search)}`,{token:getAdminToken()}).then(d=>{if(!cancelled)setData(d)}).catch(err=>{if(err.status===401){clearAdminToken();setAuth(false)}else toast(err.message||'Could not load admin data')}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true}},[auth,search,refresh])
  const login=async(e)=>{
    e.preventDefault(); setError('')
    try { const d=await api('/auth/login',{method:'POST',body:{username:credentials.u,password:credentials.p}}); setAdminToken(d.token); setAuth(true); setCredentials({u:'',p:''}); toast('Admin session authenticated.') }
    catch(err){setError(err.message||'Invalid credentials.');setCredentials(c=>({...c,p:''}))}
  }
  const logout=()=>{clearAdminToken();setAuth(false)}
  const remove=async(id)=>{if(!confirm('Delete this participant?'))return;try{await api(`/registrations/${id}`,{method:'DELETE',token:getAdminToken()});setRefresh(x=>x+1);toast('Participant removed.')}catch(err){toast(err.message)}}
  const clearAll=async()=>{if(!confirm('Delete ALL registered participants? This cannot be undone.'))return;try{await api('/registrations',{method:'DELETE',token:getAdminToken()});setRefresh(x=>x+1);toast('Registration list cleared.')}catch(err){toast(err.message)}}
  const edit=async(id,current)=>{const name=prompt('Edit name:',current);if(!name?.trim())return;try{await api(`/registrations/${id}`,{method:'PATCH',token:getAdminToken(),body:{name:name.trim()}});setRefresh(x=>x+1);toast('Participant updated.')}catch(err){toast(err.message)}}
  const addTask=async()=>{if(!task.trim())return;try{await api('/tasks',{method:'POST',token:getAdminToken(),body:{text:task.trim()}});setTask('');setRefresh(x=>x+1)}catch(err){toast(err.message)}}
  const toggleTask=async(t)=>{try{await api(`/tasks/${t._id}`,{method:'PATCH',token:getAdminToken(),body:{completed:!t.completed}});setRefresh(x=>x+1)}catch(err){toast(err.message)}}
  const deleteTask=async(id)=>{try{await api(`/tasks/${id}`,{method:'DELETE',token:getAdminToken()});setRefresh(x=>x+1)}catch(err){toast(err.message)}}
  const exportCsv=async()=>{try{const blob=await api('/registrations/export',{token:getAdminToken(),raw:true});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`hash27-participants-${Date.now()}.csv`;a.click();URL.revokeObjectURL(a.href)}catch(err){toast(err.message||'Export failed.')}}
  return <><PageHero kicker="RESTRICTED / ORGANISER DESK" title="Admin" copy="Secure organiser console for registrations, tasks and access attempts." />
  <section className="admin section">{!auth?<div className="admin-gate"><div className="admin-lock"><Icon name="lock" size={30}/></div><span>ORGANISER ACCESS</span><h2>Sign in to the desk.</h2><form onSubmit={login}><Field label="Username"><input required autoComplete="username" value={credentials.u} onChange={e=>setCredentials({...credentials,u:e.target.value})}/></Field><Field label="Password"><input required type="password" autoComplete="current-password" value={credentials.p} onChange={e=>setCredentials({...credentials,p:e.target.value})}/></Field>{error&&<p className="login-error">{error}</p>}<button className="submit-button">Authenticate <Icon name="arrow"/></button></form></div>:
  <div className="dashboard"><div className="dashboard-top"><div><span>LIVE DATABASE CONSOLE</span><h2>Registration desk</h2></div><button className="button button-quiet" onClick={logout}>Log out</button></div>
  <div className="admin-stats"><Stat value={data.stats.total} label="Total registrations"/><Stat value={data.stats.events} label="Events with signups"/><Stat value={data.stats.latest||'—'} label="Latest event"/></div>
  <div className="admin-panel"><div className="panel-head"><div><span>REGISTRATION DESK</span><h3>Participants <small>{data.participants.length}</small></h3></div><div className="panel-actions"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, event or email"/><button onClick={exportCsv}>Export CSV</button><button onClick={clearAll}>Clear all</button></div></div><div className="participant-list">{loading?<div className="empty">Loading database…</div>:data.participants.length?data.participants.map(p=><article className="participant" key={p._id}><div><strong>{p.name}</strong><span>{p.event}</span><small>{p.email} · {p.phone} · {p.inst}</small></div><div><button aria-label="Edit participant" onClick={()=>edit(p._id,p.name)}><Icon name="edit" size={17}/></button><button aria-label="Delete participant" onClick={()=>remove(p._id)}><Icon name="trash" size={17}/></button></div></article>):<div className="empty">No participants registered yet.</div>}</div></div>
  <div className="admin-two"><div className="admin-panel"><div className="panel-head"><div><span>ORGANISER TOOLS</span><h3>Task manager</h3></div></div><div className="task-add"><input value={task} onChange={e=>setTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Add a new task…"/><button onClick={addTask}><Icon name="plus" size={17}/></button></div><div className="task-list">{data.tasks.length?data.tasks.map(t=><div className={`task ${t.completed?'completed':''}`} key={t._id}><button onClick={()=>toggleTask(t)}><Icon name="check" size={17}/></button><span>{t.text}</span><button onClick={()=>deleteTask(t._id)}><Icon name="trash" size={15}/></button></div>):<div className="empty">No tasks yet. Add one.</div>}</div></div>
  <div className="admin-panel"><div className="panel-head"><div><span>AUDIT TRAIL</span><h3>Access log</h3></div><button onClick={async()=>{try{await api('/admin/audit',{method:'DELETE',token:getAdminToken()});setRefresh(x=>x+1)}catch(err){toast(err.message)}}}>Clear log</button></div><div className="log-list">{data.logs.length?data.logs.map((l,i)=><div className="log" key={l._id||i}><span>{new Date(l.createdAt).toLocaleString()}</span><strong className={l.success?'ok':'bad'}>{l.success?'SUCCESS':'FAILED'} · {l.username||'unknown'}</strong></div>):<div className="empty">No access attempts logged.</div>}</div></div></div>
  </div>}</section></>
}
function Stat({value,label}){return <div><strong>{value}</strong><span>{label}</span></div>}

function NotFound({go}){return <section className="not-found"><span>ERROR / 404</span><h1>Lost in<br/><em>code space.</em></h1><p>This route doesn't exist in this dimension. Maybe a semicolon was missing somewhere.</p><button className="button button-primary" onClick={()=>go('/')}>Back to home <Icon name="arrow"/></button></section>}

function App() {
  const [path,go]=usePath()
  const [toast,setToast]=useState(null)
  const [welcome,setWelcome]=useState(()=>!sessionStorage.getItem('hash_username'))
  const [name,setName]=useState('')
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(null),3200);return()=>clearTimeout(id)},[toast])
  const finishWelcome=(value)=>{const clean=value.trim()||'Guest';sessionStorage.setItem('hash_username',clean);setWelcome(false);setToast(`Welcome, ${clean}!`)}
  let page = path==='/'?<Home go={go}/>:path==='/events'?<Events/>:path==='/register'?<Register go={go} toast={setToast}/>:path==='/gallery'?<Gallery/>:path==='/team'?<Team/>:path==='/sponsors'?<Sponsors go={go}/>:path==='/contact'?<Contact toast={setToast}/>:path==='/admin'?<Admin toast={setToast}/>:<NotFound go={go}/>
  return <Shell path={path} go={go}>{page}{toast&&<div className="toast" role="status"><span>●</span>{toast}</div>}{welcome&&<div className="welcome-overlay"><form className="welcome-modal" onSubmit={e=>{e.preventDefault();finishWelcome(name)}}><span>HASH '27 · ACCESS</span><h2>Welcome aboard.</h2><p>Tell us your name and we'll greet you properly.</p><label className="field"><span>Your name</span><input autoFocus value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="e.g. Jishnu"/></label><div className="welcome-actions"><button type="button" className="button button-quiet" onClick={()=>finishWelcome('')}>Skip</button><button className="button button-primary">Continue <Icon name="arrow" size={17}/></button></div></form></div>}</Shell>
}
export default App
