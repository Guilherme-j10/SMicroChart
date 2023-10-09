import React, { useEffect, useId, useRef } from 'react';
import { 
  ArcsData,
  ChartColumnPos,
  DrawArcType,
  DrawElementTypes,
  FuncChart,
  OptionsType,
  ValidationChartStructure 
} from './Dtos';

type PropsType = {
  options: OptionsType
}

export const SMicroChart: React.FC <PropsType> = ({ options }) => {

  const react_id = useId();  
  const smicro_reference = useRef({} as FuncChart);

  const smicrochart_initializer = (): FuncChart => {

    const canvas = document.getElementById(react_id) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = options.chart.width;
    canvas.height = options.chart.height;

    const interpolation = (value: number, input: number[], output: number[]): number => {

      return output[0] + (((value - input[0]) / (input[1] - input[0])) * (output[1] - output[0]))

    }

    const check_data_integrity = (): ValidationChartStructure => {

      let validation: ValidationChartStructure = {
        _success: true,
        message: ''
      };

      if (["pie", "pie_interpolated", "pie_lines"].includes(options.chart.type)) {

        for (const data of options.series) {

          if (data.data.length > 1) {

            validation._success = false;
            validation.message = 'Pie type dont need more than one element on array.';
            break;

          }

        }

        if (options.chart.type === "pie_lines") {

          for (const data of options.series) {

            if (data.data[0] > 100) {

              validation._success = false;
              validation.message = 'Pie_line accepts values up to 100.';
              break;

            }

          }

        }

      }

      if (options.chart.type === 'normal') {

        for (const data of options.series) {

          if (typeof data?.data_type === 'undefined') {

            validation._success = false;
            validation.message = 'Invalid data_type.';
            break;

          }

        }

      }

      if (!validation._success) return validation;

      const amount_data = options.series[0].data.length;

      for (const data of options.series) {

        if (data.data.length === amount_data) continue;

        validation._success = false;
        validation.message = 'Your data length not is the same.'
        break;

      }

      if (validation._success) {

        if (!amount_data) {

          for (let i = 0; i < options.series.length; i++) {

            options.series[i].data = Array.from({ length: 12 }).map(() => 0);

          }

        }

        const get_all_colors = options.series.map(data => data.color);

        for (const color of get_all_colors) {

          const removed_prefix = color.split('#')[1];

          if (removed_prefix.length === 6) continue;

          validation._success = false;
          validation.message = 'The colors provided need be a hex code of 6 char.'
          break;

        }

      }

      return validation;

    }

    const default_stroke_width = (options?.stroke_line_settings?.width || 3);

    const chart = {
      line_base_height: options.chart.height - 25,
      size_text: 11,
      size_text_tip: 13,
      padding_top: 22,
      margin_borders: 10,
      min_side_by_side: 0,
      default_stroke_style: {
        width: default_stroke_width,
      },
      enable_height: (options?.disable_sparklines || false) ?
        options.chart.height - default_stroke_width : 0,
      min_width: options?.disable_sparklines ? 0 : 30,
      current_labels: [] as string[],
      chart_column_pos: [] as ChartColumnPos[],
      draw_element(load: DrawElementTypes) {

        ctx.beginPath();
        ctx.fillStyle = load.color;

        ctx.shadowColor = '#1111119e';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if (!Object.keys(load?.text || {}).length && Object.keys(load?.coords || {}).length) {

          ctx.fillRect(
            load.coords?.x as number,
            load.coords?.y as number,
            load.coords?.w as number,
            load.coords?.h as number
          );

        }

        if (Object.keys(load?.text || {}).length) {

          ctx.font = `${load.text?.px}px Arial`;
          ctx.textAlign = load.text?.aling || 'center';
          ctx.fillText(
            load.text?.content as string,
            load.text?.coords.x as number,
            load.text?.coords.y as number
          );

        }

        ctx.closePath();

      },
      draw_base_chart() {

        this.draw_element({
          color: '#ffffff2d',
          coords: { h: 1.5, w: options.chart.width - this.min_width, x: this.min_width, y: this.line_base_height }
        })

      },
      draw_spikes() {

        const calculate_spikes = (options.chart.width - (this.min_width + this.margin_borders)) / options.series[0].data.length;

        for (let i = 0; i < options.series[0].data.length; i++) {

          const initial_point = calculate_spikes * i;
          const middle = initial_point + (calculate_spikes / 2) + (this.min_width + this.margin_borders);
          const label_content = options?.labels?.length ? options.labels[i] : `${i + 1}`;

          this.draw_element({
            color: '#ffffff',
            coords: {
              h: 7,
              w: 1.5,
              x: middle,
              y: this.line_base_height
            }
          });

          this.draw_element({
            color: '#ffffff',
            text: {
              content: label_content,
              px: this.size_text,
              coords: {
                x: middle,
                y: this.line_base_height + 25
              }
            }
          })

          this.current_labels.push(label_content)

        }

      },
      calculate_max_val() {

        let max_values = [] as number[];

        for (const data_series of options.series) {

          const max_value_of = data_series.data.reduce((acc, val) => acc > val ? acc : val, 0);
          max_values.push(max_value_of);

        }

        return max_values.reduce((acc, val) => acc > val ? acc : val, 0);

      },
      get_rgb_color(hex: string) {

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;

      },
      draw_columns() {

        const vertical_boarder = options?.hide_vertical_data_set ? 0 : this.margin_borders;
        const enable_stroke_bars = options?.stroke_line_settings?.opacity_bar_enabled;
        const get_columns = options.series.filter(data => data.data_type === 'column');
        const calc_spikes_pos = (options.chart.width - (this.min_width + vertical_boarder)) / options.series[0].data.length;
        const padding_space = interpolation(options.series.length, [0, 50], [5, 30]);
        const complete_column_width = calc_spikes_pos - padding_space;
        const space_by_each_column = Math.abs((complete_column_width + (enable_stroke_bars ? this.default_stroke_style.width : 0)) / get_columns.length);
        const get_lines = options.series.filter(data => data.data_type === 'line');
        const max_height = this.calculate_max_val();

        for (let x = 0; x < options.series[0].data.length; x++) {

          const initial_point = (calc_spikes_pos * x) + this.min_width + vertical_boarder;
          const initial_point_more_padding = initial_point + (padding_space / 2);
          let start_point = initial_point_more_padding;

          this.chart_column_pos.push({
            index: x,
            is_activate: false,
            pos: { x: initial_point, y: 0, h: this.enable_height, w: calc_spikes_pos }
          });

          for (let z = 0; z < get_columns.length; z++) {

            const chart_height_column = interpolation(options.series[z].data[x], [0, max_height], [2, this.enable_height - (padding_space / 2)]);

            if (enable_stroke_bars) {

              const h = chart_height_column;
              const w = space_by_each_column - this.default_stroke_style.width;
              const x = start_point;
              const y = Math.abs(this.enable_height - chart_height_column);

              ctx.beginPath();

              const rgb = this.get_rgb_color(options.series[z].color);
              ctx.fillStyle = `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, .2)`;
              ctx.strokeStyle = options.series[z].color;
              ctx.lineWidth = this.default_stroke_style.width;

              ctx.moveTo(x, y);

              ctx.lineTo((x + w), y);
              ctx.lineTo((x + w), (y + h));
              ctx.lineTo(x, (y + h));
              ctx.lineTo(x, y - 1);

              ctx.stroke();
              ctx.fill();
              ctx.closePath();

            }

            if (!enable_stroke_bars) {

              this.draw_element({
                color: options.series[z].color,
                coords: {
                  h: chart_height_column,
                  w: space_by_each_column,
                  x: start_point,
                  y: Math.abs(this.enable_height - chart_height_column)
                }
              });

            }

            start_point = start_point + space_by_each_column;

          }

        }

        for (let i = 0; i < get_lines.length; i++) {

          let coords_of_line = [];

          for (let y = 0; y < get_lines[i].data.length; y++) {

            const chart_height_column = interpolation(get_lines[i].data[y], [0, max_height], [0, this.enable_height - 5]);
            const calc_y = Math.abs(chart_height_column - this.enable_height);

            const pinter_x = calc_spikes_pos * y;
            const middle_pointer_x = pinter_x + (calc_spikes_pos / 2);

            coords_of_line.push({ x: middle_pointer_x + (this.min_width + vertical_boarder), y: calc_y });

          }

          ctx.strokeStyle = get_lines[i].color as string;
          ctx.lineWidth = this.default_stroke_style.width;

          const is_spline_cubic = !options?.hermit_enable ? true : false;

          ctx.beginPath();
          ctx.moveTo((this.min_width + vertical_boarder), this.enable_height);

          if (options?.smooth) {

            coords_of_line.unshift({ x: (this.min_width + vertical_boarder), y: this.enable_height });
            coords_of_line.unshift({ x: (this.min_width + vertical_boarder), y: this.enable_height });
            coords_of_line.push({ x: options.chart.width, y: this.enable_height });

            const hermit_interpolation = (x: number, x1: number, y1: number, x2: number, y2: number): number => {

              var t = (x - x1) / (x2 - x1);

              var h00 = 1 - 3 * t ** 2 + 2 * t ** 3;
              var h01 = 3 * t ** 2 - 2 * t ** 3;

              return h00 * y1 + h01 * y2;

            }

            if (!is_spline_cubic) {

              for (let x = 0; x < coords_of_line.length - 1; x += 1) {

                const p1 = coords_of_line[x];
                const p2 = coords_of_line[x + 1];

                let current_x = p1.x;
                let steps = 0.1;

                while (current_x <= p2.x) {

                  current_x += steps;

                  const current_y = hermit_interpolation(current_x, p1.x, p1.y, p2.x, p2.y);

                  ctx.lineTo(current_x, current_y);

                }

              }

            }

            if (is_spline_cubic) {

              const reorganize_points = (coords: Array<{ x: number, y: number }>) => {

                let reorganized = [];

                for (let x = 0; x < coords.length - 1; x += 1) {

                  reorganized.push([
                    coords[x],
                    coords[x + 1],
                    coords[x + 2]
                  ])

                }

                return reorganized;

              }

              const points = reorganize_points(coords_of_line);

              const get_control_points = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, t: number): number[] => {

                const d1 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
                const d2 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                const fa = t * d1 / (d1 + d2);
                const fb = t * d2 / (d1 + d2);

                const p1x = x1 - fa * (x2 - x0);
                const p1y = y1 - fa * (y2 - y0);
                const p2x = x1 + fb * (x2 - x0);
                const p2y = y1 + fb * (y2 - y0);

                return [p1x, p1y, p2x, p2y];

              }

              const tension = 0.35;

              for (let i = 0; i < points.length - 1; i++) {

                const p1_1 = points[i][0];
                const p1_c = points[i][1];
                const p1_2 = points[i][2] || { x: options.chart.width, y: this.enable_height };

                const p2_1 = points[i + 1][0];
                const p2_c = points[i + 1][1];
                const p2_2 = points[i + 1][2] || { x: options.chart.width, y: this.enable_height };

                let [cp1_1x, cp1_1y, cp1_2x, cp1_2y] = get_control_points(p1_1.x, p1_1.y, p1_c.x, p1_c.y, p1_2.x, p1_2.y, tension);
                let [cp2_1x, cp2_1y, cp2_2x, cp2_2y] = get_control_points(p2_1.x, p2_1.y, p2_c.x, p2_c.y, p2_2.x, p2_2.y, tension);

                if (p1_c.y === p1_2.y && p1_c.y === this.enable_height) {

                  cp2_1y = p1_c.y;
                  cp1_2y = p1_c.y;

                } else {

                  const limit_curve_on_base = (y: number) => {

                    const limit = 20;

                    if (y > (this.enable_height - limit) && y < this.enable_height) return true;

                    return false;

                  };

                  if (p1_2.y === this.enable_height && limit_curve_on_base(p1_c.y)) {

                    cp1_2y = p1_2.y;
                    cp2_1y = p1_2.y;
                    cp2_1x = p1_2.x - ((70 / 100) * Math.abs(p1_c.x - p1_2.x));

                  }

                  if (p1_c.y === this.enable_height && limit_curve_on_base(p1_2.y)) {

                    cp1_2y = p1_c.y;
                    cp2_1y = p1_c.y + 5;

                  } else {

                    if (p1_2.y === this.enable_height)
                      cp2_1y = p1_2.y + 3;

                    if (p1_c.y === this.enable_height)
                      cp1_2y = p1_c.y + 3;

                  }

                }

                ctx.bezierCurveTo(cp1_2x, cp1_2y, cp2_1x, cp2_1y, p1_2.x, p1_2.y);

              }

            }

          }

          if (!options?.smooth) {

            for (const coord of coords_of_line) {

              ctx.lineTo(coord.x, coord.y);

            }

            ctx.lineTo(options.chart.width, this.enable_height);

          }

          ctx.stroke();

          if (options?.stroke_line_settings?.fill) {

            if (options?.stroke_line_settings?.fill_color)
              ctx.fillStyle = options?.stroke_line_settings?.fill_color;

            ctx.fill();

          }

          ctx.closePath();

          const dots_enable = typeof options.enable_data_dots === 'undefined' ? true : options.enable_data_dots;

          if (dots_enable) {

            for (const coord of coords_of_line) {

              if (
                coord.x <= 0 ||
                coord.x >= options.chart.width ||
                coord.x === vertical_boarder ||
                coord.x === (this.min_width + vertical_boarder)
              ) continue;

              ctx.fillStyle = '#fff';
              ctx.beginPath();
              ctx.arc(coord.x, coord.y, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.closePath();

            }

          }

        }

      },
      draw_activate_hover_columns() {

        for (const column of this.chart_column_pos) {

          if (column.is_activate) {

            this.draw_element({
              color: '#ffffff2d',
              coords: { h: column.pos.h, w: column.pos.w, x: column.pos.x, y: column.pos.y }
            });

          }

        }

      },
      calculate_max_value_enabled() {

        const min_space = 25;
        let get_max_value = (this.calculate_max_val()) || 10;
        const loops = (this.enable_height) / min_space;
        let increaser = get_max_value / loops;
        let vertical_data = [0];

        for (let x = 0; x < loops; x++)
          vertical_data.push(vertical_data[vertical_data.length - 1] + increaser);

        get_max_value = vertical_data.reduce((acc, val) => acc > val ? acc : val, 0);

        return { get_max_value, vertical_data };

      },
      draw_side_left_height_data() {

        const draw_xaxis = true;
        const dashed_enabled = true;
        const diff_from_base = Math.abs(options.chart.height - this.line_base_height);
        this.enable_height = options.chart.height - diff_from_base - this.margin_borders;

        if (options?.hide_vertical_data_set === true) return;

        const { get_max_value, vertical_data } = this.calculate_max_value_enabled();

        this.min_width = (`${parseInt(get_max_value as any)}`.length * this.size_text) + (this.size_text / 2);

        this.draw_element({
          color: '#ffffff2d',
          coords: { w: 1.5, h: this.enable_height + this.margin_borders, x: this.min_width, y: 0 }
        });

        const normalize_values = (current_val: number) => {

          const length_max_number = `${parseInt(get_max_value as any)}`.length;
          const length_current_val = `${current_val}`.length;
          let normalized_value = `${current_val}`;

          if (length_max_number > length_current_val) {

            const diff = length_max_number - length_current_val;
            normalized_value = `${Array.from({ length: diff }).map(() => 0).join('')}${current_val}`

          }

          return normalized_value;

        }

        for (let i = 0; i < vertical_data.length; i++) {

          const position_y = interpolation(
            vertical_data[i],
            [0, get_max_value],
            [this.enable_height, 0]
          );

          this.draw_element({
            color: '#fff',
            coords: { h: 1, w: 7, x: this.min_width - 7, y: position_y }
          });

          this.draw_element({
            color: '#ffffff',
            text: {
              content: `${normalize_values(parseInt(vertical_data[i] as any))}`,
              px: this.size_text,
              aling: 'right',
              coords: {
                x: this.min_width - this.size_text,
                y: position_y + (this.size_text - 3)
              }
            }
          });

          if (draw_xaxis) {

            if (!dashed_enabled) {

              this.draw_element({
                color: '#ffffff2d',
                coords: { h: 1, w: options.chart.width, x: this.min_width - 7, y: position_y }
              });

              continue;

            }

            const space_by = 5;
            const w_dash = 5;
            const loops_count = options.chart.width / ((w_dash + space_by));
            let current_x_pos = this.min_width;

            for (let z = 0; z < loops_count; z++) {

              this.draw_element({
                color: '#ffffff2d',
                coords: { h: 1, w: w_dash, x: current_x_pos, y: position_y }
              });

              current_x_pos += (w_dash + space_by);

            }

          }

        }

      },
      draw_tooltip() {

        const max_length = (options.series.map(data => data.data_label.length * this.size_text_tip))
          .reduce((acc, val) => acc > val ? acc : val, 0);

        for (const column of this.chart_column_pos) {

          if (column.is_activate) {

            const middle_space_width = options.chart.width / 2;
            const is_left = column.pos.x < middle_space_width ? true : false;
            const min_height_by_line = 30;
            const padding = 10;

            const tip_w = max_length + (padding * 2);
            const tip_h = (min_height_by_line + (options.series.length * min_height_by_line)) + 1;

            const pos_x_base = is_left ? (column.pos.x + column.pos.w) + 10 : (column.pos.x - tip_w) - 10;
            const pos_y_base = (column.pos.h / 2) - (tip_h / 2);

            this.draw_element({
              color: 'rgb(0,0,0,.8)',
              coords: { h: tip_h, w: tip_w, x: pos_x_base, y: pos_y_base }
            });

            this.draw_element({
              color: 'rgb(255,255,255)',
              coords: { h: 1, w: tip_w, x: pos_x_base, y: pos_y_base + 30 }
            });

            this.draw_element({
              color: 'rgb(255,255,255)',
              text: {
                aling: 'left',
                content: `${options.label_tip}${this.current_labels[column.index]}`,
                px: this.size_text_tip,
                coords: { x: pos_x_base + padding, y: pos_y_base + 18 }
              }
            });

            let pos_y_labels = pos_y_base + min_height_by_line;

            for (let i = 0; i < options.series.length; i++) {

              pos_y_labels += min_height_by_line;

              this.draw_element({
                color: 'rgb(255,255,255,.1)',
                coords: { h: 1, w: tip_w, x: pos_x_base, y: pos_y_labels }
              });

              this.draw_element({
                color: 'rgb(255,255,255)',
                text: {
                  aling: 'left',
                  content: `${options.series[i].data_label}: ${options.series[i].data[column.index]}`,
                  px: this.size_text_tip,
                  coords: { x: pos_x_base + 20, y: pos_y_labels - padding }
                }
              });

              ctx.fillStyle = options.series[i]?.color;
              ctx.beginPath();
              ctx.arc(pos_x_base + padding, pos_y_labels - 15, 5, 0, Math.PI * 2);
              ctx.fill();
              ctx.closePath();

            }

          }

        }

      },
      define_min_side() {

        const w = options.chart.width;
        const h = options.chart.height;
        this.min_side_by_side = w < h ? w : h;

      },
      draw_arc(props: DrawArcType) {

        const convert_degree_rad = (val: number) => val * (Math.PI / 180);

        ctx.beginPath();
        ctx.lineWidth = props.line_width;
        ctx.strokeStyle = props.color;
        ctx.arc(
          props.x,
          props.y,
          props.radius_size,
          convert_degree_rad(props.initial),
          convert_degree_rad(props.final)
        );
        ctx.stroke();
        ctx.closePath();

      },
      interpolated_pie() {

        let arc_data = [] as ArcsData[];
        const max_value_chart = options.series.reduce((acc, data) => acc += data.data[0], 0)

        for (const current_data of options.series) {

          const arc_current = {} as ArcsData;

          const width = interpolation(current_data.data[0], [0, max_value_chart], [20, 70]);
          const final_degree = interpolation(current_data.data[0], [0, max_value_chart], [0, 360]);

          arc_current.width = width;
          arc_current.color = current_data.color,
            arc_current.inital = arc_data[arc_data.length - 1]?.final || 0;
          arc_current.final = arc_current.inital + final_degree;

          arc_data.push(arc_current);

        }

        const high_radius = arc_data.reduce((acc, val) => acc > val.width ? acc : val.width, 0);

        for (const arc of arc_data) {

          this.draw_arc({
            color: arc.color,
            final: arc.final,
            initial: arc.inital,
            x: options.chart.width / 2,
            y: options.chart.height / 2,
            line_width: arc.width,
            radius_size: (this.min_side_by_side / 2) - (high_radius / 2)
          });

        }

      },
      pie_lines() {

        const space_by_line = 6;
        const line_width = 10;

        for (let i = 0; i < options.series.length; i++) {

          const current_serie = options.series[i];
          const convert_to = this.get_rgb_color(current_serie.color);
          const radius = (this.min_side_by_side / 2) - (line_width / 2) - ((space_by_line + line_width) * i)

          let current_arc_data: DrawArcType = {
            color: `rgb(${convert_to?.r}, ${convert_to?.g}, ${convert_to?.b}, 0.1)`,
            x: options.chart.width / 2,
            y: options.chart.height / 2,
            line_width: line_width,
            initial: 0,
            final: 360,
            radius_size: radius
          };

          this.draw_arc(current_arc_data);

          const final_degree = interpolation(current_serie.data[0], [0, 100], [0, 360]);

          current_arc_data.color = current_serie.color;
          current_arc_data.final = final_degree;

          this.draw_arc(current_arc_data);

        }

      }
    }

    const draw_everything = () => {

      ctx.clearRect(0, 0, options.chart.width, options.chart.height);

      chart.define_min_side();

      if (options.chart.type === 'pie_lines') {

        chart.pie_lines();

      }

      if (options.chart.type === 'pie_interpolated') {

        chart.interpolated_pie();

      }

      if (options.chart.type === 'normal') {

        if (!options?.disable_sparklines) {

          chart.draw_side_left_height_data();
          chart.draw_activate_hover_columns();
          chart.draw_base_chart();
          chart.draw_spikes();

        }

        chart.draw_columns();

        if (!options?.disable_sparklines)
          chart.draw_tooltip();

      }

    }

    const disable_all_columns = () => {

      for (const column of chart.chart_column_pos)
        chart.chart_column_pos[column.index] = {
          ...chart.chart_column_pos[column.index],
          is_activate: false
        }

      draw_everything();

    }

    const on_mouse_move = (event: MouseEvent) => {

      const cx = event.offsetX;

      for (const column of chart.chart_column_pos) {

        if (cx > column.pos.x && cx < (column.pos.x + column.pos.w)) {

          chart.chart_column_pos[column.index] = {
            ...chart.chart_column_pos[column.index],
            is_activate: true
          }

          continue;

        }

        chart.chart_column_pos[column.index] = {
          ...chart.chart_column_pos[column.index],
          is_activate: false
        }

      }

      draw_everything();

    }

    const data_is_ok = check_data_integrity();

    if (!data_is_ok._success) console.error(data_is_ok.message);

    if (data_is_ok._success) {

      draw_everything();

      canvas.addEventListener('mousemove', on_mouse_move);
      canvas.addEventListener('mouseout', disable_all_columns);

    }

    const destroy_canvas_listeners = () => {

      canvas.removeEventListener('mousemove', on_mouse_move);
      canvas.removeEventListener('mouseout', disable_all_columns);

    }

    return { destroy: destroy_canvas_listeners }

  }

  useEffect(() => {

    smicro_reference.current = smicrochart_initializer();

    return () => {

      smicro_reference.current.destroy();

    }

  }, []);

  return (
    <>
      <canvas id={react_id} ></canvas>
    </>
  );
}