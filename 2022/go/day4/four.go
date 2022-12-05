package day4

import (
	_ "embed"
	"fmt"
	"strings"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	lines := strings.Split(input, "\n")
	part1 := 0
	part2 := 0
	for _, line := range lines {
		var leftStart, leftEnd, rightStart, rightEnd int
		fmt.Sscanf(line, "%d-%d,%d-%d", &leftStart, &leftEnd, &rightStart, &rightEnd)
		if (leftStart <= rightStart && leftEnd >= rightEnd) || (rightStart <= leftStart && rightEnd >= leftEnd) {
			part1++
		}
		if !((rightStart > leftEnd) || (rightEnd < leftStart)) {
			part2++
		}
	}
	return part1, part2
}
