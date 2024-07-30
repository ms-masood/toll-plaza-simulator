import { useState } from "react";
import axios from "axios";

function EntryPage() {
  const [carNumber, setCarNumber] = useState();
  const [dateTime, setDateTime] = useState();
  const [interChangeName, setInterChangeName] = useState("Zero point");
  const interchangeAndDistances = [
    { name: "Zero point" },
    { name: "NS Interchange" },
    { name: "Ph4 Interchange" },
    { name: "Ferozpur Interchange" },
    { name: "Lake City Interchange" },
    { name: "Raiwand Interchange" },
    { name: "Bahria Interchange" },
  ];
  const handleSubmit = async () => {
    if (carNumber && dateTime && interChangeName) {
      await axios
        .post(
          "https://crudcrud.com/api/2832f35945b64f57a81a53b7c9b09dcc/trips",

          {
            EntryDateTime: dateTime,
            NumberPlate: carNumber,
            EntryInterchange: interChangeName,
            TripStatus: "Active",
            ExitDateTime: "",
            ExitInterchange: "",
            TotalCostTrip: null,
          }
        )
        .then(() => {
          window.alert("Success");
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    }
  };
  return (
    <div className="main-container">
      <span className="container-title">Entry</span>
      <div className="form-container">
        <select
          className="select-field"
          onChange={(e) => setInterChangeName(e.target.value)}
        >
          {interchangeAndDistances.map((data, index) => (
            <option value={data.name} key={index}>
              {data.name}
            </option>
          ))}
        </select>
        <input
          className="number-input"
          onChange={(e) => setCarNumber(e.target.value)}
          value={carNumber}
          maxlength="7"
          pattern="^[A-Za-z]{3}-\d{3}$"
          placeholder="Number-Plate"
          required
        />
        <input
          className="date-input"
          type="datetime-local"
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button
          className="submit-button"
          type="submit"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EntryPage;
