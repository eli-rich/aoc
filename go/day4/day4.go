package day4

import (
	_ "embed"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	lines := strings.Split(input, "\n")
	part1 := 0
	part2 := 0
	for _, line := range lines {
		splitComma := strings.Split(line, ",")
		splitDash := aocutils.ArrayMap(splitComma, func(s string) []string {
			return strings.Split(s, "-")
		})
		leftStart, _ := strconv.Atoi(splitDash[0][0])
		leftEnd, _ := strconv.Atoi(splitDash[0][1])
		rightStart, _ := strconv.Atoi(splitDash[1][0])
		rightEnd, _ := strconv.Atoi(splitDash[1][1])
		if (leftStart <= rightStart && leftEnd >= rightEnd) || (rightStart <= leftStart && rightEnd >= leftEnd) {
			part1++
		}
		if (leftStart <= rightEnd && leftEnd >= rightStart) || (rightStart <= leftEnd && rightEnd >= leftStart) {
			part2++
		}
	}
	return part1, part2
}
