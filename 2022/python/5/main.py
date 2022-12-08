data = ''
with open('input.txt', 'r') as f:
    data = f.read()

lines = data.splitlines()



def parse_step_stacks(lines: list[str]):
    step_stacks: dict[str, any] = {}
    stack_lines = parse_stacks(lines)
    stacks = stack_lines["stacks"]
    line: int = stack_lines["line"]
    steps = parse_steps(lines, line + 2)
    step_stacks["stacks"] = stacks
    step_stacks["steps"] = steps
    return step_stacks



def parse_steps(lines: list[str], start_line: int):
    steps = []
    for i in range(start_line, len(lines)):
        if lines[i] == "":
            break
        line = lines[i].split(" ")
        quantity = int(line[1])
        from_pos = int(line[3]) - 1
        to_pos = int(line[5]) - 1
        steps.append({"quantity": quantity, "from_pos": from_pos, "to_pos": to_pos})
    return steps




def parse_stacks(lines: list[str]):
    stacks = []
    for i in range(0, len(lines)):
        if not "[" in lines[i]:
            return {"stacks": stacks, "line": i}
        # THANK YOU @Lebster#0617
        crate = lines[i].replace("    ", "-")
        crate = crate.replace(" ", "")
        crate = crate.replace("[", "")
        crate = crate.replace("]", "")
        # Result here will be -D- for example line 1
        stacks.append(list(crate))
    return {"stacks": stacks, "line": i}

def transpose_stacks(stacks: list[list[str]]) -> list[list[str]]:
    transposed = []
    for stack in stacks:
        for j in range(0, len(stack)):
            crate = stack[j]
            if len(transposed) <= j:
                transposed.append([])
            transposed[j].append(crate)
    transposed = [x for x in transposed if x != []]
    for stack in transposed:
        for crate in stack:
            if crate == '-':
                stack.remove(crate)
    return transposed


def doOne(stacks: list[list[str]], step: dict[str, int]):
    from_pos = step["from_pos"]
    to_pos = step["to_pos"]
    quantity = step["quantity"]
    print(f"Moving {quantity} from {from_pos} to {to_pos}")
    for _ in range(0, quantity):
        stacks[to_pos].insert(0, stacks[from_pos].pop(0))
    return stacks

def do(stacks: list[list[str]], step: dict[str, int]):
    from_pos = step["from_pos"]
    to_pos = step["to_pos"]
    quantity = step["quantity"]
    tmp = []
    for _ in range(0, quantity):
        tmp.append(stacks[from_pos].pop(0))
    for _ in range(0, quantity):
        stacks[to_pos].insert(0, tmp.pop())
    return stacks

def get_top(stacks: list[list[str]]):
    top = []
    for stack in stacks:
        top.append(stack[0])
    return ''.join(top)

def deep_copy(stacks: list[list[str]]):
    return [x.copy() for x in stacks]


step_stacks = parse_step_stacks(lines)
stacks: list[str] = step_stacks["stacks"]
steps: list[dict[str, int]] = step_stacks["steps"]
stacks = transpose_stacks(stacks)
p2_stacks = deep_copy(stacks)



for step in steps:
    stacks = doOne(stacks, step)
    p2_stacks = do(p2_stacks, step)


print(get_top(stacks))
print(get_top(p2_stacks))
