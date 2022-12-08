input = ''
with open('input.txt') as f:
    input = f.read()

input = input.splitlines()

top = 0
top2 = 0
top3 = 0

current = 0

for line in input:
    if line == '':
        if current > top:
            top3 = top2
            top2 = top
            top = current
        elif current > top2:
            top3 = top2
            top2 = current
        elif current > top3:
            top3 = current

        current = 0
        continue
    else:
        val = int(line)
        current += val

print(top)
print(top + top2 + top3)