import { useEffect, useRef } from "react";
import { SMicroChart } from ".";

function App() {

  const element = useRef({} as HTMLDivElement);

  useEffect(() => {

    // setInterval(() => {

    //   element.current.style.width = `${element.current.offsetWidth + 1}px`;
    //   element.current.style.height = `${element.current.offsetHeight + 1}px`;

    // }, 50);

  }, [])

  return (
    <>
      <div ref={element} style={{
        width: '200px',
        border: 'solid 1px #ccc'
      }}>
        <SMicroChart 
          enable_parent_container_dimension={false}
          options={{
            chart: {
              type: 'pie_interpolated',
              width: 200,
              height: 200,
            },
            series: [
              {
                color: '#32b7a8', 
                data: [5],
                data_label: 'p1'
              },
              {
                color: '#333333', 
                data: [15],
                data_label: 'p1'
              },
              {
                color: '#4fd86f', 
                data: [25],
                data_label: 'p1'
              }
            ]
          }}
        />
      </div>
    </>
  )
}

export default App;