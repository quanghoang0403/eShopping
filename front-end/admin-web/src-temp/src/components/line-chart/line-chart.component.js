/**
 * Revenue line chart
 */
import { Card } from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat, OrderMaxValue, RevenueMaxValue } from "constants/string.constants";
import i18n from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { getCurrency, roundNumber } from "utils/helpers";
import "./line-chart.component.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const RevenueLineChartComponent = React.forwardRef(({ chartTitle }, ref) => {
  const [chartConfiguration, setChartConfiguration] = useState(null);
  const [t] = useTranslation();
  const [minRevenue, setMinRevenue] = useState(0);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [maxOrder, setMaxOrder] = useState(0);
  const [legendContainerId, setLegendContainerId] = useState("legendContainerId");
  const hourOfDay = 24;

  const pageData = {
    title: t("chartRevenue.title"),
    leftAxis: t("chartRevenue.leftAxis"),
    rightAxis: t("chartRevenue.rightAxis"),
    totalOrder: t("chartRevenue.totalOrder"),
    totalRevenue: t("chartRevenue.totalRevenue"),
    hour: t("chartRevenue.hour"),
    monday: t("chartRevenue.weekdays.monday"),
    tuesday: t("chartRevenue.weekdays.tuesday"),
    wednesday: t("chartRevenue.weekdays.wednesday"),
    thursday: t("chartRevenue.weekdays.thursday"),
    friday: t("chartRevenue.weekdays.friday"),
    saturday: t("chartRevenue.weekdays.saturday"),
    sunday: t("chartRevenue.weekdays.sunday"),
    january: t("chartRevenue.months.january"),
    february: t("chartRevenue.months.february"),
    march: t("chartRevenue.months.march"),
    april: t("chartRevenue.months.april"),
    may: t("chartRevenue.months.may"),
    june: t("chartRevenue.months.june"),
    july: t("chartRevenue.months.july"),
    august: t("chartRevenue.months.august"),
    september: t("chartRevenue.months.september"),
    october: t("chartRevenue.months.october"),
    november: t("chartRevenue.months.november"),
    december: t("chartRevenue.months.december"),
  };

  const [data, setData] = useState();
  const [typeOptionDate, setTypeOptionDate] = useState();

  const options = {
    responsive: true,
    interaction: {
      mode: "point",
      intersect: false,
    },
    stacked: false,
    layout: {
      padding: 10,
    },
    plugins: {
      title: {
        display: false,
        text: chartTitle || pageData.title,
        align: "start",
        position: "top",
        font: {
          family: "Plus Jakarta Sans",
          size: 24,
          weight: "bold",
        },
      },
      htmlLegend: {
        containerID: legendContainerId,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        usePointStyle: true,
        backgroundColor: "#F7F5FF",
        titleColor: "#50429B",
        titleAlign: "Left",
        titleSpacing: 5,
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyColor: "#50429B",
        bodySpacing: 5,
        bodyFont: {
          size: 12,
          weight: 400,
        },
        xAlign: "center",
        yAlign: "bottom",
        boxPadding: 7,
        displayColors: true,
        padding: 15,
        cornerRadius: 12,
        caretSize: 8,
        caretPadding: 6,
        callbacks: {
          label: (context) => {
            let label = "";

            if (context.dataset.yAxisID === "revenue" && context.parsed.y !== null) {
              let currencyValue = new Intl.NumberFormat(`vi-VN`, {
                style: "currency",
                currency: getCurrency(),
              }).format(context.parsed.y);
              label = `Revenue: <b style="display: inline-block; width: 119.86px ; text-align: right;">${currencyValue}</b>`;
            }

            if (context.dataset.yAxisID === "order" && context.parsed.y !== null) {
              label = `Order:                  ${context.parsed.y}`;
            }

            return label;
          },
        },
        external: (e) => externalTooltipHandler(e),
      },
    },
    elements: {
      point: {
        pointStyle: "circle",
        radius: 3,
        hoverRadius: 5,
      },
      line: {
        tension: 0.35,
        borderWidth: 2,
        borderDashOffset: 2,
        borderJoinStyle: "round",
      },
    },
    scales: {
      x: {
        display: true,
        beginAtZero: true,
        ticks: {
          callback: function (val, index) {
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },
        },
      },
      revenue: {
        type: "linear",
        display: true,
        position: "left",
        suggestedMin: minRevenue,
        suggestedMax: maxRevenue,
        alignToPixels: true,
        offset: false,
        ticks: {
          padding: 0,
        },
        title: {
          display: true,
          text: `${pageData.rightAxis} (${getCurrency()})`,
          color: "#50429B",
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 0, left: 0, right: 0, bottom: 0 },
        },
      },
      order: {
        type: "linear",
        display: true,
        position: "right",
        suggestedMin: minOrder,
        suggestedMax: maxOrder,
        alignToPixels: true,
        offset: false,
        ticks: {
          padding: 0,
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: pageData.leftAxis,
          color: "#FF8C21",
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 0, left: 0, right: 0, bottom: 0 },
        },
      },
    },
  };

  React.useImperativeHandle(ref, () => ({
    fillData(date, typeOptionDate, data, isAverage = false, legendContainerId) {
      let convertedData = [];
      if (legendContainerId) {
        setLegendContainerId(legendContainerId);
      }
      if (data?.orderData.length > 0) convertedData = mappingOrderDataToLocalTime(data?.orderData);
      drawChart(date, typeOptionDate, convertedData, isAverage);
    },
  }));

  const drawChart = (date, typeOptionDate, data, isAverage) => {
    setTypeOptionDate(typeOptionDate);
    let convertedData = calculateOrderData(date, typeOptionDate, data);
    let labels = [];
    if (isAverage === true) {
      for (let index = 0; index <= hourOfDay; index++) {
        let timeItem = `${index}:00`;
        labels.push(timeItem);
      }
    } else {
      labels = getHorizontalTime(date, typeOptionDate);
    }

    let currentData = {
      labels,
      datasets: [
        {
          label: pageData.totalRevenue,
          data: isAverage === true ? convertedData?.countAverageRevenueData : convertedData?.countRevenueData,
          yAxisID: "revenue",
          borderColor: "#50429B",
          backgroundColor: "#50429B",
        },
        {
          label: pageData.totalOrder,
          data: isAverage === true ? convertedData?.countAverageOrderData : convertedData?.countOrderData,
          yAxisID: "order",
          borderColor: "#FF8C21",
          backgroundColor: "#FF8C21",
        },
      ],
    };

    let maxRevenueValue = 0;
    let maxOrderValue = 0;
    let revenueMaxValue =
      isAverage === true
        ? Math.max(...convertedData?.countAverageRevenueData)
        : Math.max(...convertedData?.countRevenueData);
    if (revenueMaxValue < RevenueMaxValue) {
      maxRevenueValue = RevenueMaxValue;
    } else {
      maxRevenueValue = revenueMaxValue;
    }

    let orderMaxValue =
      isAverage === true
        ? Math.max(...convertedData?.countAverageOrderData)
        : Math.max(...convertedData?.countOrderData);
    if (orderMaxValue < OrderMaxValue) {
      maxOrderValue = OrderMaxValue;
    } else {
      maxOrderValue = orderMaxValue;
    }

    setMinRevenue(
      isAverage === true
        ? Math.min(...convertedData?.countAverageRevenueData)
        : Math.min(...convertedData?.countRevenueData),
    );
    setMaxRevenue(maxRevenueValue);
    setMinOrder(
      isAverage === true
        ? Math.min(...convertedData?.countAverageOrderData)
        : Math.min(...convertedData?.countOrderData),
    );
    setMaxOrder(maxOrderValue);
    setData(currentData);
    setChartConfiguration(options);
  };

  const getDateTime = (dateTimeUtc, formatPattern) => {
    if (!formatPattern) {
      formatPattern = DateFormat.YYYY_MM_DD_HH_MM_SS_2;
    }

    let languageCode = i18n.language;
    let dateTimeResult = moment.utc(dateTimeUtc).locale(languageCode).local().format(formatPattern);
    return dateTimeResult;
  };

  const mappingOrderDataToLocalTime = (orderData) => {
    return orderData?.map((item) => {
      return {
        id: item.id,
        priceAfterDiscount: item.priceAfterDiscount,
        createdTime: getDateTime(item?.createdTime),
      };
    });
  };

  const getOrderRevenueData = (orderData, typeOptionDate, date) => {
    const localDay = moment().local().day();
    const sunDay = 0;
    var countOrderData = [],
      countRevenueData = [];

    let condition = 0;
    let revenue = 0;
    let divideValue = 0;
    let indexDefault = 1;
    let customizeIndex = 0;
    let startDate = date?.startDate;
    let endDate = date?.endDate;

    switch (typeOptionDate) {
      case OptionDateTime.today: {
        condition = moment().local().format("HH");
        divideValue = 1;
        indexDefault = 0;
        break;
      }
      case OptionDateTime.yesterday: {
        condition = hourOfDay;
        divideValue = 1;
        indexDefault = 0;
        break;
      }
      case OptionDateTime.thisWeek: {
        condition = moment().local().day();
        for (let day = 1; day <= condition + 1; day++) {
          divideValue += 1;
        }
        break;
      }
      case OptionDateTime.lastWeek: {
        condition = 6;
        divideValue = 7;
        break;
      }
      case OptionDateTime.thisMonth: {
        condition = moment().date();
        divideValue = condition;
        break;
      }
      case OptionDateTime.lastMonth: {
        condition = moment(startDate).daysInMonth();
        divideValue = condition;
        break;
      }
      case OptionDateTime.thisYear: {
        condition = moment().month() + 1;
        divideValue = condition;
        break;
      }
      case OptionDateTime.customize: {
        var startOfDay = moment(startDate, "MM/DD/YYYY").startOf('day');
        var endOfDay = moment(endDate, "MM/DD/YYYY").endOf('day').add(1,'second');
        var numberOfDays = endOfDay.diff(startOfDay, 'days');
        if (moment(startDate).date() === moment(endDate).date()) {
          condition = hourOfDay;
          divideValue = 1;
          indexDefault = 0;
          customizeIndex = 0;
        } else if (
          moment(startDate).date() !== moment(endDate).date() &&
          moment(startDate).month() === moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          condition = moment(startDate).daysInMonth();
          divideValue = numberOfDays;
          customizeIndex = 1;
        } else if (
          moment(startDate).month() !== moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          condition = moment().month() + 1;
          divideValue = numberOfDays;
          customizeIndex = 2;
        }
        break;
      }
      default:
        condition = moment().local().format("HH");
        divideValue = condition;
        indexDefault = 0;
        break;
    }

      if (orderData.length <= 0) {
        for (let index = indexDefault; index <= condition; index++) {
          countOrderData.push(orderData);
          countRevenueData.push(revenue);
        }
      } else {
        for (let index = indexDefault; index <= condition; index++) {
          revenue = 0;
          let orders = orderData.filter((order) => {
            if (
              !typeOptionDate ||
              typeOptionDate === OptionDateTime.today ||
              typeOptionDate === OptionDateTime.yesterday
            )
              return moment(order?.createdTime).hour() === index;
            else if (typeOptionDate === OptionDateTime.thisYear)
              return moment(order?.createdTime).month() + 1 === index;
            else if (typeOptionDate === OptionDateTime.thisMonth || typeOptionDate === OptionDateTime.lastMonth)
              return moment(order?.createdTime).date() === index;
            else if (typeOptionDate === OptionDateTime.customize) {
              if (customizeIndex === 2) {
                return moment(order?.createdTime).month() + 1 === index;
              } else if (customizeIndex === 1) {
                return moment(order?.createdTime).date() === index;
              } else {
                return moment(order?.createdTime).hour() === index;
              }
            } else return moment(order?.createdTime).day() === index;
          });
          if (orders.length > 0) {
            orders.forEach((item) => {
              revenue += item?.priceAfterDiscount;
            });
          }
          countOrderData.push(orders?.length);
          countRevenueData.push(revenue);
        }
      }

    // Data for only sunday
    if (
      (localDay === sunDay && typeOptionDate === OptionDateTime.thisWeek) ||
      typeOptionDate === OptionDateTime.lastWeek
    ) {
      let revenueOnSunday = 0;
      let dataForSunday = null;
      if (orderData.length > 0) {
        dataForSunday = orderData.filter((order) => moment(order?.createdTime).day() === 0);
        if (dataForSunday.length > 0) {
          divideValue += 1;
          dataForSunday.forEach((item) => {
            revenueOnSunday += item?.priceAfterDiscount;
          });
        }
        countOrderData.push(dataForSunday?.length);
      } else {
        countOrderData.push(sunDay);
      }
      countRevenueData.push(revenueOnSunday);
    }

    return {
      countOrderData,
      countRevenueData,
      divideValue,
    };
  };

  const calculateOrderData = (date, typeOptionDate, orderData) => {
    var countOrderData = [],
      countRevenueData = [],
      countAverageOrderData = [],
      countAverageRevenueData = [];
    let divideValue = 0;
    var orderRevenueData = getOrderRevenueData(orderData, typeOptionDate, date);
    countOrderData = orderRevenueData?.countOrderData || [];
    countRevenueData = orderRevenueData?.countRevenueData || [];
    divideValue = orderRevenueData?.divideValue || 0;

    let hourLine = 24;
    if (typeOptionDate === OptionDateTime.today) hourLine = moment().local().format("HH");
    for (let hour = 0; hour <= hourLine; hour++) {
      let sumRevenueValue = 0;
      let averageRevenueValue = 0;
      let dataByHour = orderData.filter((order) => moment(order?.createdTime).hour() === hour);
      let averageDataByHour = 0;
      if (dataByHour.length > 0) {
        averageDataByHour = roundNumber(dataByHour?.length / divideValue, 2);
        dataByHour.forEach((item) => {
          sumRevenueValue += item?.priceAfterDiscount;
        });
        averageRevenueValue = roundNumber(sumRevenueValue / divideValue, 2);
      }
      countAverageOrderData.push(averageDataByHour);
      countAverageRevenueData.push(averageRevenueValue);
    }

    return {
      countOrderData,
      countRevenueData,
      countAverageOrderData,
      countAverageRevenueData,
    };
  };

  const getHorizontalTime = (date, typeOptionDate) => {
    const startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    const endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let segment = [];
    switch (typeOptionDate) {
      case OptionDateTime.today:
      case OptionDateTime.yesterday:
        for (let index = 0; index <= hourOfDay; index++) {
          let time = `${index}:00`;
          segment.push(time);
        }
        break;
      case OptionDateTime.thisWeek:
      case OptionDateTime.lastWeek:
        segment = [
          pageData.monday,
          pageData.tuesday,
          pageData.wednesday,
          pageData.thursday,
          pageData.friday,
          pageData.saturday,
          pageData.sunday,
        ];
        break;
      case OptionDateTime.thisMonth:
      case OptionDateTime.lastMonth:
        let numbsInmonth = moment(startDate).daysInMonth();
        let tempSegment = [];
        for (let numb = 1; numb < numbsInmonth + 1; numb++) {
          tempSegment.push(numb);
        }
        segment = tempSegment;
        break;
      case OptionDateTime.thisYear:
        segment = [
          pageData.january,
          pageData.february,
          pageData.march,
          pageData.april,
          pageData.may,
          pageData.june,
          pageData.july,
          pageData.august,
          pageData.september,
          pageData.october,
          pageData.november,
          pageData.december,
        ];
        break;
      case OptionDateTime.customize:
        if (moment(startDate).date() === moment(endDate).date()) {
          for (let index = 0; index <= hourOfDay; index++) {
            let time = `${index}:00`;
            segment.push(time);
          }
        } else if (
          moment(startDate).date() !== moment(endDate).date() &&
          moment(startDate).month() === moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          let numbsInmonth = moment(startDate).daysInMonth();
          let tempSegment = [];
          for (let numb = 1; numb < numbsInmonth + 1; numb++) {
            tempSegment.push(numb);
          }
          segment = tempSegment;
        } else if (
          moment(startDate).month() !== moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          segment = [
            pageData.january,
            pageData.february,
            pageData.march,
            pageData.april,
            pageData.may,
            pageData.june,
            pageData.july,
            pageData.august,
            pageData.september,
            pageData.october,
            pageData.november,
            pageData.december,
          ];
        }
        break;
      default:
        break;
    }
    return segment;
  };

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "#50429B";
      tooltipEl.style.borderRadius = "15px";
      tooltipEl.style.color = "#FFFFFF";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
      tooltipEl.style.zIndex = 9999;
      tooltipEl.style.marginTop = "10px";

      const table = document.createElement("table");
      table.style.width = "100%";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    //Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);
    if (!tooltip.body) {
      return;
    }
    const bodyLines = tooltip.body.map((bodyLine) => bodyLine.lines);
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    // Set Text
    let currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const tableHead = document.createElement("thead");
      tableHead.style.color = "white";
      titleLines.forEach((title) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = 0;
        tr.style.width = "100%";
        const th = document.createElement("th");
        th.style.borderWidth = 0;
        th.style.textAlign = "left";
        th.style.display = "flex";
        th.style.alignContent = "center";
        th.style.paddingBottom = "16.62px";
        th.style.marginLeft = "12.37px";
        th.style.fontSize = "12px";
        th.style.fontWeight = "500";
        th.style.fontStyle = "normal";
        th.style.lineHeight = "normal";
        const text = document.createTextNode(
          title + " " + (typeOptionDate === 0 || typeOptionDate === 1 ? formattedDate : ""),
        );
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
      const tableBody = document.createElement("tbody");
      tableBody.style.background = "white";
      tableBody.style.color = "#50429B";
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = "2px";
        span.style.marginRight = "12.37px";
        span.style.marginLeft = "9.62px";
        span.style.height = "11px";
        span.style.width = "11px";
        span.style.display = "inline-block";
        span.style.borderRadius = "50%";
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;
        tr.style.lineHeight = 3;
        const td = document.createElement("td");
        td.style.borderWidth = 0;
        td.style.paddingRight = "5px";
        //td.style.borderRadius = "0px 0px 5px 5px";
        const text = document.createTextNode(body);
        const span2 = document.createElement("span");
        span2.innerHTML = body; // body chứa các thẻ HTML như <b>
        span2.style.display = "inline-block";
        span2.style.width = "192.46px";
        span2.style.color = "#273B4A";
        td.appendChild(span);
        td.appendChild(span2);
        //td.appendChild(text);
        if (i === bodyLines.length - 1) {
          td.style.borderBottomRightRadius = "12px";
          td.style.borderBottomLeftRadius = "12px";
          td.style.paddingBottom = "12px";
        }
        tr.appendChild(td);

        tableBody.appendChild(tr);
      });
      const tableRoot = tooltipEl.querySelector("table");
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.width = "243.2px";
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + (bodyLines.length === 1 ? -120 : -160) + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.borderRadius = "12px";
    tooltipEl.style.padding = tooltip.options.padding + "px " + "0px " + "0px " + "0px ";
  };

  const createLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector("ul");

    if (!listContainer) {
      listContainer = document.createElement("ul");
      listContainer.style.display = "flex";
      listContainer.style.flexDirection = "row";
      listContainer.style.justifyContent = "end";
      listContainer.style.margin = "0 0 24px 8px";
      listContainer.style.padding = 0;

      legendContainer.appendChild(listContainer);
    }

    return listContainer;
  };

  const htmlLegendPlugin = [
    {
      id: "htmlLegend",
      afterUpdate(chart, args, options) {
        const ul = createLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach((item) => {
          const li = document.createElement("li");
          li.style.alignItems = "center";
          li.style.cursor = "pointer";
          li.style.display = "flex";
          li.style.flexDirection = "row";
          li.style.marginLeft = "50px";

          li.onclick = () => {
            const { type } = chart.config;
            if (type === "pie" || type === "doughnut") {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };

          // Icon
          renderLegendIcon(li, item.fillStyle);

          // Text
          const textContainer = document.createElement("p");
          textContainer.style.color = item.fontColor;
          textContainer.style.margin = "0 0 0 12px";
          textContainer.style.padding = 0;
          textContainer.style.textDecoration = item.hidden ? "line-through" : "";

          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      },
    },
  ];

  const renderLegendIcon = (node, fillColor) => {
    const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iconSvg.setAttribute("width", "61");
    iconSvg.setAttribute("height", "13");
    iconSvg.setAttribute("viewBox", "0 0 61 13");
    iconSvg.setAttribute("fill", fillColor);

    let iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute("fill-rule", "evenodd");
    iconPath.setAttribute("clip-rule", "evenodd");
    iconPath.setAttribute(
      "d",
      "M0 6C0 5.44772 0.447715 5 1 5H60C60.5523 5 61 5.44772 61 6C61 6.55228 60.5523 7 60 7H1C0.447715 7 0 6.55228 0 6Z",
    );
    iconSvg.appendChild(iconPath);
    iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute(
      "d",
      "M30.9603 12.9206C29.2472 12.9206 27.6042 12.2402 26.3927 11.029C25.1812 9.81783 24.5004 8.17503 24.5 6.46193C24.4996 4.74883 25.1796 3.1057 26.3905 1.8939C27.6014 0.682097 29.244 0.00085736 30.9571 8.08702e-07C32.6702 -0.000855743 34.3135 0.678743 35.5256 1.88933C36.7377 3.09992 37.4193 4.74237 37.4206 6.45548C37.4219 8.16858 36.7427 9.81205 35.5324 11.0245C34.3222 12.2369 32.6799 12.9189 30.9668 12.9206H30.9603Z",
    );
    iconSvg.appendChild(iconPath);

    return node.appendChild(iconSvg);
  };

  return (
    <>
      <Card className="w-100 fnb-card line-chart">
        <div className="chart-title">{chartTitle || pageData.title}</div>
        <div id={legendContainerId} className="legend-container"></div>
        <div>{data && <Line options={options} data={data} plugins={htmlLegendPlugin} />}</div>
      </Card>
    </>
  );
});
