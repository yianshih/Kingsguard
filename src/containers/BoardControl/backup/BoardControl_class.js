import React, { Component } from 'react'
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import * as actions from '../../store/actions/index'
//import Aux from '../../hoc/Aux/Aux'
import styles from './BoardControl.module.css'
import Board from '../../components/Board/Board'
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
import Guard from '../../components/Guard/Guard'
import GuardsInfo from '../../components/GuardsInfo/GuardsInfo'
import GuardOptionModal from '../../components/UI/GuardOptionModal/GuardOptionModal'    
// import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
// import PositionLabel from './PositionLabel'

const BoardControl = props => {
    const guards = useSelector(state => state.guards);
    console.log(guards)
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         turn: null,
    //         gameStage: null,
    //         fightStart: false,
    //         gameStart: false,
    //         modalMessage: null,
    //         isModalShow: false,
    //         whosMoving: null,
    //         whosAttacking: null,
    //         clickedGuard: null,
    //         actionCounts: 0,
    //         isGuardOptionModalShow:false,
    //     }
    // }

    squaresFightingClickHandler = (pos) => {
        this.props.onSetSquareUnit(this.props.guards[this.state.whosMoving - 1].pos,null)
        this.props.onSetSquareUnit(pos,this.state.whosMoving)
        this.props.onSetGuardPos(this.state.whosMoving,pos)
        this.props.onSetGuardActived(this.state.whosMoving,false)
        if (this.state.actionCounts > 0) {
            this.props.onSetSquaresDisabled(true)
            this.switchTurn()
            this.setState({
                actionCounts: 0,
                whosMoving:null,
                clickedGuard: null,
            })
            // setTimeout( () => {
            //     this.props.onSetTeamDisabled(this.state.turn,false)
            // },500)
        }
        else {
            this.setState({
                actionCounts: 1,
                whosMoving:null,
                clickedGuard: null,
            })
            this.props.onSetSquaresDisabled(true)
            this.props.onSetTeamDisabled(this.state.turn,false)
        }
    }

    
    squaresPlacingClickHandler = (pos) => {
        this.props.onSetSquareUnit(pos,this.state.whosMoving)
        this.props.onSetSquaresDisabled(true)
        this.props.onSetOneGuardDisabled(this.state.whosMoving,true)
        this.props.onSetGuardActived(this.state.whosMoving,false)
        this.props.onSetGuardPos(this.state.whosMoving,pos)
        this.props.onSetGuardisPlaced(this.state.whosMoving,true)
        this.props.onSetUnplacedGuardsDisabled(this.state.turn,true)    
        this.setState({whosMoving:null})
        setTimeout( () => {
            let placementFinish = true
            for (let i = 0; i < this.props.guards.length; i++) {
                placementFinish = this.props.guards[i].isPlaced && placementFinish
            }
            if (placementFinish) {
                this.setState({fightStart:true})
                this.fightStartHandler()
            }
            else {
                this.props.onSetUnplacedGuardsDisabled(this.state.turn,false)
            }
        },500)
        this.switchTurn()
    }

    switchTurn = () => {
        switch(this.state.turn) {
            case 'red':
                this.showModalHandler(0.3,"It's blue turn")
                this.props.onSetTeamDisabled('blue',false)
                return this.setState({turn: 'blue'})
            case 'blue':
                this.showModalHandler(0.3,"It's red turn")
                this.props.onSetTeamDisabled('red',false)
                return this.setState({turn: 'red'})
            default:
                return
        }
    }

    squaresClickedHandler = (e) => {

        switch(this.state.gameStage) {
            case 'placing':
                return this.squaresPlacingClickHandler(e.target.value)
            case 'fighting':
                return this.squaresFightingClickHandler(e.target.value)
            default:
                return alert('unknown stage')
        }

        

    }

    fightStartHandler = () => {
        this.showModalHandler(1,'Fight Start')
        this.setState({gameStage:'fighting'})
        this.props.onSetTeamDisabled(this.state.turn,false)
    }

    gameStartHandler = () => {
        this.showModalHandler(1,'Game Start')
        this.setState({
            turn:'red',
            gameStage: 'placing',
            gameStart: true
        })
        // -- [Place guards] --
        setTimeout( () => {
            //console.log('this.state.turn : ',this.state.turn)
            this.showModalHandler(1,this.state.turn + "'s turn")
            this.props.onSetUnplacedGuardsDisabled(this.state.turn,false)    
        },1000)        

    }

    closeModalHandler = () => {
        this.setState({isGuardOptionModalShow:false})
    }

    guardsFightingMovingHandler = () => {
        const id = this.state.clickedGuard
        this.setState({
            isGuardOptionModalShow: false,
            whosMoving: id
        })
        this.props.onSetOnlyOneGuardDisabled(id,false)
        
        this.props.onSetGuardActived(id,true)
        this.props.onSetSquaresMovingDisabled(this.props.guards[id - 1].pos,this.props.guards[id - 1].step,true)

    }

    guardsAttackHandler = () => {
        const id = this.state.clickedGuard
        this.setState({
            isGuardOptionModalShow: false,
            whosAttacking: id
        })
        this.props.onSetGuardActived(id,true)
        this.props.onSetOnlyOneGuardDisabled(id,false)
        this.props.onSetGuardsAttackable(id)
    }

    guardsAbilityHandler = () => {
        alert('coming soon')
    }
    guardsFightingClickHandler = (id) => {
        if (this.state.whosAttacking !== null && this.state.whosAttacking !== id) {
            //clicking attack target
            this.props.onSetGuardAttacking(this.state.whosAttacking,id)
            this.props.onSetGuardActived(this.state.whosAttacking,false)
            this.props.onSetTeamDisabled(this.state.turn,false)
            if (this.state.actionCounts > 0) {
                this.switchTurn()
                this.setState({
                    actionCounts: 0,
                    whosAttacking: null,
                    clickedGuard: null
                })
                // setTimeout( () => {
                //     this.setState({
                //         isModalShow: false
                //     })
                // },500)
            }
            else {
                this.setState({
                    actionCounts: 1,
                    clickedGuard: null,
                    whosAttacking: null
                })
            }
        } 
        else if (this.state.whosMoving !== null || this.state.whosAttacking !== null) {
            // double clicked
            this.props.onSetGuardActived(id,false)
            this.props.onSetSquaresDisabled(true)
            this.props.onSetTeamDisabled(this.state.turn,false)
            this.setState({
                isGuardOptionModalShow: false,
                clickedGuard: null,
                whosMoving: null,
                whosAttacking: null
            })
        }
        else {
            // first click 
            this.setState({
                isGuardOptionModalShow: true,
                clickedGuard: id
            })
        }
        

        
    }

    guardsPlacingClickHandler = (id) => {
        
        if (this.state.whosMoving === id) {
            this.props.onSetGuardActived(this.state.whosMoving,false)
            this.props.onSetSquaresPlacingDisabled(this.state.turn,true)
            this.setState({whosMoving:null})
        }
        else if (this.state.whosMoving !== null) {
            this.props.onSetGuardActived(this.state.whosMoving,false)
            this.props.onSetGuardActived(id,true)
            this.props.onSetSquaresPlacingDisabled(this.state.turn,false)
            this.setState({whosMoving:id})
        }
        else {
            this.props.onSetGuardActived(id,true)
            this.props.onSetSquaresPlacingDisabled(this.state.turn,false)
            this.setState({whosMoving:id})
        }
    }

    guardsClickedHandler = (id) => {
        
        switch(this.state.gameStage) {
            case 'placing':
                return this.guardsPlacingClickHandler(id)
            case 'fighting':
                return  this.guardsFightingClickHandler(id)
            default:
                alert('Unknown Stage')
        }
        
    }

    showModalHandler = (seconds,message) => {
        this.setState({
            modalMessage: message,
            isModalShow: true
        })
        setTimeout( () => {
            this.setState({
                isModalShow: false
            })
        },seconds*1000)
    }

    mouseMovehandler = e => {
        if (!this.state.isGuardOptionModalShow){
            this.setState({
                mousePos: {
                    x: e.clientX,
                    y: e.clientY
                }
            })
        }
    }

    jumpToFightHandler = () => {

        for (let i = 0; i < this.props.guards.length; i++) {
            const id = this.props.guards[i].id
            this.props.onSetGuardisPlaced(id,true)
            if (i < 4) {
                this.props.onSetGuardPos(id,'D'+id)
                this.props.onSetSquareUnit('D'+id,id)
            }
            else if (i > 5){
                this.props.onSetGuardPos(id,'E'+(id-4))
                this.props.onSetSquareUnit('E'+(id-4),id)
            }
            else {
                this.props.onSetGuardPos(id,'E'+id)
                this.props.onSetSquareUnit('E'+id,id)
            }
   
        }

        this.setState({
            turn:'red',
            gameStage: 'fighting',
                gameStart: true,
            fightStart:true
        })
        
        setTimeout( () => {
            this.fightStartHandler()
        },500)
        
        
    }


    // console.log("this.state.whosMoving : ",this.state.whosMoving)
    // console.log("this.state.whosAttacking : ",this.state.whosAttacking)
    // console.log("this.state.clickedGuard : ",this.state.clickedGuard)

    const renderGuards = this.state.fightStart
    ? null
    :<div className={styles.GuardsBoard}>
        {this.props.guards.map( g => 
        g.isPlaced 
        ? null 
        :<Guard
            id={g.id}
            key={g.id}
            side={g.side}
            clicked={() => this.guardsClickedHandler(g.id)} 
            pos={g.pos}
            name={g.name} 
            disabled={g.disabled}
            actived={g.actived}
        />
        )}
    </div>
        
    return(
        <div>
        {/* // <div onMouseMove={this.mouseMovehandler}> */}
            <Modal show={this.state.isModalShow} modalClosed={null}>
                {this.state.modalMessage}
            </Modal>
            <GuardOptionModal mousePos={this.state.mousePos} show={this.state.isGuardOptionModalShow} modalClosed={this.closeModalHandler}>
                <Button btnType='Success' clicked={this.guardsFightingMovingHandler}>Move</Button>
                <Button btnType='Success' clicked={this.guardsAttackHandler}>Attack</Button>
                <Button btnType='Success' clicked={this.guardsAbilityHandler}>Ability</Button>
                <p></p>
                <Button btnType='Danger' clicked={this.closeModalHandler}>Close</Button>
            </GuardOptionModal>
            <Button btnType='Danger' clicked={this.gameStartHandler} disabled={this.state.gameStart}>Game Start</Button>
            <Button btnType='Danger' clicked={this.jumpToFightHandler} disabled={this.state.gameStage === 'fighting'}>Jump To Fight</Button>
            <div className={styles.BoardControl}>
                <div className={styles.SquareBoard}>
                    <Board 
                        clicked={ e => this.squaresClickedHandler(e)}
                        gclicked={ e => this.guardsClickedHandler(e.target.id)} 
                    />
                </div>
                {renderGuards}
            </div>
            
            {/* <Button clicked={() => {this.setState({isGuardOptionModalShow:true})}}>Open</Button> */}
            <GuardsInfo side='red'/>
            <GuardsInfo side='blue'/>
            {/* <ReactCursorPosition>
                <PositionLabel/>
            </ReactCursorPosition> */}
        </div>
        
    )


    

}

