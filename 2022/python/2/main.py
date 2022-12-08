data = ''
with open('input.txt', 'r') as f:
    data = f.read()

data = data.splitlines()

score = 0
score2 = 0

for line in data:
    match line[2]:
        case 'X':
            score += 1
            match line[0]:
                case 'A':
                    score += 3
                    score2 += 3
                case 'B':
                    score2 += 1
                case 'C':
                    score += 6
                    score2 += 2
        case 'Y':
            score += 2
            score2 += 3
            match line[0]:
                case 'A':
                    score += 6
                    score2 += 1
                case 'B':
                    score += 3
                    score2 += 2
                case 'C':
                    score2 += 3
        case 'Z':
            score += 3
            score2 += 6
            match line[0]:
                case 'A':
                    score2 += 2
                case 'B':
                    score += 6
                    score2 += 3
                case 'C':
                    score += 3
                    score2 += 1

print(score)
print(score2)