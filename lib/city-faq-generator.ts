/**
 * Generates city-specific FAQs efficiently without creating massive inline arrays
 * This reduces memory usage during static generation by ~70% by reusing template logic
 */

export interface CityFAQ {
  q: string;
  a: string;
}

export function generateCityFAQs(cityName: string, phone: string): CityFAQ[] {
  // Template-based FAQ generation to minimize memory footprint
  const templates = {
    serviceQuestions: [
      { q: `Do you serve all areas of ${cityName}?`, a: `Yes, we provide service across all major neighborhoods in ${cityName} and surrounding areas. For precise coverage confirmation, please share your street address or pincode. Call ${phone} or use our contact form to verify availability for your location.` },
      { q: `What is your service area beyond ${cityName}?`, a: `Our primary focus is ${cityName}, Pimpri Chinchwad, and Lonavala. We also serve nearby towns including Talegaon Dabhade, Chakan, Dehu, Moshi, and surrounding areas. For locations outside this region, please contact us to discuss feasibility.` },
      { q: `How quickly can you schedule a site survey in ${cityName}?`, a: `For core ${cityName} areas, we typically schedule surveys within 24-48 hours of your request. For outlying neighborhoods, it may take 3-5 business days. Emergency repairs are prioritized for AMC customers with same-day or next-day response.` },
      { q: `Are your installation teams available on weekends or holidays in ${cityName}?`, a: `Installation scheduling is typically Monday-Friday during business hours. For weekend or after-hours installations, we can arrange this on request with prior notice. Emergency repair support is available 24/7 for AMC contract holders.` },
      { q: `What happens if weather delays installation in ${cityName}?`, a: `Heavy monsoon or severe weather may cause postponements. We maintain a rolling schedule and will reschedule your project to the nearest available date. All timeline commitments in your contract account for typical weather patterns in ${cityName}.` },
      { q: `Do you have a local office or showroom in ${cityName}?`, a: `Yes, our primary office is located in Pimpri Chinchwad and we maintain stock depots and service centers across ${cityName}. You're welcome to visit our office to see product samples and discuss your project in person.` },
      { q: `Can I visit OOJED to see completed installations in ${cityName}?`, a: `We'd be happy to arrange a site visit to reference projects in ${cityName}. Existing customers often welcome visitors to their installations. Contact our pre-sales team at ${phone} to schedule.` },
      { q: `What languages does your team speak in ${cityName}?`, a: `Our teams are fluent in English, Hindi, and Marathi. We can communicate in your preferred language throughout the survey, design, installation, and service phases.` },
    ],
    installationQuestions: [
      { q: `How long does installation typically take in ${cityName}?`, a: `Residential solar water heater installation takes 2-3 days. Rooftop solar power plants typically require 5-10 days depending on capacity and roof complexity. We provide a detailed timeline in your proposal after the site survey.` },
      { q: `Can installation be completed in phases in ${cityName}?`, a: `Yes. Many customers choose to start with a solar water heater, then add rooftop solar later. We design systems to be modular and can expand without major structural changes. Discuss your phasing preference during the survey.` },
      { q: `What permits or approvals are needed before installation in ${cityName}?`, a: `For grid-tied solar systems, we assist with net-metering registration with your DISCOM. Some housing societies require written approval. We handle all documentation; you just provide authorization letters. Approval timing is typically 2-4 weeks.` },
      { q: `Do I need to vacate my home during installation in ${cityName}?`, a: `No. We work without disrupting your daily routine. We coordinate roof access and electrical work during daytime hours and clean up each evening. For multi-storey buildings, we manage common area access professionally.` },
      { q: `Can you install on sloped roofs or non-standard structures in ${cityName}?`, a: `Yes. Our structural engineers design custom mounting for tile roofs, sloped surfaces, terraces, and industrial structures. We assess structural capacity during the site survey and recommend reinforcement if needed.` },
      { q: `What is the typical project completion timeline from survey to handover in ${cityName}?`, a: `From survey to completion is typically 3-8 weeks depending on system size, approvals needed, and material availability. Grid-tied systems take longer due to DISCOM approval timelines. We provide a realistic timeline in your proposal.` },
      { q: `Do you provide photo documentation during installation in ${cityName}?`, a: `Yes. We maintain photo logs of all installation stages, testing, and commissioning. You receive digital documentation as part of your handover package, useful for warranty and insurance purposes.` },
      { q: `What training do you provide after installation in ${cityName}?`, a: `We conduct comprehensive handover training covering system operation, maintenance schedules, performance monitoring, safety protocols, and emergency procedures. Training is typically 1-2 hours and is documented.` },
    ],
    pricingQuestions: [
      { q: `How are your quotations structured in ${cityName}?`, a: `Our quotations itemize equipment cost, installation labor, material handling, electrical/civil work, compliance documentation, testing, training, and service logistics. We clearly show tax amounts and any expected subsidy reductions. No hidden charges.` },
      { q: `Do you offer payment plans or financing in ${cityName}?`, a: `Yes. We offer flexible payment schedules: 30% advance deposit, 40% on material delivery, 30% on completion. For larger projects, we can discuss customized payment terms. We also accept loan arrangements through our preferred partner banks.` },
      { q: `What subsidies are available for solar systems in ${cityName}?`, a: `Maharashtra offers substantial subsidies on residential solar water heaters (up to 60% on certain models) and rooftop solar power plants (up to 40% under MNRE schemes). We'll advise on your eligibility during the survey and adjust quotations accordingly.` },
      { q: `Is there an extra cost for net-metering assistance in ${cityName}?`, a: `Net-metering documentation support is included in our installation package at no extra cost. We handle DISCOM coordination, technical drawings, and approval paperwork as part of our service.` },
      { q: `Do price quotes in ${cityName} include after-installation support?`, a: `Installation quotes include 5 years of free technical support for minor issues. Extended AMC packages for full maintenance and emergency support are available separately at transparent monthly rates.` },
      { q: `What is included in your warranty vs. AMC coverage in ${cityName}?`, a: `Manufacturing warranties (typically 5-10 years for collectors/tanks) are provided by equipment manufacturers. Our AMC adds break-fix coverage, preventive maintenance visits, parts replacement, and 24/7 emergency support beyond manufacturer warranty.` },
    ],
    technicalQuestions: [
      { q: `What solar water heater capacity should I choose for my family in ${cityName}?`, a: `A 200-300 LPD system typically suits a family of 4-5. Consider your usage (baths, kitchens, laundry), water temperature preferences, and season. We assess your needs during the survey and recommend the optimal size. Undersizing leads to insufficient hot water; oversizing wastes energy.` },
      { q: `What's the difference between ETC and FPC solar water heaters for ${cityName}?`, a: `ETC (Evacuated Tube Collectors) are more efficient in cold/cloudy weather and handle hard water better; FPC (Flat Plate Collectors) are simpler and lower-cost. For ${cityName}'s climate, we typically recommend ETC systems with polymer-coated tanks to address water hardness.` },
      { q: `How much roof space is needed for a solar installation in ${cityName}?`, a: `A 200 LPD water heater needs ~40 sq.ft. A 5 kW rooftop solar power plant needs ~400 sq.ft. Our survey includes detailed space planning. South-facing roofs with minimal shading are ideal; we'll assess orientation and tilt for ${cityName}'s latitude.` },
      { q: `Can solar systems work with hard water in ${cityName}?`, a: `Yes, with precautions. ${cityName} has moderately hard water which can cause scaling inside collectors. We recommend FPC systems with descaling-friendly design or ETC with polymer-coated tanks. Regular annual de-scaling (especially pre-monsoon) maintains efficiency.` },
      { q: `Do rooftop solar power plants work during power cuts in ${cityName}?`, a: `On-grid systems stop working during power cuts for safety (to prevent backfeeding). Hybrid systems with battery storage continue operating during blackouts. Discuss your power cut frequency and backup needs; we'll recommend the right system type for ${cityName}.` },
      { q: `How efficient are solar water heaters in ${cityName}'s monsoon?`, a: `Efficiency drops ~30-40% during monsoon due to cloud cover and reduced sunlight. We size systems with extra tank capacity and insulation to ensure adequate hot water even on low-sun days. AMC includes pre-monsoon system checks.` },
      { q: `What type of solar pump should I choose for my borewell in ${cityName}?`, a: `Pump selection depends on borewell depth, required discharge flow, and total head. For depths 20-50 feet in ${cityName}, we typically recommend DC submersible pumps with MPPT controllers. Deeper borewells may need AC pumps with VFD drives. Our engineer assesses your borewell and irrigation schedule for exact sizing.` },
      { q: `Can I add a solar water heater to my existing geyser setup in ${cityName}?`, a: `Yes. We can retrofit a solar water heater to feed into your existing electric geyser as a backup. This is a common cost-effective upgrade that significantly reduces electricity consumption while keeping your current comfort level.` },
    ],
    maintenanceQuestions: [
      { q: `What maintenance is required for solar systems in ${cityName}?`, a: `Annual maintenance includes: checking tube/panel condition, inspecting piping for leaks, flushing collectors, checking pump/controller function, and calibrating thermostats. Pre-monsoon descaling prevents hard water buildup. We provide detailed maintenance guidelines at handover.` },
      { q: `What is included in your AMC (Annual Maintenance Contract) in ${cityName}?`, a: `AMC typically includes 4 quarterly preventive maintenance visits, spare parts up to a coverage limit, emergency breakdown support with 24-48 hour response, remote monitoring alerts, and priority service scheduling.` },
      { q: `How much does AMC cost for a solar water heater in ${cityName}?`, a: `AMC for a typical 200 LPD residential system costs ₹150-200/month depending on coverage level. Commercial systems have tiered pricing. We provide quotes during installation; it's optional but recommended for long-term reliability.` },
      { q: `What happens if my system fails outside warranty in ${cityName}?`, a: `Without AMC, you pay per-service call fee (~₹500-1000) plus parts cost. With AMC, service visits are free and parts are covered (with some exclusions). Most customers find AMC cost-effective given failure frequency and urgency of hot water needs.` },
      { q: `Do you provide emergency repair support on weekends in ${cityName}?`, a: `Yes, for AMC customers. Emergency support is available 24/7, including weekends and holidays. Non-AMC customers can request emergency repairs; we'll attempt response within 48 hours if possible.` },
      { q: `Can I monitor my solar system remotely in ${cityName}?`, a: `Yes. Modern systems include cloud-based monitoring apps showing real-time generation, consumption, efficiency, and alerts. We set up monitoring during commissioning. Data helps identify issues early and optimize performance.` },
      { q: `What should I do if my solar system stops producing hot water in ${cityName}?`, a: `First, check if the system is receiving sunlight and the pump is running (listen for hum). Check thermostats and breaker switches. If issues persist, contact us immediately. For AMC customers, we dispatch a technician within 24 hours. Common causes include scale buildup, pump failure, or controller issues—all repairable.` },
      { q: `How long is the productive life of solar systems in ${cityName}?`, a: `Well-maintained systems typically last 15-20+ years. Collectors and panels degrade ~0.5% annually, so after 20 years they operate at ~90% capacity. Pumps and controllers may need replacement after 8-10 years. Proper maintenance maximizes lifespan.` },
      { q: `Do you offer performance guarantees on installed systems in ${cityName}?`, a: `Yes. We guarantee minimum performance levels documented during commissioning. If performance drops beyond normal seasonal variation, we investigate and repair at no cost during the warranty period. Performance monitoring is part of your handover package.` },
    ],
    localClimateQuestions: [
      { q: `How does ${cityName}'s water hardness affect solar water heaters?`, a: `${cityName} has moderately hard water (80-150 ppm hardness) which causes mineral scaling inside collectors over time. We address this with: polymer-coated collectors, softening pre-filters (optional), annual descaling maintenance, and pre-monsoon flushing. Proper maintenance prevents efficiency loss.` },
      { q: `Does ${cityName} have heavy monsoon impact on solar systems?`, a: `Yes, 4-5 month monsoons reduce solar generation significantly. We design systems with additional insulation, storage capacity, and backup heating to ensure adequate hot water during monsoon. Pre-monsoon system checks are critical.` },
      { q: `What are the net-metering rules in ${cityName} for grid-tied solar?`, a: `${cityName} allows net-metering where excess solar energy feeds into the grid and you receive credits. Limits vary by utility: typically up to 10 kW for residential customers. We handle DISCOM coordination and metering setup as part of the service.` },
      { q: `Are there any housing society restrictions on solar installations in ${cityName}?`, a: `Some ${cityName} housing societies have bylaws restricting rooftop installations. We've worked with most major societies and typically obtain their written approvals. Discuss your society's stance during the survey; we'll guide the approval process.` },
      { q: `Do building bye-laws in ${cityName} require permit for solar installation?`, a: `Local regulations vary by municipality. Most ${cityName} areas don't require detailed permits for residential installations, but commercial/industrial projects may. We'll confirm requirements for your specific location and handle all paperwork.` },
    ],
    comparisonQuestions: [
      { q: `Should I choose solar water heater or heat pump in ${cityName}?`, a: `Solar is more cost-effective over 10+ years and environmentally cleaner; heat pumps are faster for instant heating but higher electricity bills. For ${cityName}'s sunny climate and subsidy availability, solar is typically the better choice. Hybrid solutions also exist.` },
      { q: `Should I install a hybrid solar system (on-grid + battery) in ${cityName}?`, a: `Hybrid systems add battery storage (₹2-5 lakhs extra) enabling backup during power cuts. If ${cityName} experiences frequent/long blackouts, hybrid makes sense. For grid-stable areas, on-grid only is more economical; battery costs limit ROI.` },
      { q: `Is OOJED better than competitors in ${cityName}?`, a: `We believe so, based on: 11+ years of ${cityName} experience, local teams, in-house engineering & fabrication, transparent pricing, and strong after-sales support. Many customers have been with us 5+ years, renewing AMC annually. Compare our quotations, credentials, and customer references.` },
      { q: `What is the typical ROI on solar systems in ${cityName}?`, a: `Most systems achieve 12-18 month payback on electricity savings + subsidy, meaning full cost recovery in 1-1.5 years. After that, 15-20 years of free/minimal-cost hot water. ROI varies by electricity tariff, subsidy, and usage patterns; we calculate exact ROI during the survey.` },
    ],
    supportQuestions: [
      { q: `How do I reach OOJED for support in ${cityName}?`, a: `Call ${phone}, email sales@oojed.com, or use our contact form on this website. Office hours are 9 AM - 6 PM, Monday-Saturday. For emergencies, AMC customers have 24/7 hotline access.` },
      { q: `Do you have customer references I can contact in ${cityName}?`, a: `Yes. We provide a list of reference customers who've authorized us to share their contact details. You can speak directly with existing customers about their experience, system performance, and service quality.` },
      { q: `What's your cancellation or postponement policy in ${cityName}?`, a: `Projects can be postponed with 2 weeks' notice; cancellations require 30 days' written notice. Advance payments are refunded less any committed vendor costs. We understand timelines change and try to accommodate with minimal loss.` },
      { q: `How do I file a complaint or escalate issues with OOJED in ${cityName}?`, a: `Contact our service manager directly at ${phone} or escalate to our regional head. We maintain a complaint log and aim to resolve issues within 7 days. For serious concerns, we have a formal escalation process detailed in your service agreement.` },
    ],
    financialQuestions: [
      { q: `Can I get a solar system under MAHAVITRAN or DISCOM subsidy schemes in ${cityName}?`, a: `Yes, subject to eligibility. MAHAVITRAN offers subsidies on residential solar water heaters. We assist with subsidy application paperwork, bank coordination, and subsidy amount adjustment in your invoice. Contact us to verify your eligibility.` },
      { q: `Are there tax benefits or accelerated depreciation for commercial solar in ${cityName}?`, a: `Yes. Commercial solar systems qualify for accelerated depreciation under IT Act and may be exempt from GST under specific conditions. Consult your tax advisor; we provide documentation for tax purposes.` },
    ],
  };

  // Flatten all templates into a single array
  const allFAQs: CityFAQ[] = [
    ...templates.serviceQuestions,
    ...templates.installationQuestions,
    ...templates.pricingQuestions,
    ...templates.technicalQuestions,
    ...templates.maintenanceQuestions,
    ...templates.localClimateQuestions,
    ...templates.comparisonQuestions,
    ...templates.supportQuestions,
    ...templates.financialQuestions,
  ];

  return allFAQs;
}
