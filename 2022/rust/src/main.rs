mod day1;
mod day2;
mod day3;
mod day4;
use std::fmt::Display;
use std::time::{Duration, Instant};

use tabled::{Table, Tabled};

struct Day<R: Display> {
    durations: [Duration; ITERATIONS],
    result: [R; 2],
}
type DurationString = String;
#[derive(Tabled)]
struct Output {
    day: String,
    part1: String,
    part2: String,
    average: DurationString,
}

const DAYS: usize = 4;
const ITERATIONS: usize = 500;

fn main() {
    let funcs = [d1, d2, d3, d4];
    let mut outputs: Vec<Output> = Vec::new();
    let mut averages = [Duration::new(0, 0); DAYS];
    for i in 0..DAYS {
        let results = funcs[i]();
        let average = average(results.durations);
        averages[i] = average;
        let output = Output {
            day: (i + 1).to_string(),
            part1: results.result[0].to_string(),
            part2: results.result[1].to_string(),
            average: format!("{:?}", average),
        };
        outputs.push(output);
    }
    // sum averages to get total time
    let total = format!("{:?}", sum_averages(averages));
    outputs.push(Output {
        day: "Total".to_string(),
        part1: "".to_string(),
        part2: "".to_string(),
        average: total,
    });
    let table = Table::new(outputs).to_string();
    println!("{}", table);
}

fn sum_averages(averages: [Duration; DAYS]) -> Duration {
    let mut total = Duration::new(0, 0);
    for duration in averages {
        total += duration;
    }
    return total;
}

fn average(durations: [Duration; ITERATIONS]) -> Duration {
    let mut total = Duration::new(0, 0);
    for duration in durations {
        total += duration;
    }
    return total / ITERATIONS.try_into().unwrap();
}

fn d1() -> Day<String> {
    let mut durations: [Duration; ITERATIONS] = [Duration::new(0, 0); ITERATIONS];
    for i in 0..ITERATIONS {
        let start = Instant::now();
        day1::execute();
        durations[i] = start.elapsed();
    }
    return Day {
        durations,
        result: day1::execute().map(|x| x.to_string()),
    };
}

fn d2() -> Day<String> {
    let mut durations: [Duration; ITERATIONS] = [Duration::new(0, 0); ITERATIONS];
    for i in 0..ITERATIONS {
        let start = Instant::now();
        day2::execute();
        durations[i] = start.elapsed();
    }
    return Day {
        durations,
        result: day2::execute().map(|x| x.to_string()),
    };
}

fn d3() -> Day<String> {
    let mut durations: [Duration; ITERATIONS] = [Duration::new(0, 0); ITERATIONS];
    for i in 0..ITERATIONS {
        let start = Instant::now();
        day3::execute();
        durations[i] = start.elapsed();
    }
    return Day {
        durations,
        result: day3::execute().map(|x| x.to_string()),
    };
}

fn d4() -> Day<String> {
    let mut durations: [Duration; ITERATIONS] = [Duration::new(0, 0); ITERATIONS];
    for i in 0..ITERATIONS {
        let start = Instant::now();
        day4::execute();
        durations[i] = start.elapsed();
    }
    return Day {
        durations,
        result: day4::execute().map(|x| x.to_string()),
    };
}