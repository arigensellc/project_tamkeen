'use client';

import { useEffect } from 'react';

export default function SiteContent({ html }: { html: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const photos: Record<string, string> = {
      hero: '/images/pakistani-aid-recipients.jpg',
      heroSide: '/images/pakistani-girl.jpg',
      about1: '/images/pakistani-family.jpg',
      about2: '/images/pakistani-craftsman.jpg',
      whatWeDo: '/images/pakistani-child.jpg',
      prog1: '/images/pakistani-children.jpg',
      prog2: '/images/pakistani-family.jpg',
      prog3: '/images/pakistani-craftsman.jpg',
      prog4: '/images/pakistani-child-worker.jpg',
    };
    const photoAlts: Record<string, string> = {
      hero: 'Children gathered after receiving food aid',
      heroSide: 'A young girl wearing a red headscarf',
      about1: 'A family sitting together outside their home',
      about2: 'An older craftsman carrying a large wrench',
      whatWeDo: 'A young child standing beside a wall',
      prog1: 'Children sitting together in warm clothes',
      prog2: 'A family sitting together outside their home',
      prog3: 'An older craftsman carrying a large wrench',
      prog4: 'A child carrying a large sack',
    };
    const photoCredits: Record<string, string> = {
      hero: 'Image supplied by Tamkeen',
      heroSide: 'Image supplied by Tamkeen',
      about1: 'Image supplied by Tamkeen',
      about2: 'Image supplied by Tamkeen',
      whatWeDo: 'Image supplied by Tamkeen',
      prog1: 'Image supplied by Tamkeen',
      prog2: 'Image supplied by Tamkeen',
      prog3: 'Image supplied by Tamkeen',
      prog4: 'Image supplied by Tamkeen',
    };
    document.querySelectorAll<HTMLElement>('.ph[data-photo]').forEach((figure) => {
      const photoKey = figure.dataset.photo ?? '';
      const src = photos[photoKey];
      if (!src || figure.querySelector('img')) return;
      const image = document.createElement('img');
      image.src = src;
      image.alt = photoAlts[photoKey] ?? 'Representative stock photograph';
      image.decoding = 'async';
      if (photoKey === 'hero') image.fetchPriority = 'high'; else image.loading = 'lazy';
      image.onerror = () => {
        image.onerror = null;
        image.src = `/images/${({ hero: 'hero-community', heroSide: 'family-plan', about1: 'family-plan', about2: 'livelihood-start', whatWeDo: 'winter-kit', prog1: 'winter-kit', prog2: 'monthly-groceries', prog3: 'skills-workshop', prog4: 'livelihood-start' } as Record<string, string>)[photoKey] ?? 'hero-community'}.svg`;
        image.alt = 'Original Tamkeen-inspired illustration';
        const caption = figure.querySelector<HTMLElement>('.cap');
        if (caption) caption.textContent = 'Original Tamkeen-inspired illustration';
      };
      figure.insertBefore(image, figure.firstChild);
      const caption = figure.querySelector<HTMLElement>('.cap');
      if (caption) caption.textContent = photoCredits[photoKey] ?? 'Representative stock photo';
      figure.classList.add('has-img');
    });
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll<HTMLElement>('.light, .wwd, .forms, .connect, .foot, .prog').forEach((el) => {
      el.dataset.reveal = 'true'; revealObserver.observe(el);
    });

    const nav = document.getElementById('nav');
    const menu = document.querySelector<HTMLButtonElement>('.menu-btn');
    const closeNav = () => { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
    const toggleMenu = () => { const open = nav?.classList.toggle('open') ?? false; menu?.setAttribute('aria-expanded', String(open)); };
    menu?.addEventListener('click', toggleMenu);
    nav?.addEventListener('click', (event) => { if ((event.target as HTMLElement).closest('a')) closeNav(); });
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeNav(); };
    document.addEventListener('keydown', onKey);

    const themeButton = document.getElementById('theme-btn');
    try { const saved = localStorage.getItem('tamkeen-theme'); if (saved) root.setAttribute('data-theme', saved); } catch {}
    const darkNow = () => root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const updateThemeLabel = () => { if (themeButton) themeButton.textContent = darkNow() ? 'Switch to light' : 'Switch to dark'; };
    updateThemeLabel();
    const onTheme = () => { const next = darkNow() ? 'light' : 'dark'; root.setAttribute('data-theme', next); try { localStorage.setItem('tamkeen-theme', next); } catch {} updateThemeLabel(); };
    themeButton?.addEventListener('click', onTheme);

    const rail = document.querySelector<HTMLElement>('.rail');
    const arrows = [...document.querySelectorAll<HTMLButtonElement>('.arrow')];
    const updateArrows = () => { if (!rail) return; const max = rail.scrollWidth - rail.clientWidth - 2; if (arrows[0]) arrows[0].disabled = rail.scrollLeft <= 2; if (arrows[1]) arrows[1].disabled = rail.scrollLeft >= max; };
    const arrowHandlers = arrows.map((button) => { const handler = () => { const card = rail?.querySelector('.prog'); if (card && rail) rail.scrollBy({ left: (card.getBoundingClientRect().width + 18) * Number(button.dataset.dir), behavior: reduce ? 'auto' : 'smooth' }); }; button.addEventListener('click', handler); return handler; });
    rail?.addEventListener('scroll', updateArrows, { passive: true }); window.addEventListener('resize', updateArrows); updateArrows();

    document.querySelectorAll<HTMLAnchorElement>('[data-purpose]').forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault(); const purpose = document.getElementById('d-purpose') as HTMLSelectElement | null;
      if (purpose) purpose.value = link.dataset.purpose ?? ''; document.getElementById('donate')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));
    document.querySelectorAll<HTMLButtonElement>('.copy[data-copy]').forEach((button) => button.addEventListener('click', async () => {
      const text = document.getElementById(button.dataset.copy ?? '')?.textContent?.trim() ?? '';
      try { await navigator.clipboard.writeText(text); const status = document.getElementById('copy-status'); if (status) status.textContent = `Copied: ${text}`; } catch { const status = document.getElementById('copy-status'); if (status) status.textContent = `Select and copy: ${text}`; }
    }));

    const setError = (form: HTMLFormElement, name: string, message: string) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      const error = document.getElementById(`${form.id === 'donate-form' ? 'd' : 'v'}-${name === 'fullname' ? 'name' : name}-err`);
      if (error) error.textContent = message;
      input?.setAttribute('aria-invalid', message ? 'true' : 'false'); return !message;
    };
    const deliver = (form: HTMLFormElement, message: string) => {
      const box = form.querySelector<HTMLElement>('.result'); if (!box) return; box.replaceChildren();
      const p = document.createElement('p'); p.className = 'status'; p.textContent = 'Our WhatsApp number isn’t listed yet. Copy this message and send it to us:';
      const pre = document.createElement('pre'); pre.textContent = message;
      const copy = document.createElement('button'); copy.className = 'copy'; copy.type = 'button'; copy.textContent = 'Copy message';
      copy.onclick = async () => { try { await navigator.clipboard.writeText(message); copy.textContent = 'Copied'; } catch { copy.textContent = 'Select and copy the text above'; } };
      box.append(p, pre, copy); box.classList.add('show');
    };
    const donateForm = document.getElementById('donate-form') as HTMLFormElement | null;
    const onDonate = (event: Event) => {
      event.preventDefault(); if (!donateForm) return; const data = new FormData(donateForm);
      const amount = String(data.get('amount') ?? '').replace(/\D/g, '');
      const ok = [setError(donateForm, 'amount', Number(amount) > 0 ? '' : 'Enter the amount in rupees.'), setError(donateForm, 'fullname', String(data.get('fullname') ?? '').trim() ? '' : 'Enter your name.'), setError(donateForm, 'phone', String(data.get('phone') ?? '').replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.')].every(Boolean);
      if (!ok) { donateForm.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
      deliver(donateForm, `Assalam-o-Alaikum Tamkeen, I have made a donation.\nType: ${data.get('type')}\nFor: ${data.get('purpose')}\nAmount: PKR ${Number(amount).toLocaleString('en-PK')}\nTransaction ID: ${data.get('ref') || 'Not provided'}\nName: ${data.get('fullname')}\nPhone: ${data.get('phone')}`);
    };
    donateForm?.addEventListener('submit', onDonate);
    const volunteerForm = document.getElementById('vol-form') as HTMLFormElement | null;
    const onVolunteer = (event: Event) => {
      event.preventDefault(); if (!volunteerForm) return; const data = new FormData(volunteerForm);
      const help = data.getAll('help').map(String); const phone = String(data.get('phone') ?? '');
      const ok = [setError(volunteerForm, 'fullname', String(data.get('fullname') ?? '').trim() ? '' : 'Enter your full name.'), setError(volunteerForm, 'phone', phone.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.'), setError(volunteerForm, 'city', String(data.get('city') ?? '').trim() ? '' : 'Enter your city and area.'), (() => { const err = document.getElementById('v-help-err'); if (err) err.textContent = help.length ? '' : 'Choose at least one way to help.'; return help.length > 0; })(), (() => { const consent = document.getElementById('v-consent') as HTMLInputElement | null; const err = document.getElementById('v-consent-err'); if (err) err.textContent = consent?.checked ? '' : 'Please agree to respect families’ privacy.'; return !!consent?.checked; })()].every(Boolean);
      if (!ok) { volunteerForm.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
      deliver(volunteerForm, `Assalam-o-Alaikum Tamkeen, I would like to volunteer.\nName: ${data.get('fullname')}\nPhone: ${phone}\nCity: ${data.get('city')}\nI can help with: ${help.join(', ')}\nAvailable: ${data.getAll('when').join(', ') || 'Flexible'}\nNote: ${data.get('note') || 'None'}`);
    };
    volunteerForm?.addEventListener('submit', onVolunteer);

    return () => { revealObserver.disconnect(); menu?.removeEventListener('click', toggleMenu); document.removeEventListener('keydown', onKey); themeButton?.removeEventListener('click', onTheme); rail?.removeEventListener('scroll', updateArrows); window.removeEventListener('resize', updateArrows); arrows.forEach((button, i) => button.removeEventListener('click', arrowHandlers[i])); donateForm?.removeEventListener('submit', onDonate); volunteerForm?.removeEventListener('submit', onVolunteer); };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
