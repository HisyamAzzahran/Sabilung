import type { FeatureCollection } from "geojson";

export const bandungZones: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { kecamatan: "Soreang" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.49, -7.06],
            [107.55, -7.06],
            [107.55, -7.0],
            [107.49, -7.0],
            [107.49, -7.06],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Cilengkrang" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.68, -6.9],
            [107.74, -6.9],
            [107.74, -6.84],
            [107.68, -6.84],
            [107.68, -6.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Ciparay" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.68, -7.08],
            [107.74, -7.08],
            [107.74, -7.02],
            [107.68, -7.02],
            [107.68, -7.08],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Cisarua" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.54, -6.86],
            [107.6, -6.86],
            [107.6, -6.8],
            [107.54, -6.8],
            [107.54, -6.86],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Rancaekek" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.74, -7.0],
            [107.8, -7.0],
            [107.8, -6.94],
            [107.74, -6.94],
            [107.74, -7.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Banjaran" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.54, -7.1],
            [107.6, -7.1],
            [107.6, -7.04],
            [107.54, -7.04],
            [107.54, -7.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Dayeuhkolot" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.58, -6.99],
            [107.64, -6.99],
            [107.64, -6.93],
            [107.58, -6.93],
            [107.58, -6.99],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kecamatan: "Pangalengan" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.5, -7.22],
            [107.6, -7.22],
            [107.6, -7.14],
            [107.5, -7.14],
            [107.5, -7.22],
          ],
        ],
      },
    },
  ],
};
