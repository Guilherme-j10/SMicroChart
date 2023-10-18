import { useEffect, useRef, useState } from 'react';
import { SMicroChart } from './';

function App() {

  const element = useRef({} as HTMLDivElement);
  const timer = useRef({} as NodeJS.Timeout);

  const [enable, set_enable] = useState(false);

  useEffect(() => {

    timer.current = setInterval(() => {

      if (enable) {
        element.current.style.width = `${element.current.offsetWidth + 1}px`;
        element.current.style.height = `${element.current.offsetHeight + 1}px`;
      }

    }, 50);

    return () => {

      window.clearInterval(timer.current);

    }

  }, [enable]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#111', flexDirection: 'column', alignItems: 'center', height: '200vh' }}>
      <button onClick={() => set_enable(val => !val)} style={{ background: '#333', marginBottom: 20, color: 'white' }}>
        toggle
      </button>
      <div style={{ width: '400px', height: '100px', border: 'solid 1px red' }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          disable_border_points={true}
          options={{
            disable_sparklines: true,
            hermit_enable: true,  
            enable_data_dots: false,
            smooth: true,
            stroke_line_settings: {
              fill: false,
              width: 2,
            },
            series: [
              {
                color: '#ffffff',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '400px', height: '100px', border: 'solid 1px red' }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            disable_sparklines: true,
            hermit_enable: true,
            enable_data_dots: false,
            smooth: true,
            stroke_line_settings: {
              fill: true,
              width: 1,
              fill_color: '#ffffff5b'
            },
            series: [
              {
                color: '#ffffff5b',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '400px', height: '100px', border: 'solid 1px red' }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            disable_sparklines: true,
            hermit_enable: false,
            enable_data_dots: false,
            smooth: true,
            stroke_line_settings: {
              fill: true,
              width: 1,
              fill_color: '#ffffff5b'
            },
            series: [
              {
                color: '#ffffff5b',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '400px', height: '100px', border: 'solid 1px red' }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            disable_sparklines: true,
            hermit_enable: false,
            enable_data_dots: false,
            smooth: false,
            stroke_line_settings: {
              fill: true,
              width: 1,
              fill_color: '#ffffff5b'
            },
            series: [
              {
                color: '#ffffff5b',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '700px', height: '300px', border: 'solid 1px red', marginTop: 10 }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            series: [
              {
                color: '#3defcc',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              },
              {
                color: '#acec19',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'column'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '700px', height: '300px', border: 'solid 1px red', marginTop: 10 }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            smooth: true,
            series: [
              {
                color: '#3defcc',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'line'
              },
              {
                color: '#acec19',
                data: [160, 85, 100, 56, 150, 110, 89, 130],
                data_label: 'teste',
                data_type: 'column'
              }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
      <div style={{ width: '700px', height: '300px', border: 'solid 1px transparent', marginTop: 10 }} ref={element}>
        <SMicroChart
          enable_parent_container_dimension={true}
          options={{
            disable_sparklines: true,
            hermit_enable: true,
            smooth: true,
            series: [
              {
                color: '#3defcc',
                data: [0,0,0,0,0,0,0],
                data_label: 'teste',
                data_type: 'line'
              },
              // {
              //   color: '#acec19',
              //   data: [0,0,0,0,0,0,0],
              //   data_label: 'teste',
              //   data_type: 'column'
              // }
            ],
            chart: {
              type: 'normal',
              width: 200,
              height: 100
            }
          }}
        />
      </div>
    </div>
  )
}

export default App;
