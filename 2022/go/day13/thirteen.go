package day13

import (
	_ "embed"
	"encoding/json"
	"sort"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	chunks := strings.Split(strings.TrimSpace(input), "\n\n")
	packets := aocutils.ArrayMap(chunks, func(chunk string) []string {
		return strings.Split(chunk, "\n")
	})
	allPackets := aocutils.ArrayFilter(strings.Split(strings.TrimSpace(input), "\n"), func(str string) bool {
		return str != ""
	})
	var left interface{}
	var right interface{}
	indexSum := 0
	for i, packet := range packets {
		json.Unmarshal([]byte(packet[0]), &left)
		json.Unmarshal([]byte(packet[1]), &right)
		result := compare(left, right)
		if result == 1 {
			indexSum += i + 1
		}
	}

	allPackets = append(allPackets, "[[6]]", "[[2]]")
	var packet1 interface{}
	var packet2 interface{}
	sort.SliceStable(allPackets, func(i, j int) bool {
		json.Unmarshal([]byte(allPackets[i]), &packet1)
		json.Unmarshal([]byte(allPackets[j]), &packet2)
		result := compare(packet1, packet2)
		return result == 1
	})

	div1 := aocutils.ArrayFindIndex(allPackets, func(packet string) bool {
		divider := string(packet)
		return string(divider) == "[[6]]"
	})
	div2 := aocutils.ArrayFindIndex(allPackets, func(packet string) bool {
		divider := string(packet)
		return string(divider) == "[[2]]"
	})

	p2 := (div1 + 1) * (div2 + 1)
	return indexSum, p2
}

func compare(left, right interface{}) int {
	// compare numbers
	leftNum, numOK := left.(float64)
	rightNum, numOK2 := right.(float64)
	if numOK && numOK2 {
		if leftNum < rightNum {
			return 1
		} else if leftNum > rightNum {
			return -1
		}
		return 0
	}
	// compare arrays
	leftArr, arrOk := left.([]interface{})
	rightArr, arrOk2 := right.([]interface{})
	if arrOk && arrOk2 {
		for i := 0; i < len(leftArr); i++ {
			if i >= len(rightArr) {
				return -1
			}
			result := compare(leftArr[i], rightArr[i])
			if result != 0 {
				return result
			}
		}
		if len(leftArr) < len(rightArr) {
			return 1
		}
		return 0
	}
	// compare mismatched types
	if numOK && !numOK2 {
		leftArr = []interface{}{left}
		return compare(leftArr, right)
	} else if !numOK && numOK2 {
		rightArr = []interface{}{right}
		return compare(left, rightArr)
	}
	return -100
}
