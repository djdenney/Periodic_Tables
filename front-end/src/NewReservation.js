import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function NewReservation() {
    const history = useHistory()

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "1",
    }

    const [formData, setFormData] = useState(initialFormState)

    const handleInput = (e) => {
        
        let value = e.target.value
        if (e.target.name === "mobile_number") {
            const formatted = formatPhoneNumber(value)
            setFormData({
                ...formData,
                [e.target.name]: formatted /*TODO: for some reason the variable "formatted" returns the correct format, but the field in browser does not reflect formatting.*/
            })
        } else {
            setFormData({
                ...formData,
                [e.target.name]: value
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const abortController = new AbortController()
        const response = null/*TODO: create reservation function*/
        history.push("/")
        return response
    }

    const handleCancel = () => {
        history.push("/")
    }

    const formatPhoneNumber = (value) => {
        if (!value) return value
        const phoneNumber = value.replace(/[^\d]/g, "")
        const phoneNumberLength = phoneNumber.length
        if (phoneNumberLength < 4) return phoneNumber
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h1>New Reservation</h1>
                <div className="form-group">
                    <label>First Name:</label>
                    <input 
                        id="first_name"
                        name="first_name" 
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="text"
                        value={formData.first_name}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        id="last_name"
                        name="last_name"
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="text"
                        value={formData.last_name}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mobile Number:</label>
                    <input
                        id="mobile_number"
                        name="mobile_number"
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="text"
                        maxLength="10"
                        size="14"
                        value={formData.phone_number}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date of Reservation:</label>
                    <input
                        id="reservation_date"
                        name="reservation_date"
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="date"
                        value={formData.reservation_date}
                        min="2021-05-07" /*TODO: remove min/max values, replace with logic that allows the user to set invalid values which result in an error on submit*/
                        max="2021-12-31"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Time of Reservation:</label>
                    <input
                        id="reservation_time"
                        name="reservation_time"
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="time"
                        value={formData.reservation_time}
                        min="10:30"/*TODO: remove min/max values, replace with logic that allows the user to set invalid values which result in an error on submit*/
                        max="09:30"
                        step="900"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>People:</label>
                    <input
                        id="people"
                        name="people"
                        className="form-control"
                        onChange={(e) => handleInput(e)}
                        type="number"
                        value={formData.people}
                        min="1"
                        max="10"
                        required
                    />
                </div>
                <button className="btn btn-primary mx-1" type="submit">
                    Submit
                </button>
                <button className="btn btn-secondary mx-1" onClick={() => handleCancel()}>
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default NewReservation