// const mapStateToProps = state => {
//     return {
//         squares: state.squares,
//         guards: state.guards
//     }
// }


// const mapDispatchToProps = dispatch => {
//     return {
//         onSetSquaresDisabled: (disabled) => dispatch(actions.setSquaresDisabled(disabled)),
//         onSetSquareUnit: (pos, unit) => dispatch(actions.setSquareUnit(pos, unit)),
//         onSetSquaresMovingDisabled: (pos, step) => dispatch(actions.setSquaresMovingDisabled(pos,step)),
//         onSetSquaresPlacingDisabled: (side, disabled) => dispatch(actions.setSquaresPlacingDisabled(side, disabled)),
//         onSetTeamDisabled: (side,disabled) => dispatch(actions.setTeamDisabled(side,disabled)),
//         onSetGuardActived: (id, actived) => dispatch(actions.setGuardActived(id, actived)),
//         onSetOneGuardDisabled: (id, disabled) => dispatch(actions.setOneGuardDisabled(id, disabled)),
//         onSetOnlyOneGuardDisabled: (id, disabled) => dispatch(actions.setOnlyOneGuardDisabled(id, disabled)),        
//         onSetGuardisPlaced: (id, isPlaced) => dispatch(actions.setGuardisPlaced(id, isPlaced)),
//         onSetGuardPos: (id, pos) => dispatch(actions.setGuardPos(id, pos)),
//         onSetGuardsAttackable: (id) => dispatch(actions.setGuardsAttackable(id)),
//         onSetGuardAttacking: (attacker, defender) => dispatch(actions.setGuardAttacking(attacker, defender)),
//         onSetUnplacedGuardsDisabled: (side, disabled) => dispatch(actions.setUnplacedGuardsDisabled(side,disabled))
//     }
// }

export default BoardControl
// export default connect(mapStateToProps,mapDispatchToProps)(BoardControl)