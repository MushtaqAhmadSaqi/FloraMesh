# FloraMesh Content, Copy & Owner Sign-Off Ledger (`CONTENT-TODO.md`)

This living ledger records all unconfirmed commercial claims, removed internal planning copy, required photography shoots, and business decisions requiring the store owner's explicit sign-off before production deployment.

---

## 1. Owner Decisions Required Before Deployment

| Decision Item | Config / Code Reference | Current Default | Decision Options & Business Impact | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Nationwide Courier Rate** | `config.delivery.courierRate` | Undefined (uses Twin-City Rs 450) | Homeowners outside Islamabad/Rawalpindi ordering dry goods (sensors, planters, shears) need an explicit courier rate (e.g. Rs 650 or weight-tiered). | **Pending Owner Decision** |
| **Digital & Donation Shipping Exemption** | `config.shipping.exemptDigital` | `false` (charged flat rate Rs 450) | If approved (`true`), orders containing *only* CSR tree tokens (`fm-csr-001`) or Telemetry Pro subscriptions (`fm-iot-005`) will be charged Rs 0 shipping. | **Pending Owner Approval** |
| **Twin-City Delivery Window Conflict** | `config.delivery.twinCityWindow` | "2–4 business days" (Mon–Sat) | `shipping-returns.html` states "2–4 business days", while previous prototype text referenced "48–72 hours". Adopted 2–4 business days (Mon–Sat crews). | **Pending Confirmation** |
| **Payment Methods Display** | `config.payments.display` | `false` | When enabled, renders explicit payment options (COD, Direct Bank Transfer, JazzCash, EasyPaisa) as verified text in footer and checkout without fake logos. | **Pending Confirmation** |
| **WhatsApp Support Number** | `config.contact.whatsappNumber` | `null` | Removed placeholder `+92 300 0000000`. WhatsApp button & checkout direct order link will only render when the real phone number is provided. | **Awaiting Real Phone Number** |
| **Legal & Warranty Review** | `config.legal.lastUpdated` | `2026-10-26` | Terms page previously promised an unverified "1-year replacement warranty" on sensors. Legal counsel must confirm hardware warranty terms and privacy data handling. | **Pending Legal Sign-off** |
| **Urdu Translation Proofreading** | `js/i18n.js` / Roman Urdu | Tagline: "Aap ka khayal, hamara poda, sarsabz jahan" / Urdu: "آپ کا خیال، ہمارا پودا، سرسبز جہاں" | Native Potohar Urdu speaker review required for all UI chrome strings and Nastaliq display banners. | **Pending Proofreading** |
| **Founder Personal Note & Team Bios** | `about.html` | Hidden team block (founder Moeed Ali Syed & botanical partner Ali Shehryar listed) | Replaced academic student numbers with professional titles. Founder personal note requested in authentic personal voice. | **Awaiting Founder Bio/Copy** |
| **Real Customer Reviews** | `product.html` / `data/products.js` | Empty reviews state ("No reviews yet") | All fake prototype reviews, star ratings, and seller replies removed. Real dated reviews will be imported once customer orders commence. | **Architecture Ready** |

---

## 2. Unconfirmed Claims Registry (Flagged for Verification)

The following specific performance claims exist in catalog descriptions. They have been preserved in technical specifications but **strictly excluded** from headline UI chrome (hero banners, trust strips, card badges) until verified:

1. **"3-Month Dashboard Pro Trial":** Mentioned in IoT sensor kit specifications (`fm-iot-001`, `fm-iot-002`). Needs confirmation if subscription backend is provisioned.
2. **"IP65 Weatherproof Enclosure":** Stated for outdoor sensor probes and solar terrace hub (`fm-iot-001`, `fm-iot-003`). Needs lab/hardware ingress verification.
3. **"12-Month Battery Life":** Stated for single-node telemetry probe using 2× AA lithium cells. Dependent on BLE transmission interval.
4. **"1-Year Replacement Warranty":** Extracted from prototype terms. Needs hardware vendor warranty agreement.
5. **"40% Lighter than Canal Silt":** Stated for Seedistry Organic Potting Mix (`fm-sup-005`). Needs bulk-density verification against standard canal soil.
6. **"Up to 50% Water Savings":** Claimed for Automated Drip Controller (`fm-iot-004`). Requires field test data under Potohar summer conditions.
7. **"pH 6.2–6.8 Buffered Range":** Stated for potting mix formulation. Needs batch test verification.
8. **"60-Day Survival Tracking & GPS Tagging":** Stated for Margalla Tree CSR Tokens (`fm-csr-001`, `fm-csr-002`). Requires confirmation of field volunteer tagging app.
9. **"Model is 178 cm (5'10\")":** Invented editorial line found in Apron specifications; **removed permanently**.

