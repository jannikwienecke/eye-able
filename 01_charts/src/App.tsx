import { ChartCard } from "./components/chart-card";
import { SelectYears } from "./components/select-years";
import { useChartData } from "./use-chart-data";
import { Loader2 } from "lucide-react";

function App() {
  const { hasData, loading, error, schemaError, chartData, years, setYears } =
    useChartData();

  if (loading && !hasData) {
    return (
      <>
        <div
          className="flex h-screen items-center justify-center"
          aria-busy="true"
        >
          <span
            className="text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            Loading…
          </span>
        </div>
      </>
    );
  }

  if (error || schemaError) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <span className="text-destructive" role="alert">
            {schemaError || "Failed to load data."}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold py-8">US Population Growth</h1>

          <main
            id="main-content"
            role="main"
            className="w-full max-w-3xl mx-auto flex flex-col gap-2"
            aria-busy={loading ? true : undefined}
          >
            <label id="years-label" className="text-sm text-muted-foreground">
              Select years to show
            </label>

            <div className="flex flex-row gap-2">
              <SelectYears
                value={String(years)}
                onChange={(value) => setYears(parseInt(value, 10))}
                labelId="years-label"
              />

              {loading && (
                <div className="flex items-center justify-center">
                  <span className="text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                </div>
              )}
            </div>

            <ChartCard chartData={chartData ?? []} />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
