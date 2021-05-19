import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ today }) {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const date = query.get("date");
  const [selectedDate, setSelectedDate] = useState(date || today);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [selectedDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ selectedDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function handleChange(e) {
    let value = e.target.value;
    setSelectedDate(value);
  }

  function handlePrevious() {
    const asDate = new Date(selectedDate);
    const previousDate = new Date(asDate.setDate(asDate.getDate() - 1));
    const previousDateString = previousDate.toISOString().split("T")[0];
    setSelectedDate(previousDateString);
  }

  function handleNext() {
    const asDate = new Date(selectedDate);
    const nextDate = new Date(asDate.setDate(asDate.getDate() + 1));
    const nextDateString = nextDate.toISOString().split("T")[0];
    setSelectedDate(nextDateString);
  }

  function handleCurrent() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    setSelectedDate(currentDateString);
  }

  function simpleTimeFormat(time) {
    let hour = +time.substr(0, 2);
    let newHour = hour % 12 || 12;
    let meridiem = hour < 12 || hour === 24 ? "am" : "pm";
    return `${newHour}${time.substr(2, 3)} ${meridiem}`;
  }

  function tableStatus(reservation_id) {
    return reservation_id ? "Occupied" : "Free";
  }

  async function finish(table) {
    try {
      if (
        window.confirm(
          `Is this table ready to seat new guests? This cannot be undone.`
        )
      ) {
        const abortController = new AbortController();
        const response = await finishTable(table, abortController.signal);
        history.go(0);
        return response;
      }
    } catch (error) {
      setTablesError(error);
      console.error(error);
    }
  }

  function showFinishButton(table, reservationId) {
    if (reservationId) {
      return (
        <button
          className="btn btn-light"
          data-table-id-finish={table.table_id}
          onClick={() => finish(table)}
        >
          Finish
        </button>
      );
    }
    return null;
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
      setTablesError(error);
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
        <td>{reservation.people}</td>
        <td
          className="d-none d-md-table-cell"
          data-reservation-id-status={reservation.revervation_id}
        >
          {reservation.status}
        </td>
        <td>{reservationStatus(reservation)}</td>
        <td>{editReservation(reservation)}</td>
        <td>{cancelButton(reservation)}</td>
      </tr>
    );
  });

  const tableRows = tables.map((table) => (
    <tr className="text-truncate" key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {tableStatus(table.reservation_id)}
      </td>
      <td>{showFinishButton(table, table.reservation_id)}</td>
    </tr>
  ));

  return (
    <main>
      <div className="container">
        <div className="d-grid gap-2 mb-2">
          <h1>Dashboard</h1>
          <h4>Reservations for date</h4>
          <input
            id="date"
            name="date"
            className="form-control"
            type="date"
            value={selectedDate}
            onChange={(e) => handleChange(e)}
            required
          />
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => handlePrevious()}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => handleCurrent()}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => handleNext()}
            >
              Next
            </button>
          </div>
          <ErrorAlert error={reservationsError} />
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
                <th scope="col">Party</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Status
                </th>
                <th scope="col">Seat</th>
                <th scope="col">Edit</th>
                <th scope="col">Cancel</th>
              </tr>
            </thead>
            <tbody>{reservationRows}</tbody>
          </table>
          <h4>Tables</h4>
          <ErrorAlert error={tablesError} />
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Occupied</th>
                <th scope="col">Finish</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
