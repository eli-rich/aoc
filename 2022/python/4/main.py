import re

indicies_regex = re.compile(r'[,-]')

data = ''
with open('input.txt', 'r') as f:
    data = f.read()


lines = data.splitlines()

part1 = 0
part2 = 0

for line in lines:
    indicies = re.split(indicies_regex, line)
    indicies = [int(i) for i in indicies]
    left_start = indicies[0]
    left_end = indicies[1]
    right_start = indicies[2]
    right_end = indicies[3]
    if (left_start <= right_start and left_end >= right_end) or (right_start <= left_start and right_end >= left_end):
        part1 += 1
    if not ((right_start > left_end) or (right_end < left_start)):
        part2 += 1

print(part1)
print(part2)
