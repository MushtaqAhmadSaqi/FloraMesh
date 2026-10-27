import json
import re
import hashlib
import os
from collections import Counter

with open('data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

products = json.loads(re.search(r'window\.FLORAMESH_PRODUCTS\s*=\s*(\[[\s\S]*?\]);\s*$', text).group(1))

slots = []
for p in products:
    for img in p['images']:
        src = img['src']
        with open(src, 'rb') as f:
            h = hashlib.md5(f.read()).hexdigest()
        slots.append({
            'product_id': p['id'],
            'product_name': p['shortName'],
            'type': img['type'],
            'src': src,
            'hash': h
        })

counts = Counter(s['hash'] for s in slots)

print(f"Total image slots: {len(slots)}")
print(f"Unique files / hashes: {len(counts)}")
print("\n--- ALL SHARED SLOTS ---")
for h, c in counts.items():
    if c > 1:
        print(f"\nHash {h[:8]} ({c} slots):")
        for s in slots:
            if s['hash'] == h:
                print(f"   [{s['product_id']:10} {s['type']:6}] {s['product_name']:25} -> {s['src']}")
