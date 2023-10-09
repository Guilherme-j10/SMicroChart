export type BasicDataSet = {
  data_label: string,
  color: string,
  data_type?: string,
  data: number[]
}

export type FuncChart = {
  destroy: () => void;
}

export type OptionsType = {
  label_tip?: string,
  series: BasicDataSet[],
  hide_vertical_data_set?: boolean,
  enable_data_dots?: boolean,
  stroke_line_settings?: {
    width: number,
    opacity_bar_enabled?: boolean
    fill?: boolean,
    fill_color?: string
  },
  disable_sparklines?: boolean,
  smooth?: boolean,
  hermit_enable?: boolean
  labels?: string[],
  chart: {
    type: "normal" | "pie" | "pie_interpolated" | "pie_lines"
    width: number,
    height: number
  }
}

export type ChartType = {
  destroy: () => void
}

export type ChartColumnPos = {
  pos: { x: number, y: number, h: number, w: number },
  index: number,
  is_activate: boolean
}

export type ValidationChartStructure = {
  _success: boolean,
  message: string
}

export type DrawArcType = {
  line_width: number,
  x: number,
  y: number,
  radius_size: number
  color: string,
  initial: number,
  final: number
}

export type ArcsData = {
  inital: number,
  final: number,
  color: string,
  width: number
}

export type DrawElementTypes = {
  color: string,
  text?: {
    content: string,
    aling?: 'center' | 'left' | 'right'
    px: number,
    coords: {
      x: number,
      y: number
    }
  },
  coords?: {
    w: number,
    h: number,
    x: number,
    y: number
  }
}