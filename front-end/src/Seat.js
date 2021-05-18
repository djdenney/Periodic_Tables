import React, { useState } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { updateReservationStatus, findReservation, updateTable } from './utils/api'
import ErrorAlert from './layout/ErrorAlert'


function Seat() {
    const history = useHistory()
    const location = useLocation()
    const { reservation_id } = useParams()
    const tables = location.state?.tables
    const [table, setTable] = useState(tables.find((table) => !table.reservation_id))
    const [error, setError] = useState(null)

    const tableOptions = tables.map((table) => {
        if (!table.reservation_id) {
            return (
                <option 
                    key={table.table_id} 
                    value={table.table_name}
                >
                    {table.table_name} - {table.capacity}
                </option>
            )
        } else {
            return (
                <option 
                    key={table.table_id} 
                    value={table.table_name} 
                    disabled
                >
                    {table.table_name} - {table.capacity} - Occupied
                </option>
            )
        }
    })

    function handleChange(e) {
        const value = e.target.value
        const result = tables.find((table) => table.table_name === value)
        setTable(result)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const abortController = new AbortController()
            const response = await updateTable({...table, reservation_id: reservation_id}, abortController.signal)
            history.push(`/`)
            const reservation = await findReservation(reservation_id, abortController.signal)
            await updateReservationStatus(reservation, 'seated', abortController.signal)
            return response
        } catch (error) {
            setError(error)
            console.error(error)
        }
    }

    async function handleCancel(e) {
        e.preventDefault()
        //const reservation = await findReservation(reservation_id)
        //console.log(reservation.status)
        history.goBack()
    }
    
    if (table) {
    return (
        <div className="container d-grid gap-2">
            <h4>Seating for Reservation</h4>
            <ErrorAlert error={error} />
            <form className="d-grid gap-2" onSubmit={(e) => handleSubmit(e)}>
                <select
                    id="table_id"
                    name="table_id"
                    className="form-control"
                    value={table.table_name}
                    onChange={(e) => handleChange(e)}
                >
                    {tableOptions}
                </select>
                <button type="submit" className="btn btn-light">Submit</button>
                <button type="cancel" className="btn btn-light mb-2" onClick={(e) => handleCancel(e)}>Cancel</button>
            </form>
                
        </div>
    )
    } else {
        return null
    }
}

export default Seat