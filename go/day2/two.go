package day2

import (
	_ "embed"
	"strings"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	score := 0
	score2 := 0
	lines := strings.Split(input, "\n")
	for _, line := range lines {
		switch line[2] {
		case 'X':
			score += 1
			switch line[0] {
			case 'A':
				score += 3
				score2 += 3
			case 'B':
				score2 += 1
			case 'C':
				score += 6
				score2 += 2
			}
		case 'Y':
			score += 2
			score2 += 3
			switch line[0] {
			case 'A':
				score2 += 1
				score += 6
			case 'B':
				score2 += 2
				score += 3
			case 'C':
				score2 += 3
			}
		default:
			score += 3
			score2 += 6
			switch line[0] {
			case 'A':
				score2 += 2
			case 'B':
				score += 6
				score2 += 3
			case 'C':
				score += 3
				score2 += 1
			}
		}
	}
	return score, score2
}
