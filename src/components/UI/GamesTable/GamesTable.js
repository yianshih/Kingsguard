import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import { AutoSizer, Column, Table } from 'react-virtualized'
import Button from '@material-ui/core/Button'

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
})

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  }

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  cellRenderer = ({ cellData, columnIndex }) => {
    //console.log("this.props : ",this.props)
    //const id = this.props.idGetter()
    const { classes, rowHeight, onRowClick } = this.props
    const newData = columnIndex === 2 
      ? cellData[1] === 'waitingBlue'
        ?<Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => this.props.joinHandler(cellData[0])}>
          Join
        </Button>
        : 'Playing'
      : cellData
    return (
      <TableCell
        align="center"
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        //align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {newData}
      </TableCell>
    )
  }

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    )
  }

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)

// ---

const sample = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
]

function createData(id, dessert, calories, fat, carbs, protein) {
  return { id, dessert, calories, fat, carbs, protein }
}

const rows = []

for (let i = 0; i < 200; i++ ) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)]
  rows.push(createData(i, ...randomSelection))
}

const ReactVirtualizedTable = (props) => {
  //console.log(props.data)
  const games = []
  for (let i = 0; i < Object.keys(props.data).length; i++) {
    //const randomSelection = sample[Math.floor(Math.random() * sample.length)]
    const gameID = Object.keys(props.data)[i]
    games.push({
      id: gameID,
      user: props.data[gameID].red,
      join:  [gameID,props.data[gameID].currentState],
    })
  }

  return (
    <Paper elevation={5} style={{ height: '100%', width: '100%' }}>
      <VirtualizedTable
        // rowCount={rows.length}
        // rowGetter={({ index }) => rows[index]}
        joinHandler={props.joinHandler}
        rowCount={games.length}
        rowGetter={({ index }) => games[index]}
        columns={[
          {
            width: 200,
            label: 'Game ID',
            dataKey: 'id',
          },
          {
            width: 120,
            label: 'User',
            dataKey: 'user',
          },
          {
            width: 120,
            label: '',
            dataKey: 'join',
          }
        ]}
      />
    </Paper>
  )
}

export default ReactVirtualizedTable
