import os

with open("index - Copy.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

insert_idx = -1
for i, line in enumerate(lines):
    if '<div id="tab-course" class="pg">' in line:
        insert_idx = i + 1
        break

start_idx = -1
end_idx = -1
# find the second occurrence of <!-- ENROLL CTA -->, because there's one in home tab
occurrences = []
for i in range(len(lines)):
    if '<!-- ENROLL CTA -->' in lines[i]:
        occurrences.append(i)

if len(occurrences) >= 2:
    start_idx = occurrences[1] # The one in course tab
else:
    start_idx = occurrences[0] # Fallback if only one

for i in range(start_idx, len(lines)):
    if '</div><!-- /course -->' in lines[i]:
        end_idx = i
        break

if insert_idx != -1 and start_idx != -1 and end_idx != -1:
    cta_block = lines[start_idx:end_idx]
    
    # Check if we are inserting before the deletion block
    # We are, so deleting won't shift insert_idx
    del lines[start_idx:end_idx]
    
    for i in reversed(range(len(cta_block))):
        lines.insert(insert_idx, cta_block[i])
        
    with open("index - Copy.html", "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Success")
else:
    print(f"Failed. insert: {insert_idx}, start: {start_idx}, end: {end_idx}, occurrences: {len(occurrences)}")
