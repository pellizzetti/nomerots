import express from "express";
import http from "http";
import cors from "cors";

type Memo = { [key: string]: number };

const app = express();
app.use(cors());

const server = http.createServer(app);

function calculateFibonacciSequenceWithoutMemoization(number: number): number {
  if (number <= 1) {
    return 1;
  }

  return (
    calculateFibonacciSequenceWithoutMemoization(number - 1) +
    calculateFibonacciSequenceWithoutMemoization(number - 2)
  );
}

function calculateFibonacciSequence(number: number, memo: Memo = {}): number {
  if (memo[number]) {
    return memo[number];
  }

  if (number <= 1) {
    return 1;
  }

  memo[number] =
    calculateFibonacciSequence(number - 1, memo) +
    calculateFibonacciSequence(number - 2, memo);

  return memo[number];
}

app.get("/health", (_request, response) =>
  response.json({
    message: "OK",
  })
);

app.get("/fibonnaci/:number", (request, response) => {
  const { fast } = request.query;
  const number = parseInt(request.params.number as string, 10);

  const result = !!fast
    ? calculateFibonacciSequence(number)
    : calculateFibonacciSequenceWithoutMemoization(number);

  return response.json({
    result,
    version: process.env.VERSION || "0.0.1",
  });
});

export default server;
