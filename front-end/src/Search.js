import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  listTables,
  searchPhoneNumber,
  updateReservationStatus,
} from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";

function Search() {
  const history = useHistory();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(loadSearch, [reservations]);

  function loadSearch() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  function handleInput(e) {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const abortController = new AbortController();
      const response = await searchPhoneNumber(
        phoneNumber,
        abortController.signal
      );
      setReservations(response);
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

  function simpleTimeFormat(time) {
    let hour = +time.substr(0, 2);
    let newHour = hour % 12 || 12;
    let meridiem = hour < 12 || hour === 24 ? "am" : "pm";
    return `${newHour}${time.substr(2, 3)} ${meridiem}`;
  }

  function reservationStatus(reservation) {
    if (reservation.status === "booked") {
      return (
        <Link
          to={{
            pathname: `/reservations/${reservation.reservation_id}/seat`,
            state: {
              tables: tables,
            },
          }}
          type="button"
          className="btn btn-light"
        >
          Seat
        </Link>
      );
    }
    return null;
  }

  function editReservation(reservation) {
    if (reservation.status === "booked") {
      return (
        <Link
          to={{
            pathname: `/reservations/${reservation.reservation_id}/edit`,
            state: {
              initialReservationState: reservation,
            },
          }}
          type="button"
          className="btn btn-light"
        >
          Edit
        </Link>
      );
    }
    return null;
  }

  function cancelButton(reservation) {
    if (reservation.status === "booked") {
      return (
        <button
          className="btn btn-danger"
          onClick={() => cancelReservation(reservation)}
        >
          Cancel
        </button>
      );
    }
    return null;
  }

  async function cancelReservation(reservation) {
    try {
      if (
        window.confirm(
          `Do you want to cancel this reservation? This cannot be undone.`
        )
      ) {
        const abortController = new AbortController();
        const response = await updateReservationStatus(
          reservation,
          "cancelled",
          abortController.signal
        );
        history.go(0);
        return response;
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }

  const reservationRows = reservations.map((reservation) => {
    return (
      <tr className="text-truncate" key={reservation.reservation_id}>
        <th className="d-none d-md-table-cell" scope="row">
          {reservation.reservation_id}
        </th>
        <td>
          <div className="d-none d-md-table-cell">{reservation.first_name}</div>{" "}
          {reservation.last_name}
        </td>
        <td className="d-none d-md-table-cell">{reservation.mobile_number}</td>
        <td>{simpleTimeFormat(reservation.reservation_time)}</td>
        <td className="d-none d-md-table-cell" >{reservation.people}</td>
        <td
          className="d-none d-md-table-cell"
          data-reservation-id-status={reservation.revervation_id}
        >
          {reservation.status}
        </td>
        <td>{reservationStatus(reservation)}</td>
        <td className="d-none d-md-table-cell" >{editReservation(reservation)}</td>
        <td>{cancelButton(reservation)}</td>
      </tr>
    );
  });

  return (
    <div className="container">
      <form className="d-grid gap-2 mb-2" onSubmit={(e) => handleSubmit(e)}>
        <h1>Search</h1>
        <ErrorAlert error={error} />
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            id="mobile_number"
            name="mobile_number"
            className="form-control"
            onChange={(e) => handleInput(e)}
            type="text"
            maxLength="14"
            size="14"
            value={phoneNumber}
            placeholder="Enter a customer's phone number"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Find
        </button>
      </form>
      {reservations.length <= 0 ? (
        <h4>No reservations found</h4>
      ) : (
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell" scope="col">
                #
              </th>
              <th scope="col">Name</th>
              <th className="d-none d-md-table-cell" scope="col">
                Phone
              </th>
              <th scope="col">Time</th>
              <th className="d-none d-md-table-cell" scope="col">Party</th>
              <th className="d-none d-md-table-cell" scope="col">
                Status
              </th>
              <th scope="col">Seat</th>
              <th className="d-none d-md-table-cell" scope="col">Edit</th>
              <th scope="col">Cancel</th>
            </tr>
          </thead>
          <tbody>{reservationRows}</tbody>
        </table>
      )}
    </div>
  );
}

export default Search;
