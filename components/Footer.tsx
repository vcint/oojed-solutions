import data from "@/data/site.json";
import Link from "next/link";
import Button from "./Button";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiArrowRight } from "react-icons/fi";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/why-us", label: "Why Us" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: FiFacebook },
  { href: "https://www.instagram.com/oojed_solar", label: "Instagram", icon: FiInstagram },
  { href: "https://www.linkedin.com/company/oojed/", label: "LinkedIn", icon: FiLinkedin },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f8fbff] to-white text-slate-800 dark:from-[#01030c] dark:via-[#031024] dark:to-[#01030c] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/90 via-transparent to-transparent dark:from-[#0c1c3f]/60" />
      <div className="pointer-events-none absolute -right-36 top-6 h-72 w-72 rounded-full bg-[#c0d5ff]/35 blur-3xl dark:bg-[#123061]/40" />
      <div className="pointer-events-none absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-[#d8f1ff]/30 blur-3xl dark:bg-[#08223d]/45" />

      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel flex h-full flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-white/70 blur-xl dark:bg-white/30" aria-hidden="true" />
                <img src="/oojed-logo.png" alt="OOJED logo" className="relative h-12 w-auto drop-shadow-lg" />
              </div>
              {/* <div className="text-base font-semibold text-slate-800 dark:text-white">OOJED Solar Solutions</div> */}
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
              Distributor-led solar, lighting and energy-efficiency solutions for Maharashtra. OEM partnerships, fabrication yards
              and AMC command centres keep every deployment supported long after commissioning.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="gradient" className="w-full justify-center px-5 py-2.5 text-xs uppercase tracking-[0.35em]">
                Book a consultation
                <FiArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="glass-panel flex h-full flex-col gap-4 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Quick links</div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel flex h-full flex-col gap-4 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Contact</div>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <span>{data.contacts.puneOffice}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <div className="space-y-1">
                  {data.contacts.phones.map((phone: string) => (
                    <div key={phone}>
                      <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} className="transition hover:text-slate-900 dark:hover:text-white">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <a href={`mailto:${data.contacts.email}`} className="transition hover:text-slate-900 dark:hover:text-white">
                  {data.contacts.email}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-panel flex h-full flex-col gap-4 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Stay connected</div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
              Follow rollout stories, maintenance tips and subsidy alerts curated for societies, industries and civic teams.
            </p>
            <div className="mt-auto flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/70 dark:border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-xs text-slate-500 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
          <div>© {year} OOJED. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Website by</span>
            <a href="#" target="_blank" rel="noreferrer" className="font-semibold text-slate-700 hover:underline dark:text-white">
              Webflexi Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
