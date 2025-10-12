import data from "@/data/site.json";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-semibold text-slate-900">Oojed Solutions</div>
          <p className="mt-3 text-slate-600">Manufacturer and supplier of solar water heaters, LED lighting and solar pumps — quality products and end-to-end support.</p>
          <div className="mt-4 text-sm text-slate-500">© {new Date().getFullYear()} Oojed Solutions</div>
        </div>

        <div>
          <div className="font-medium text-slate-900">Quick links</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a href="#about" className="hover:text-blue-700">About</a></li>
            <li><a href="#products" className="hover:text-blue-700">Products</a></li>
            <li><a href="#benefits" className="hover:text-blue-700">Why Us</a></li>
            <li><a href="#contact" className="hover:text-blue-700">Contact</a></li>
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
              <div>{data.contacts.phones.join(' | ')}</div>
            </div>
            <div className="flex items-start gap-3">
              <FiMail className="w-5 h-5 text-blue-700 mt-1" />
              <a href={`mailto:${data.contacts.email}`} className="underline text-slate-700">{data.contacts.email}</a>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a href="#" className="text-slate-500 hover:text-blue-700"><FiFacebook className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-blue-700"><FiInstagram className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-blue-700"><FiLinkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
