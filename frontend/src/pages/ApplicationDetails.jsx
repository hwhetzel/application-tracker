import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function ApplicationDetails() {

  // Get ID from URL
  const { id } = useParams();

  // Store application data
  const [application, setApplication] =
    useState(null);

  useEffect(() => {

    fetchApplication();

  }, []);

  // Load single application
  const fetchApplication =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:8000/applications/${id}`
          );

        setApplication(
          response.data
        );

      } catch (error) {

        console.error(
          "Error loading application:",
          error
        );

      }
    };

  if (!application) {

    return (
      <p>
        Loading...
      </p>
    );

  }

  return (

    <div>

        <Link to="/">
            Back To Applications
        </Link>

        <br />
        <br />

      <h1>
        {application.company_name}
      </h1>

      <p>
        Role:
        {" "}
        {application.position}
      </p>

      <p>
        Status:
        {" "}
        {application.status}
      </p>

      <p>
        Applied On:
        {" "}
        {application.date_applied}
      </p>

      <p>
        Notes:
        {" "}
        {application.notes}
      </p>

    </div>

  );

}

export default ApplicationDetails;