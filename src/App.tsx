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
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#111', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
      <button onClick={() => set_enable(val => !val)} style={{ background: '#333', marginBottom: 20, color: 'white' }}>
        toggle
      </button>
      <div style={{ width: '20%', height: '300px', border: 'solid 1px red' }} ref={element}>
        <SMicroChart
          options={{
            series: [
              {
                color: '#333333',
                data: [25, 0, 0, 0, 0],
                data_label: 'opt_1',
                data_type: 'column'
              },
              {
                color: '#90ff68',
                data: [35, 0, 0, 0, 0],
                data_label: 'opt_1',
                data_type: 'column'
              },
              {
                color: '#5cf8c7',
                data: [45, 0, 0, 0, 0],
                data_label: 'opt_1',
                data_type: 'column'
              }
            ],
            chart: {
              height: 300,
              width: 300,
              type: 'normal'
            }
          }}
        />
      </div>
    </div>
  )
}

export default App;
