import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, BrainCircuit, Bot, Cpu, Instagram, LockKeyhole,
  MapPin, Rocket, Sparkles, Users, Wrench, Zap, CalendarDays,
  Menu, X, Clock3, Award, Code2
} from "lucide-react";

const SITE_CONFIG_KEY = "ml-efficient-site-config";
const ADMIN_SESSION_KEY = "ml-efficient-admin-session";


const defaultSchedule = [
  {
    day: "Day 1",
    date: "24 January 2026",
    sessions: [
      { time: "05:00 PM", title: "Installation & Python Basics", description: "Set up your development environment and learn Python fundamentals for ML/AI development", icon: "setup" },
      { time: "06:00 PM", title: "ML, DL & Handwritten Digits Project", description: "Learn Machine Learning and Deep Learning with a hands-on handwritten digits recognition system", icon: "brain" },
      { time: "07:00 PM", title: "RAG-Based AI Agent", description: "Introduction to building Retrieval Augmented Generation based AI agents", icon: "bot" },
    ],
  },
  {
    day: "Day 2",
    date: "25 January 2026",
    sessions: [
      { time: "10:00 AM", title: "RAG Project Continuation", description: "Continue building and refining your RAG-based AI agent project with advanced techniques", icon: "code" },
      { time: "12:00 PM", title: "Automation Concepts & Project", description: "Learn automation fundamentals and build a practical automation project", icon: "cpu" },
      { time: "02:00 PM", title: "Introduction to Gen AI", description: "Brief overview of Generative AI concepts and applications in modern development", icon: "spark" },
      { time: "04:00 PM", title: "Project Mentoring & Development", description: "Refine your project with mentor guidance and prepare it for the final-day hackathon", icon: "bot" },
    ],
  },
  {
    day: "Day 3",
    date: "26 January 2026",
    sessions: [
      { time: "10:00 AM", title: "Hackathon Briefing & Team Formation", description: "Receive the problem statement, understand the rules, and form teams for the ML Efficient hackathon", icon: "code" },
      { time: "12:00 PM", title: "Hackathon: Build & Prototype", description: "Apply your workshop learning to build an innovative, working solution for the problem statement", icon: "cpu" },
      { time: "04:00 PM", title: "Project Pitches & Results", description: "Present your prototype, meet the judges, and celebrate the winning teams and goodie recipients", icon: "award" },
      { time: "05:00 PM", title: "Certificates Distribution", description: "Certificate distribution ceremony for all participants", icon: "award" },
    ],
  },
];

