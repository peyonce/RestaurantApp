#!/bin/bash
echo "Applying quick fixes..."

# 1. Ensure all .tsx files have React import
for file in *.tsx; do
  if [ -f "$file" ] && ! grep -q "import React" "$file"; then
    echo "Adding React import to $file"
    # Check if there are any imports already
    if grep -q "^import" "$file"; then
      # Add after first import
      sed -i '0,/^import/{/^import/a\
import React from "react";}' "$file"
    else
      # Add at top of file
      sed -i '1iimport React from "react";' "$file"
    fi
  fi
done

# 2. Check for missing default exports
for file in *.tsx; do
  if [ -f "$file" ] && grep -q "function\|const.*=.*()" "$file" && ! grep -q "export default" "$file"; then
    echo "Adding export default to $file"
    # Find the main component function
    if grep -q "function.*Component\|function.*Screen\|function.*Page" "$file"; then
      component_name=$(grep "function" "$file" | head -1 | sed 's/function //' | sed 's/(.*//' | tr -d ' ')
      if [ -n "$component_name" ]; then
        # Add export default at end of file
        echo "" >> "$file"
        echo "export default $component_name;" >> "$file"
      fi
    fi
  fi
done

echo "Quick fixes applied."
