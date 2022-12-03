package main

import (
	_ "embed"
	"fmt"
	"strings"
	"time"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func main() {
	times := []time.Duration{}
	for i := 0; i < 1000; i++ {
		times = append(times, execute())
	}
	sum := time.Duration(0)
	for _, t := range times {
		sum += t
	}
	fmt.Println(sum / 1000)
}

func execute() time.Duration {
	start := time.Now()
	lines := strings.Split(input, "\n")
	sum := aocutils.ArrayReduce(lines, func(sum int, line string) int {
		length := len(line)
		first := line[:length/2]
		second := line[length/2:]
		for _, char := range first {
			if strings.Contains(second, string(char)) {
				sum += strings.Index(alphabet, string(char)) + 1
				break
			}
		}
		return sum
	}, 0)

	sum2 := 0
	for i := 0; i < len(lines); i += 3 {
		first := lines[i]
		second := lines[i+1]
		third := lines[i+2]
		for _, char := range first {
			if strings.Contains(second, string(char)) && strings.Contains(third, string(char)) {
				sum2 += strings.Index(alphabet, string(char)) + 1
				break
			}
		}
	}
	duration := time.Since(start)
	fmt.Println(sum, sum2)
	return duration
}
