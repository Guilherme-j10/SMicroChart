import { SMicroChart } from "..";
import type { Meta, StoryObj } from '@storybook/react';
import { BasicDataSet, OptionsType } from "../Dtos";

const meta: Meta<typeof SMicroChart> = {
  title: 'SMicroChart',
  component: SMicroChart,
  tags: ['autodocs']
}

export default meta;

type SMChart = StoryObj<typeof SMicroChart>;

const series_pie: BasicDataSet[] = [
  {
    data_label: 'Propaganda',
    data_type: 'column',
    color: '#fbad06',
    data: [10]
  },
  {
    data_label: 'Propaganda',
    data_type: 'column',
    color: '#ab33f5',
    data: [20]
  },
  {
    data_label: 'Propaganda',
    data_type: 'column',
    color: '#50acfd',
    data: [30]
  },
  {
    data_label: 'Notificação',
    data_type: 'column',
    color: '#b7e844',
    data: [40]
  }
]

const series_chart: BasicDataSet[] = [
  {
    data_label: 'Saudação',
    data_type: 'column',
    color: '#ffffff',
    data: Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 50))
  },
  {
    data_label: 'Propaganda',
    data_type: 'column',
    color: '#62a5d9',
    data: Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 50))
  },
  {
    data_label: 'Notificação',
    data_type: 'column',
    color: '#dbd753',
    data: Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 50))
  },
  {
    data_label: 'Encaminhamento',
    data_type: 'line',
    color: '#caf50a',
    data: Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 50))
  },
  {
    data_label: 'Conversão',
    data_type: 'line',
    color: '#be45ff',
    data: Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 120))
  }
]

const default_data: OptionsType = {
  smooth: true,
  disable_sparklines: false,
  label_tip: 'Dia: ',
  series: series_chart,
  chart: {
    type: 'normal',
    width: 380,
    height: 250
  }
}

export const SmoothLineDisabled = {
  args: {
    options: {
      ...default_data,
      smooth: false,
    }
  }
}

export const HermitInterpolationEnableAndVerticalDataDisabled = {
  args: {
    options: {
      ...default_data,
      hermit_enable: true,
      hide_vertical_data_set: true
    }
  }
}

export const ChartSimpleAndDotsDisables = {
  args: {
    options: {
      ...default_data,
      disable_sparklines: true, 
      enable_data_dots: false
    }
  }
}

export const ChartJustLine: SMChart = {
  args: {
    options: {
      ...default_data,
      disable_sparklines: true,
      enable_data_dots: false,
      stroke_line_settings: {
        width: 2,
        fill: true,
        fill_color: '#33ff0018'
      },
      series: [
        {
          data_label: 'Conversão',
          data_type: 'line',
          color: '#33ff00',
          data: Array.from({ length: 20 }).map(() => Math.floor(Math.random() * 50))
        }
      ],
    }
  }
}

export const NormalChart: SMChart = {
  args: {
    options: {
      ...default_data
    }
  }
}

export const ChartBarFill = {
  args: {
    options: {
      ...default_data,
      disable_sparklines: true,
      enable_data_dots: false,
      stroke_line_settings: {
        width: 2,
        fill: true,
        opacity_bar_enabled: true,
        fill_color: '#33ff0018'
      },
      series: [
        {
          data_label: 'Propaganda',
          data_type: 'column',
          color: '#fbe606',
          data: Array.from({ length: 15 }).map(() => Math.floor(Math.random() * 50))
        },
        {
          data_label: 'Propaganda',
          data_type: 'column',
          color: '#3a7ced',
          data: Array.from({ length: 15 }).map(() => Math.floor(Math.random() * 50))
        },
        {
          data_label: 'Notificação',
          data_type: 'column',
          color: '#2be812',
          data: Array.from({ length: 15 }).map(() => Math.floor(Math.random() * 50))
        }
      ],
    }
  }
}

export const InterpolatedPie = {
  args: {
    options: {
      ...default_data,
      series: series_pie,
      chart: {
        type: 'pie_interpolated',
        width: 380,
        height: 250
      }
    }
  }
}

export const PieLines: SMChart = {
  args: {
    options: {
      ...default_data,
      series: series_pie,
      chart: {
        type: 'pie_lines',
        width: 380,
        height: 250
      }
    }
  }
}