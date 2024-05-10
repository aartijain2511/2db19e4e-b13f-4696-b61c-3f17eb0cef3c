import prisma from "../db";
import { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { isValidTimeZone } from "../../utils/isValidTimeZone";

type SavingsData = {
  _id: {
    date: string;
  };
  carbon_saved_sum: number;
  diesel_saved_sum: number;
};

type MonthlySavings = {
  [month: string]: { carbonSavings: number; dieselSavings: number };
};

type DailySavings = {
  [date: string]: { carbonSavings: number; dieselSavings: number };
};

const getSavings: RequestHandler = async (req, res) => {
  const deviceId = req.query?.id;
  const from = req.query?.from;
  const to = req.query?.to;
  const timezone =  isValidTimeZone(req.query?.timezone?.toString()) ? req.query?.timezone : "UTC";

  if (deviceId && from && to) {
    if (+deviceId < 1 || +deviceId > 10) {
      res.status(400).json({
        error: "id query parameter is inavlid, it should be between 1 and 10.",
      });
      return;
    }

    if (new Date(from.toString()) > new Date(to.toString())) {
      res.status(400).json({
        error:
          "from, to query parameters are invalid. from should be lesser than to.",
      });
      return;
    }
    try {
      const savings = await prisma.deviceSavings.aggregateRaw({
        pipeline: [
          {
            $match: {
              device_id: +deviceId,
              timestamp: {
                $gte: { $date: from },
                $lte: { $date: to },
              },
            },
          },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: timezone },
                },
              },
              carbon_saved_sum: { $sum: "$carbon_saved" },
              diesel_saved_sum: { $sum: "$fueld_saved" },
            },
          },
          {
            $sort: {
              "_id.date": 1,
            },
          },
        ],
      });

      if (Array.isArray(savings) && savings.length === 0) {
        res.json({ data: savings });
        return;
      }

      const savingsData = JSON.parse(JSON.stringify(savings));
      const savingsPerMonth = calculateMonthlyTotals(savingsData);

      const savingsPerDay: DailySavings[] = savingsData.map(
        (item: SavingsData) => ({
          [item._id.date]: {
            carbonSavings: item.carbon_saved_sum / 1000,
            dieselSavings: item.diesel_saved_sum,
          },
        }),
      );

      const totalCarbonSavings: number = savingsData
        .map((item: SavingsData) => item.carbon_saved_sum / 1000)
        .reduce((acc: number, curr: number) => acc + curr);

      const totalDieselSavings: number = savingsData
        .map((item: SavingsData) => item.diesel_saved_sum)
        .reduce((acc: number, curr: number) => acc + curr);

      const result = {
        id: +deviceId,
        totalCarbonSavings,
        totalDieselSavings,
        savingsPerDay,
        savingsPerMonth,
      };

      return res.json({ data: result });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientUnknownRequestError
      ) {
        res.status(500).json({ error: "Prisma error" });
        throw error;
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  } else {
    return res
      .status(400)
      .json(
        "Query parameters are missing or undefined. Pass id, from and to in query parameters",
      );
  }
};

function calculateMonthlyTotals(data: SavingsData[]): MonthlySavings[] {
  const monthlyData: MonthlySavings = {};

  data.forEach((curr) => {
    const month = (new Date(curr._id.date).getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const year = new Date(curr._id.date).getFullYear();
    const monthYear = `${year}-${month}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        carbonSavings: 0,
        dieselSavings: 0,
      };
    }

    monthlyData[monthYear].carbonSavings += curr.carbon_saved_sum / 1000;
    monthlyData[monthYear].dieselSavings += curr.diesel_saved_sum;
  });

  const monthlySavingsArray: MonthlySavings[] = Object.entries(monthlyData).map(
    ([monthYear, savings]) => ({
      [monthYear]: savings,
    }),
  );

  return monthlySavingsArray;
}

export default getSavings;
