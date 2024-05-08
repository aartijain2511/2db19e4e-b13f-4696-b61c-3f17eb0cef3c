import { FC, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EChartsReact, { EChartsInstance } from "echarts-for-react";
import savingsDataState from "../state/atoms/savingsDataState";
import formatValue from "../utils/formatValue";
import apiFetchState from "../state/atoms/apiFetchState";
import { STATUS } from "../constants";
import styled from "styled-components";
import { theme } from "../styles/Theme";
import selectedDeviceIdState from "../state/atoms/selectedDeviceIdState";
import { Data } from "../types";

function getZoomLevel(deviceSavingsData: Data) {
  if (Object.keys(deviceSavingsData).length > 0) {
    const dataPerDay = deviceSavingsData?.savingsPerDay;
    if (dataPerDay) {
      return dataPerDay.length === 0
        ? null
        : dataPerDay.length >= 31
          ? "month"
          : "day";
    }
  }
  return null;
}

const DeviceSavingsChart: FC = () => {
  const deviceSavingsData = useRecoilValue(savingsDataState);
  let [dataFetchState, setDataFetchedState] = useRecoilState(apiFetchState);
  const deviceId = useRecoilValue(selectedDeviceIdState);
  const isDataEmpty = Object.keys(deviceSavingsData.data).length === 0;
  const [zoomLevel, setZoomLevel] = useState(
    getZoomLevel(deviceSavingsData.data),
  );
  const chartRef = useRef<EChartsReact>(null);
  let xAxisData: string[] = [];
  let xIndex = useRef(-1);
  let xIndexValue = useRef<string | null>();

  useEffect(() => {
    if (isDataEmpty) setDataFetchedState(null);
  }, [isDataEmpty, setDataFetchedState]);

  useEffect(() => {
    setZoomLevel(getZoomLevel(deviceSavingsData.data));
    xIndex.current = -1;
  }, [deviceId, deviceSavingsData]);

  useEffect(() => {
    const option: EChartsInstance | null =
      chartRef.current?.getEchartsInstance();
    if (dataFetchState === STATUS.PENDING) option?.showLoading();
    if (dataFetchState === STATUS.SUCCESS) option?.hideLoading();
    setZoomLevel(getZoomLevel(deviceSavingsData.data));
  }, [deviceId, dataFetchState, deviceSavingsData.data]);

  const getOption = () => {
    let carbonSavingsData: number[] = [];
    let dieselSavingsData: number[] = [];
    let leftYAxisData: number[] = [];
    let rightYAxisData: number[] = [];
    const defaultFormatter = (value: string) => value;
    let xAxisLabelFormatter = defaultFormatter;
    const xAxisInterval = zoomLevel === "month" ? 0 : "auto";
    const CARBON_SERIES = "Carbon Savings";
    const DIESEL_SERIES = "Diesel Savings";

    if (zoomLevel === "month") {
      leftYAxisData = [0, 3, 6, 9, 12, 15];
      rightYAxisData = [0, 2000, 4000, 6000, 8000, 10000];
      xAxisData =
        deviceSavingsData.data?.savingsPerMonth?.map((entry) => {
          return Object.keys(entry)[0];
        }) ?? [];
      xAxisLabelFormatter = (value: string) => {
        const [year, month] = value.split("-");
        const monthName = new Date(`${+year}-${+month}-01`).toLocaleString(
          "default",
          { month: "short" },
        );
        return `${monthName} ${year}`;
      };
      carbonSavingsData =
        deviceSavingsData?.data?.savingsPerMonth?.map((entry) => {
          const monthData = Object.values(entry)[0];
          return monthData.carbonSavings;
        }) ?? [];
      dieselSavingsData =
        deviceSavingsData?.data?.savingsPerMonth?.map((entry) => {
          const monthData = Object.values(entry)[0];
          return monthData.dieselSavings;
        }) ?? [];
    } else if (zoomLevel === "day") {
      leftYAxisData = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
      rightYAxisData = [0, 50, 100, 150, 200, 250, 300, 350, 400];
      if (
        deviceSavingsData?.data?.savingsPerDay &&
        deviceSavingsData?.data?.savingsPerDay?.length <= 31
      ) {
        xAxisData =
          deviceSavingsData?.data?.savingsPerDay?.map(
            (entry) => Object.keys(entry)[0],
          ) ?? [];
        carbonSavingsData =
          deviceSavingsData?.data?.savingsPerDay?.map(
            (obj) => Object.values(obj)[0].carbonSavings,
          ) ?? [];
        dieselSavingsData =
          deviceSavingsData?.data?.savingsPerDay?.map(
            (obj) => Object.values(obj)[0].dieselSavings,
          ) ?? [];
      } else {
        const year_month = xIndexValue.current;
        if (year_month?.length) {
          let filteredData = deviceSavingsData?.data?.savingsPerDay?.filter(
            (obj) => Object.keys(obj)[0].includes(year_month),
          );
          xAxisData = filteredData?.map((entry) => Object.keys(entry)[0]) ?? [];
          carbonSavingsData =
            filteredData?.map((obj) => Object.values(obj)[0].carbonSavings) ??
            [];
          dieselSavingsData =
            filteredData?.map((obj) => Object.values(obj)[0].dieselSavings) ??
            [];
        }
      }
    }

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
        formatter: (params: any) => {
          let tooltip = xAxisLabelFormatter(params[0].axisValue) + "<br/>";
          params.forEach((param: any) => {
            tooltip +=
              " " +
              param.seriesName +
              ": " +
              `${formatValue(param.value)}${param.seriesName === CARBON_SERIES ? " Tonnes" : " Litres"}` +
              "<br/>";
          });
          return tooltip;
        },
      },
      legend: {
        data: ["Carbon Savings", "Diesel Savings"],
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLabel: {
          formatter: xAxisLabelFormatter,
          interval: xAxisInterval,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: "value",
          scale: true,
          min: 0,
          max: leftYAxisData[leftYAxisData.length - 1],
          data: leftYAxisData,
        },
        {
          type: "value",
          scale: true,
          min: 0,
          max: rightYAxisData[rightYAxisData.length - 1],
          data: rightYAxisData,
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000) {
                return (value / 1000).toFixed(0) + "k";
              }
              return value;
            },
          },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: CARBON_SERIES,
          type: "bar",
          color: `${theme.colors.green}`,
          data: carbonSavingsData,
          yAxisIndex: 0,
        },
        {
          name: DIESEL_SERIES,
          type: "bar",
          color: `${theme.colors.blue}`,
          data: dieselSavingsData,
          yAxisIndex: 1,
        },
      ],
    };
  };

  const onDataZoom = (params: { batch: { start: number; end: number }[] }) => {
    const zoomStart = params.batch[0].start;
    const zoomEnd = params.batch[0].end;

    let difference = zoomEnd - zoomStart;
    if (difference <= 4) {
      const newStart = Math.max(0, zoomStart - 2.5);
      const newEnd = Math.min(100, zoomEnd + 2.5);
      params.batch[0].start = newStart;
      params.batch[0].end = newEnd;
      setZoomLevel("day");
    } else if (zoomEnd === 100) {
      setZoomLevel("month");
    }
  };

  const onMouseOver = (params: any) => {
    if (params?.dataIndex !== undefined) {
      xIndex.current = params?.dataIndex;
      xIndexValue.current = xAxisData[xIndex.current];
    }
  };

  const onEvents = {
    dataZoom: onDataZoom,
    mouseOver: onMouseOver,
  };

  return (
    <div>
      {isDataEmpty &&
        (dataFetchState === null || dataFetchState === STATUS.SUCCESS) && (
          <StyledEmptyData>No data available</StyledEmptyData>
        )}
      {(dataFetchState === STATUS.PENDING ||
        dataFetchState === STATUS.SUCCESS) && (
        <EChartsReact
          ref={chartRef}
          option={getOption()}
          style={{ height: "400px", width: "100%" }}
          onEvents={onEvents}
        />
      )}
      {dataFetchState === STATUS.FAILED && (
        <StyledEmptyData>Error fetching charts data</StyledEmptyData>
      )}
    </div>
  );
};

export default DeviceSavingsChart;

const StyledEmptyData = styled.div`
  display: inline-block;
  border: 1px solid ${theme.colors.lightGray};
  font-weight: bold;
  padding: 12px;
  margin: 30px;
`;
