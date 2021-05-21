import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import ErrorAlert from "./layout/ErrorAlert";
import { editReservation, findReservation } from "./utils/api";
import { asDateString } from "./utils/date-time";

function EditReservation() {
    const history = useHistory();
    const location = useLocation()
    const date = location.state.date
    const { reservation_id } = useParams();
    const [formData, setFormData] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController()
        async function loadEditReservation() {
            try {
                setError(null)
                const response = await findReservation(
                    reservation_id, 
                    abortController.signal
                )
                /*setFormData date from 'response' comes through as SQL formatted date.
                setFormData date from {...response, reservation_date: date} comes from location.state.
                when using location.state to retrieve the date from the link click found
                in the editReservation() function on the Dashboard component, the app works,
                but only if this module (EditReservation.js) is accessed by clicking the link.
                if it is not accessed via link-click, but manually via the URL, the date is not
                sent from the state set by the link on the Dashboard, so when frontend test 08
                attempts to access it (by manually entering url '/reservations/:reservation_id/edit')
                the date does not populate.

                On the other hand, if I just use 'response', the date does not populate because
                the form field is a 'date' type and the received information for 'formData.reservation_date'
                is in the SQL format, which cannot be read as a 'date' type in JSX.

                it should also be noted that using date passed from location.state for setFormData causes
                the vercel build to fail, specifically because when it builds the pages for deployment, it
                attempts to access the page by its route, meaning that location.state.date is never passed
                so when 'date' is used in this useEffect, it throws the following build error: 

                ***Line 38:8:  React Hook useEffect has a missing dependency: 'date'. 
                Either include it or remove the dependency array  react-hooks/exhaustive-deps***

                */
                setFormData(response)
                // setFormData({
                //     ...response,
                //     reservation_date: date
                // })
                
            } catch (error) {
                setError(error)
                console.error(error)
            }
        }
        loadEditReservation()
        return () => {
            abortController.abort()
        }
    }, [reservation_id])

    function handleChange(e) {
        let value = e.target.value;
        if (e.target.name === "mobile_number") {
            const formatted = formatPhoneNumber(value);
            return setFormData({
                ...formData,
                [e.target.name]: formatted,
            });
        } else if (e.target.name === "people") {
            value = Number(value);
            return setFormData({
                ...formData,
                [e.target.name]: value,
            });
        } else {
            return setFormData({
                ...formData,
                [e.target.name]: value,
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const abortController = new AbortController();
            const response = await editReservation(
                { ...formData },
                abortController.signal
            );
            history.push(`/dashboard?date=${formData.reservation_date}`);
            return response;
        } catch (error) {
            setError(error);
            console.error(error);
        }
    }

    function formatPhoneNumber(value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    }

    function handleCancel(e) {
        e.preventDefault();
        history.goBack();
    }

    if (formData) {
        return (
            <div className="container">
                <form
                    className="d-grid gap-2 mb-2"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1>Edit Reservation</h1>
                    <ErrorAlert error={error} />
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            onChange={(e) => handleChange(e)}
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
                            onChange={(e) => handleChange(e)}
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
                            onChange={(e) => handleChange(e)}
                            type="text"
                            maxLength="14"
                            size="14"
                            value={formData.mobile_number}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Reservation:</label>
                        <input
                            id="reservation_date"
                            name="reservation_date"
                            className="form-control"
                            onChange={(e) => handleChange(e)}
                            type="date"
                            value={formData.reservation_date}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time of Reservation:</label>
                        <input
                            id="reservation_time"
                            name="reservation_time"
                            className="form-control"
                            onChange={(e) => handleChange(e)}
                            type="time"
                            value={formData.reservation_time}
                            step="300"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>People:</label>
                        <input
                            id="people"
                            name="people"
                            className="form-control"
                            onChange={(e) => handleChange(e)}
                            type="number"
                            value={formData.people}
                            required
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                    <button
                        data-reservation-id-cancel={formData.reservation_id}
                        className="btn btn-secondary"
                        onClick={(e) => handleCancel(e)}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    } else {
        return null;
    }
}

export default EditReservation;
