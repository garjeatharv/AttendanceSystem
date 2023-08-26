import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";


export default function Attendance() {

    const [students, setStudents] = useState(
    JSON.parse(localStorage.getItem("students")) || [
      {
        id: 1,
        name: "John Doe",
        registrationNo: "12345",
        class: "10A",
        present: false,
      },
      {
        id: 2,
        name: "Jane Smith",
        registrationNo: "67890",
        class: "11B",
        present: false,
      },
    ]
  );
    

    const resetCheckboxes = () => {
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({ ...student, present: false }))
      );
    };


    const addExcel = () => {
      const presentStudents = students.filter((student) => student.present);
      const worksheetData = presentStudents.map((student) => ({
        "Sr. No.": student.id,
        Name: student.name,
        "Registration No.": student.registrationNo,
        Class: student.class,
        Attendance: "Present",
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

      const currentDate = new Date().toISOString().slice(0, 10);
      const fileName = `attendance_${currentDate}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      resetCheckboxes();
    };

    const currentDate = new Date().toISOString().slice(0, 10);

    useEffect(() => {
      localStorage.setItem("students", JSON.stringify(students));
    }, [students]);
    
  const handleAddAttendance = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: true } : student
      )
    );
  };

  const handleAddStudent = () => {
    const det = prompt("Enter Student details(Name,Registration No,Class):");
    if (det) {
        const stdDet = det.split(",");
      const newStudent = {
        id: students.length + 1,
        name: stdDet[0],
        registrationNo: stdDet[1], // Ycosou can add a prompt for this as well
        class: stdDet[2], // You can add a prompt for this as well
        present: false,
      };

      setStudents((prevStudents) => [...prevStudents, newStudent]);
    }
    else{
        return;
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Attendance System</h1>

      <div className="options">
        <p>{currentDate}</p>
        <div className="row justify-content-end">
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary me-5"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddAttendance}
            >
              Add Attendance
            </button>
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Registration No.</th>
            <th>Class</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.registrationNo}</td>
              <td>{student.class}</td>
              <td>
                <input
                  type="checkbox"
                  checked={student.present}
                  onChange={() => handleAddAttendance(student.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row justify-content-end">
        <div className="col-auto">
          <button type="button" className="btn btn-success" onClick={addExcel}>
            Export
          </button>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-warning"
            onClick={resetCheckboxes}
          >
            Reset Checkboxes
          </button>
        </div>
      </div>
    </div>
  );
}
