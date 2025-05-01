Feature: Health Check

  Scenario: Check if the server is alive
    When I send a GET request to "/health"
    Then I should receive a 200 status code
    And the response should be "OK"
