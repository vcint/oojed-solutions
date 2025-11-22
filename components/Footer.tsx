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
    <footer className="relative overflow-hidden bg-secondary/30 text-foreground">
      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass flex h-full flex-col gap-4 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-white/70 blur-xl dark:bg-white/30" aria-hidden="true" />
                <img src="/oojed-logo.png" alt="OOJED logo" className="relative h-12 w-auto drop-shadow-lg" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Solar solutions that actually work in Maharashtra. We supply, install, and care for systems built to handle monsoon, hard water, and grid challenges. Since 2014.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="gradient" className="w-full justify-center px-5 py-2.5 text-xs uppercase tracking-[0.35em] rounded-full">
                Let's Talk Solar
                <FiArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="glass flex h-full flex-col gap-4 p-6 rounded-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Quick links</div>
            <ul className="space-y-3 text-sm text-foreground/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass flex h-full flex-col gap-4 p-6 rounded-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Contact</div>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                <span>{data.contacts.puneOffice}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  {data.contacts.phones.map((phone: string) => (
                    <div key={phone}>
                      <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} className="transition hover:text-primary">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${data.contacts.email}`} className="transition hover:text-primary">
                  {data.contacts.email}
                </a>
              </div>
            </div>
          </div>

          <div className="glass flex h-full flex-col gap-4 p-6 rounded-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Stay connected</div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Follow us for project updates, real customer stories, and tips to keep your solar running smoothly.
            </p>
            <div className="mt-auto flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition hover:-translate-y-0.5 hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {year} OOJED. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Website by</span>
            <a href="#" target="_blank" rel="noreferrer" className="font-semibold text-foreground hover:underline">
              Webflexi Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
