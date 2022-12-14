package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/eli-rich/aoc/go/day1"
	"github.com/eli-rich/aoc/go/day10"
	"github.com/eli-rich/aoc/go/day11"
	"github.com/eli-rich/aoc/go/day12"
	"github.com/eli-rich/aoc/go/day13"
	"github.com/eli-rich/aoc/go/day14"
	"github.com/eli-rich/aoc/go/day15"
	"github.com/eli-rich/aoc/go/day2"
	"github.com/eli-rich/aoc/go/day3"
	"github.com/eli-rich/aoc/go/day4"
	"github.com/eli-rich/aoc/go/day5"
	"github.com/eli-rich/aoc/go/day6"
	"github.com/eli-rich/aoc/go/day7"
	"github.com/eli-rich/aoc/go/day8"
	"github.com/eli-rich/aoc/go/day9"
	"github.com/fatih/color"
	"github.com/rodaine/table"
)

type DayFunc = func() (time.Duration, string, string)

const ITERATIONS = 10
const CURRENT_DAY = 15

func main() {
	headerFmt := color.New(color.FgGreen, color.Underline).SprintfFunc()
	columnFmt := color.New(color.FgYellow).SprintfFunc()

	tbl := table.New("Day", "Part 1", "Part 2", "Time")
	tbl.WithHeaderFormatter(headerFmt).WithFirstColumnFormatter(columnFmt)

	var functions []DayFunc = []DayFunc{
		d1,
		d2,
		d3,
		d4,
		d5,
		d6,
		d7,
		d8,
		d9,
		d10,
		d11,
		d12,
		d13,
		d14,
		d15,
	}
	times := make([]time.Duration, CURRENT_DAY)
	for i := 0; i < CURRENT_DAY; i++ {
		elapsed, part1, part2 := sim(functions[i])
		times[i] = elapsed
		tbl.AddRow("Day "+strconv.Itoa(i+1), part1, part2, fmt.Sprint(elapsed))
	}
	total := time.Duration(0)
	for _, t := range times {
		total += t
	}
	tbl.AddRow("", "", "", "")
	tbl.AddRow("Total", "", "", fmt.Sprint(total))
	tbl.Print()
}

func sim(fn DayFunc) (time.Duration, string, string) {
	times := make([]time.Duration, ITERATIONS)
	p1, p2 := "", ""
	for i := 0; i < ITERATIONS; i++ {
		elapsed, part1, part2 := fn()
		times[i] = elapsed
		p1, p2 = part1, part2
	}
	shortest := times[0]
	for _, t := range times {
		if t < shortest {
			shortest = t
		}
	}
	return shortest, p1, p2
}

func d1() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day1.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d2() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day2.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d3() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day3.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d4() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day4.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d5() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day5.Execute()
	elapsed := time.Since(start)
	r1 := part1
	r2 := part2
	return elapsed, r1, r2
}

func d6() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day6.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d7() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day7.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d8() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day8.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d9() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day9.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := strconv.Itoa(part2)
	return elapsed, r1, r2
}

func d10() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day10.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(part1)
	r2 := read(part2)
	return elapsed, r1, r2
}

func d11() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day11.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(int(part1))
	r2 := strconv.Itoa(int(part2))
	return elapsed, r1, r2
}

func d12() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day12.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(int(part1))
	r2 := strconv.Itoa(int(part2))
	return elapsed, r1, r2
}

func d13() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day13.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(int(part1))
	r2 := strconv.Itoa(int(part2))
	return elapsed, r1, r2
}

func d14() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day14.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(int(part1))
	r2 := strconv.Itoa(int(part2))
	return elapsed, r1, r2
}

func d15() (time.Duration, string, string) {
	start := time.Now()
	part1, part2 := day15.Execute()
	elapsed := time.Since(start)
	r1 := strconv.Itoa(int(part1))
	r2 := strconv.Itoa(int(part2))
	return elapsed, r1, r2
}
