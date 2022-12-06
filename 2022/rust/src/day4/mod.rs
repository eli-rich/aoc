const INPUT: &str = include_str!("input.txt");

#[derive(Debug)]
struct Range {
    start: u32,
    end: u32,
}

pub fn execute() -> [u32; 2] {
    let result: [u32; 2] = INPUT
        .lines()
        .map(|line| {
            let mut split = line.split(",");
            let left = split.next().unwrap();
            let right = split.next().unwrap();

            let mut left_split = left.split("-");
            let left_start = left_split.next().unwrap().parse::<u32>().unwrap();
            let left_end = left_split.next().unwrap().parse::<u32>().unwrap();

            let mut right_split = right.split("-");
            let right_start = right_split.next().unwrap().parse::<u32>().unwrap();
            let right_end = right_split.next().unwrap().parse::<u32>().unwrap();

            return [
                Range {
                    start: left_start,
                    end: left_end,
                },
                Range {
                    start: right_start,
                    end: right_end,
                },
            ];
        })
        .fold([0, 0], |mut acc, pair| {
            let left = &pair[0];
            let right = &pair[1];

            if (left.start <= right.start && left.end >= right.end)
                || (right.start <= left.start && right.end >= left.end)
            {
                acc[0] += 1;
            }
            if !((right.start > left.end) || (right.end < left.start)) {
                acc[1] += 1;
            }
            return acc;
        });
    return result;
}