function Countdown({ target }: { target: Date }) {
  const [remaining, setRemaining] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="countdown" aria-label="Event countdown">
      {Object.entries(remaining).map(([label, value]) => (
        <div className="time-box" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; radius: number; pulse: number }[] = [];

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(72, Math.max(38, Math.floor((width * height) / 23000)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: index % 9 === 0 ? 2 : 0.8 + Math.random() * 1.1,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 145) {
            const opacity = (1 - distance / 145) * 0.16;
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.strokeStyle = `rgba(0, 210, 238, ${opacity})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      }

      for (const node of nodes) {
        const glow = 0.55 + Math.sin(time * 0.0015 + node.pulse) * 0.2;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(0, 224, 244, ${glow})`;
        context.shadowColor = "rgba(0, 224, 244, .8)";
        context.shadowBlur = node.radius > 1.5 ? 8 : 3;
        context.fill();
      }
      context.shadowBlur = 0;
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-background" aria-hidden="true" />;
}

const sessionIcon = {
  setup: Wrench, brain: BrainCircuit, bot: Bot, code: Code2,
  cpu: Cpu, spark: Sparkles, award: Award,
};

type PastEvent = {
  name: string;
  description: string;
  participants: string;
  image: string;
  tags: string[];
};

type AboutFeature = {
  title: string;
  description: string;
  icon: "brain" | "bot" | "cpu" | "zap";
};

type SiteConfig = {
  edition: string;
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  googleFormUrl: string;
  participantCount: string;
  aboutTitle: string;
  aboutDescription: string;
  topics: string[];
  aboutFeatures: AboutFeature[];
  schedule: typeof defaultSchedule;
  pastEvents: PastEvent[];
};

const defaultConfig: SiteConfig = {
  edition: "3.0",
  registrationStart: "2025-12-01T00:00:00",
  registrationEnd: "2026-01-23T10:00:00",
  eventStart: "2026-01-24T17:00:00",
  googleFormUrl: "",
  participantCount: "250+",
  aboutTitle: "What is ML Efficient 3.0?",
  aboutDescription: "ML Efficient is a three-day workshop and hackathon organized by the R&D Cell, CCA - NIT Durgapur. Move beyond the jargon with practical learning across Machine Learning, Neural Networks, AI Agents, Automation, and Generative AI, then turn your skills into a prototype at the final-day hackathon.",
  topics: ["Machine Learning", "AI", "Computer Vision", "Gen AI", "Automation", "Python", "Deep Learning"],
  aboutFeatures: [
    { title: "Machine Learning & Deep Learning", description: "Learn the fundamentals of ML and DL with hands-on projects like handwritten digit recognition using neural networks.", icon: "brain" },
    { title: "AI Agents & RAG", description: "Build intelligent AI agents using Retrieval Augmented Generation (RAG) to create context-aware applications.", icon: "bot" },
    { title: "Automation", description: "Master automation concepts and build practical projects that streamline workflows and boost productivity.", icon: "cpu" },
    { title: "Generative AI", description: "Get introduced to the world of Generative AI and understand how it is transforming the tech landscape.", icon: "zap" },
  ],
  schedule: defaultSchedule,
  pastEvents: [
    { name: "ML Efficient 1.0", description: "Our inaugural edition sparked the AI revolution at NIT Durgapur. Students learned Machine Learning fundamentals, data preprocessing, and built their very first ML models.", participants: "100+", image: "/assets/ml-efficient-1.0.jpe", tags: ["ML Fundamentals", "Data Science", "Python Basics"] },
    { name: "ML Efficient 2.0", description: "The second edition expanded into neural networks, computer vision, and practical AI project development with a larger, more collaborative audience.", participants: "150+", image: "/assets/ml-efficient-2.0.jpe", tags: ["Deep Learning", "Computer Vision", "AI Projects"] },
  ],
};

function loadConfig(): SiteConfig {
  try {
    const saved = localStorage.getItem(SITE_CONFIG_KEY);
    if (!saved) return defaultConfig;
    const parsed = JSON.parse(saved) as Partial<SiteConfig>;
    return {
      ...defaultConfig,
      ...parsed,
      topics: parsed.topics?.length ? parsed.topics : defaultConfig.topics,
      aboutFeatures: parsed.aboutFeatures?.length ? parsed.aboutFeatures : defaultConfig.aboutFeatures,
      pastEvents: parsed.pastEvents?.length ? parsed.pastEvents : defaultConfig.pastEvents,
      schedule: parsed.schedule?.length ? parsed.schedule : defaultConfig.schedule,
    };
  } catch {
    return defaultConfig;
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(loadConfig);
  const now = Date.now();
  const registrationStart = new Date(config.registrationStart);
  const registrationEnd = new Date(config.registrationEnd);
  const eventStart = new Date(config.eventStart);
  const registrationOpen = now >= registrationStart.getTime() && now <= registrationEnd.getTime() && /^https?:\/\//.test(config.googleFormUrl);

  const register = () => {
    if (registrationOpen) window.open(config.googleFormUrl, "_blank", "noopener,noreferrer");
    else document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const navTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site">
      <NeuralBackground />
      <nav className="navbar">
        <button className="brand" onClick={() => navTo("home")} aria-label="Go to home">
          <img className="brand-lockup" src="/assets/navbar-logo-new.png" alt="CCA and R&D Cell NIT Durgapur" />
          <span className="brand-name">ML <span className="brand-efficient">Efficient</span> <span className="brand-version">{config.edition}</span></span>
        </button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => navTo("about")}>About</button>
          <button onClick={() => navTo("past-events")}>Past Events</button>
          <button onClick={() => navTo("timeline")}>Timeline</button>
          <button onClick={() => navTo("register")}>Register</button>
        </div>
      </nav>

      <main>
        <section className="hero section" id="home">
          <div className="hero-content reveal visible">
            <div className="eyebrow"><Sparkles size={16} /> R&amp;D Cell Technical Event</div>
            <h1>ML <span className="white">Efficient</span> <span className="gradient-text">{config.edition}</span></h1>
            <p className="tagline">Learn the technology shaping tomorrow, then build something that proves you’re ready for it.</p>
            <p className="event-date">24-26 January 2026 <b>|</b> 5 PM onwards on Day 1</p>
            <span className="countdown-label">EVENT STARTS IN</span>
            <Countdown target={eventStart} />
            <p className="close-note"><Clock3 size={16} /> Registration closes: <b>{registrationEnd.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</b></p>
            <div className="hero-actions">
              <button className="primary" onClick={register}>Register Now</button>
              <button className="timeline-link" onClick={() => navTo("timeline")}><ArrowDown size={18} /> View Timeline</button>
            </div>
          </div>
        </section>

        <section className="section reveal" id="about">
          <div className="section-heading">
            <span>About the Event</span>
            <h2>{config.aboutTitle || `What is ML Efficient ${config.edition}?`}</h2>
            <p>{config.aboutDescription || defaultConfig.aboutDescription}</p>
          </div>
          <div className="feature-grid">
            {(config.aboutFeatures?.length ? config.aboutFeatures : defaultConfig.aboutFeatures).map((feature) => {
              const Icon = feature.icon === "brain" ? BrainCircuit : feature.icon === "bot" ? Bot : feature.icon === "cpu" ? Cpu : Zap;
              return (
              <article className="feature-card" key={feature.title}>
                <Icon />
                <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
              </article>
              );
            })}
          </div>
        </section>

        <section className="topics-section section reveal">
          <h3>Topics Covered:</h3>
          <div className="topics">{(config.topics?.length ? config.topics : defaultConfig.topics).map((topic) => <span key={topic}>{topic}</span>)}</div>
          <div className="organizer"><i /> Organized by <b>R&amp;D Cell, CCA - NIT Durgapur</b></div>
        </section>

        <section className="section reveal past-section" id="past-events">
          <div className="section-heading">
            <span><Zap size={14} /> Our Journey of Innovation <Zap size={14} /></span>
            <h2>Past <em>Events</em></h2>
            <p>Building a legacy of innovation, learning, and community. From 100+ participants in our first edition to 150+ in the next, each year brings bigger crowds and greater impact.</p>
          </div>
          <div className="past-grid">
            {config.pastEvents.map((event) => (
              <article className="past-card" key={event.name}>
                    <div className="poster">
                      <img
                        src={event.image}
                        alt={`${event.name} event poster`}
                      />
                      <div className="poster-shade" />
                    </div>
                <div className="past-card-body">
                  <h3><BrainCircuit size={19} /> {event.name}</h3>
                  <p>{event.description}</p>
                  <div className="tags">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="participant-count"><Users size={18} /> {event.participants} Participants</div>
                </div>
              </article>
            ))}
          </div>
          <p className="upcoming">🚀 <b>ML Efficient {config.edition}</b> brings together {config.participantCount} participants for a three-day journey through AI learning, project building, and a final-day hackathon.</p>
        </section>

        <section className="section reveal timeline-section" id="timeline">
          <div className="section-heading">
            <span>Event Schedule</span>
            <h2>3-Day <em>Timeline</em></h2>
            <p>Three days of hands-on learning, immersive project building, and a hackathon that puts your skills to the test.</p>
          </div>
          {config.schedule.map((day) => (
            <div className="schedule-day" key={day.day}>
              <h3>{day.day}</h3><span>{day.date}</span>
              <div className="timeline-list">
                {day.sessions.map(({ time, title, description, icon }) => {
                  const Icon = sessionIcon[icon as keyof typeof sessionIcon] || Code2;
                  return (
                    <article className="timeline-item" key={title}>
                      <i />
                      <div className="session-icon"><Icon /></div>
                      <b className="session-time">{time}</b>
                      <div className="session-copy"><h4>{title}</h4><p>{description}</p></div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="section reveal register-section" id="register">
          <div className="section-heading">
            <h2>Register for <em>ML Efficient {config.edition}</em></h2>
          </div>
          {registrationOpen ? (
            <div className="registration-card open-card">
              <Rocket />
              <h3>Registrations Open</h3>
              <p>Secure your seat for ML Efficient {config.edition}.</p>
              <button className="primary" onClick={register}>Complete Registration</button>
            </div>
          ) : (
            <div className="registration-card">
              <div className="lock"><LockKeyhole /></div>
              <h3>Registrations Closed</h3>
              <p>Registration for ML Efficient {config.edition} closed on <b>{registrationEnd.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}.</b></p>
              <p>See you at the event on <b>{eventStart.toLocaleDateString("en-IN", { dateStyle: "long" })}</b> at MAB, NIT Durgapur!</p>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-grid">
          <div><h3>ML Efficient {config.edition}</h3><p>A premier technical event by R&amp;D Cell, CCA - NIT Durgapur, exploring the frontiers of efficient machine learning systems.</p></div>
          <div><h3>Quick Links</h3><button onClick={() => navTo("about")}>About</button><button onClick={() => navTo("past-events")}>Past Events</button><button onClick={() => navTo("timeline")}>Timeline</button><button onClick={() => navTo("register")}>Register</button></div>
          <div><h3>Location</h3><p><MapPin /> MAB (Main Academic Building)<br />NIT Durgapur</p></div>
        </div>
        <div className="social">
          <h3>Stay Updated with R&amp;D Cell and CCA</h3>
          <p>Follow us on Instagram for the latest research happenings, Sci-Fi videos, and updates on R&amp;D events.</p>
          <div className="social-links">
            <a href="https://www.instagram.com/rnd_cca.nitd" target="_blank" rel="noreferrer"><Instagram /> Follow @rnd_cca.nitd</a>
            <a href="https://www.instagram.com/cca.nitd?utm_source=ig_web_button_share_sheet&amp;igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><Instagram /> Follow @cca.nitd</a>
          </div>
          <div className="cca-social-links" aria-label="CCA social media links">
            <a href="https://www.facebook.com/ccanitd.in/" target="_blank" rel="noreferrer" aria-label="CCA on Facebook"><img src="/assets/cca-facebook.png" alt="" /></a>
            <a href="https://www.linkedin.com/company/center-for-cognitive-activities-nit-durgapur/" target="_blank" rel="noreferrer" aria-label="CCA on LinkedIn"><img src="/assets/cca-linkedin.png" alt="" /></a>
            <a href="https://www.youtube.com/@ccanitdgp" target="_blank" rel="noreferrer" aria-label="CCA on YouTube"><img src="/assets/cca-youtube.png" alt="" /></a>
          </div>
        </div>
        <div className="copyright">Made with <span>♥</span> for ML Efficient {config.edition}</div>
      </footer>
    </div>
  );
}

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [config, setConfig] = useState<SiteConfig>(loadConfig);
  const [saved, setSaved] = useState(false);

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() === "admin" && password === "MLEfficient@3.0") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect admin credentials.");
    }
  };

  const save = () => {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const readImage = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setConfig((current) => ({
        ...current,
        pastEvents: current.pastEvents.map((item, itemIndex) => itemIndex === index ? { ...item, image: String(reader.result) } : item),
      }));
    };
    reader.readAsDataURL(file);
  };

  if (!authenticated) {
    return (
      <main className="admin-page admin-login-page">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-brand">ML <span>Efficient</span></div>
          <h1>Admin Access</h1>
          <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
          {loginError && <p className="admin-error">{loginError}</p>}
          <button className="admin-save" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><span>ML Efficient CMS</span><h1>Event Content Manager</h1></div>
        <div className="admin-actions">
          <button onClick={() => { sessionStorage.removeItem(ADMIN_SESSION_KEY); setAuthenticated(false); }}>Logout</button>
          <button className="admin-save" onClick={save}>{saved ? "Saved" : "Save changes"}</button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button className="active">Event Settings</button>
          <button onClick={() => document.getElementById("admin-past-events")?.scrollIntoView({ behavior: "smooth" })}>Past Events</button>
          <button onClick={() => document.getElementById("admin-about")?.scrollIntoView({ behavior: "smooth" })}>About Section</button>
          <button onClick={() => document.getElementById("admin-timeline")?.scrollIntoView({ behavior: "smooth" })}>Timeline</button>
        </aside>

        <div className="admin-content">
          <section className="admin-card">
            <div className="admin-section-title"><span>01</span><div><h2>Event settings</h2><p>Update the active edition, registration window, and countdown.</p></div></div>
            <div className="admin-grid">
              <label>Edition<input value={config.edition} onChange={(event) => setConfig({ ...config, edition: event.target.value })} /></label>
              <label>Registration opens<input type="datetime-local" value={config.registrationStart.slice(0, 16)} onChange={(event) => setConfig({ ...config, registrationStart: event.target.value })} /></label>
              <label>Registration closes<input type="datetime-local" value={config.registrationEnd.slice(0, 16)} onChange={(event) => setConfig({ ...config, registrationEnd: event.target.value })} /></label>
              <label>Event starts<input type="datetime-local" value={config.eventStart.slice(0, 16)} onChange={(event) => setConfig({ ...config, eventStart: event.target.value })} /></label>
              <label className="admin-span-2">Google Form link<input type="url" placeholder="https://forms.google.com/..." value={config.googleFormUrl} onChange={(event) => setConfig({ ...config, googleFormUrl: event.target.value })} /></label>
            </div>
          </section>

          <section className="admin-card" id="admin-about">
            <div className="admin-section-title"><span>02</span><div><h2>About section</h2><p>Edit the main description and the four feature cards.</p></div></div>
            <div className="about-admin-form">
              <label>Section heading<input value={config.aboutTitle || ""} onChange={(event) => setConfig({ ...config, aboutTitle: event.target.value })} /></label>
              <label>Main description<textarea rows={5} value={config.aboutDescription || ""} onChange={(event) => setConfig({ ...config, aboutDescription: event.target.value })} /></label>
              <label>Topics covered (comma separated)<input value={(config.topics || []).join(", ")} onChange={(event) => setConfig({ ...config, topics: event.target.value.split(",").map((topic) => topic.trim()).filter(Boolean) })} /></label>
            </div>
            <div className="about-admin-list">
              {(config.aboutFeatures || []).map((feature, index) => (
                <div className="about-admin-editor" key={`${feature.title}-${index}`}>
                  <div className="about-card-heading">
                    <h3>Feature card {index + 1}</h3>
                    <button
                      className="admin-remove"
                      type="button"
                      onClick={() => setConfig({ ...config, aboutFeatures: config.aboutFeatures.filter((_, itemIndex) => itemIndex !== index) })}
                    >
                      Remove card
                    </button>
                  </div>
                  <label>Card heading<input value={feature.title} onChange={(event) => setConfig({ ...config, aboutFeatures: config.aboutFeatures.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} /></label>
                  <label>Card description<textarea rows={3} value={feature.description} onChange={(event) => setConfig({ ...config, aboutFeatures: config.aboutFeatures.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} /></label>
                </div>
              ))}
            </div>
            <button
              className="admin-add"
              type="button"
              onClick={() => setConfig({ ...config, aboutFeatures: [...config.aboutFeatures, { title: "New feature", description: "", icon: "brain" }] })}
            >
              + Add feature card
            </button>
          </section>

          <section className="admin-card" id="admin-past-events">
            <div className="admin-section-title"><span>03</span><div><h2>Past events</h2><p>Add an edition and manage its poster, description, and participant count.</p></div></div>
            {config.pastEvents.map((event, index) => (
              <div className="past-admin-editor" key={`${event.name}-${index}`}>
                <div className="past-image-editor">
                  {event.image && <img src={event.image} alt={`${event.name} preview`} />}
                  <label className="admin-upload">Upload poster<input type="file" accept="image/*" onChange={(imageEvent) => readImage(imageEvent, index)} /></label>
                </div>
                <div className="past-fields">
                  <div className="admin-grid">
                    <label>Edition name<input value={event.name} onChange={(eventInput) => setConfig({ ...config, pastEvents: config.pastEvents.map((item, itemIndex) => itemIndex === index ? { ...item, name: eventInput.target.value } : item) })} /></label>
                    <label>Participants<input value={event.participants} onChange={(eventInput) => setConfig({ ...config, pastEvents: config.pastEvents.map((item, itemIndex) => itemIndex === index ? { ...item, participants: eventInput.target.value } : item) })} /></label>
                  </div>
                  <label>Description<textarea rows={4} value={event.description} onChange={(eventInput) => setConfig({ ...config, pastEvents: config.pastEvents.map((item, itemIndex) => itemIndex === index ? { ...item, description: eventInput.target.value } : item) })} /></label>
                  <label>Tags (comma separated)<input value={event.tags.join(", ")} onChange={(eventInput) => setConfig({ ...config, pastEvents: config.pastEvents.map((item, itemIndex) => itemIndex === index ? { ...item, tags: eventInput.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) } : item) })} /></label>
                  <button className="admin-remove" type="button" onClick={() => setConfig({ ...config, pastEvents: config.pastEvents.filter((_, itemIndex) => itemIndex !== index) })}>Remove event</button>
                </div>
              </div>
            ))}
            <button className="admin-add" type="button" onClick={() => setConfig({ ...config, pastEvents: [...config.pastEvents, { name: "ML Efficient 4.0", description: "", participants: "100+", image: "", tags: ["Machine Learning"] }] })}>+ Add past event</button>
          </section>

          <section className="admin-card" id="admin-timeline">
            <div className="admin-section-title"><span>04</span><div><h2>Timeline</h2><p>Create event days, then add and reorder sessions for each day.</p></div></div>
            {config.schedule.map((day, dayIndex) => (
              <div className="day-editor" key={`${day.day}-${dayIndex}`}>
                <div className="day-heading">
                  <input aria-label="Day name" value={day.day} onChange={(event) => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, day: event.target.value } : item) })} />
                  <input aria-label="Day date" value={day.date} onChange={(event) => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, date: event.target.value } : item) })} />
                  <button type="button" onClick={() => setConfig({ ...config, schedule: config.schedule.filter((_, index) => index !== dayIndex) })}>Remove day</button>
                </div>
                {day.sessions.map((session, sessionIndex) => (
                  <div className="session-editor" key={`${session.title}-${sessionIndex}`}>
                    <input aria-label="Session time" value={session.time} onChange={(event) => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, sessions: item.sessions.map((value, valueIndex) => valueIndex === sessionIndex ? { ...value, time: event.target.value } : value) } : item) })} />
                    <input aria-label="Session title" value={session.title} onChange={(event) => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, sessions: item.sessions.map((value, valueIndex) => valueIndex === sessionIndex ? { ...value, title: event.target.value } : value) } : item) })} />
                    <textarea aria-label="Session description" rows={2} value={session.description} onChange={(event) => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, sessions: item.sessions.map((value, valueIndex) => valueIndex === sessionIndex ? { ...value, description: event.target.value } : value) } : item) })} />
                    <button type="button" aria-label="Remove session" onClick={() => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, sessions: item.sessions.filter((_, valueIndex) => valueIndex !== sessionIndex) } : item) })}>×</button>
                  </div>
                ))}
                <button className="admin-add session-add" type="button" onClick={() => setConfig({ ...config, schedule: config.schedule.map((item, index) => index === dayIndex ? { ...item, sessions: [...item.sessions, { time: "", title: "New session", description: "", icon: "code" }] } : item) })}>+ Add session</button>
              </div>
            ))}
            <button className="admin-add" type="button" onClick={() => setConfig({ ...config, schedule: [...config.schedule, { day: `Day ${config.schedule.length + 1}`, date: "", sessions: [] }] })}>+ Add event day</button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
