import { z } from "zod";

export const DataItemSchema = z.object({
  Nation: z.string(),
  Year: z.number(),
  "Total Population": z.number(),
  "Nation ID": z.string(),
});

export const DataSchema = z.object({
  annotations: z.object({
    dataset_link: z.string(),
    hidden_measures: z.string(),
    topic: z.string(),
    table: z.string(),
    dataset_name: z.string(),
    source_description: z.string(),
    source_name: z.string(),
    subtopic: z.string(),
  }),
  columns: z.array(z.string()),
  data: z.array(DataItemSchema),
  page: z.object({
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
  }),
});

export type Data = z.infer<typeof DataItemSchema>;
export type DataResponse = z.infer<typeof DataSchema>;

export type ChartDataType = {
  Years: string;
  Population: number;
};
