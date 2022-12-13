package day13

import (
	_ "embed"
	"encoding/json"
	"reflect"
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
	if reflect.TypeOf(left).Kind() == reflect.Float64 && reflect.TypeOf(right).Kind() == reflect.Float64 {
		if left.(float64) < right.(float64) {
			return 1
		} else if left.(float64) > right.(float64) {
			return -1
		}
		return 0
	}
	if reflect.TypeOf(left).Kind() == reflect.Slice && reflect.TypeOf(right).Kind() == reflect.Slice {
		switch left.(type) {
		case []float64:
			switch right.(type) {
			case []float64:
				for i := 0; i < len(left.([]float64)); i++ {
					if i > len(right.([]float64))-1 {
						return -1
					}
					result := compare(left.([]float64)[i], right.([]float64)[i])
					if result != 0 {
						return result
					}
				}
				if len(left.([]float64)) < len(right.([]float64)) {
					return 1
				}
				return 0
			case []interface{}:
				for i := 0; i < len(left.([]float64)); i++ {
					if i > len(right.([]interface{}))-1 {
						return -1
					}
					result := compare(left.([]float64)[i], right.([]interface{})[i])
					if result != 0 {
						return result
					}
				}
				if len(left.([]float64)) < len(right.([]interface{})) {
					return 1
				}
				return 0
			}
		case []interface{}:
			switch right.(type) {
			case []interface{}:
				for i := 0; i < len(left.([]interface{})); i++ {
					if i > len(right.([]interface{}))-1 {
						return -1
					}
					result := compare(left.([]interface{})[i], right.([]interface{})[i])
					if result != 0 {
						return result
					}
				}
				if len(left.([]interface{})) < len(right.([]interface{})) {
					return 1
				}
				return 0
			case []float64:
				for i := 0; i < len(left.([]interface{})); i++ {
					if i > len(right.([]float64))-1 {
						return -1
					}
					result := compare(left.([]interface{})[i], right.([]float64)[i])
					if result != 0 {
						return result
					}
				}
				if len(left.([]interface{})) < len(right.([]float64)) {
					return 1
				}
				return 0
			}
		}
		return 0
	}
	if reflect.TypeOf(left).Kind() == reflect.Float64 {
		arrLeft := make([]float64, 0)
		arrLeft = append(arrLeft, left.(float64))
		return compare(arrLeft, right)
	} else if reflect.TypeOf(right).Kind() == reflect.Float64 {
		arrRight := make([]float64, 0)
		arrRight = append(arrRight, right.(float64))
		return compare(left, arrRight)
	}
	return -100
}
