package day1

import (
	_ "embed"
	"strconv"
	"strings"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	arr := strings.Split(string(input), "\n")
	top := 0
	top2 := 0
	top3 := 0
	var current int
	for _, v := range arr {
		if v == "" {
			if current > top {
				top3 = top2
				top2 = top
				top = current
			} else if current > top2 {
				top3 = top2
				top2 = current
			} else if current > top3 {
				top3 = current
			}
			current = 0
			continue
		}
		val, _ := strconv.Atoi(v)
		current += val
	}
	part1 := top
	part2 := top + top2 + top3
	return part1, part2
}
