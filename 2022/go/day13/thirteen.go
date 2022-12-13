package day13

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"reflect"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed test.txt
var input string

func Execute() (int, int) {
	chunks := strings.Split(strings.TrimSpace(input), "\n\n")
	packets := aocutils.ArrayMap(chunks, func(chunk string) []string {
		return strings.Split(chunk, "\n")
	})
	var left interface{}
	var right interface{}
	json.Unmarshal([]byte(packets[1][0]), &left)
	json.Unmarshal([]byte(packets[1][1]), &right)
	result := compare(left, right)
	fmt.Println(result)

	os.Exit(0)
	return 0, 0
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
