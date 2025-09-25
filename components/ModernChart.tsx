import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ModernChartProps {
  type: 'line' | 'area' | 'bar' | 'donut' | 'radialBar';
  data: any[];
  title: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  categories?: string[];
  series?: any[];
}

const ModernChart: React.FC<ModernChartProps> = ({
  type,
  data,
  title,
  subtitle,
  height = 350,
  colors = ['#64ffda', '#7c3aed', '#06b6d4', '#8b5cf6', '#10b981'],
  categories,
  series
}) => {
  const getBaseOptions = (): ApexOptions => ({
    theme: {
      mode: 'dark',
    },
    chart: {
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          csv: {
            filename: `${title.replace(/\s+/g, '_').toLowerCase()}_data`,
          },
          svg: {
            filename: `${title.replace(/\s+/g, '_').toLowerCase()}_chart`,
          },
          png: {
            filename: `${title.replace(/\s+/g, '_').toLowerCase()}_chart`,
          }
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: colors,
    grid: {
      borderColor: '#2a3152',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: false,
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#b8c5d6'
      },
      markers: {
        radius: 6,
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif'
      },
      x: {
        show: true,
        format: 'dd MMM yyyy'
      },
      marker: {
        show: true,
      },
      fillSeriesColor: false
    },
    dataLabels: {
      enabled: false
    }
  });

  const getSeriesData = () => {
    if (series) return series;
    
    switch (type) {
      case 'donut':
        // Filter out zero values for donut charts
        return data
          .filter(item => (item.value || item.y) && (item.value || item.y) > 0)
          .map(item => item.value || item.y);
      case 'radialBar':
        // Filter out zero values for radial bar charts
        return data
          .filter(item => (item.percentage || item.value) && (item.percentage || item.value) > 0)
          .map(item => item.percentage || item.value);
      default:
        return [{
          name: title,
          data: data
            .filter(item => (item.value || item.y) && (item.value || item.y) > 0)
            .map(item => ({
              x: item.label || item.name || item.x,
              y: item.value || item.y
            }))
        }];
    }
  };

  const getChartOptions = (): ApexOptions => {
    const baseOptions = getBaseOptions();
    
    switch (type) {
      case 'line':
        return {
          ...baseOptions,
          stroke: {
            curve: 'smooth',
            width: 3,
            lineCap: 'round'
          },
          markers: {
            size: 6,
            colors: colors,
            strokeColors: '#1e2441',
            strokeWidth: 2,
            hover: {
              size: 8
            }
          },
          xaxis: {
            categories: categories || data.map(item => item.label || item.name),
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px',
                fontWeight: 500
              }
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px',
                fontWeight: 500
              },
              formatter: (value) => `${value.toFixed(0)}`
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'vertical',
              shadeIntensity: 0.3,
              gradientToColors: colors,
              inverseColors: false,
              opacityFrom: 0.8,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          }
        };

      case 'area':
        return {
          ...baseOptions,
          stroke: {
            curve: 'smooth',
            width: 2
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'vertical',
              shadeIntensity: 0.3,
              gradientToColors: colors,
              inverseColors: false,
              opacityFrom: 0.6,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          },
          xaxis: {
            categories: categories || data.map(item => item.label || item.name),
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px'
              }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px'
              }
            }
          }
        };

      case 'bar':
        return {
          ...baseOptions,
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '60%',
              distributed: false
            }
          },
          xaxis: {
            categories: categories || data.map(item => item.label || item.name),
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px'
              }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#8892b0',
                fontSize: '12px'
              }
            }
          }
        };

      case 'donut':
        return {
          ...baseOptions,
          labels: data.map(item => item.label || item.name),
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#ffffff'
                  },
                  value: {
                    show: true,
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#64ffda',
                    formatter: (val) => `${val}%`
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    label: 'Total',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#b8c5d6'
                  }
                }
              }
            }
          },
          responsive: [{
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        };

      case 'radialBar':
        return {
          ...baseOptions,
          plotOptions: {
            radialBar: {
              hollow: {
                size: '40%',
                background: 'transparent'
              },
              track: {
                background: '#2a3152',
                strokeWidth: '100%',
                margin: 5
              },
              dataLabels: {
                name: {
                  fontSize: '14px',
                  color: '#b8c5d6',
                  offsetY: -10
                },
                value: {
                  fontSize: '20px',
                  color: '#ffffff',
                  offsetY: 5,
                  formatter: (val) => `${val}%`
                }
              }
            }
          },
          labels: data.map(item => item.label || item.name)
        };

      default:
        return baseOptions;
    }
  };

  return (
    <div className="chart-container fade-in-up">
      <div className="chart-title">
        {title}
      </div>
      {subtitle && (
        <div className="chart-subtitle">
          {subtitle}
        </div>
      )}
      <Chart
        options={getChartOptions()}
        series={getSeriesData()}
        type={type}
        height={height}
      />
    </div>
  );
};

export default ModernChart;
