import path from "node:path";
import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { SuperTest } from "supertest";
import Test from "supertest/lib/test";
import { expect } from "vitest";
import { app } from "#src/app.ts";
import { createUwsSupertest } from "#tests/utils/uWSSupertest.ts";

const feature = await loadFeature(
  path.join(__dirname, "../features/health.feature"),
);

describeFeature(feature, ({ Scenario }) => {
  Scenario("Check if the server is alive", ({ When, Then, And }) => {
    const request = createUwsSupertest(app);
    let response: Awaited<ReturnType<typeof request.get>>;

    When('I send a GET request to "/health"', async () => {
      response = await request.get("/health");
    });

    Then("I should receive a 200 status code", () => {
      expect(response.status).toBe(200);
    });

    And('the response should be "OK"', () => {
      expect(response.text).toBe("OK");
    });
  });
});
