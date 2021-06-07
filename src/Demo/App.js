import React from 'react'

const Demo = () => {
  const [ count, setCount ] = React.useState(0)

  return (
    <div>
      <span>Count: { count }</span>
      <button onClick={ () => setCount(count+1) }>Increment</button>
    </div>
  )
}

export default Demo
