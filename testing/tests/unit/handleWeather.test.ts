import { handleWeather, WeatherInfo } from "@/utils/weather/handleWeather";

global.fetch = jest.fn();

describe("handleWeather", () => {
  const mockWeatherData = {
    current: {
      temp_f: 72,
      condition: {
        text: "Sunny",
        code: 1000,
      },
      is_day: 1,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns weather info on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    const result = await handleWeather({
      city: "Los Angeles",
      stateOrCountry: "CA",
    });
    expect(result.temperature).toBe(72);
    expect(result.condition).toBe("Sunny");
    expect(result.code).toBe(1000);
    expect(typeof result.icon).toBe("function");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("Los Angeles, CA"),
    );
  });

  it("throws an error if fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(
      handleWeather({ city: "Nowhere", stateOrCountry: "ZZ" }),
    ).rejects.toThrow("Failed to fetch weather data.");
  });
});
