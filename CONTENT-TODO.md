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

## 3. Commercial Photography Shoot List

Multiple products currently point to shared generic imagery keys (`watermarked_img_...`). While no visible watermarks are present on the cropped assets, the following bespoke photography shoots are scheduled:

| Product SKU | Product Title | Photography Required | Recommended Staging / Location |
| :--- | :--- | :--- | :--- |
| `FM-SRV-001` | Apartment Balcony Green Oasis | 3 Distinct Shots: Full Balcony (40–60 sq ft), Planter Grouping, Soil Sensor in pot | Real high-rise apartment balcony in Sector F-10 or F-11 overlooking Margallas. |
| `FM-SRV-002` | Rooftop Heat-Resilient Garden | 3 Distinct Shots: Wide Terrace, Shaded Pergola arrangement, Heat-hardy Bougainvillea | Residential rooftop terrace in Rawalpindi / Bahria Town. |
| `FM-SRV-004` | Corporate Workspace Greenery | 3 Distinct Shots: Reception Living Wall, Conference Desk Planters, Executive Study | Tech office in Blue Area, Islamabad. |
| `FM-IOT-001` | Smart Soil Sensor Kit | 3 Distinct Shots: Probe in soil closeup, Enclosure disassembled, Phone telemetry pairing | Studio macro photography on terracotta background. |
| `FM-IOT-003` | Pro Terrace 6-Node Solar Hub | 3 Distinct Shots: Solar panel mounting, 6 probes arrayed, Weather-sealed gateway | Bright sunlit terrace setting. |
| `FM-SUP-001` | Multani Blue Pottery Planter Duo | 3 Distinct Shots: Glaze detail, Matching saucers, Potted with lush foliage | Natural morning sunlight against textured lime-plaster wall. |
| `FM-SUP-002` | Hand-Thrown Taxila Terracotta Set | 3 Distinct Shots: Graduated cylinder trio, Drainage rim detail, Patina texture | Artisan potter studio setting in Taxila corridor. |
| `FM-SUP-004` | Wazirabad Bypass Pruning Shears | 3 Distinct Shots: Sheesham handle grain, Leather holster, Action branch cut | Studio bench with raw wood and leather textures. |
| `FM-CSR-001` | Margalla Native Tree CSR Token | 3 Distinct Shots: Planting sapling in ground, QR verification card, Wood keepsake token | Margalla Foothills Trail 3 / Trail 5 conservation zone. |
| `FM-CSR-003` | 'Sarsabz Jahan' Gift Hamper | 3 Distinct Shots: Open hamper contents, Kraft wrap with jute ribbon, Gift note in reed box | Festive table setting with botanical accents. |

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
