data = ''
with open('input.txt', 'r') as f:
    data = f.read()

lines = data.strip().split('\n')

head: dict[str, int] = {
    'x': 0,
    'y': 0,
}

tail: dict[str, int] = {
    'x': 0,
    'y': 0,
}

positions: list[dict[str, int]] = []

def getTouching(pos: dict[str, int]) -> list[dict[str, int]]:
    return [
        {'x': pos['x'] + 1, 'y': pos['y']},
        {'x': pos['x'] - 1, 'y': pos['y']},
        {'x': pos['x'], 'y': pos['y'] + 1},
        {'x': pos['x'], 'y': pos['y'] - 1},
        {'x': pos['x'] + 1, 'y': pos['y'] + 1},
        {'x': pos['x'] - 1, 'y': pos['y'] - 1},
        {'x': pos['x'] + 1, 'y': pos['y'] - 1},
        {'x': pos['x'] - 1, 'y': pos['y'] + 1},
    ]

def moveOne(dir: str, dist: int) -> None:
    for i in range(dist):
        match dir:
            case 'U':
                head['y'] += 1
            case 'D':
                head['y'] -= 1
            case 'L':
                head['x'] -= 1
            case 'R':
                head['x'] += 1
        # if the tail no longer touches the head, including diagonally, move the tail
        if not any([r == tail for r in getTouching(head)]):
            if head['x'] > tail['x']: tail['x'] += 1
            if head['x'] < tail['x']: tail['x'] -= 1
            if head['y'] > tail['y']: tail['y'] += 1
            if head['y'] < tail['y']: tail['y'] -= 1
        # if the tail is not already in the list of positions, add it
        if tail not in positions:
            positions.append(tail.copy())

for line in lines:
    split = line.split(' ')
    dir = split[0]
    dist = int(split[1])
    moveOne(dir, dist)

print(len(positions))


# part 2

positions: list[dict[str, int]] = []
nodes: list[dict[str, int]] = []
for i in range(10):
    nodes.append({
        'x': 0,
        'y': 0,
    })

head = nodes[0]
tail = nodes[len(nodes) - 1]

def updateNode(node: dict[str, int], next: dict[str, int]) -> None:
    if not any([r == node for r in getTouching(next)]):
        # move the tail to touch head, including diagonally
        if next['x'] > node['x']: node['x'] += 1
        if next['x'] < node['x']: node['x'] -= 1
        if next['y'] > node['y']: node['y'] += 1
        if next['y'] < node['y']: node['y'] -= 1

for line in lines:
    split = line.split(' ')
    dir = split[0]
    dist = int(split[1])
    for i in range(dist):
        if dir == 'U': head['y'] += 1
        if dir == 'D': head['y'] -= 1
        if dir == 'L': head['x'] -= 1
        if dir == 'R': head['x'] += 1
        for j in range(len(nodes) - 1):
            updateNode(nodes[j + 1], nodes[j])
        # if the tail is not already in the list of positions, add it
        if tail not in positions:
            positions.append(tail.copy())


print(len(positions))