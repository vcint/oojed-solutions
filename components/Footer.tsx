import data from "@/data/site.json";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-slate-100">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-semibold ui-text">OOJED</div>
          <p className="mt-3 muted">Manufacturer and supplier of solar water heaters, LED lighting and solar pumps — quality products, installation, and maintenance services with end-to-end support.</p>
          <div className="mt-4 text-sm muted">© {new Date().getFullYear()} OOJED</div>
        </div>

        <div>
          <div className="font-medium ui-text">Quick links</div>
          <ul className="mt-3 space-y-2 muted">
            <li><Link href={"/about"} className="hover:text-blue-700">About</Link></li>
            <li><Link href={"/products"} className="hover:text-blue-700">Products</Link></li>
            <li><Link href={"/services"} className="hover:text-blue-700">Services</Link></li>
            <li><Link href={"/benefits"} className="hover:text-blue-700">Why Us</Link></li>
            {/* <li><Link href="#contact" className="hover:text-blue-700">Contact</Link></li> */}
          </ul>
        </div>

        <div>
          <div className="font-medium text-slate-900">Contact</div>
          <div className="mt-3 space-y-3 text-slate-600">
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-blue-700 mt-1" />
              <div>{data.contacts.puneOffice}</div>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone className="w-5 h-5 text-blue-700 mt-1" />
              <div>
                {data.contacts.phones.map((p: string, i: number) => (
                  <span key={p}>
                    <a href={`tel:${p.replace(/[^+0-9]/g, '')}`} className="text-slate-700" aria-label={`Call ${p}`}>{p}</a>
                    {i < data.contacts.phones.length - 1 ? ' | ' : ''}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMail className="w-5 h-5 text-blue-700 mt-1" />
              <a href={`mailto:${data.contacts.email}`} className="text-slate-700">{data.contacts.email}</a>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a href="#" className="text-slate-500 hover:text-blue-700" target="_blank"><FiFacebook className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/oojed_solar" className="text-slate-500 hover:text-blue-700" target="_blank"><FiInstagram className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-blue-700" target="_blank"><FiLinkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 mt-6">
        <div className="container py-4 text-center text-sm muted">
          Designed and developed by <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-blue-700">Webflexi Technologies.</a>
        </div>
      </div>
    </footer>
  );
}
