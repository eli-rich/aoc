from functools import reduce

data = ''
with open('input.txt', 'r') as f:
    data = f.read()

data = data.splitlines()

alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

def reducer(sum, line):
    length = len(line)
    first = line[:int(length/2)]
    second = line[int(length/2):]
    for char in first:
        if char in second:
            sum += alphabet.index(char) + 1
            break
    return sum

sum = reduce(reducer, data, 0)


sum2 = 0
for i in range(0, len(data), 3):
    first = data[i]
    second = data[i+1]
    third = data[i+2]
    for char in first:
        if char in second and char in third:
            sum2 += alphabet.index(char) + 1
            break

print(sum)
print(sum2)