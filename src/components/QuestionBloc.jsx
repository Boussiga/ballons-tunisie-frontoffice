import { Mail, Phone, Volleyball } from 'lucide-react'
import { CONTACT } from '../config'

// "Une question ?" block shown at the bottom of the catalogue and offers pages
export default function QuestionBloc() {
  return (
    <section className="mx-auto mt-16 max-w-[1216px] px-4 sm:px-11">
      <div className="rounded-3xl bg-panel px-6 py-12 text-center">
        <Volleyball className="mx-auto text-brand-dark" size={30} />
        <h2 className="mt-3 font-display text-2xl font-semibold uppercase text-ink">Une question ou un conseil sur nos ballons ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          Nous vous conseillons avec plaisir sur la taille et le modèle le plus adapté à votre pratique sportive ou à votre club.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className="btn !bg-brand-dark">
            <Phone size={15} /> {CONTACT.telephone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="label inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-ink shadow-sm hover:text-brand-dark">
            <Mail size={15} /> Écrire à notre équipe
          </a>
        </div>
      </div>
    </section>
  )
}
