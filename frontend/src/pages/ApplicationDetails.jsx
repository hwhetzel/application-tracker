import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ApplicationDetails() {

    // Get ID from URL
    const { id } = useParams();

    // Store application data
    const [application, setApplication] = useState(null);
    
    // Controls edit mode
    const [editing, setEditing] =
    useState(false);

    // Editable values
    const [status, setStatus] =
    useState("");

    const [location, setLocation] =
    useState("");

    const [jobLink, setJobLink] =
    useState("");

    const [notes, setNotes] =
    useState("");

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

        setStatus(
            response.data.status
        );

        setLocation(
            response.data.location || ""
        );

        setJobLink(
            response.data.job_link || ""
        );

        setNotes(
            response.data.notes || ""
        );

      } catch (error) {

        console.error(
          "Error loading application:",
          error
        );

      }
    };

    // Used to redirect user after delete
    const navigate = useNavigate();

    // Delete application
    const handleDelete = async () => {

        try {

            await axios.delete(
            `http://localhost:8000/applications/${id}`
            );

            // Return to homepage
            navigate("/");

        } catch (error) {

            console.error(
            "Error deleting application:",
            error
            );

        }

    };

    // Save edits
    const handleUpdate = async () => {

        try {

            await axios.put(
            `http://localhost:8000/applications/${id}`,
            {
                status: status,
                location: location,
                job_link: jobLink,
                notes: notes
            }
            );

            // Refresh displayed data
            fetchApplication();

            // Exit edit mode
            setEditing(false);

        } catch (error) {

            console.error(
            "Error updating application:",
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

        {editing ? (

            <div>

                <label>Status</label>

                <br />

                <select
                value={status}
                onChange={(e) =>
                    setStatus(
                    e.target.value
                    )
                }
                >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
                </select>

            </div>

        ) : (

        <p>
            Status: {application.status}
        </p>

        )}

      <p>
        Applied On:
        {" "}
        {application.date_applied}
      </p>

        {editing ? (

            <div>

                <label>Location</label>

                <br />

                <input
                type="text"
                value={location}
                onChange={(e) =>
                    setLocation(
                    e.target.value
                    )
                }
                />

            </div>

        ) : (

        <p>
            Location: {application.location}
        </p>

        )}

       {editing ? (

            <div>

                <label>Job Link</label>

                <br />

                <input
                type="text"
                value={jobLink}
                onChange={(e) =>
                    setJobLink(
                    e.target.value
                    )
                }
                />

            </div>

        ) : (

        <p>

            Job Posting:

            {" "}

            <a
            href={application.job_link}
            target="_blank"
            rel="noreferrer"
            >
            Open Job Posting
            </a>

        </p>

        )}

        {editing ? (

            <div>

                <label>Notes</label>

                <br />

                <textarea
                rows="10"
                cols="60"
                value={notes}
                onChange={(e) =>
                    setNotes(
                    e.target.value
                    )
                }
                />

            </div>

        ) : (

        <div className="notes-card">

            <h3>
                Notes
            </h3>

            <pre
                style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit"
                }}
            >
                {application.notes}
            </pre>

        </div>

        )}

        {editing ? (

            <button
                onClick={handleUpdate}
            >
                Save Changes
            </button>

        ) : (

            <button
                onClick={() =>
                setEditing(true)
                }
            >
                Edit Application
            </button>

        )}

        <br />
        <br />

        <button
            onClick={handleDelete}
        >
            Delete Application
        </button>

        

    </div>

  );

}

export default ApplicationDetails;