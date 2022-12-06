package day6

import (
	_ "embed"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	v1, v2 := 0, 0
	lastFour := []byte{}
	for i, c := range input {
		lastFour = append(lastFour, byte(c))
		if len(lastFour) > 4 {
			lastFour = lastFour[1:]
		}
		if len(uniqueChars(lastFour)) == 4 {
			v1 = i + 1
			break
		}
	}
	lastFourteen := []byte{}
	for i, c := range input {
		lastFourteen = append(lastFourteen, byte(c))
		if len(lastFourteen) > 14 {
			lastFourteen = lastFourteen[1:]
		}
		if len(uniqueChars(lastFourteen)) == 14 {
			v2 = i + 1
			break
		}
	}
	return v1, v2
}
func uniqueChars(s []byte) string {
	m := map[byte]bool{}
	for _, c := range s {
		m[c] = true
	}
	result := ""
	for c := range m {
		result += string(c)
	}
	return result
}
