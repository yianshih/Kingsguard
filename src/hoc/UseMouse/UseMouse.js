import React from 'react'
import useMousePosition from '@react-hook/mouse-position'

const useMouse = (props) => {
    const [mousePosition, ref] = useMousePosition(
        0, // enterDelay
        0, // leaveDelay
        30 // fps
    )
    const getMousePos = (active) => {
        if (active) return mousePosition
    }
    const children = React.Children.map(props.children, child => {
        return React.cloneElement(child,{
            getMousePos: getMousePos
        })
    })
    return (
        // You must provide the ref to the element you're tracking the
        // mouse position of
        <div ref={ref}>
            x: {mousePosition.x}
            y: {mousePosition.y}
            {children}
        </div>
    )

}

const getMousePos = () => {

}

export default useMouse