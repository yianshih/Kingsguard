import React from 'react';

const PositionLabel = (props) => {
    
    console.log(props.position)
    return (
        <div className={props.className}>
            {'x : '+props.position.x+' , y : '+props.position.y}
            {/* {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {props.shouldShowIsActive && [`isActive: ${isActive}`, <br key="line-break"/>]}
            {`width: ${width}`}<br />
            {`height: ${height}`}<br />
            {`isPositionOutside: ${isPositionOutside ? 'true' : 'false'}`}<br />
            {`isMouseDetected: ${isMouseDetected ? 'true' : 'false'}`}<br />
            {`isTouchDetected: ${isTouchDetected ? 'true' : 'false'}`} */}
        </div>
    );
};

PositionLabel.defaultProps = {
    shouldShowIsActive: true
};

export default PositionLabel;