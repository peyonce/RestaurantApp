#!/bin/bash
echo "Fixing common syntax issues in all .tsx files..."

# Fix missing commas in object literals (common issue)
for file in $(find . -name "*.tsx" -type f ! -path "./node_modules/*"); do
  echo "Checking $file..."
  
  # Fix missing commas after object properties in JSX props
  # Pattern: property={value} without comma
  sed -i 's/\([a-zA-Z0-9]\+\)={\([^}]*\)}\([^,]\)/\1={\2}, \3/g' "$file"
  
  # Fix missing commas in array literals
  sed -i 's/\(\]\)\([^,]\)/\], \2/g' "$file"
  
  # Fix missing closing brackets/parentheses
  # This is more complex and might need manual review
done

echo "Done. Please check if errors are resolved."
