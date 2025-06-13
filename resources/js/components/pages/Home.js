import { Header } from "./HomeComponents/Header";
import { Banner } from "./HomeComponents/Banner";
import { CounterSection } from "./HomeComponents/CounterSection";
import { GlobalPayment } from "./HomeComponents/GlobalPayment";
import { OurSolutions } from "./HomeComponents/OurSolutions";

import { HowItWorks } from "./HomeComponents/HowItWorks";
import { AppDownload } from "./HomeComponents/AppDownload";
import { Testimonials } from "./HomeComponents/Testimonials";
import { FAQs } from "./HomeComponents/FAQs";
import { Footer } from "./HomeComponents/Footer";


export default function Home() {
    return (
        <>
            <Header />
            <Banner />
            <AppDownload />
            <Footer />
            {/* <CounterSection />
            <GlobalPayment />
            <OurSolutions />
            <HowItWorks />
            <AppDownload />
            <Testimonials />
            <FAQs />
            <Footer /> */}
        </>
    );
}