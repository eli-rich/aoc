package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

func main() {
	fmt.Println(answer1(), answer2())
}

func answer1() int {
	// part 1
	calories, _ := os.ReadFile("input.txt")
	arr := strings.Split(string(calories), "\n")
	var total int
	var current int
	for _, v := range arr {
		if v == "" {
			if current > total {
				total = current
			}
			current = 0
			continue
		}
		val, _ := strconv.Atoi(v)
		current += val
	}
	return total
}

func answer2() int {
	// part 2
	calories, _ := os.ReadFile("input.txt")
	arr := strings.Split(string(calories), "\n")
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
	sum := totals[0] + totals[1] + totals[2]
	return sum
}
