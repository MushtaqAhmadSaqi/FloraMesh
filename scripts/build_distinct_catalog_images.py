import os
import hashlib
from PIL import Image, ImageEnhance, ImageFilter

ARTIFACT_DIR = r'C:\Users\Miraan gee\.gemini\antigravity-ide\brain\7ece9fe2-359d-4bc9-83bf-9cd0c82a3070'
PROD_DIR = r'assets\images\products'
TARGET_W, TARGET_H = 600, 750
TARGET_ASPECT = TARGET_W / TARGET_H

def crop_and_resize(img, crop_box=None):
    """Crops a region (or center) and resizes to 600x750."""
    if crop_box:
        # crop_box is (left_ratio, top_ratio, width_ratio, height_ratio)
        w, h = img.size
        l = int(crop_box[0] * w)
        t = int(crop_box[1] * h)
        box_w = int(crop_box[2] * w)
        box_h = int(crop_box[3] * h)
        img = img.crop((l, t, l + box_w, t + box_h))
    
    w, h = img.size
    aspect = w / h
    if aspect > TARGET_ASPECT:
        new_w = int(h * TARGET_ASPECT)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / TARGET_ASPECT)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
        
    return img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

def save_webp(img, filename, quality=90):
    dest = os.path.join(PROD_DIR, filename)
    img.save(dest, 'WEBP', quality=quality)
    size = os.path.getsize(dest)
    print(f"Saved {filename:55} ({size} bytes)")

def process_generated_trios():
    """Generates unique main, detail, and scale images from the high-res generated assets."""
    specs = {
        'apartment-balcony-green-oasis-package': {
            'src': 'balcony_oasis_main_1793101498902.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.1, 0.45, 0.6, 0.5), # Macro zoom on potted Monstera and terracotta pots
            'scale_crop': (0.0, 0.1, 0.9, 0.8)   # Wider view showing high-rise balcony & Margalla hills
        },
        'rooftop-terrace-pergola-garden-setup': {
            'src': 'rooftop_terrace_main_1793101529200.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.15, 0.05, 0.7, 0.45), # Zoom on magenta bougainvillea and pergola beams
            'scale_crop': (0.0, 0.35, 1.0, 0.65)   # Wide lounge seating and terrace planters
        },
        'indoor-biophilic-living-room-styling': {
            'src': 'indoor_biophilic_main_1793101562175.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.0, 0.35, 0.55, 0.6), # Macro on Monstera and peace lily in glazed ceramics
            'scale_crop': (0.2, 0.1, 0.8, 0.8)    # Full lounge with couch, window, and plants
        },
        'corporate-office-greenery-maintenance-plan': {
            'src': 'corporate_office_main_1793101599776.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.05, 0.55, 0.5, 0.45), # Macro on charcoal cylinder planters and snake plant
            'scale_crop': (0.1, 0.1, 0.9, 0.75)   # Open office desks and glass boardroom
        },
        'kitchen-herb-vegetable-raised-bed-service': {
            'src': 'kitchen_herb_raised_bed_1793101640141.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.2, 0.18, 0.65, 0.5), # Close-up of basil and cherry tomatoes on vine
            'scale_crop': (0.05, 0.05, 0.9, 0.9)   # Standing wooden bed on sunny courtyard patio
        },
        'floramesh-smart-soil-sensor-single': {
            'src': 'smart_soil_sensor_single_1793101686552.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.35, 0.15, 0.45, 0.65), # Tight macro on FloraMesh sensor head & prongs in soil
            'scale_crop': (0.1, 0.2, 0.85, 0.75)   # Plant pot in botanical room
        },
        'floramesh-balcony-mesh-trio': {
            'src': 'balcony_mesh_trio_1793101738087.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.05, 0.35, 0.65, 0.45), # Close-up of 3 color-coded silicone collar rings
            'scale_crop': (0.35, 0.4, 0.65, 0.55)   # USB-C mesh receiver hub and desk context
        },
        'floramesh-pro-terrace-station': {
            'src': 'pro_terrace_station_1793101789731.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.15, 0.15, 0.65, 0.45), # Close-up of solar panel, antenna, and IP66 casing
            'scale_crop': (0.1, 0.45, 0.75, 0.55)   # 6 rugged stainless probes mounted on brick wall
        },
        'floramesh-smart-drip-controller': {
            'src': 'smart_drip_controller_1793101849671.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.55, 0.5, 0.45, 0.45), # Close-up of brass drip emitter watering soil
            'scale_crop': (0.05, 0.05, 0.55, 0.6)   # Smart digital timer attached to brass garden spigot
        },
        'floramesh-telemetry-dashboard-annual': {
            'src': 'telemetry_dashboard_pro_1793101911747.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.08, 0.42, 0.52, 0.4), # Tight zoom on live telemetry graphs (54% & 72%)
            'scale_crop': (0.45, 0.65, 0.52, 0.35)  # Seed-paper activation card and mobile app
        },
        'multani-blue-pottery-planter-duo': {
            'src': 'multani_pottery_duo_1793101434973.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.1, 0.48, 0.45, 0.48), # Macro zoom on hand-painted cobalt kashi glaze
            'scale_crop': (0.05, 0.1, 0.9, 0.85)   # Full duo with tropical foliage on linen table
        },
        'taxila-terracotta-breathable-pot-set': {
            'src': 'taxila_terracotta_set_1793101979876.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.1, 0.6, 0.45, 0.38), # Close-up on unglazed red clay texture and rim
            'scale_crop': (0.2, 0.3, 0.7, 0.65)   # 3 graduated pots with fern on artisan potting bench
        },
        'solid-brass-plant-mister': {
            'src': 'solid_brass_mister_1793102049914.jpg',
            'main_crop': (0.0, 0.0, 1.0, 1.0),
            'detail_crop': (0.45, 0.4, 0.45, 0.5), # Macro on polished solid brass body & thumb plunger
            'scale_crop': (0.15, 0.2, 0.75, 0.6)   # Fine mist spraying on delicate fern by window
        }
    }

    for slug, cfg in specs.items():
        src_path = os.path.join(ARTIFACT_DIR, cfg['src'])
        if not os.path.exists(src_path):
            print(f"Skipping {slug}: missing source {src_path}")
            continue
        with Image.open(src_path) as raw:
            # 1. Main
            main_img = crop_and_resize(raw, cfg['main_crop'])
            save_webp(main_img, f"{slug}-main.webp")
            
            # 2. Detail
            detail_img = crop_and_resize(raw, cfg['detail_crop'])
            save_webp(detail_img, f"{slug}-detail.webp")
            
            # 3. Scale
            scale_img = crop_and_resize(raw, cfg['scale_crop'])
            save_webp(scale_img, f"{slug}-scale.webp")

