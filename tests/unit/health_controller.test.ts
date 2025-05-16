import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { HealthRouter } from "../../src/apps/core/health/api/health_controller";

describe("HealthRouter", () => {
  describe("getHealth", () => {
    it("should return 'OK'", () => {
      // Arrange
      const router = new HealthRouter();

      // Act
      const result = router.getHealth();

      // Assert
      expect(result).toBe("OK");
    });

    it("should return a string (type-level assertion)", () => {
      // Arrange
      const router = new HealthRouter();

      // Act
      const result = router.getHealth();

      // Assert
      expectTypeOf(result).toBeString();
    });

    it("should not throw when called", () => {
      // Arrange
      const router = new HealthRouter();

      // Act & Assert
      expect(() => router.getHealth()).not.toThrow();
    });

    it("should be callable and spyable (demonstration of spy)", () => {
      // Arrange
      const router = new HealthRouter();
      const spy = vi.spyOn(router, "getHealth");

      // Act
      const result = router.getHealth();

      // Assert
      expect(spy).toHaveBeenCalledOnce();
      expect(result).toBe("OK");
      spy.mockRestore();
    });
  });
});
