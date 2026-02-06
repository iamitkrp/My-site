import re

with open('src/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find all <script ...> tags and their corresponding </script>
# Actually, just find everything that looks like a closing script tag but might be weird
for match in re.finditer(r'</script>', content, re.IGNORECASE):
    chunk = match.group(0)
    print(f"Found closing tag: '{chunk}' at {match.start()}")
    # Check for non-ascii characters nearby
    context = content[max(0, match.start()-10):min(len(content), match.end()+10)]
    print(f"Context: {repr(context)}")
