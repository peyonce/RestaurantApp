import re

with open('app/menu/index.tsx', 'r') as f:
    content = f.read()

# Replace specific images
replacements = [
    # Bunny Chow
    ("name: 'Bunny Chow',[^}]+image: '[^']+'", "name: 'Bunny Chow',\n    description: 'Hollowed-out bread filled with curry - a Durban specialty',\n    price: 129.99,\n    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',"),
    
    # Boerewors Roll
    ("name: 'Boerewors Roll',[^}]+image: '[^']+'", "name: 'Boerewors Roll',\n    description: 'Traditional farmer sausage in a fresh roll with toppings',\n    price: 89.99,\n    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433?w=400',"),
    
    # Chakalaka Burger (should probably be Chakalaka & Bread)
    ("name: 'Chakalaka Burger',[^}]+image: '[^']+'", "name: 'Chakalaka & Bread',\n    description: 'Spicy vegetable relish served with fresh bread',\n    price: 79.99,\n    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',"),
    
    # Koeksister
    ("name: 'Koeksister',[^}]+image: '[^']+'", "name: 'Koeksister',\n    description: 'Sweet, syrupy plaited doughnut - a South African favorite',\n    price: 49.99,\n    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',"),
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also fix other South African dishes if they exist
extra_replacements = {
    "Bobotie": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
    "Pap and Wors": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
    "Cape Malay Curry": "https://images.unsplash.com/photo-1559314809-2b99056a8c4a?w=400",
    "Biryani": "https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400",
    "Malva Pudding": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    "Milk Tart": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
}

for dish, image_url in extra_replacements.items():
    if dish in content:
        # Simple replacement for image lines
        content = re.sub(
            rf"name:\s*['\"]{re.escape(dish)}['\"][^}}]+image:\s*['\"][^'\"]+['\"]",
            f"name: '{dish}', image: '{image_url}'",
            content,
            flags=re.DOTALL
        )

with open('app/menu/index.tsx', 'w') as f:
    f.write(content)

print("✅ Updated South African dish images in app/menu/index.tsx")
