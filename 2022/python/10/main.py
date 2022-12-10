data = ''
with open('input.txt', 'r') as f:
    data = f.read()

lines = data.strip().split('\n')

instructions = []

for line in lines:
    split = line.split(' ')
    instruction = {
        'op': split[0],
        'value': int(split[1]) if split[0] == 'addx' else 0
    }
    instructions.append(instruction)

queue = []

for instruction in instructions:
    match instruction['op']:
        case 'noop':
            queue.append({'instruction': instruction, 'remaining': 1})
        case 'addx':
            queue.append({'instruction': instruction, 'remaining': 2})

register = 1
cycle = 1

def execute(instruction, register):
    match instruction['op']:
        case 'noop':
            register += 0
        case 'addx':
            register += instruction['value'] if instruction['value'] else 0
    return register

def three_pixels(register: int):
    return [register - 1, register, register + 1]


def draw_pixel(cycle: int, reigster: int, draw: str):
    cycle -= 1
    if cycle % 40 == 0: draw += '\n'
    if (cycle % 40) in three_pixels(register):
        draw += '#'
    else: draw += '.'
    return draw

values = {}

draw = ''

while len(queue) > 0:
    next = queue.pop(0)
    while next['remaining'] > 0:
        values[cycle] = register
        draw = draw_pixel(cycle, register, draw)
        cycle += 1
        next['remaining'] -= 1
    register = execute(next['instruction'], register)

def cycle_sum():
    cycle20 = values[20]
    cycle60 = values[60]
    cycle100 = values[100]
    cycle140 = values[140]
    cycle180 = values[180]
    cycle220 = values[220]

    result = cycle20 * 20 + cycle60 * 60 + cycle100 * 100 + cycle140 * 140 + cycle180 * 180 + cycle220 * 220
    return result

print(cycle_sum())
print(draw)