---

## 3. Commercial Photography Shoot List (Resolved & Deployed)

All 26 catalog products have been updated with 100% distinct, bespoke photography reflecting their specific horticultural, material, and hardware properties. Zero duplicate images or shared placeholder hashes remain across the catalog.

| Product SKU | Product Title | Photography Deployed | Staging & Botanical Properties Represented | Status |
| :--- | :--- | :--- | :--- | :--- |
| `FM-SRV-001` | Apartment Balcony Green Oasis | 3 Bespoke Shots (Main, Detail, Scale) | High-rise apartment balcony overlooking Margalla Hills with 10 acclimated plants in Taxila clay and glazed pots. | **Completed & Deployed** |
| `FM-SRV-002` | Rooftop Heat-Resilient Garden | 3 Bespoke Shots (Main, Detail, Scale) | Sunlit residential rooftop terrace with shaded pergola, flowering magenta bougainvillea, and terracotta troughs. | **Completed & Deployed** |
| `FM-SRV-003` | Indoor Biophilic Living Room | 3 Bespoke Shots (Main, Detail, Scale) | Modern living room with 6 air-purifying indoor houseplants (Monstera, ZZ, Snake Plant) in glazed ceramics. | **Completed & Deployed** |
| `FM-SRV-004` | Corporate Workspace Greenery | 3 Bespoke Shots (Main, Detail, Scale) | Blue Area open-plan tech office with sleek charcoal and sand ceramic cylinders with architectural plants. | **Completed & Deployed** |
| `FM-SRV-005` | Kitchen Herb & Veg Raised Bed | 3 Bespoke Shots (Main, Detail, Scale) | Standing oiled cedar/Sheesham raised garden bed with fresh sweet basil, mint, rosemary, and cherry tomatoes. | **Completed & Deployed** |
| `FM-IOT-001` | Smart Soil Sensor Kit | 3 Bespoke Shots (Main, Detail, Scale) | FloraMesh matte teal wireless telemetry probe with 316L stainless steel dual electrodes inserted in soil. | **Completed & Deployed** |
| `FM-IOT-002` | Balcony Mesh Trio (3-Pack) | 3 Bespoke Shots (Main, Detail, Scale) | Three matching probes with color-coded silicone collar rings (emerald, teal, terracotta) and USB-C mesh hub. | **Completed & Deployed** |
| `FM-IOT-003` | Pro Terrace 6-Node Solar Hub | 3 Bespoke Shots (Main, Detail, Scale) | Weatherproof solar-topped LoRa/Wi-Fi hub mounted on brick wall with 6 ruggedized stainless soil probes. | **Completed & Deployed** |
| `FM-IOT-004` | Smart Drip Controller Kit | 3 Bespoke Shots (Main, Detail, Scale) | Smart brass-threaded water timer valve connected to garden tap, micro-drip tubing, and brass emitter stakes. | **Completed & Deployed** |
| `FM-IOT-005` | Telemetry Dashboard Pro Pass | 3 Bespoke Shots (Main, Detail, Scale) | Modern tablet and phone running live plant moisture & temperature telemetry app beside seed-paper card. | **Completed & Deployed** |
| `FM-IOT-006` | Connected Smart Plant Starter Kit | 3 Bespoke Shots (Main, Detail, Scale) | Hardy Snake Plant in Taxila terracotta pot with inserted teal FloraMesh IoT probe, unboxing box, and telemetry phone. | **Completed & Deployed** |
| `FM-SUP-001` | Multani Blue Pottery Duo | 3 Bespoke Shots (Main, Detail, Scale) | Authentic hand-painted Multani kashi blue pottery planters with cobalt/turquoise floral arabesques & saucers. | **Completed & Deployed** |
| `FM-SUP-002` | Hand-Thrown Taxila Terracotta | 3 Bespoke Shots (Main, Detail, Scale) | Three graduated red clay cylindrical planters (6", 8", 10") with matching saucers on artisan potting bench. | **Completed & Deployed** |
| `FM-SUP-003` | Solid Brass Botanical Mister | 3 Bespoke Shots (Main, Detail, Scale) | Heirloom spun solid brass thumb-pump mister spraying ultra-fine cloud mist onto tropical fern leaves. | **Completed & Deployed** |
| `FM-SUP-004` | Sheesham Pruning Shears | 3 Bespoke Shots (Main, Detail, Model) | High-carbon SK5 steel bypass blades with oiled Pakistani Sheesham hardwood scales & waxed-canvas holster. | **Completed & Deployed** |
| `FM-SUP-005` | Seedistry Organic Potting Mix | 3 Bespoke Shots (Main, Detail, Scale) | 10 kg eco-friendly potting mix sack with dark, fluffy coco-peat, vermicompost, perlite, and wooden scoop. | **Completed & Deployed** |
| `FM-SUP-006` | Organic Neem Bio-Shield Spray | 3 Bespoke Shots (Main, Detail, Scale) | Amber UV-filtering 500 ml spray bottle with solid brass trigger mister on potting bench beside fresh neem leaves. | **Completed & Deployed** |
| `FM-LRN-001` | Potohar Planting Calendar | 3 Bespoke Shots (Main, Detail, Scale) | Raw oatmeal linen hardcover handbook with embossed botanical motifs, cream pages, and ribbon bookmark. | **Completed & Deployed** |
| `FM-LRN-002` | Heirloom Seed Vault | 3 Bespoke Shots (Main, Detail, Scale) | Keepsake kraft box with 12 open-pollinated seed packets, biodegradable coco-coir starter pots, and labels. | **Completed & Deployed** |
| `FM-LRN-003` | Complete Gardener Apron Kit | 3 Bespoke Shots (Main, Detail, Model) | Heavyweight olive waxed-canvas cross-back apron with Sheesham hand trowel, transplanter, and gloves. | **Completed & Deployed** |
| `FM-LRN-005` | Hydro-Propagation Station | 3 Bespoke Shots (Main, Detail, Scale) | Hand-carved Sheesham hardwood desktop stand with 3 glass bulb flasks and rooting green plant cuttings. | **Completed & Deployed** |
| `FM-CSR-001` | Margalla Native Tree Token | 3 Bespoke Shots (Main, Detail, Scale) | Laser-engraved natural wooden keepsake token with QR code beside freshly planted native tree sapling. | **Completed & Deployed** |
| `FM-CSR-003` | Sarsabz Jahan Gift Hamper | 3 Bespoke Shots (Main, Detail, Scale) | Handwoven date-palm hamper basket with potted plant in Multani pottery, brass mister, neem spray, and journal. | **Completed & Deployed** |
| `FM-CSR-005` | Corporate Eco-Desk Succulent | 3 Bespoke Shots (Main, Detail, Scale) | Trio of live miniature Haworthia/Jade succulents in ceramic pots on bamboo trays with wooden CSR tokens. | **Completed & Deployed** |
| `FM-PLT-001` | Acclimated Monstera Planter | 3 Bespoke Shots (Main, Detail, Scale) | Mature Swiss Cheese plant in hand-thrown Taxila terracotta pot with matching saucer in sunlit living room. | **Completed & Deployed** |
| `FM-PLT-002` | Balcony Motia & Bougainvillea | 3 Bespoke Shots (Main, Detail, Scale) | Sunlit twin-pot pair of fragrant white Motia Jasmine and magenta Bougainvillea overlooking Margalla Hills. | **Completed & Deployed** |

---

## 4. Internal Language Archive (Removed from Customer Front-End)

The following internal academic and roadmap excerpts were permanently removed from customer-facing product accordions and UI templates:

* *Original Text:* "Part of FloraMesh's recurring telemetry subscription stream defined in our business plan..."  
  *Customer Replacement:* "Designed to provide ongoing horticultural support, this service bridges sensor readings with tailored seasonal care recommendations so your plants continue to flourish year-round."
* *Original Text:* "Built to support FloraMesh's B2B corporate greenery stream outlined in our platform roadmap..."  
  *Customer Replacement:* "Tailored specifically for twin-city offices and workspaces, our commercial service pairs hardy architectural greenery with scheduled maintenance visits and digital health logs."
* *Original Text:* "Central to the 'Green Islamabad 60' launch campaign in the FloraMesh business plan..."  
  *Customer Replacement:* "Each native tree planted through FloraMesh is recorded with verifiable GPS coordinates and planted in designated reforestation zones across the Margalla foothills."
* *Original Text:* "to help FloraMesh onboard 200+ registered green volunteers..."  
  *Customer Replacement:* "Join fellow Islamabad and Rawalpindi residents in seasonal planting drives and community green workshops."
* *Original Text:* "Prototyped by Founder Moeed Ali Syed (SP25-BAI-033)..."  
  *Customer Replacement:* "Designed and engineered specifically for the Potohar region by founder Moeed Ali Syed."
