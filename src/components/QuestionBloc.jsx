import { Mail, Volleyball } from 'lucide-react'
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
        <a href={`mailto:${CONTACT.email}`} className="btn mt-5 !bg-brand-dark">
          <Mail size={15} /> Contactez notre équipe
        </a>
      </div>
    </section>
  )
}
