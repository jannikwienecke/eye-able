import { useState, useEffect } from "react";
import { DataSchema, type ChartDataType, type DataResponse } from "./types";
import { BASE_URL_HONOLU_API } from "./constants";

const CUBE = "pums_5";
const DRILLDOWNS = "Nation,Year";
const MEASURES = "Total+Population";
const ORDER = "Year:desc";
// This nation id is for the United States
const NATION = "01000US";

export const useChartData = () => {
  const [years, setYears] = useState<number>(3);
  const [data, setData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  //   Normally we would use rather a library like react-query or swr to handle this and more.
  const [cache, setCache] = useState<{ [key: string]: DataResponse }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = `${BASE_URL_HONOLU_API}?cube=${CUBE}&drilldowns=${DRILLDOWNS}&measures=${MEASURES}&order=${ORDER}&limit=${years}&Nation=${NATION}`;

        if (cache[url]) {
          setData(cache[url]);
          return;
        }

        const response = await fetch(url);

        const data = await response.json();

        const parseResult = DataSchema.safeParse(data);

        if (!parseResult.success) {
          setSchemaError(parseResult.error.message);
          return;
        }

        setCache((prev) => ({ ...prev, [url]: parseResult.data }));
        setSchemaError(null);
        setError(null);
        setData(parseResult.data);
      } catch (error) {
        setError(error as unknown as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [years, cache]);

  const chartData: ChartDataType[] =
    data?.data.map((item) => ({
      Years: item.Year.toString(),
      Population: item["Total Population"],
    })) ?? [];

  return {
    chartData,
    data,
    loading,
    error,
    schemaError,
    hasData: !!data?.data.length,
    years,
    setYears,
  };
};
