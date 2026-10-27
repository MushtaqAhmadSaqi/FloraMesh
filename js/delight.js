/**
 * FloraMesh Botanical & Smart IoT Delight Features (js/delight.js)
 * High-value domain-specific features tailored for Islamabad & Rawalpindi:
 * 1. Potohar Seasonal Planting Radar
 * 2. Soil Telemetry Moisture Simulator
 * 3. Pot Sizer & Soil Volume Calculator
 * 4. Shareable Wishlist Links (WhatsApp & SMS)
 * 5. Customer Plant Health Diagnostic Inquiry Modal
 * 6. Local Order Tracking & Van Dispatch Stepper
 */

(function () {
  'use strict';

  var POTOHAR_SEASONS = [
    {
      id: 'kohar',
      urdu: 'کہر',
      name: 'Kohar',
      english: 'Frost Chills',
      months: 'Dec – Jan',
      monthIndices: [11, 0],
      temp: 'Night 0°C–4°C / Day 14°C–18°C',
      climate: 'Heavy night frost, drying northern winds, low sun angle. Tender bougainvillea and ficus risk cellular freeze rupture.',
      cultivars: ['Winter Pansies', 'Calendula', 'Petunias', 'Protected Bougainvillea', 'Cold-hardy Winter Bulbs'],
      watering: 'Deeply reduce frequency. Water only at midday on bright sunny mornings when root-zone VWC drops below 25%.',
      targetVwc: '25% – 35% VWC',
      actionText: 'View Frost Protection Kits',
      actionUrl: 'shop.html?category=services'
    },
    {
      id: 'bahar',
      urdu: 'بہار',
      name: 'Bahar',
      english: 'Spring Bloom',
      months: 'Feb – Mar',
      monthIndices: [1, 2],
      temp: 'Day 18°C–26°C / Night 8°C–14°C',
      climate: 'Peak vegetative emergence, rising ambient humidity, and mild breezes. Optimal window for repotting and heirloom seeding.',
      cultivars: ['Kachnar (Bauhinia)', 'Amaltas', 'Heirloom Mint & Coriander', 'Motia (Arabian Jasmine)', 'Sweet Basil'],
      watering: 'Moderate, regular watering. Top-dress pots with living Seedistry organic compost to fuel spring root expansion.',
      targetVwc: '45% – 60% VWC',
      actionText: 'Explore Spring Cultivars',
      actionUrl: 'shop.html?category=plants'
    },
    {
      id: 'garmi',
      urdu: 'گرمی',
      name: 'Garmi',
      english: 'Intense Pre-Monsoon Heat',
      months: 'Apr – Jun',
      monthIndices: [3, 4, 5],
      temp: 'Day 38°C–45°C / Night 24°C–28°C',
      climate: 'Scorching sunlight on concrete balconies. Plastic pots act like thermal ovens, cooking delicate root-hair networks.',
      cultivars: ['Taxila Terracotta Gamlas', 'Desert Rose', 'Hardy Citrus', 'Portulaca', 'Bougainvillea Climbers'],
      watering: 'Water twice daily or deploy FloraMesh Smart Drip Controller. Breathable Taxila pottery dissipates heat through evaporative cooling.',
      targetVwc: '50% – 65% VWC',
      actionText: 'Explore Smart Drip & Terracotta',
      actionUrl: 'shop.html?category=hardware'
    },
    {
      id: 'barsat',
      urdu: 'برسات',
      name: 'Barsat',
      english: 'Monsoon Rains',
      months: 'Jul – Aug',
      monthIndices: [6, 7],
      temp: 'Day 32°C–36°C / Night 24°C–26°C',
      climate: 'Torrential downpours, 85%+ relative humidity. Standing puddle water in pot saucers breeds fungal root rot and dengue mosquitoes.',
      cultivars: ['Rain Lilies', 'Native Neem', 'Sukh Chain', 'Margalla Climbers', 'Indoor Biophilic Ferns'],
      watering: 'Halt artificial hose watering; ensure all pot drainage holes are free. Empty saucers immediately after rainfall.',
      targetVwc: '55% – 70% VWC',
      actionText: 'Explore Aerated Gamlas',
      actionUrl: 'shop.html?category=pots'
    },
    {
      id: 'khazan',
      urdu: 'خزاں',
      name: 'Khazan',
      english: 'Golden Autumn',
      months: 'Sep – Nov',
      monthIndices: [8, 9, 10],
      temp: 'Day 24°C–29°C / Night 12°C–16°C',
      climate: 'Crisp Margalla skies, falling dew, dropping humidity. Prime season for planting citrus, perennials, and winter kitchen herbs.',
      cultivars: ['Winter Herb Seed Box', 'Chrysanthemums', 'Citrus & Fig Balcony Duo', 'Dahlias', 'Sweet Peas'],
      watering: 'Steady, moderate watering every 2–3 days. Monitor drying rates closely with capacitive sensors as night temperatures cool.',
      targetVwc: '35% – 50% VWC',
      actionText: 'Explore Autumn Packages',
      actionUrl: 'shop.html?category=plants'
    }
  ];

  function getCurrentSeason() {
    var now = new Date();
    var currentMonth = now.getMonth(); // 0-11
    var match = POTOHAR_SEASONS.find(function (s) {
      return s.monthIndices.indexOf(currentMonth) !== -1;
    });
    return match || POTOHAR_SEASONS[4]; // Default to Khazan (Autumn)
  }

  // 1. Potohar Seasonal Planting Radar
  function initSeasonalRadar(containerId) {
    var container = document.getElementById(containerId || 'seasonal-radar-mount');
    if (!container) return;

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var activeSeason = getCurrentSeason();

    function renderRadar(season) {
      var tabsHtml = POTOHAR_SEASONS.map(function (s) {
        var isCurrent = (s.id === getCurrentSeason().id);
        var isSelected = (s.id === season.id);
        return '<button type="button" class="radar-tab-btn ' + (isSelected ? 'is-active' : '') + '" data-season-id="' + s.id + '" role="tab" aria-selected="' + (isSelected ? 'true' : 'false') + '">' +
          '<span class="radar-tab-urdu">' + s.urdu + '</span>' +
          '<strong class="radar-tab-name">' + s.name + '</strong>' +
          '<small class="radar-tab-months">' + s.months + '</small>' +
          (isCurrent ? '<span class="radar-tab-badge">Active Season</span>' : '') +
          '</button>';
      }).join('');

      var cultivarsPills = season.cultivars.map(function (c) {
        return '<span class="chip" style="font-size:var(--text-xs);padding:4px 10px;background:var(--color-surface);border:1px solid var(--color-border);">' + escape(c) + '</span>';
      }).join(' ');

      container.innerHTML =
        '<div class="planting-radar panel" style="padding:var(--space-6);">' +
        '  <div class="planting-radar__header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-6);">' +
        '    <div>' +
        '      <div class="section__eyebrow" style="color:var(--color-accent);">Potohar Horticultural Calendar</div>' +
        '      <h2 class="h2" style="margin-bottom:var(--space-1);display:flex;align-items:center;gap:var(--space-3);">' +
        '        <span>' + season.name + ' (' + season.english + ')</span>' +
        '        <span style="font-family:var(--font-urdu);font-size:1.4em;color:var(--color-primary);">' + season.urdu + '</span>' +
        '      </h2>' +
        '      <p style="color:var(--color-text-muted);font-size:var(--text-sm);">' + season.months + ' • Islamabad &amp; Rawalpindi Microclimate Radar</p>' +
        '    </div>' +
        '    <div style="text-align:right;">' +
        '      <div style="font-size:var(--text-xs);color:var(--color-text-muted);">Regional Temperatures</div>' +
        '      <strong style="font-size:var(--text-base);color:var(--color-primary);font-variant-numeric:tabular-nums;">' + season.temp + '</strong>' +
        '    </div>' +
        '  </div>' +
        '  <div class="planting-radar__tabs" role="tablist" aria-label="Potohar Seasons">' +
        tabsHtml +
        '  </div>' +
        '  <div class="planting-radar__body grid-2" style="gap:var(--space-6);margin-top:var(--space-6);padding-top:var(--space-6);border-top:1px solid var(--color-border);">' +
        '    <div>' +
        '      <h3 class="h4" style="margin-bottom:var(--space-2);">Climate Reality &amp; Plant Care</h3>' +
        '      <p style="font-size:var(--text-sm);color:var(--color-text-muted);line-height:var(--leading-relaxed);margin-bottom:var(--space-4);">' + season.climate + '</p>' +
        '      <h4 style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.05em;color:var(--color-text-muted);margin-bottom:var(--space-2);">Recommended Twin-City Cultivars</h4>' +
        '      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-4);">' + cultivarsPills + '</div>' +
        '    </div>' +
        '    <div style="background:var(--color-surface-alt);padding:var(--space-5);border-radius:var(--radius-md);border:1px solid var(--color-border);display:flex;flex-direction:column;justify-content:space-between;">' +
        '      <div>' +
        '        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">' +
        '          <span style="font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;color:var(--color-primary);">Watering &amp; Soil Target</span>' +
        '          <span class="badge badge--success" style="font-size:11px;">' + season.targetVwc + '</span>' +
        '        </div>' +
        '        <p style="font-size:var(--text-sm);line-height:var(--leading-relaxed);color:var(--color-text);margin-bottom:var(--space-4);">' + season.watering + '</p>' +
        '      </div>' +
        '      <a href="' + season.actionUrl + '" class="btn btn--primary btn--full" style="text-align:center;">' + season.actionText + '</a>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      container.querySelectorAll('.radar-tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sid = btn.getAttribute('data-season-id');
          var selected = POTOHAR_SEASONS.find(function (s) { return s.id === sid; });
          if (selected) renderRadar(selected);
        });
      });
    }

    renderRadar(activeSeason);
  }

  // 2. Soil Telemetry Moisture Simulator
  function initTelemetrySimulator(containerId) {
    var container = document.getElementById(containerId || 'telemetry-simulator-mount');
    if (!container) return;

    var utils = window.FloraMeshUtils || {};
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    var currentVwc = 64; // Starting percentage
    var potType = 'terracotta'; // 'terracotta' or 'plastic'
    var isSimulating = false;
    var simInterval = null;

    function getTelemetryState(vwc, pot) {
      if (vwc < 20) {
        return {
          status: 'Critical Underwatering Alert',
          badgeClass: 'badge--danger',
          badgeText: 'Dry Out Distress',
          color: 'var(--color-danger)',
          msg: 'Root-zone moisture has fallen below 20%. Beneficial mycorrhizal fungi are entering dormancy. Immediate deep watering recommended.',
          tempOffset: (pot === 'plastic') ? '+5°C' : '+1°C'
        };
      } else if (vwc < 40) {
        return {
          status: 'Approaching Dry Threshold',
          badgeClass: 'badge--warning',
          badgeText: 'Water Soon',
          color: 'var(--color-warning)',
          msg: 'Soil is drying progressively. Schedule evening irrigation for balcony plants before tomorrow morning sun.',
          tempOffset: (pot === 'plastic') ? '+3°C' : 'Normal'
        };
      } else if (vwc <= 70) {
        return {
          status: 'Optimal Root-Zone Moisture',
          badgeClass: 'badge--success',
          badgeText: 'Optimal Range',
          color: 'var(--color-success)',
          msg: 'Volumetric water content is in the sweet spot for Potohar urban plants. Steady nutrient uptake and aerobic microbial respiration.',
          tempOffset: (pot === 'plastic') ? '+1°C' : '-2°C (Cooling)'
        };
      } else {
        return {
          status: 'Soil Saturation Warning',
          badgeClass: 'badge--accent',
          badgeText: 'Waterlogged',
          color: 'var(--color-accent)',
          msg: 'Root zone is saturated above 70%. Ensure pot drainage hole is unblocked to prevent anaerobic root rot during monsoon showers.',
          tempOffset: 'Ambient'
        };
      }
    }

    function renderSimulator() {
      var state = getTelemetryState(currentVwc, potType);

      // SVG graph points calculated from currentVwc
      var p1 = Math.round(50 - (currentVwc * 0.4));
      var p2 = Math.round(p1 + 8);
      var p3 = Math.round(p1 - 6);
      var p4 = Math.round(p1 + 4);

      container.innerHTML =
        '<div class="telemetry-simulator card panel" style="padding:var(--space-6);">' +
        '  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-4);">' +
        '    <div>' +
        '      <div class="section__eyebrow" style="color:var(--color-accent);">Hardware Telemetry Interactive Widget</div>' +
        '      <h3 class="h3" style="margin:0;">Capacitive Soil Probe Simulator</h3>' +
        '    </div>' +
        '    <div style="display:flex;align-items:center;gap:var(--space-2);">' +
        '      <button type="button" class="btn btn--outline btn--sm" id="sim-run-cycle">' + (isSimulating ? 'Pause Drying Cycle' : 'Simulate 24h Drying') + '</button>' +
        '      <span class="badge ' + state.badgeClass + '" id="sim-status-badge">' + state.badgeText + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="grid-2" style="gap:var(--space-6);">' +
        '    <div>' +
        '      <!-- Live Telemetry SVG Sparkline Graph -->' +
        '      <div style="background:var(--color-surface-sunken);border-radius:var(--radius-md);padding:var(--space-4);border:1px solid var(--color-border);margin-bottom:var(--space-4);">' +
        '        <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-2);">' +
        '          <span>7-Day Volumetric Water Content (VWC %)</span>' +
        '          <strong style="color:var(--color-text);font-variant-numeric:tabular-nums;" id="sim-vwc-display">' + currentVwc + '% VWC</strong>' +
        '        </div>' +
        '        <svg viewBox="0 0 320 80" width="100%" height="80" fill="none" style="overflow:visible;" aria-hidden="true">' +
        '          <line x1="0" y1="20" x2="320" y2="20" stroke="var(--color-accent)" stroke-dasharray="3 3" stroke-width="1" opacity="0.4"/>' +
        '          <text x="5" y="16" fill="var(--color-text-muted)" font-size="9">70% Saturated</text>' +
        '          <line x1="0" y1="58" x2="320" y2="58" stroke="var(--color-danger)" stroke-dasharray="3 3" stroke-width="1" opacity="0.4"/>' +
        '          <text x="5" y="55" fill="var(--color-danger)" font-size="9">20% Dry Alert</text>' +
        '          <path d="M 0,35 Q 80,' + p1 + ' 160,' + p2 + ' T 260,' + p3 + ' L 310,' + p4 + '" stroke="' + state.color + '" stroke-width="3" stroke-linecap="round" fill="none" style="transition:all 0.3s ease;"/>' +
        '          <circle cx="310" cy="' + p4 + '" r="5" fill="' + state.color + '" stroke="var(--color-surface)" stroke-width="2"/>' +
        '        </svg>' +
        '      </div>' +
        '      <!-- Interactive Slider Control -->' +
        '      <div class="form-field">' +
        '        <label for="sim-vwc-slider" style="display:flex;justify-content:space-between;font-size:var(--text-xs);font-weight:var(--weight-bold);margin-bottom:var(--space-1);">' +
        '          <span>Adjust Soil Moisture Level:</span>' +
        '          <span style="color:var(--color-primary);">' + currentVwc + '%</span>' +
        '        </label>' +
        '        <input type="range" id="sim-vwc-slider" min="5" max="95" value="' + currentVwc + '" style="width:100%;accent-color:var(--color-primary);">' +
        '      </div>' +
        '    </div>' +
        '    <div>' +
        '      <!-- Pot & Substrate Selector -->' +
        '      <div class="form-field" style="margin-bottom:var(--space-4);">' +
        '        <label for="sim-pot-type" style="font-size:var(--text-xs);font-weight:var(--weight-bold);display:block;margin-bottom:var(--space-1);">Planter Material &amp; Microclimate Factor:</label>' +
        '        <select id="sim-pot-type" class="form-select form-select--sm" style="width:100%;">' +
        '          <option value="terracotta"' + (potType === 'terracotta' ? ' selected' : '') + '>Taxila Fired Terracotta + Seedistry Mix (Evaporative Root Cooling)</option>' +
        '          <option value="plastic"' + (potType === 'plastic' ? ' selected' : '') + '>Standard Plastic Gamla + Heavy Clay Silt (Thermal Trap)</option>' +
        '        </select>' +
        '      </div>' +
        '      <!-- Live Status Diagnostic Box -->' +
        '      <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-4);">' +
        '        <div style="font-weight:var(--weight-bold);font-size:var(--text-sm);color:var(--color-text);margin-bottom:var(--space-1);">' + state.status + '</div>' +
        '        <p style="font-size:var(--text-xs);color:var(--color-text-muted);line-height:var(--leading-relaxed);margin-bottom:var(--space-3);">' + state.msg + '</p>' +
        '        <div style="display:flex;gap:var(--space-3);font-size:var(--text-xs);padding-top:var(--space-2);border-top:1px dashed var(--color-border);">' +
        '          <span>Root Temp Effect: <strong style="color:var(--color-text);">' + state.tempOffset + '</strong></span>' +
        '          <span>pH Buffer: <strong style="color:var(--color-text);">6.5 Optimal</strong></span>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      // Bind events
      var slider = document.getElementById('sim-vwc-slider');
      if (slider) {
        slider.addEventListener('input', function () {
          currentVwc = parseInt(slider.value, 10);
          if (isSimulating) stopSimulation();
          renderSimulator();
        });
      }

      var potSelect = document.getElementById('sim-pot-type');
      if (potSelect) {
        potSelect.addEventListener('change', function () {
          potType = potSelect.value;
          renderSimulator();
        });
      }

      var cycleBtn = document.getElementById('sim-run-cycle');
      if (cycleBtn) {
        cycleBtn.addEventListener('click', function () {
          if (isSimulating) {
            stopSimulation();
          } else {
            startSimulation();
          }
        });
      }
    }

    function startSimulation() {
      isSimulating = true;
      currentVwc = 80;
      renderSimulator();
      simInterval = setInterval(function () {
        currentVwc -= 3;
        if (currentVwc <= 12) {
          stopSimulation();
          currentVwc = 12;
        }
        renderSimulator();
      }, 350);
    }

    function stopSimulation() {
      isSimulating = false;
      if (simInterval) clearInterval(simInterval);
      renderSimulator();
    }

    renderSimulator();
  }

  // 3. Pot Sizer & Soil Volume Calculator
  function initSoilCalculator(containerId) {
    var container = document.getElementById(containerId || 'soil-calculator-mount');
    if (!container) return;

    var utils = window.FloraMeshUtils || {};
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    var shape = 'round'; // 'round' or 'rect'
    var unit = 'inches'; // 'inches' or 'cm'
    var dim1 = 12; // Diameter or Length
    var dim2 = 12; // Height or Width
    var dim3 = 12; // Height (for rect)

    function calculateLiters() {
      var liters = 0;
      if (unit === 'inches') {
        if (shape === 'round') {
          // V = pi * (d/2)^2 * h * 0.85 (for tapered gamla) / 61.024 (cubic inches to liters)
          var radius = dim1 / 2;
          var cuIn = Math.PI * radius * radius * dim2 * 0.85;
          liters = cuIn / 61.0237;
        } else {
          var cuInRect = dim1 * dim2 * dim3;
          liters = cuInRect / 61.0237;
        }
      } else { // cm
        if (shape === 'round') {
          var rCm = dim1 / 2;
          var cuCm = Math.PI * rCm * rCm * dim2 * 0.85;
          liters = cuCm / 1000;
        } else {
          var cuCmRect = dim1 * dim2 * dim3;
          liters = cuCmRect / 1000;
        }
      }
      return Math.max(1, Math.round(liters));
    }

    function getBagBreakdown(totalLiters) {
      // Seedistry potting soil available in 25L and 10L bags
      var bags25 = Math.floor(totalLiters / 25);
      var remainder = totalLiters % 25;
      var bags10 = Math.ceil(remainder / 10);
      var estimatedCost = (bags25 * 1450) + (bags10 * 850);
      return {
        liters: totalLiters,
        bags25: bags25,
        bags10: bags10,
        estimatedCost: estimatedCost
      };
    }

    function renderCalculator() {
      var totalLiters = calculateLiters();
      var bags = getBagBreakdown(totalLiters);

      container.innerHTML =
        '<div class="soil-calculator card panel" style="padding:var(--space-6);">' +
        '  <div class="section__eyebrow" style="color:var(--color-accent);">Substrate Estimator</div>' +
        '  <h3 class="h3" style="margin-bottom:var(--space-2);">Pot Sizer &amp; Seedistry Soil Calculator</h3>' +
        '  <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-6);max-width:60ch;">' +
        '    Calculate the precise volume of organic Seedistry potting substrate required for your Taxila planters, balcony troughs, or raised beds.' +
        '  </p>' +
        '  <div class="grid-2" style="gap:var(--space-6);">' +
        '    <div>' +
        '      <!-- Shape & Unit Toggles -->' +
        '      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);">' +
        '        <button type="button" class="chip ' + (shape === 'round' ? 'is-active' : '') + '" id="calc-shape-round">Round / Tapered Gamla</button>' +
        '        <button type="button" class="chip ' + (shape === 'rect' ? 'is-active' : '') + '" id="calc-shape-rect">Rectangular Trough</button>' +
        '      </div>' +
        '      <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">' +
        '        <label style="display:inline-flex;align-items:center;gap:6px;font-size:var(--text-xs);cursor:pointer;">' +
        '          <input type="radio" name="calc-unit" value="inches" ' + (unit === 'inches' ? 'checked' : '') + ' style="accent-color:var(--color-primary);"> Inches' +
        '        </label>' +
        '        <label style="display:inline-flex;align-items:center;gap:6px;font-size:var(--text-xs);cursor:pointer;">' +
        '          <input type="radio" name="calc-unit" value="cm" ' + (unit === 'cm' ? 'checked' : '') + ' style="accent-color:var(--color-primary);"> Centimeters (cm)' +
        '        </label>' +
        '      </div>' +
        '      <!-- Dimension Inputs -->' +
        '      <div class="form-grid" style="margin-bottom:var(--space-4);">' +
        '        <div class="form-field">' +
        '          <label for="calc-dim1">' + (shape === 'round' ? 'Top Rim Diameter (' + unit + ')' : 'Length (' + unit + ')') + '</label>' +
        '          <input type="number" id="calc-dim1" min="4" max="200" value="' + dim1 + '">' +
        '        </div>' +
        '        <div class="form-field">' +
        '          <label for="calc-dim2">' + (shape === 'round' ? 'Pot Depth / Height (' + unit + ')' : 'Width (' + unit + ')') + '</label>' +
        '          <input type="number" id="calc-dim2" min="4" max="200" value="' + dim2 + '">' +
        '        </div>' +
        (shape === 'rect' ?
          '        <div class="form-field">' +
          '          <label for="calc-dim3">Trough Height (' + unit + ')</label>' +
          '          <input type="number" id="calc-dim3" min="4" max="200" value="' + dim3 + '">' +
          '        </div>' : '') +
        '      </div>' +
        '    </div>' +
        '    <!-- Result Panel -->' +
        '    <div style="background:var(--color-surface-sunken);border-radius:var(--radius-md);border:1px solid var(--color-border);padding:var(--space-5);display:flex;flex-direction:column;justify-content:space-between;">' +
        '      <div>' +
        '        <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:4px;">Total Soil Required</div>' +
        '        <div style="font-size:var(--text-3xl);font-family:var(--font-display);color:var(--color-primary);line-height:1;margin-bottom:var(--space-3);font-variant-numeric:tabular-nums;">' +
        bags.liters + ' Liters' +
        '        </div>' +
        '        <div style="font-size:var(--text-sm);color:var(--color-text);margin-bottom:var(--space-2);font-weight:var(--weight-semibold);">' +
        '          Recommended Seedistry Mix Breakdown:' +
        '        </div>' +
        '        <ul style="font-size:var(--text-xs);color:var(--color-text-muted);padding-left:18px;margin-bottom:var(--space-4);line-height:1.6;">' +
        (bags.bags25 > 0 ? '<li><strong>' + bags.bags25 + 'x</strong> 25-Liter Seedistry Living Soil Bag(s)</li>' : '') +
        (bags.bags10 > 0 ? '<li><strong>' + bags.bags10 + 'x</strong> 10-Liter Seedistry Living Soil Bag(s)</li>' : '') +
        '          <li>Estimated Substrate Cost: <strong>' + formatPKR(bags.estimatedCost) + '</strong></li>' +
        '        </ul>' +
        '      </div>' +
        '      <button type="button" class="btn btn--primary btn--full" id="calc-add-soil-btn">Add Soil to Garden Basket</button>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      // Bind input events
      var shapeRound = document.getElementById('calc-shape-round');
      var shapeRect = document.getElementById('calc-shape-rect');
      if (shapeRound) shapeRound.addEventListener('click', function () { shape = 'round'; renderCalculator(); });
      if (shapeRect) shapeRect.addEventListener('click', function () { shape = 'rect'; renderCalculator(); });

      document.querySelectorAll('input[name="calc-unit"]').forEach(function (radio) {
        radio.addEventListener('change', function () { unit = radio.value; renderCalculator(); });
      });

      var d1 = document.getElementById('calc-dim1');
      var d2 = document.getElementById('calc-dim2');
      var d3 = document.getElementById('calc-dim3');
      if (d1) d1.addEventListener('input', function () { dim1 = parseFloat(d1.value) || 12; renderCalculator(); });
      if (d2) d2.addEventListener('input', function () { dim2 = parseFloat(d2.value) || 12; renderCalculator(); });
      if (d3) d3.addEventListener('input', function () { dim3 = parseFloat(d3.value) || 12; renderCalculator(); });

      var addBtn = document.getElementById('calc-add-soil-btn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          if (window.FloraMeshCart && window.FloraMeshCart.addItem) {
            if (bags.bags25 > 0) {
              window.FloraMeshCart.addItem('seedistry-organic-potting-mix', 'mix-25l', bags.bags25);
            }
            if (bags.bags10 > 0) {
              window.FloraMeshCart.addItem('seedistry-organic-potting-mix', 'mix-10l', bags.bags10);
            }
            if (window.FloraMeshToast) {
              window.FloraMeshToast('Added ' + bags.liters + 'L Seedistry mix to your basket!');
            }
          }
        });
      }
    }

    renderCalculator();
  }

  // 4. Shareable Wishlist Links (WhatsApp & SMS)
  function initWishlistSharing() {
    var wishlist = window.FloraMeshWishlist;
    if (!wishlist) return;

    // Attach delegated listener for WhatsApp and SMS sharing buttons
    document.addEventListener('click', function (e) {
      var waBtn = e.target.closest('#wishlist-whatsapp-share');
      var smsBtn = e.target.closest('#wishlist-sms-share');

      if (waBtn) {
        e.preventDefault();
        var url = wishlist.generateShareUrl ? wishlist.generateShareUrl() : window.location.href;
        var text = 'Check out my curated FloraMesh botanical wishlist for Islamabad & Rawalpindi:\n' + url;
        var waUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      if (smsBtn) {
        e.preventDefault();
        var smsUrlVal = wishlist.generateShareUrl ? wishlist.generateShareUrl() : window.location.href;
        var smsBody = 'Check out my FloraMesh botanical wishlist: ' + smsUrlVal;
        window.location.href = 'sms:?&body=' + encodeURIComponent(smsBody);
      }
    });
  }

  // 5. Customer Plant Health Diagnostic Inquiry Modal
  function openPlantDiagnosticModal(initialProductSlug) {
    var modal = document.getElementById('plant-diagnostic-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'plant-diagnostic-modal';
      modal.className = 'overlay-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Plant Health Diagnostic Inquiry');
      document.body.appendChild(modal);
    }

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var products = window.FLORAMESH_PRODUCTS || [];

    var productOptions = products.map(function (p) {
      var sel = (initialProductSlug && p.slug === initialProductSlug) ? ' selected' : '';
      return '<option value="' + escape(p.slug) + '"' + sel + '>' + escape(p.shortName || p.name) + '</option>';
    }).join('');

    modal.innerHTML =
      '<div class="overlay-backdrop" id="diagnostic-backdrop"></div>' +
      '<div class="modal-card" style="max-width:680px;max-height:90vh;overflow-y:auto;position:relative;z-index:1001;background:var(--color-surface);padding:var(--space-6);border-radius:var(--radius-lg);margin:40px auto;border:1px solid var(--color-border);">' +
      '  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-4);">' +
      '    <div>' +
      '      <div class="section__eyebrow" style="color:var(--color-accent);">Horticultural Triage</div>' +
      '      <h2 class="h3" style="margin:0;">Plant Health Diagnostic Inquiry</h2>' +
      '      <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:2px;">Get expert guidance from Seedistry and twin-city field malis.</p>' +
      '    </div>' +
      '    <button type="button" class="btn btn--ghost" id="close-diagnostic-btn" aria-label="Close diagnostic modal" style="font-size:var(--text-lg);min-width:auto;padding:4px 8px;">&times;</button>' +
      '  </div>' +
      '  <div id="diagnostic-result" class="alert alert--success" style="display:none;margin-bottom:var(--space-4);" role="status"></div>' +
      '  <form id="plant-diagnostic-form" novalidate>' +
      '    <div class="form-grid">' +
      '      <div class="form-field">' +
      '        <label for="diag-plant">Botanical Item / Specimen *</label>' +
      '        <select id="diag-plant" required>' +
      '          <option value="">-- Choose Plant from FloraMesh --</option>' +
      productOptions +
      '          <option value="custom">Other Home Plant (Non-FloraMesh)</option>' +
      '        </select>' +
      '      </div>' +
      '      <div class="form-field">' +
      '        <label for="diag-location">Twin-City Sector / Society *</label>' +
      '        <input type="text" id="diag-location" required placeholder="e.g. Sector F-8, Bahria Phase 4, DHA II">' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-field">' +
      '      <label style="font-weight:var(--weight-semibold);font-size:var(--text-xs);display:block;margin-bottom:var(--space-1);">Primary Symptoms Observed *</label>' +
      '      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">' +
      '        <label class="chip" style="cursor:pointer;"><input type="checkbox" name="diag-symptom" value="yellowing" style="margin-right:4px;"> Yellowing Leaves</label>' +
      '        <label class="chip" style="cursor:pointer;"><input type="checkbox" name="diag-symptom" value="crispy" style="margin-right:4px;"> Crispy Brown Leaf Tips</label>' +
      '        <label class="chip" style="cursor:pointer;"><input type="checkbox" name="diag-symptom" value="rot" style="margin-right:4px;"> Soggy Soil / Root Rot Odor</label>' +
      '        <label class="chip" style="cursor:pointer;"><input type="checkbox" name="diag-symptom" value="pests" style="margin-right:4px;"> Aphids / White Powdery Spots</label>' +
      '        <label class="chip" style="cursor:pointer;"><input type="checkbox" name="diag-symptom" value="droop" style="margin-right:4px;"> Wilting / Drooping Stems</label>' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-grid">' +
      '      <div class="form-field">' +
      '        <label for="diag-sunlight">Sunlight Exposure</label>' +
      '        <select id="diag-sunlight">' +
      '          <option value="direct-full">Direct All-Day Sun (6+ hours)</option>' +
      '          <option value="direct-morning">Gentle Morning Sun (2–4 hours)</option>' +
      '          <option value="indirect-bright">Bright Indirect Balcony Light</option>' +
      '          <option value="low-shade">Deep Shade / Indoor Corner</option>' +
      '        </select>' +
      '      </div>' +
      '      <div class="form-field">' +
      '        <label for="diag-watering">Current Watering Schedule</label>' +
      '        <select id="diag-watering">' +
      '          <option value="daily">Daily Morning Watering</option>' +
      '          <option value="alternate">Every 2–3 Days</option>' +
      '          <option value="weekly">Once a Week</option>' +
      '          <option value="sensor">Guided by FloraMesh Sensor Telemetry</option>' +
      '        </select>' +
      '      </div>' +
      '    </div>' +
      '    <!-- Photo Upload Guidance & Client Preview -->' +
      '    <div class="form-field" style="margin-bottom:var(--space-4);">' +
      '      <label for="diag-photo-input" style="font-size:var(--text-xs);font-weight:var(--weight-bold);display:block;margin-bottom:4px;">Attach Photo for Visual Triage (Optional)</label>' +
      '      <input type="file" id="diag-photo-input" accept="image/*" class="form-control" style="font-size:var(--text-xs);">' +
      '      <span style="font-size:11px;color:var(--color-text-muted);display:block;margin-top:2px;">Helpful angles: 1. Full plant habit, 2. Close-up of leaf damage, 3. Soil surface / pot drainage.</span>' +
      '      <div id="diag-photo-preview" style="margin-top:8px;display:none;">' +
      '        <img id="diag-preview-img" src="" alt="Diagnostic photo preview" style="max-height:100px;border-radius:var(--radius-sm);border:1px solid var(--color-border);object-fit:cover;">' +
      '      </div>' +
      '    </div>' +
      '    <div style="display:flex;justify-content:flex-end;gap:var(--space-3);">' +
      '      <button type="button" class="btn btn--outline" id="cancel-diagnostic-btn">Cancel</button>' +
      '      <button type="submit" class="btn btn--primary" id="submit-diagnostic-btn">Submit for Horticultural Review</button>' +
      '    </div>' +
      '  </form>' +
      '</div>';

    modal.style.display = 'block';

    var close = function () {
      modal.style.display = 'none';
    };

    var closeBtn = document.getElementById('close-diagnostic-btn');
    var cancelBtn = document.getElementById('cancel-diagnostic-btn');
    var backdrop = document.getElementById('diagnostic-backdrop');
    if (closeBtn) closeBtn.onclick = close;
    if (cancelBtn) cancelBtn.onclick = close;
    if (backdrop) backdrop.onclick = close;

    // Photo preview
    var photoInput = document.getElementById('diag-photo-input');
    var previewWrap = document.getElementById('diag-photo-preview');
    var previewImg = document.getElementById('diag-preview-img');
    if (photoInput) {
      photoInput.addEventListener('change', function () {
        if (photoInput.files && photoInput.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            if (previewImg) previewImg.src = e.target.result;
            if (previewWrap) previewWrap.style.display = 'block';
          };
          reader.readAsDataURL(photoInput.files[0]);
        }
      });
    }

    // Form submit
    var form = document.getElementById('plant-diagnostic-form');
    var resultBox = document.getElementById('diagnostic-result');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var plantVal = document.getElementById('diag-plant').value;
        var locVal = document.getElementById('diag-location').value.trim();
        if (!plantVal || !locVal) {
          alert('Please select a plant and specify your twin-city location.');
          return;
        }

        var ref = 'DIAG-ISB-' + Math.floor(10000 + Math.random() * 90000);
        form.style.display = 'none';
        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML =
            '<strong>Inquiry Logged successfully! Reference #' + ref + '</strong><br>' +
            '<p style="font-size:var(--text-xs);margin-top:4px;color:var(--color-text);">' +
            'Our senior consulting horticulturist (Seedistry &amp; Field Malis) will review your symptoms against current Potohar microclimate conditions and respond via WhatsApp/Email within 12–24 hours.' +
            '</p>' +
            '<div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-surface);border-radius:var(--radius-sm);font-size:var(--text-xs);">' +
            '<strong>Preliminary Triage Tip:</strong> In Islamabad balconies, overwatering causes 80% of yellowing leaves. Allow the top 2 inches of soil to dry and verify drainage hole permeability.' +
            '</div>';
        }
      });
    }
  }

  // 6. Local Order Tracking & Milestone Stepper
  function initOrderTracker(containerId) {
    var container = document.getElementById(containerId || 'order-tracker-mount');
    if (!container) return;

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    function getOrders() {
      try {
        var raw = localStorage.getItem('floramesh_orders_v1');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    // Read URL query parameter ?track=FM-ISB-XXXXX if present
    var urlParams = new URLSearchParams(window.location.search);
    var initialTrackRef = urlParams.get('track') || '';

    function renderTrackerView(orderRef) {
      var orders = getOrders();
      var foundOrder = orders.find(function (o) {
        return o.ref && o.ref.toUpperCase() === (orderRef || '').toUpperCase().trim();
      });

      // If not in local storage, synthesize a demo lookup state for customer demonstration
      if (!foundOrder && orderRef) {
        foundOrder = {
          ref: orderRef.toUpperCase(),
          date: 'Recent Order',
          city: 'Islamabad',
          slot: 'Morning Mali Crew',
          status: 'Dispatched with Field Van',
          total: 18500,
          gateInstructions: 'Visitor clearance pre-registered'
        };
      }

      var searchBarHtml =
        '<div style="margin-bottom:var(--space-6);max-width:540px;">' +
        '  <form id="order-track-search-form" style="display:flex;gap:var(--space-2);">' +
        '    <label for="order-track-input" class="sr-only">Order Reference</label>' +
        '    <input type="text" id="order-track-input" class="form-field" placeholder="Enter Reference (e.g. FM-ISB-12345)" value="' + escape(orderRef || '') + '" style="flex:1;padding:10px 14px;border:1px solid var(--color-border);border-radius:var(--radius-md);">' +
        '    <button type="submit" class="btn btn--primary" style="white-space:nowrap;">Track Dispatch</button>' +
        '  </form>' +
        '</div>';

      if (!foundOrder) {
        container.innerHTML =
          searchBarHtml +
          '<div class="empty-state panel" style="padding:var(--space-8);text-align:center;">' +
          '  <h3 class="h4" style="margin-bottom:var(--space-2);">No active dispatch record selected</h3>' +
          '  <p style="font-size:var(--text-sm);color:var(--color-text-muted);">' +
          (orders.length > 0 ? 'Select an order from your recent history above or enter your reference number.' : 'Complete checkout to generate a simulated local delivery tracking reference.') +
          '  </p>' +
          '</div>';
      } else {
        container.innerHTML =
          searchBarHtml +
          '<div class="order-tracker-card panel" style="padding:var(--space-6);">' +
          '  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6);">' +
          '    <div>' +
          '      <span class="badge badge--success" style="margin-bottom:var(--space-1);display:inline-block;">Nursery Van Active</span>' +
          '      <h3 class="h3" style="margin:0;">Dispatch Status: ' + escape(foundOrder.ref) + '</h3>' +
          '      <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:2px;">Fulfillment Destination: ' + escape(foundOrder.city || 'Islamabad') + ' • ' + escape(foundOrder.slot || 'Morning Crew') + '</p>' +
          '    </div>' +
          '    <div style="text-align:right;">' +
          '      <div style="font-size:var(--text-xs);color:var(--color-text-muted);">Assigned Crew</div>' +
          '      <strong style="font-size:var(--text-sm);color:var(--color-primary);">Mali Tariq &amp; Field Team</strong>' +
          '      <div style="font-size:11px;color:var(--color-text-muted);">Van Reg: ISB-GL-4491</div>' +
          '    </div>' +
          '  </div>' +
          '  <!-- Visual Milestones Stepper -->' +
          '  <div class="tracker-steps" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:var(--space-4);margin-bottom:var(--space-6);position:relative;">' +
          '    <div class="tracker-step is-complete" style="text-align:center;">' +
          '      <div style="width:36px;height:36px;border-radius:50%;background:var(--color-primary);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-2);font-weight:bold;">&#10003;</div>' +
          '      <strong style="font-size:var(--text-xs);display:block;">1. Order Confirmed</strong>' +
          '      <span style="font-size:11px;color:var(--color-text-muted);">Plants Acclimated</span>' +
          '    </div>' +
          '    <div class="tracker-step is-active" style="text-align:center;">' +
          '      <div style="width:36px;height:36px;border-radius:50%;background:var(--color-accent);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-2);font-weight:bold;animation:pulse 1.8s infinite;">2</div>' +
          '      <strong style="font-size:var(--text-xs);display:block;color:var(--color-accent);">2. Van Dispatched</strong>' +
          '      <span style="font-size:11px;color:var(--color-text-muted);">En Route in Twin Cities</span>' +
          '    </div>' +
          '    <div class="tracker-step" style="text-align:center;">' +
          '      <div style="width:36px;height:36px;border-radius:50%;background:var(--color-surface-sunken);border:1px solid var(--color-border);color:var(--color-text-muted);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-2);font-weight:bold;">3</div>' +
          '      <strong style="font-size:var(--text-xs);display:block;color:var(--color-text-muted);">3. Balcony Installation</strong>' +
          '      <span style="font-size:11px;color:var(--color-text-muted);">Placement &amp; Sensor Setup</span>' +
          '    </div>' +
          '  </div>' +
          (foundOrder.gateInstructions ?
            '<div style="background:var(--color-surface-sunken);padding:var(--space-3) var(--space-4);border-radius:var(--radius-sm);font-size:var(--text-xs);margin-bottom:var(--space-4);border-left:3px solid var(--color-primary);">' +
            '  <strong>Gated Society Security Note:</strong> ' + escape(foundOrder.gateInstructions) +
            '</div>' : '') +
          '</div>';
      }

      var searchForm = document.getElementById('order-track-search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var inputVal = document.getElementById('order-track-input').value.trim();
          renderTrackerView(inputVal);
        });
      }
    }

    renderTrackerView(initialTrackRef);
  }

  // Export Delight API
  window.FloraMeshDelight = {
    seasons: POTOHAR_SEASONS,
    getCurrentSeason: getCurrentSeason,
    initSeasonalRadar: initSeasonalRadar,
    initTelemetrySimulator: initTelemetrySimulator,
    initSoilCalculator: initSoilCalculator,
    initWishlistSharing: initWishlistSharing,
    openPlantDiagnosticModal: openPlantDiagnosticModal,
    initOrderTracker: initOrderTracker
  };

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('seasonal-radar-mount')) {
      initSeasonalRadar('seasonal-radar-mount');
    }
    if (document.getElementById('telemetry-simulator-mount')) {
      initTelemetrySimulator('telemetry-simulator-mount');
    }
    if (document.getElementById('soil-calculator-mount')) {
      initSoilCalculator('soil-calculator-mount');
    }
    if (document.getElementById('order-tracker-mount')) {
      initOrderTracker('order-tracker-mount');
    }
    initWishlistSharing();
  });
})();
