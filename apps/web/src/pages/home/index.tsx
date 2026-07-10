/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navigation from '../../components/common/Navigation';
import Hero from './Hero';
import TrustedBy from './TrustedBy';
import Features from './Features';
import HowItWorks from './HowItWorks';
import WhoIsItFor from './WhoIsItFor';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import Footer from '../../components/common/Footer';

export default function Home() {
    return (
        <>
            <Navigation />
            <Hero />
            <TrustedBy />
            <Features />
            <HowItWorks />
            <WhoIsItFor />
            <Testimonials />
            <Pricing />
            <FAQ />
            <FinalCTA />
            <Footer />
        </>
    );
}
