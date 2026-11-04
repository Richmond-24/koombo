import KoomboHero from './components/KoomboHero'
import PartnerPage from './components/PartnerPage'
import Faq from './components/Faq'
import Banner from './components/Banner'
import SellerPage from './components/SellerPage'
import KoomboRider from './components/KoomboRider'
import KoomboConnector from './components/KoomboConnector'
import Footer from './components/Footer'
import Display from './components/Display'
import KoomboBonaza from './components/koomboBonaza'
export default function Home() {
  return (
    <div>
      <KoomboHero />
      <PartnerPage />
      <SellerPage />
      <Banner />
      <KoomboRider />
      <KoomboConnector />
      <Faq />
      <Display />
      <KoomboBonaza/>
      <Footer /> 
    </div>
  )
}