def process_curated_products():
    """Processes and un-duplicates the remaining 12 products using authentic product imagery."""
    # 1. Sheesham Wood Pruning Shears (FM-SUP-004)
    # Model shot is the shears in hand/holster, detail is the blade and wood grain close-up
    model_path = os.path.join(PROD_DIR, 'sheesham-wood-pruning-shears-model.webp')
    detail_path = os.path.join(PROD_DIR, 'sheesham-wood-pruning-shears-detail.webp')
    with Image.open(model_path) as m_img:
        # Make main a sharp, beautiful representation from model
        main_img = crop_and_resize(m_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'sheesham-wood-pruning-shears-main.webp')

    # 2. Complete Urban Gardener Apron (FM-LRN-003)
    # Model shot is the gardener wearing the apron with tools in pockets
    apron_model_path = os.path.join(PROD_DIR, 'urban-gardener-apron-tool-kit-model.webp')
    with Image.open(apron_model_path) as a_img:
        main_img = crop_and_resize(a_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'urban-gardener-apron-tool-kit-main.webp')

    # 3. Citronella Balcony Candle in Clay Vessel (FM-CSR-004)
    # detail is the actual candle in the clay vessel
    candle_detail_path = os.path.join(PROD_DIR, 'citronella-terracotta-balcony-candle-detail.webp')
    with Image.open(candle_detail_path) as c_img:
        # Make main a beautifully centered view of the candle
        main_img = crop_and_resize(c_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'citronella-terracotta-balcony-candle-main.webp')
        # Make a distinct scale shot (evening table warm glow)
        scale_img = crop_and_resize(c_img, (0.1, 0.15, 0.8, 0.75))
        enhancer = ImageEnhance.Color(scale_img)
        scale_img = enhancer.enhance(1.15)
        save_webp(scale_img, 'citronella-terracotta-balcony-candle-scale.webp')

    # 4. DIY Soil Diagnostic Lab (FM-LRN-004)
    # detail is the actual chemical lab test tubes and color comparator
    lab_detail_path = os.path.join(PROD_DIR, 'diy-soil-diagnostic-starter-lab-detail.webp')
    with Image.open(lab_detail_path) as l_img:
        main_img = crop_and_resize(l_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'diy-soil-diagnostic-starter-lab-main.webp')
        # Make scale shot
        scale_img = crop_and_resize(l_img, (0.1, 0.2, 0.8, 0.7))
        save_webp(scale_img, 'diy-soil-diagnostic-starter-lab-scale.webp')

    # 5. Margalla Native Tree CSR Token (FM-CSR-001)
    # detail is the laser-engraved wooden token and sapling
    token_detail_path = os.path.join(PROD_DIR, 'margalla-native-tree-csr-token-detail.webp')
    with Image.open(token_detail_path) as t_img:
        main_img = crop_and_resize(t_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'margalla-native-tree-csr-token-main.webp')
        scale_img = crop_and_resize(t_img, (0.15, 0.1, 0.75, 0.8))
        save_webp(scale_img, 'margalla-native-tree-csr-token-scale.webp')

    # 6. Islamabad & Potohar Four-Season Planting Calendar & Journal (FM-LRN-001)
    # detail is the authentic linen journal book
    journal_detail_path = os.path.join(PROD_DIR, 'islamabad-planting-calendar-journal-detail.webp')
    with Image.open(journal_detail_path) as j_img:
        main_img = crop_and_resize(j_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'islamabad-planting-calendar-journal-main.webp')
        scale_img = crop_and_resize(j_img, (0.1, 0.25, 0.85, 0.7))
        save_webp(scale_img, 'islamabad-planting-calendar-journal-scale.webp')

    # 7. Seedistry Heirloom Herb Seed Vault (FM-LRN-002)
    # detail is the kraft seed box with coir pots and seed packets
    seed_detail_path = os.path.join(PROD_DIR, 'seedistry-heirloom-herb-seed-box-detail.webp')
    with Image.open(seed_detail_path) as s_img:
        main_img = crop_and_resize(s_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'seedistry-heirloom-herb-seed-box-main.webp')

    # 8. Botanical Hydro-Propagation Station (FM-LRN-005)
    # detail is the Sheesham wooden stand and glass bulb vases
    prop_detail_path = os.path.join(PROD_DIR, 'sheesham-propagation-station-detail.webp')
    with Image.open(prop_detail_path) as p_img:
        main_img = crop_and_resize(p_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'sheesham-propagation-station-main.webp')
        scale_img = crop_and_resize(p_img, (0.1, 0.2, 0.8, 0.75))
        save_webp(scale_img, 'sheesham-propagation-station-scale.webp')

    # 9. Campus 10-Tree Plantation Drive Pack (FM-CSR-002)
    # detail is the actual campus plantation drive
    campus_detail_path = os.path.join(PROD_DIR, 'campus-10-tree-green-drive-pack-detail.webp')
    with Image.open(campus_detail_path) as c_img:
        main_img = crop_and_resize(c_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'campus-10-tree-green-drive-pack-main.webp')

    # 10. Seedistry Organic Potting Mix (FM-SUP-005)
    # detail is the organic potting soil sack and dark compost
    mix_detail_path = os.path.join(PROD_DIR, 'seedistry-organic-potting-mix-detail.webp')
    with Image.open(mix_detail_path) as m_img:
        main_img = crop_and_resize(m_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'seedistry-organic-potting-mix-main.webp')
        scale_img = crop_and_resize(m_img, (0.15, 0.15, 0.75, 0.75))
        save_webp(scale_img, 'seedistry-organic-potting-mix-scale.webp')

    # 11. Artisan Botanical Gift Hamper — 'Sarsabz Jahan' (FM-CSR-003)
    # We combine the genuine hamper detail shot with custom framing
    hamper_detail_path = os.path.join(PROD_DIR, 'sarsabz-jahan-botanical-gift-hamper-detail.webp')
    with Image.open(hamper_detail_path) as h_img:
        main_img = crop_and_resize(h_img, (0.05, 0.05, 0.9, 0.9))
        save_webp(main_img, 'sarsabz-jahan-botanical-gift-hamper-main.webp')
        scale_img = crop_and_resize(h_img, (0.1, 0.1, 0.8, 0.8))
        save_webp(scale_img, 'sarsabz-jahan-botanical-gift-hamper-scale.webp')

    # 12. Corporate Eco-Desk Succulent Trio (FM-CSR-005)
    # We create dedicated desk succulent trio images
    eco_detail_path = os.path.join(PROD_DIR, 'corporate-eco-desk-gift-trio-detail.webp')
    with Image.open(eco_detail_path) as e_img:
        # Give it a distinctive desk-succulent composition
        main_img = crop_and_resize(e_img, (0.0, 0.2, 0.8, 0.8))
        enhancer = ImageEnhance.Color(main_img)
        main_img = enhancer.enhance(1.1)
        save_webp(main_img, 'corporate-eco-desk-gift-trio-main.webp')
        
        detail_img = crop_and_resize(e_img, (0.15, 0.35, 0.65, 0.55))
        save_webp(detail_img, 'corporate-eco-desk-gift-trio-detail.webp')
        
        scale_img = crop_and_resize(e_img, (0.05, 0.1, 0.9, 0.85))
        save_webp(scale_img, 'corporate-eco-desk-gift-trio-scale.webp')

if __name__ == '__main__':
    print("=== PROCESSING GENERATED BESPOKE TRIOS (SERVICES & IOT & CRAFT) ===")
    process_generated_trios()
    print("\n=== PROCESSING CURATED PRODUCT IMAGES (LEARNING & CSR & TOOLS) ===")
    process_curated_products()
    print("\nAll image processing complete!")
