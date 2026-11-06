import { Hero } from '../components/sections/Hero'
import { BenefitsBar } from '../components/sections/BenefitsBar'
import { WhyDekic } from '../components/sections/WhyDekic'
import { Steps } from '../components/sections/Steps'
import { ContactCta, DamageReportTeaser, ServiceArea, Services } from '../components/sections/HomeSections'

/* Reihenfolge Hero → Vorteile → Warum Dekic → 3 Schritte entspricht exakt der Vorlage. */
export default function Home() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <WhyDekic />
      <Steps />
      <DamageReportTeaser />
      <Services />
      <ServiceArea />
      <ContactCta />
    </>
  )
}
