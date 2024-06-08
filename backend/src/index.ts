import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

let currentValue = 50; // Last generated value for smooth transitions
const yMultipliers = [0.5, 0.75, 0.85, 0.95, 0.9, 1, 1.05, 1.1, 1.15, 1.2]; // Multipliers for each X value
const upperBound = 70; // Maximum allowed stock price
const lowerBound = 15; // Minimum allowed stock price

function generateNewPrice() {
  const x = Math.floor(Math.random() * 10); // Randomly select an X value between 0 and 9
  let multiplier = yMultipliers[x]; // Select corresponding Y multiplier

  let newValue = currentValue * multiplier;

  if (newValue > upperBound) {
    newValue = upperBound - (Math.random() * 5);
  } else if (newValue < lowerBound) {
    newValue = lowerBound + (Math.random() * 5);
  }

  currentValue = newValue;
}

setInterval(() => {
  generateNewPrice();
}, 1000);

const app = new Elysia()
  .use(cors())
  .get("/check", () => {
    return { value: currentValue };
  })
  .post(
    "/set",
    ({ body }) => {
      currentValue = body.value;
      return { value: body.value };
    },
    {
      body: t.Object({
        value: t.Number(),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
