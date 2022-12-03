package day1

import (
	_ "embed"
	"sort"
	"strconv"
	"strings"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	arr := strings.Split(string(input), "\n")
	var totals []int
	var current int
	for _, v := range arr {
		if v == "" {
			totals = append(totals, current)
			current = 0
			continue
		}
		val, _ := strconv.Atoi(v)
		current += val
	}
	sort.Sort(sort.Reverse(sort.IntSlice(totals)))
	part1 := totals[0]
	part2 := totals[0] + totals[1] + totals[2]
	return part1, part2
}
