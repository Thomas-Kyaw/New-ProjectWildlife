import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/Admin.module.css";

const Admin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("Date");
  const [sortOrder, setSortOrder] = useState("asc");

  const parseCsv = (csvString) => {
    const rows = csvString.split("\n").filter((row) => row.trim() !== "");
    const headers = rows[0].split(",");
    return rows.slice(1).map((row) => {
      const values = row.split(",");
      const rowObject = headers.reduce(
        (acc, header, index) => ({
          ...acc,
          [header.trim()]: values[index]?.trim() || "",
        }),
        {}
      );

      if (rowObject.DateTimeTemperature) {
        const [date, time, temperature] =
          rowObject.DateTimeTemperature.split(" ");
        rowObject.Date = date || "";
        rowObject.Time = time || "";
        rowObject.Temperature = parseFloat(temperature) || 0;
        delete rowObject.DateTimeTemperature;
      }

      rowObject.Temperature = parseFloat(rowObject.Temperature) || 0;
      rowObject.Confidence = parseFloat(rowObject.Confidence) || 0;

      return rowObject;
    });
  };

  const sortData = useCallback(() => {
    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;

      if (["Date", "Time", "Temperature", "Species"].includes(sortKey)) {
        const aRow = a.parsedCsv ? a.parsedCsv[0] : null;
        const bRow = b.parsedCsv ? b.parsedCsv[0] : null;

        if (sortKey === "Date") {
          aValue = aRow ? new Date(aRow.Date).getTime() : 0;
          bValue = bRow ? new Date(bRow.Date).getTime() : 0;
        } else if (sortKey === "Time") {
          aValue = aRow ? Date.parse(`1970-01-01T${aRow.Time}Z`) : 0;
          bValue = bRow ? Date.parse(`1970-01-01T${bRow.Time}Z`) : 0;
        } else if (sortKey === "Temperature") {
          aValue = aRow ? parseFloat(aRow.Temperature) : 0;
          bValue = bRow ? parseFloat(bRow.Temperature) : 0;
        } else if (sortKey === "Species") {
          aValue = aRow ? aRow.Species.toLowerCase() : "";
          bValue = bRow ? bRow.Species.toLowerCase() : "";
        }
      } else if (sortKey === "uploadedDate") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  }, [data, sortKey, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://new-projectwildlife.onrender.com/api/data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const parsedData = result.map((item) => ({
          ...item,
          parsedCsv: item.csv_data ? parseCsv(atob(item.csv_data)) : null,
        }));

        setData(Array.isArray(parsedData) ? parsedData : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      sortData();
    }
  }, [data, sortData]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorAlert}>
          <strong>Error Loading Data! </strong>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Admin Dashboard</h2>
        </div>
        <div className={styles.cardBody}>
          {data.length === 0 ? (
            <p className={styles.noDataMessage}>No files have been uploaded yet.</p>
          ) : (
            <>
              <div className={styles.filters}>
                <select
                  className={styles.select}
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                >
                  <option value="Date">Date</option>
                  <option value="Time">Time</option>
                  <option value="Temperature">Temperature</option>
                  <option value="Species">Species</option>
                  <option value="uploadedDate">Uploaded Date</option>
                </select>
                <select
                  className={styles.select}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Image</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Temperature</th>
                      <th>Species</th>
                      <th>Uploaded Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.image_data && (
                            <img
                              src={`data:image/jpeg;base64,${item.image_data}`}
                              alt={item.image_filename}
                              className={styles.image}
                            />
                          )}
                        </td>
                        <td>
                          {item.parsedCsv &&
                            item.parsedCsv.map((row, rowIndex) => (
                              <div key={rowIndex}>{row.Date}</div>
                            ))}
                        </td>
                        <td>
                          {item.parsedCsv &&
                            item.parsedCsv.map((row, rowIndex) => (
                              <div key={rowIndex}>{row.Time}</div>
                            ))}
                        </td>
                        <td>
                          {item.parsedCsv &&
                            item.parsedCsv.map((row, rowIndex) => (
                              <div key={rowIndex}>{row.Temperature}</div>
                            ))}
                        </td>
                        <td>
                          {item.parsedCsv &&
                            item.parsedCsv.map((row, rowIndex) => (
                              <div key={rowIndex}>{row.Species}</div>
                            ))}
                        </td>
                        <td>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "Date not available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
