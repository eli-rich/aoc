package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/eli-rich/aco/go/day1"
	"github.com/eli-rich/aco/go/day2"
	"github.com/eli-rich/aco/go/day3"
	"github.com/fatih/color"
	"github.com/rodaine/table"
)

type DayFunc = func() (time.Duration, int, int)

const ITERATIONS = 500
const CURRENT_DAY = 3

func main() {
	headerFmt := color.New(color.FgGreen, color.Underline).SprintfFunc()
	columnFmt := color.New(color.FgYellow).SprintfFunc()

	tbl := table.New("Day", "Part 1", "Part 2", "Time")
	tbl.WithHeaderFormatter(headerFmt).WithFirstColumnFormatter(columnFmt)

	var functions []DayFunc = []DayFunc{
		d1,
		d2,
		d3,
	}
	times := make([]time.Duration, CURRENT_DAY)
	for i := 0; i < CURRENT_DAY; i++ {
		elapsed, part1, part2 := sim(functions[i])
		times[i] = elapsed
		tbl.AddRow("Day "+strconv.Itoa(i+1), part1, part2, fmt.Sprint(elapsed))
	}
	avg := time.Duration(0)
	for _, t := range times {
		avg += t
	}
	avg /= CURRENT_DAY
	tbl.AddRow("", "", "", "")
	tbl.AddRow("Average", "", "", fmt.Sprint(avg))
	tbl.Print()
}

func sim(fn DayFunc) (time.Duration, int, int) {
	times := make([]time.Duration, ITERATIONS)
	p1, p2 := 0, 0
	for i := 0; i < ITERATIONS; i++ {
		elapsed, part1, part2 := fn()
		times[i] = elapsed
		p1, p2 = part1, part2
	}
	avg := time.Duration(0)
	for _, t := range times {
		avg += t
	}
	avg /= ITERATIONS
	return avg, p1, p2
}

func d1() (time.Duration, int, int) {
	start := time.Now()
	part1, part2 := day1.Execute()
	elapsed := time.Since(start)
	return elapsed, part1, part2
}

func d2() (time.Duration, int, int) {
	start := time.Now()
	part1, part2 := day2.Execute()
	elapsed := time.Since(start)
	return elapsed, part1, part2
}

func d3() (time.Duration, int, int) {
	start := time.Now()
	part1, part2 := day3.Execute()
	elapsed := time.Since(start)
	return elapsed, part1, part2
}
