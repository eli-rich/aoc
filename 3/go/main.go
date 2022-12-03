package main

import (
	_ "embed"
	"fmt"
	"strings"
	"time"
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
	sum := 0
	for _, line := range lines {
		first := line[:len(line)/2]
		second := line[len(line)/2:]
		for _, char := range first {
			if strings.Contains(second, string(char)) {
				sum += strings.Index(alphabet, string(char)) + 1
				break
			}
		}
	}
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
	return time.Since(start)
}
