import React, { Component } from 'react'
import styles from './BoardControl.module.css'
import Guard from '../../components/Guard/Guard'
//import update from 'immutability-helper'
import Board from '../../components/Board/Board'
import Aux from '../../hoc/Aux/Aux'
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
//import GuardBoard from '../../components/GuardBoard/GuardBoard'
//import thunk from 'redux-thunk'


const redRowList = ['A','B','C','D']

const blueRowList = ['E','F','G','H']

const squareList = ['1','2','3','4','5','6']

// const gameMessage = [
//     'Please place your guards','Start fight !!'
// ]

const allRows = redRowList.concat(blueRowList)


const allSquares = []

for (let i = 0; i < allRows.length; i++) {
    for (let j = 0; j < squareList.length; j++) {
        allSquares.push({
            pos: allRows[i]+squareList[j],
            unit: null,
            disabled: true,
            actived: false
        })
    }    
}

class BoardControl extends Component {

    state = {
        gameStage:null,
        placingGuards: false,
        placedFinish: false,
        placedStarting:false,
        fightStarting:false,
        whosMoving: null,
        modal:false,
        squares: allSquares,
        modalMessage: null,
        guardsList: [
            {
                id: 1,
                name: 'Knight',
                hp: 200,
                dmg: 50,
                isPlaced: false,
                actived: false,
                disabled: true,
                pos:null
            },
            {
                id: 2,
                name: 'Archer',
                hp: 150,
                dmg: 70,
                isPlaced: false,
                actived: false,
                disabled: true,
                pos:null
            },
            {
                id: 3,
                name: 'Wizard',
                hp: 120,
                dmg: 80,
                isPlaced: false,
                actived: false,
                disabled: true,
                pos:null
            },
            {
                id: 4,
                name: 'King',
                hp: 100,
                dmg: 30,
                isPlaced: false,
                actived: false,
                disabled: true,
                pos:null     
            }
        ]

    }

    componentDidMount() {
        
        //console.log('[componentDidMount]')

    }

    setGuardPlacing(id) {

        this.setSquareDisabled(false)

        let copyGuardsList = [
            ...this.state.guardsList
        ]

        for (let i = 0; i < copyGuardsList.length; i++) {
            if (copyGuardsList[i].id === id) {
                copyGuardsList[i].actived = true
            }            
        }

        this.setState({        
            guardsList: copyGuardsList,
            placingGuards: true,
            whosMoving: copyGuardsList[id - 1]
        })

        this.setSquareDisabled(false)

    }

    setSquareDisabled(disabled,pos=null) {

        let copySquares = [
            ...this.state.squares
        ]

        

        if (pos) {
            copySquares[this.extractIndex(pos)].disabled = disabled
        }
        else {
            for (let i = 0; i < copySquares.length; i++) {
                if (copySquares[i].unit === null) {
                    copySquares[i].disabled = disabled
                } 
                
            }
        }
        
        
        this.setState({squares: copySquares})
    }

    setGuardDisabled (disabled) {
        
        let copyGuardsList = [...this.state.guardsList]
        
        for (let i = 0; i < copyGuardsList.length; i++) {

            copyGuardsList[i].disabled = disabled

            // if (copyGuardsList[i].pos !== null) {
            //     this.setSquareDisabled(disabled,copyGuardsList[i].pos)
            // }
            // else {
                
            // }
            
        }

        this.setState({
            guardsList: copyGuardsList
        })
    }

    guardsClickedHandler = (value) => {
        //e.preventDefault()
        const id = value
        console.log('[guardsClickedHandler] e.target.value',value)
        let copyGuardsList = [...this.state.guardsList]

        if (this.state.whosMoving === null) {
            this.setGuardPlacing(id)
            return
        }

        if (this.state.whosMoving.id === id) {
            // click the same guard
            console.log('click the same guard')
            copyGuardsList[id - 1].actived = false
            this.setSquareDisabled(true)
            this.setState({
                whosMoving: null,
            })
        }
        else { // click other guards while placing
            const prevGuardIndex = this.state.whosMoving.id - 1
            copyGuardsList[prevGuardIndex].actived = false
            this.setState({
                guardsList: copyGuardsList
            })
            this.setGuardPlacing(id)
        }
    } //guardsClickedHandler end

