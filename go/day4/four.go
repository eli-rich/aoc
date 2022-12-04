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
		leftStart, _ := strconv.ParseInt(splitDash[0][0], 10, 32)
		leftEnd, _ := strconv.ParseInt(splitDash[0][1], 10, 32)
		rightStart, _ := strconv.ParseInt(splitDash[1][0], 10, 32)
		rightEnd, _ := strconv.ParseInt(splitDash[1][1], 10, 32)
		if (leftStart <= rightStart && leftEnd >= rightEnd) || (rightStart <= leftStart && rightEnd >= leftEnd) {
			part1++
		}
		if !((rightStart > leftEnd) || (rightEnd < leftStart)) {
			part2++
		}
	}
	return part1, part2
}
