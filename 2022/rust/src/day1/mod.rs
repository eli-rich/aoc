const INPUT: &str = include_str!("input.txt");
pub fn execute() -> [u32; 2] {
    let mut chunks: Vec<_> = INPUT
        .split("\n\n")
        .map(|chunk| {
            chunk
                .lines()
                .map(|line| line.parse::<u32>().unwrap())
                .sum::<u32>()
        })
        .collect();
    chunks.sort();
    let answers = [
        *chunks.last().unwrap(),
        chunks.into_iter().rev().take(3).sum::<u32>(),
    ];
    return answers;
}
