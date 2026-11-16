'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const programs = [
  { category: 'RELIEF', title: 'Winter kits', description: 'A warm blanket and a pair of shoes for one person, delivered before the cold sets in.', amount: '', image: '/images/pakistani-children.jpg', alt: 'Children sitting together in warm clothes', cta: 'Give a winter kit' },
  { category: 'RELIEF', title: 'Monthly groceries', description: 'Flour, rice, lentils, oil and other essentials while the family works on their plan.', amount: '', image: '/images/pakistani-family.jpg', alt: 'A family sitting together outside their home', cta: 'Sponsor groceries' },
  { category: 'LIVELIHOOD', title: 'Skills training', description: 'A course in a trade people in the area will pay for, with a mentor afterwards.', amount: '', image: '/images/pakistani-craftsman.jpg', alt: 'An older craftsman carrying a large wrench', cta: 'Fund a trainee' },
  { category: 'LIVELIHOOD', title: 'A livelihood start', description: 'The tools or stock a family needs to start earning. Our most lasting gift.', amount: '', image: '/images/pakistani-child-worker.jpg', alt: 'A child carrying a large sack', cta: 'Fund a livelihood' },
];

const steps = [
  ['01', 'Relief', 'Groceries, warm blankets and shoes, so a family is safe today.', ['Groceries', 'Blankets', 'Shoes']],
  ['02', 'Listen', 'Two volunteers visit, hear the family’s goals and agree a personal plan.', ['2 volunteers', '1 plan']],
  ['03', 'Build', 'Skills, tools or an interest-free loan, with mentoring along the way.', ['Skills', 'Tools', 'Qarz-e-Hasna']],
  ['04', 'Stand tall', 'A steady income of their own. Repaid loans help the next family begin.', ['Own income', 'Next family']],
] as const;

// One line, four treads: flat relief rising to standing tall.
const STAIR = 'M14 236 H124 V176 H234 V116 H344 V56 H466';
const STAIR_DOTS = [[69, 236], [179, 176], [289, 116], [405, 56]];

const TALLY_FORM = 'https://tally.so/r/9N9ODX';
const TALLY_EMBED = 'https://tally.so/embed/9N9ODX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';

const BANK = { title: 'ABDULLAH', bank: 'Meezan Bank', account: '09030111593645', iban: 'PK71MEZN0009030111593645' };

function CopyValue({ value, label, display }: { value: string; label: string; display?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(value); ok = true; }
    catch {
      // Fallback for browsers or embedded views without the async clipboard API.
      const field = Object.assign(document.createElement('textarea'), { value, readOnly: true });
      field.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(field);
      field.select();
      ok = document.execCommand('copy');
      field.remove();
    }
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 1800);
  };
  return <button type="button" className="copy-value" onClick={copy} aria-label={`Copy ${label} ${value}`}>
    <span translate="no">{display ?? value}</span><em aria-live="polite">{copied ? 'Copied' : 'Copy'}</em>
  </button>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={diagonal ? 'M7 17 17 7M8 7h9v9' : 'M4 12h15M13 6l6 6-6 6'} /></svg>;
}

function TamkeenMark({ light = false }: { light?: boolean }) {
  const dark = light ? '#F5F5F5' : '#303236';
  return <svg aria-hidden="true" viewBox="64 0 312 176" className="h-10 w-[70px] shrink-0"><g fill="none" stroke={dark} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"><path d="M340 88v32H150" /><circle cx="290" cy="103" r="17" /><path d="M244 120V42l46-22M199 120V98M150 120c0 42-68 42-68-12" /></g><g fill="#E65416"><circle cx="327" cy="56" r="11.5" /><circle cx="353" cy="56" r="11.5" /><circle cx="116" cy="88" r="11.5" /></g><g fill={dark}><circle cx="187" cy="156" r="10" /><circle cx="211" cy="156" r="10" /></g></svg>;
}