    gameStartClickHandler = () => {

        this.setState(prevState => {
            return {
                gameStage:'placing',
                placedStarting: !prevState.placedStarting
            }
            
        })
        this.showModal(1,'Place your guards')
        this.setGuardDisabled(this.state.placedStarting)
    }

    showModal = (seconds,message) => {

        this.setState({
            modalMessage:message
        })

        this.ModalHandler()

        setTimeout( () => {
            this.ModalHandler()
        },seconds*1000)

        
    }

    extractIndex (id) {
        
        const rowIndex = allRows.findIndex(i => i === id[0])
        const index = rowIndex === 0 ? +id[1] -1 : rowIndex * 6 + +id[1] - 1

        return index
        
    }

    ModalHandler = () => {
        this.setState( prevState => {
            return {
                modal: !prevState.modal
            }
        })
    }

    squaresClickedHandler(e) {
        e.preventDefault()
        console.log('[squaresClickedHandler]',e.target.value)
        if (this.state.whosMoving === null) {return}
        
        const squareIndex = this.extractIndex(e.target.value)
        const placingGuardId = this.state.whosMoving.id

        const copyGuard = [
            ...this.state.guardsList
        ]

        const targetGuard = copyGuard[placingGuardId - 1]
        targetGuard.isPlaced = true
        targetGuard.pos = e.target.value
        targetGuard.actived = false
        targetGuard.disabled = true

        let copySquares = [
            ...this.state.squares
        ]

        copySquares[squareIndex].unit = targetGuard


        for (let i = 0; i < copySquares.length; i++) {
            copySquares[i].disabled = true
        }

        let updateFinishedPlace = true

        for (let i = 0;i < copyGuard.length; i++) {
            updateFinishedPlace = copyGuard[i].isPlaced && updateFinishedPlace
        }

        // this.setState(newData)
        this.setState({
            squares: copySquares,
            placingGuards: false,
            whosMoving: null,
            placedFinish: updateFinishedPlace,
            gameStage:updateFinishedPlace ? 'fighting' : 'placing'
        })

        if(updateFinishedPlace) {
            this.fightingHandler()
        }

    }

    setGuardMoving = (id) => {

        
    }

    fightingHandler = () => {
        this.showModal(1,'Start Fighting')

        this.setGuardDisabled(false)

    }

    render() {


        console.log('this.state.whosMoving',this.state.whosMoving)

        return (
            <Aux>
                <Modal show={this.state.modal} modalClosed={null}>
                    {this.state.modalMessage}
                </Modal>
                <div className={styles.BoardControl}>
                    <div className={styles.SquareBoard}>
                        <Board 
                            squareList={this.state.squares} 
                            clicked={ e => this.squaresClickedHandler(e)}
                            gclicked={ e => this.guardsClickedHandler(e)} 
                        />
                    </div>
                    <div className={styles.GuardsBoard}>
                        {this.state.guardsList.map( g => 
                            <Guard
                            id={g.id}
                            key={g.name}
                            clicked={e => this.guardsClickedHandler(e.target.id)} 
                            pos={g.pos}
                            name={g.name} 
                            disabled={g.disabled}
                            actived={g.actived}/>
                        )}
                    
                        {/* <GuardBoard guardsList={this.state.guardsList} clicked={ e => this.guardsClickedHandler(e.target.value)} /> */}
                    </div>
                </div>
                <div>
                    <Button disabled={this.state.placedStarting} clicked={this.gameStartClickHandler}>Start Game</Button>
                </div>
            </Aux>
        )

    }

}

export default BoardControl