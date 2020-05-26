import React, { Component } from 'react'
import styles from './Square.module.css'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'
import Aux from '../../../hoc/Aux/Aux'
import UnitButton from '../../UI/UnitButton/UnitButton'

class Square extends Component {

    state = {
        unit: null
    }
    
    render() {

      if (this.props.unit !== null) {
        console.log('[Square] id : ',this.props.id,' unit : ',this.props.unit)
      }
      

      let btnType = this.props.placingGuards ? 'Shaking' : null 

      let renderUnitButton = null

      //console.log('this.props.isUnit : ',this.props.isUnit)

      const renderUnitButton_test = this.props.isUnit ? 
      (<UnitButton
          disabled={this.props.disabled} 
          className={styles.Square} 
          clicked={this.props.clicked} 
          btnType={btnType}
        >{this.props.unit.name}
      </UnitButton>)
      : (<UnitButton 
            disabled={this.props.disabled} 
            className={styles.Square} 
            clicked={this.props.clicked} 
            btnType={btnType}
          >{this.props.id}
        </UnitButton>)

      if (this.props.unit === null) {
        renderUnitButton = (
          <UnitButton 
            disabled={this.props.disabled} 
            className={styles.Square} 
            clicked={this.props.clicked} 
            btnType={btnType}
            >
              {this.props.id}
          </UnitButton>
        )
      }
      
      
      
      return (
        <Aux>
          {renderUnitButton_test}
        </Aux>
      )
    }
}

const mapStateToProps = state => {
    return {
      isMoving: state.isMoving
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
      onMoving: () => dispatch( actions.move() )
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(Square)