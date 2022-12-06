const INPUT: &str = include_str!("input.txt");

pub fn execute() -> [u32; 2] {
    let mut score = 0;
    let mut score2 = 0;
    for line in INPUT.lines() {
        let player = line.chars().nth(2).unwrap();
        let elf = line.chars().nth(0).unwrap();
        match player {
            'X' => {
                score += 1;
                match elf {
                    'A' => {
                        score += 3;
                        score2 += 3;
                    }
                    'B' => score2 += 1,
                    'C' => {
                        score += 6;
                        score2 += 2;
                    }
                    _ => panic!("AOC in block??"),
                }
            }
            'Y' => {
                score += 2;
                score2 += 3;
                match elf {
                    'A' => {
                        score += 6;
                        score2 += 1;
                    }
                    'B' => {
                        score += 3;
                        score2 += 2;
                    }
                    'C' => score2 += 3,
                    _ => panic!("AOC in block??"),
                }
            }
            'Z' => {
                score += 3;
                score2 += 6;
                match elf {
                    'A' => score2 += 2,
                    'B' => {
                        score += 6;
                        score2 += 3;
                    }
                    'C' => {
                        score += 3;
                        score2 += 1;
                    }
                    _ => panic!("AOC in block??"),
                }
            }
            _ => panic!("AOC???"),
        }
    }
    return [score, score2];
}
