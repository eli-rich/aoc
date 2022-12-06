const INPUT: &str = include_str!("input.txt");
const ALPHABET: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
pub fn execute() -> [u32; 2] {
    let lines = INPUT.lines();
    let sum = lines.fold(0, |mut acc, line| {
        let length = line.len();
        let first = line.chars().take(length / 2).collect::<Vec<char>>();
        let second = line.chars().skip(length / 2).collect::<Vec<char>>();
        for (_i, c) in first.iter().enumerate() {
            if second.contains(c) {
                acc += ALPHABET.find(*c).unwrap() + 1;
                break;
            }
        }
        return acc;
    });
    let mut sum2 = 0;
    let line_collection: Vec<_> = INPUT.lines().collect();
    for i in (0..line_collection.len()).step_by(3) {
        let first = line_collection[i].chars().collect::<Vec<char>>();
        let second = line_collection[i + 1].chars().collect::<Vec<char>>();
        let third = line_collection[i + 2].chars().collect::<Vec<char>>();
        for (_, c) in first.iter().enumerate() {
            if second.contains(c) && third.contains(c) {
                sum2 += ALPHABET.find(*c).unwrap() + 1;
                break;
            }
        }
    }
    return [sum as u32, sum2 as u32];
}
