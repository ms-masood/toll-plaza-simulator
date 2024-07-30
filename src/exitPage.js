import { useState } from "react";
import axios from "axios";

function getDateTimeData(dateTimeString) {
  const date = new Date(dateTimeString);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  return {
    dayOfWeek: dayOfWeek,
    month: month,
    dayOfMonth: dayOfMonth,
  };
}

const findLastObject = (arr, key, value) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i][key] === value) {
      return arr[i];
    }
  }
  return null;
};

function ExitPage() {
  const [carNumber, setCarNumber] = useState();
  const [dateTime, setDateTime] = useState();
  const [interChangeName, setInterChangeName] = useState("Zero point");
  const [showReceipt, setShowReceipt] = useState(false);
  const [vehicleEntryData, setVehicleEntryData] = useState();
  const interchangeAndDistances = [
    { name: "Zero point", distance: 0 },
    { name: "NS Interchange", distance: 5 },
    { name: "Ph4 Interchange", distance: 10 },
    { name: "Ferozpur Interchange", distance: 17 },
    { name: "Lake City Interchange", distance: 24 },
    { name: "Raiwand Interchange", distance: 29 },
    { name: "Bahria Interchange", distance: 34 },
  ];
  const [updatedData, setUpdatedData] = useState();
  const basePrice = 20;
  const pricePerKmWeekdays = 0.2;
  const pricePerKmWeekend = 0.3;
  const weekendDays = ["Sat", "Sun"];
  const discDaysForEven = ["Mon", "Wed"];
  const discDaysForOdd = ["Tue", "Thu"];

  const findDistanceByName = (name) => {
    const interchange = interchangeAndDistances.find(
      (interchange) => interchange.name === name
    );
    return interchange ? interchange.distance : null;
  };

  function findDiscount() {
    const netPrice = findNetPrice();
    const formattedDateTime = getDateTimeData(vehicleEntryData?.EntryDateTime);
    if (
      discDaysForEven.includes(formattedDateTime.dayOfWeek) &&
      vehicleEntryData?.NumberPlate.split("-")[1] % 2 === 0
    ) {
      return netPrice * 0.1;
    } else if (
      discDaysForOdd.includes(formattedDateTime.dayOfWeek) &&
      vehicleEntryData?.NumberPlate.split("-")[1] % 2 === 1
    ) {
      return netPrice * 0.1;
    }
    if (
      (formattedDateTime.month === 3 && formattedDateTime.dayOfMonth === 23) ||
      (formattedDateTime.month === 8 && formattedDateTime.dayOfMonth === 14) ||
      (formattedDateTime.month === 12 && formattedDateTime.dayOfMonth === 25)
    ) {
      return netPrice * 0.5;
    } else {
      return 0;
    }
  }

  function distanceCovered() {
    return Math.abs(
      findDistanceByName(vehicleEntryData?.EntryInterchange) -
        findDistanceByName(interChangeName)
    );
  }

  function findNetPrice() {
    const totalDistanceCovered = distanceCovered();
    const formattedDateTime = getDateTimeData(vehicleEntryData?.EntryDateTime);

    if (weekendDays.includes(formattedDateTime.dayOfWeek)) {
      return totalDistanceCovered * pricePerKmWeekend;
    } else {
      return totalDistanceCovered * pricePerKmWeekdays;
    }
  }
  const handleSubmit = async () => {
    if (carNumber && dateTime && interChangeName) {
      await axios
        .get("https://crudcrud.com/api/2832f35945b64f57a81a53b7c9b09dcc/trips")
        .then((fetchedData) => {
          const data = findLastObject(
            fetchedData.data,
            "NumberPlate",
            `${carNumber}`
          );
          if (data.TripStatus === "Active") {
            setVehicleEntryData(data);

            const netPayableTax = findNetPrice();
            const applicableDiscount = findDiscount();
            const totalPayableTax =
              basePrice + netPayableTax - applicableDiscount;
            setUpdatedData(() => ({
              ...data,
              TripStatus: "Completed",
              ExitDateTime: dateTime,
              ExitInterchange: interChangeName,
              TotalCostTrip: totalPayableTax,
            }));
            updateAPI({
              ...data,
              TripStatus: "Completed",
              ExitDateTime: dateTime,
              ExitInterchange: interChangeName,
              TotalCostTrip: totalPayableTax,
            });
            setShowReceipt(true);
          }
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    }
  };

  const updateAPI = (dataToUpdate) => {
    if (dataToUpdate?.NumberPlate) {
      axios
        .put(
          `https://crudcrud.com/api/2832f35945b64f57a81a53b7c9b09dcc/trips/${dataToUpdate?._id}`,
          dataToUpdate
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
    <div className="exit-main-container">
      <div>
        <span className="container-title">Exit</span>
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
            Calculate
          </button>
        </div>
      </div>
      <div className="receipt-container">
        <div className="receipt-title">Breakdown of cost</div>
        <div>Base Rate: {showReceipt ? basePrice : "............"}</div>
        <div>
          Distance Cost Breakdown:{" "}
          {showReceipt ? findNetPrice().toFixed(2) : "................"}
        </div>
        <div>
          Sub-Total:{" "}
          {showReceipt
            ? updatedData?.TotalCostTrip + findDiscount().toFixed(2)
            : "..................."}
        </div>
        <div>
          Discount/Other:{" "}
          {showReceipt ? findDiscount().toFixed(2) : "................"}
        </div>
        <div className="total">
          TOTAL TO BE CHARGED:{" "}
          {showReceipt ? updatedData?.TotalCostTrip : "............"}
        </div>
      </div>
    </div>
  );
}

export default ExitPage;