export default function TamkeenHome() {
  const rail = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [litDots, setLitDots] = useState(0);
  const [showFloatNav, setShowFloatNav] = useState(false);
  const rise = useRef<HTMLElement>(null);
  const floatNav = useRef<HTMLDivElement>(null);

  // Keep the hidden floating nav out of the tab order.
  useEffect(() => { floatNav.current?.toggleAttribute('inert', !showFloatNav); }, [showFloatNav]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // The Nastaliq font is large and only decorates one line, so load it after hydration.
  useEffect(() => {
    if (document.getElementById('nastaliq-font')) return;
    const link = Object.assign(document.createElement('link'), { id: 'nastaliq-font', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap' });
    document.head.appendChild(link);
  }, []);

  // Floating nav appears once the hero header has scrolled away.
  useEffect(() => {
    const hero = document.querySelector('.topbar');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setShowFloatNav(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Signature moment: the rising line draws with scroll progress through the four steps.
  useEffect(() => {
    const section = rise.current;
    if (!section) return;
    const list = section.querySelector<HTMLElement>('.rise-steps');
    const items = Array.from(section.querySelectorAll<HTMLElement>('.rise-steps > li'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.setProperty('--p', '1');
      setActiveStep(3);
      setLitDots(3);
      return;
    }
    const line = section.querySelector<SVGSVGElement>('.rise-line');
    const narrow = window.matchMedia('(max-width: 1000px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!list || !line) return;
      const vh = window.innerHeight;
      const mid = vh * 0.55;
      let current = 0;
      items.forEach((item, index) => { if (item.getBoundingClientRect().top < mid) current = index; });
      current = Math.min(current, steps.length - 1);
      let p: number;
      if (narrow.matches) {
        // Stage is not pinned on small screens: draw the rise while the line itself crosses the viewport.
        const top = line.getBoundingClientRect().top;
        p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.5)));
        setLitDots(Math.min(3, Math.floor(p * 3.999)));
      } else {
        const box = list.getBoundingClientRect();
        p = Math.min(1, Math.max(0, (mid - box.top) / box.height));
        setLitDots(current);
      }
      section.style.setProperty('--p', p.toFixed(4));
      setActiveStep(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);

  const goDonate = (_purpose?: string) => {
    setMenuOpen(false);
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
  };

  const slidePrograms = (direction: -1 | 1) => {
    if (!rail.current) return;
    const card = rail.current.querySelector<HTMLElement>('.program-card');
    rail.current.scrollBy({ left: direction * ((card?.offsetWidth ?? 560) + 22), behavior: 'smooth' });
  };

  return <main className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className={`float-nav${showFloatNav ? ' is-shown' : ''}`} ref={floatNav} aria-hidden={!showFloatNav}>
      <a className="brand" href="#top" aria-label="Back to top of Tamkeen"><TamkeenMark /></a>
      <nav aria-label="Section navigation"><a href="#about">About</a><a href="#journey">Journey</a><a href="#programs">Programs</a><a href="#faq">FAQ</a></nav>
      <button className="button button-orange" type="button" onClick={() => goDonate()}>Donate <span className="button-arrow"><Arrow /></span></button>
    </div>
    <div className="hero-frame" id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tamkeen home"><TamkeenMark /><span>tamkeen</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-nav" aria-label="Main navigation">
          <a href="#about" onClick={() => setMenuOpen(false)}>About us</a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a><a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <button className="button button-orange nav-donate" type="button" onClick={() => goDonate()}>Donate now <span className="button-arrow"><Arrow /></span></button>
        </nav>
      </header>

      <section className="hero-grid" id="main-content" aria-labelledby="hero-title">
        <div className="hero-heading">
          <span className="eyebrow eyebrow-light"><i /> A new NGO for families in Pakistan</span>
          <h1 id="hero-title">From relief<br /><span>to self-reliance</span></h1>
        </div>
        <figure className="hero-photo photo-wrap">
          <img src="/images/pakistani-aid-recipients.jpg" alt="Children gathered after receiving food aid" fetchPriority="high" />

          <div className="hero-stat"><b>4</b><span>steps toward<br />independence</span></div>
          <div className="photo-pills"><span>Relief</span><span>Livelihoods</span></div>
        </figure>
        <div className="hero-copy">
          <ul className="first-gifts" aria-label="Immediate family support"><li>Groceries</li><li>Warmth</li><li>Footwear</li></ul>
          <p className="hero-lede">Groceries, blankets and shoes come first. Then we stay with skills, tools and interest-free loans until a family earns a living of its own.</p>
          <div className="hero-actions"><button className="button button-orange" onClick={() => goDonate()}>Be part of the change <span className="button-arrow"><Arrow /></span></button><a className="button button-outline" href="#about">Learn more</a></div>
        </div>
        <aside className="hero-aside">
          <TamkeenMark light />
          <h2>Help today.<br />Independence tomorrow.</h2>
          <p>Tamkeen means empowerment. Every family deserves the tools to stand on its own.</p>
          <figure className="aside-photo photo-wrap"><img src="/images/pakistani-girl.jpg" alt="A young girl wearing a red headscarf" loading="lazy" /></figure>
        </aside>
      </section>
    </div>

    <section className="about-section light-section reveal" id="about" aria-labelledby="about-title">
      <div className="section-heading centered"><span className="eyebrow"><i /> About Tamkeen</span><h2 id="about-title">Building families<br />that stand on their own</h2></div>
      <div className="about-grid">
        <figure className="about-photo photo-wrap"><img src="/images/pakistani-family.jpg" alt="A family sitting together outside their home" loading="lazy" /></figure>
        <div className="about-story">
          <TamkeenMark />
          <p className="about-lede">A food parcel feeds a family for a week. Tamkeen starts with what a family needs right now and stays until they can stand on their own.</p>
          <p>Every family completes a short survey with volunteers, so support can be planned around their income, skills and goals.</p>
          <p>Our vision is a Pakistan where every family earns its living with dignity, and no one depends on charity to survive.</p>
          <a className="text-link" href="#approach">See how we work <Arrow diagonal /></a>
          <div className="mini-stats"><div><b>4</b><span>steps to independence</span></div><div><b>1</b><span>plan for each family</span></div><div><b>0%</b><span>interest on loans</span></div><div><b>2</b><span>volunteers per visit</span></div></div>
        </div>
        <figure className="about-photo about-photo-tall photo-wrap"><img src="/images/pakistani-craftsman.jpg" alt="An older craftsman carrying a large wrench" loading="lazy" /></figure>
      </div>
      <div className="trust-strip"><span>Care today</span><i /><span>Skills for tomorrow</span><i /><span>Dignity always</span><i /><span>Qarz-e-Hasna</span></div>
    </section>

    <section className="mission-section dark-section" id="approach" aria-labelledby="mission-title">
      <div className="mission-heading reveal"><div><span className="eyebrow eyebrow-light"><i /> Our mission</span><h2 id="mission-title">Relief is the beginning.<br /><span>Self-reliance is the goal.</span></h2></div><p>We stand alongside families with practical, personal support that can grow into a livelihood.</p></div>
      <div className="mission-grid">
        <div className="mission-list">
          {[
            ['Immediate essentials', 'Monthly groceries, warm blankets and shoes for verified families.'],
            ['A personal plan', 'Two volunteers visit, listen and agree next steps with each family.'],
            ['Skills and tools', 'Training and the equipment or stock needed to begin earning.'],
            ['Interest-free loans', 'Qarz-e-Hasna repaid in small instalments to support another family.'],
          ].map(([title, description], index) => <article className="mission-item reveal" key={title}><span className="mission-number">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><span className="mission-plus">+</span></article>)}
        </div>
        <figure className="mission-photo photo-wrap"><img src="/images/pakistani-child.jpg" alt="A young child standing beside a wall" loading="lazy" /><div className="mission-caption"><span className="eyebrow eyebrow-light"><i /> The Tamkeen promise</span><p>Support that sees the whole person, and their future.</p></div></figure>
      </div>
    </section>

    <section className="rise-section dark-section" id="journey" ref={rise} data-step={activeStep} aria-labelledby="journey-title">
      <div className="rise-stage">
        <div className="rise-sun" aria-hidden="true" />
        <div className="rise-intro">
          <span className="eyebrow eyebrow-light"><i /> From relief to self-reliance</span>
          <h2 id="journey-title">Four steps.<br /><span>A future of their own.</span></h2>
          <p>Every family’s path is personal. The care stays consistent.</p>
        </div>
        <svg className="rise-line" viewBox="0 0 480 260" aria-hidden="true">
          <path className="rise-track" d={STAIR} pathLength={1} />
          <path className="rise-draw" d={STAIR} pathLength={1} />
          {STAIR_DOTS.map(([cx, cy], index) => <circle key={cx} className={`rise-dot${index <= litDots ? ' is-on' : ''}`} cx={cx} cy={cy} r="10" />)}
        </svg>
        <div className="rise-counter" aria-hidden="true"><b>{steps[activeStep][0]}</b><span>/ 04</span><em>{steps[activeStep][1]}</em></div>
      </div>
      <ol className="rise-steps">
        {steps.map(([number, title, description, tags], index) => <li key={number} className={index === activeStep ? 'is-active' : undefined}>
          <span className="rise-number">{number}</span>
          <h3>{title}</h3>
          <p>{description}</p>
          <ul aria-label={`${title} includes`}>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </li>)}
      </ol>
    </section>

    <section className="program-section light-section reveal" id="programs" aria-labelledby="program-title">
      <div className="program-heading"><div><span className="eyebrow"><i /> Our programs</span><h2 id="program-title">Choose what<br />your gift can do</h2><p>Each gift supports a practical step on the road to self-reliance.</p></div><div className="carousel-controls"><button type="button" aria-label="Previous programs" onClick={() => slidePrograms(-1)}><Arrow diagonal={false} /></button><button type="button" aria-label="Next programs" onClick={() => slidePrograms(1)}><Arrow /></button></div></div>
      <div className="program-rail" ref={rail} tabIndex={0} aria-label="Tamkeen programs">
        {programs.map((program) => <article className="program-card" key={program.title}>
          <figure className="program-image photo-wrap"><img src={program.image} alt={program.alt} loading="lazy" /></figure>
          <div className="program-info"><span className="program-type">{program.category}</span><h3>{program.title}</h3><p>{program.description}</p>{program.amount && <strong>{program.amount}</strong>}<button className="button button-orange" type="button" onClick={() => goDonate(program.title)}>Choose this gift <span className="button-arrow"><Arrow /></span></button></div>
        </article>)}
      </div>
      <div className="program-foot"><span>Scroll or use the arrows to see all four programs</span><a href="#donate" onClick={(event) => { event.preventDefault(); goDonate(); }}>Give where it’s needed most <Arrow diagonal /></a></div>
    </section>

    <section className="faq-section light-section reveal" id="faq" aria-labelledby="faq-title">
      <div className="faq-heading"><span className="eyebrow"><i /> Questions</span><h2 id="faq-title">Straight answers,<br />from the start.</h2><p>Want to ask us something else? Use the donation form and leave a note for the team.</p><button className="button button-dark" onClick={() => goDonate()}>Contact Tamkeen <span className="button-arrow"><Arrow /></span></button></div>
      <div className="faq-list">
        <details><summary>How do you choose which families to help?<span>+</span></summary><p>Families are referred by trusted community members. Two volunteers visit and complete a short survey, and a committee reviews support using written criteria.</p></details>
        <details><summary>Do you give cash?<span>+</span></summary><p>Relief is provided as groceries, blankets and shoes. Livelihood support may include tools, stock, training or a small interest-free loan.</p></details>
        <details><summary>Can I choose where my donation goes?<span>+</span></summary><p>Yes. Select a winter kit, monthly groceries, skills training or a livelihood start in the donation form. You can also choose where the need is greatest.</p></details>
        <details><summary>Will I receive a receipt?<span>+</span></summary><p>After the transfer is confirmed, the team will send a receipt using the contact details you provide.</p></details>
        <details><summary>How does Qarz-e-Hasna work?<span>+</span></summary><p>It is a small interest-free loan repaid in manageable instalments. Repayments can help another family begin.</p></details>
      </div>
    </section>

    <section className="donate-section" id="donate" aria-labelledby="donate-title">
      <div className="donate-copy"><span className="eyebrow eyebrow-light"><i /> Give with purpose</span><h2 id="donate-title">Your gift can<br />help a family<br />stand tall.</h2><p>Transfer your donation, then share the details below so Tamkeen can confirm it and send your receipt.</p><div className="bank-details"><span>DONATE BY BANK TRANSFER</span><dl><div><dt>Account title</dt><dd>{BANK.title}</dd></div><div><dt>Bank</dt><dd>{BANK.bank}</dd></div><div><dt>Account no.</dt><dd><CopyValue value={BANK.account} label="account number" /></dd></div><div><dt>IBAN</dt><dd><CopyValue value={BANK.iban} label="IBAN" display={BANK.iban.replace(/(.{4})/g, '$1 ').trim()} /></dd></div></dl><p>Tap a number to copy it into your banking app.</p></div><p className="donate-urdu" lang="ur" dir="rtl">آج مدد، کل خودمختاری</p></div>
      <div className="donate-form-panel">
        <div className="donate-form-heading"><div><span className="eyebrow"><i /> Donation details</span><h3>Send your donation details</h3></div></div>
        <p className="form-intro">After your transfer, share your details and a screenshot of the payment.</p>
        <iframe className="tally-embed" data-tally-src={TALLY_EMBED} src={TALLY_EMBED} title="Tamkeen donation and volunteer form" loading="lazy" width="100%" height="520" />
        <p className="privacy-note">Form not loading? <a href={TALLY_FORM} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.</p>
      </div>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" onLoad={() => (window as unknown as { Tally?: { loadEmbeds: () => void } }).Tally?.loadEmbeds()} />
    </section>

    <footer className="site-footer">
      <div className="footer-main"><div className="footer-brand"><a className="brand brand-footer" href="#top"><TamkeenMark light /><span>tamkeen</span></a><p>From relief to self-reliance.<br />A Pakistan where every family earns with dignity.</p><a className="button button-orange" href="#donate" onClick={(event) => { event.preventDefault(); goDonate(); }}>Support a family <span className="button-arrow"><Arrow /></span></a></div><div className="footer-links"><div><b>Explore</b><a href="#about">About Tamkeen</a><a href="#approach">Our approach</a><a href="#programs">Programs</a><a href="#faq">Questions</a></div></div></div>
      <div className="footer-wordmark" aria-hidden="true">tamkeen</div><div className="footer-bottom"><span>© 2026 Tamkeen. From relief to self-reliance.</span><a href="#top">Back to top ↑</a></div>
    </footer>
  </main>;
}
