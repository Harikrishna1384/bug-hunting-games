import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "./models/Challenge.js";

dotenv.config();

const challenges = [
  {
    title: "Fix the Missing Colon",
    description: "Debug the code. There's a syntax error.",
    category: "software",
    errorType: "syntax error",
    difficulty: "easy",
    buggyCodes: ["a, b = map(int, input().split())\nnprint(a + b)"],
    correctCode: "a, b = map(int, input().split())\nprint(a + b)",
    testCases: [{ input: "1 2", expectedOutput: "3" }],
  },
  {
    title: "Validate IoT Temperature Data",
    description:
      "An IoT device sends temperature readings every minute. Sometimes, sensor errors cause temperatures far outside the physical range (like -100°C or 999°C) to be sent. Fix the code to discard any temperature outside the range -40 to 85°C before saving to database.",
    category: "hardware",
    errorType: "validation error",
    difficulty: "easy",
    buggyCodes: [
      `reading = int(input())
# Bug: No validation, accepts any reading
print("saved")`,
    ],
    correctCode: `reading = int(input())
if reading < -40 or reading > 85:
    print("Error: out of range")
else:
    print("saved")`,
    testCases: [
      { input: "24", expectedOutput: "saved" },
      { input: "-100", expectedOutput: "Error: out of range" },
      { input: "90", expectedOutput: "Error: out of range" },
    ],
  },
  {
    title: "Python Factorial Print",
    description: "Fix the syntax error in this Python code that prints the factorial of a number.",
    category: "software",
    errorType: "syntax error",
    difficulty: "easy",
    buggyCodes: [
      `n = int(input())
fact = 1
for i in range(1, n+1)
    fact *= i
print(fact)`
    ],
    correctCode: `n = int(input())
fact = 1
for i in range(1, n+1):
    fact *= i
print(fact)`,
    testCases: [
      { input: "5", expectedOutput: "120" }
    ],
  },
  {
    title: "Sum of List Elements",
    description: "Fix the bug in this code that should print the sum of a list of numbers.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `nums = list(map(int, input().split()))
total = 0
for num in nums:
    total = num
print(total)`
    ],
    correctCode: `nums = list(map(int, input().split()))
total = 0
for num in nums:
    total += num
print(total)`,
    testCases: [
      { input: "1 2 3 4", expectedOutput: "10" }
    ],
  },
  {
    title: "Print Even Numbers",
    description: "Fix the bug so the code prints only even numbers from the input list.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `nums = list(map(int, input().split()))
for num in nums:
    if num % 2 == 1:
        print(num)`
    ],
    correctCode: `nums = list(map(int, input().split()))
for num in nums:
    if num % 2 == 0:
        print(num)`,
    testCases: [
      { input: "1 2 3 4", expectedOutput: "2\n4" }
    ],
  },
  {
    title: "Temperature Conversion",
    description: "Fix the bug in converting Celsius to Fahrenheit and print the result.",
    category: "hardware",
    errorType: "conversion error",
    difficulty: "easy",
    buggyCodes: [
      `celsius = int(input())
fahrenheit = celsius * 1.8
print(fahrenheit)`
    ],
    correctCode: `celsius = int(input())
fahrenheit = celsius * 1.8 + 32
print(fahrenheit)`,
    testCases: [
      { input: "0", expectedOutput: "32.0" }
    ],
  },
  {
    title: "Print Numbers in Reverse",
    description: "Fix the bug so the code prints numbers from n down to 1.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `n = int(input())
for i in range(1, n+1):
    print(i)`
    ],
    correctCode: `n = int(input())
for i in range(n, 0, -1):
    print(i)`,
    testCases: [
      { input: "3", expectedOutput: "3\n2\n1" }
    ],
  },
  {
    title: "Sum of Digits",
    description: "Fix the bug so the code prints the sum of digits of the input number.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `num = input()
total = 0
for d in num:
    total = d
print(total)`
    ],
    correctCode: `num = input()
total = 0
for d in num:
    total += int(d)
print(total)`,
    testCases: [
      { input: "123", expectedOutput: "6" }
    ],
  },
  {
    title: "Find Maximum",
    description: "Fix the bug so the code prints the maximum number from the input list.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `nums = list(map(int, input().split()))
max_num = 0
for num in nums:
    if num > max_num:
        max_num = num
print(max_num)`
    ],
    correctCode: `nums = list(map(int, input().split()))
max_num = nums[0]
for num in nums:
    if num > max_num:
        max_num = num
print(max_num)`,
    testCases: [
      { input: "2 5 1 9", expectedOutput: "9" }
    ],
  },
  {
    title: "Count Vowels",
    description: "Fix the bug so the code prints the number of vowels in the input string.",
    category: "software",
    errorType: "logical error",
    difficulty: "easy",
    buggyCodes: [
      `s = input()
count = 0
for ch in s:
    if ch in "aeiou":
        count = count + 1
print(count)`
    ],
    correctCode: `s = input()
count = 0
for ch in s.lower():
    if ch in "aeiou":
        count = count + 1
print(count)`,
    testCases: [
      { input: "Hello", expectedOutput: "2" }
    ],
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Only affect challenges collection, leave users untouched
    await Challenge.deleteMany();
    await Challenge.insertMany(challenges);
    console.log("Challenges seeded successfully.");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
