import os
import re

def get_relative_path(from_file, to_module):
    from_dir = os.path.dirname(from_file)
    to_path = to_module  # e.g. "src/config"
    rel = os.path.relpath(to_path, from_dir)
    if not rel.startswith('.'):
        rel = './' + rel
    return rel

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    def replacer(match):
        quote = match.group(1)
        src_path = match.group(2)
        rel = get_relative_path(filepath, src_path)
        return f'from {quote}{rel}{quote}'
    
    content = re.sub(r'from (["\'])(src/[^"\']+)\1', replacer, content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'Fixed: {filepath}')

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts'):
            fix_file(os.path.join(root, file))

print('\nVerifying...')
remaining = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts'):
            with open(os.path.join(root, file)) as f:
                for i, line in enumerate(f, 1):
                    if re.search(r'from ["\']src/', line):
                        remaining.append(f"{os.path.join(root, file)}:{i}: {line.strip()}")

if remaining:
    print('Still remaining:')
    for r in remaining:
        print(r)
else:
    print('All clean! No src/ imports remaining.')
