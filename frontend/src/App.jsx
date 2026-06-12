import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";

function App() {

  // Form field states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [location, setLocation] = useState("");

  // Stores all applications returned from backend
  const [applications, setApplications] = useState([]);

  // Search boxt text
  const [searchTerm, setSearchTerm] = useState("");

  // Current status filter selection
  const [statusFilter, setStatusFilter] = useState("All");

  // Current sort option selected by user
  const [sortOption, setSortOption] = useState("Newest");

  // Load applications when page first loads
  useEffect(() => {
    fetchApplications();
  }, []);

  // Get all applications from backend
  const fetchApplications = async () => {
    try {

      const response = await axios.get(
        "http://localhost:8000/applications"
      );

      setApplications(response.data);

    } catch (error) {

      console.error("Error loading applications:", error);

    }
  };

  // Create new application
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:8000/applications",
        {
          company_name: company,
          position: role,
          status: status,
          date_applied: dateApplied || null,
          notes:notes,
          job_link: jobLink,
          location: location

        }
      );

      // Clear form after successful submit
      setCompany("");
      setRole("");
      setStatus("Applied");
      setDateApplied("");
      setNotes("");
      setJobLink("");
      setLocation("");

      // Refresh application list
      fetchApplications();

    } catch (error) {

      console.error("Error creating application:", error);

    }
  };

  // Delete application
  const deleteApplication = async (id) => {

    try {
      //Send DELETE request to backend
      await axios.delete(
        `http://localhost:8000/applications/${id}`
      );

      //Refresh application list
      fetchApplications();
      
    } catch (error) {
      
      console.error("Error deleting application:", error);
    }
  };

  // Updatte application status
  const updateStatus = async (id, newStatus) => {
    
    try {
      //Send PUT request to backend with new status
      await axios.put(
        `http://localhost:8000/applications/${id}`,
        { status: newStatus }
      );

      //Refresh application list
      fetchApplications();
      
    } catch (error) {

      console.error("Error updating status:", error);
    }
  };

    // Filter applications before displaying them
  const filteredApplications = applications.filter(
    (application) => {

      // Check if company name contains search text
      const matchesSearch =
        application.company_name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      // Check if application matches selected status
      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const sortedApplications = [...filteredApplications];

  // Sort applications based on dropdown selection
  sortedApplications.sort(
    (a, b) => {

      // Newest application first
      if (sortOption === "Newest") {
        return (
            new Date(b.date_applied) - new Date(a.date_applied)
          );
      }

      // Oldest application first
      if (sortOption === "Oldest") {
        return (
            new Date(a.date_applied) - new Date(b.date_applied)
          );
      }

      // Alphabetical company name
      if (sortOption === "Company A-Z") {

        return a.company_name.localeCompare(
          b.company_name
        );

      }

      // Reverse alphabetical company name
      if (sortOption === "Company Z-A") {

        return b.company_name.localeCompare(
          a.company_name
        );

      }

      return 0;

    }
  );

  // Total number of applications
  const totalApplications =
    applications.length;

  // Count applications by status
  const appliedCount =
    applications.filter(
      (app) =>
        app.status === "Applied"
    ).length;

  const interviewCount =
    applications.filter(
      (app) =>
        app.status === "Interview"
    ).length;

  const offerCount =
    applications.filter(
      (app) =>
        app.status === "Offer"
    ).length;

  const rejectedCount =
    applications.filter(
      (app) =>
        app.status === "Rejected"
    ).length;

  return (
    <div className="container">

      <nav className="navbar">

        <h1>
          Job Application Tracker
        </h1>

        <div>

          Total Applications:
          {" "}
          {applications.length}

        </div>

      </nav>

      <h1>Job Application Tracker</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          <div>
            <label>Company</label>
            <br />

            <input
              type="text"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Role</label>
            <br />

            <input
              type="text"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label>
            <br />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <br />

          <div>

            <label>
              Date Applied
            </label>

            <br />

            <input
              type="date"
              value={dateApplied}
              onChange={(e) =>
                setDateApplied(
                  e.target.value
                )
              }
            />

          </div>

          <br />

          <div>

            <label>
              Location
            </label>

            <br />

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

          </div>

          <br />

          <div>

            <label>
              Job Link
            </label>

            <br />

            <input
              type="url"
              value={jobLink}
              onChange={(e) =>
                setJobLink(e.target.value)
              }
            />

          </div>

          <br />

          <div>
            <label>Notes</label>
            <br />

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows = "10"
              cols = "60"
            />
          </div>

          <br />

          <button type="submit">
            Add Application
          </button>

        </form>
      </div>
      <hr />

      <h2>Search & Filter</h2>

      {/* Search by company name */}

      <input
        type="text"
        placeholder="Search company..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value)
        }
      >
        <option value="All">
          All Statuses
        </option>

        <option value="Applied">
          Applied
        </option>

        <option value="Interview">
          Interview
        </option>

        <option value="Offer">
          Offer
        </option>

        <option value="Rejected">
          Rejected
        </option>
      </select>

      <br />
      
      <label>Sort By:</label>

      <select
        value={sortOption}
        onChange={(e) =>
          setSortOption(e.target.value)
        }
      >
        <option>Newest</option>
        <option>Oldest</option>
        <option>Company A-Z</option>
        <option>Company Z-A</option>
      </select>

      <hr />

      {/* Dashboard Statistics */}

      <h2>Dashboard</h2>

      <div>

        <p>
          Total Applications:
          {" "}
          {totalApplications}
        </p>

        <p>
          Applied:
          {" "}
          {appliedCount}
        </p>

        <p>
          Interview:
          {" "}
          {interviewCount}
        </p>

        <p>
          Offer:
          {" "}
          {offerCount}
        </p>

        <p>
          Rejected:
          {" "}
          {rejectedCount}
        </p>

      </div>

      <hr />

      <h2>Applications</h2>

      <div className="board">

        <div className="column">

          <h2>Applied</h2>

          {applications
            .filter(
              app =>
                app.status === "Applied"
            )
            .map(app => (

              <div
                key={app.id}
                className="application-card"
              >

                <h3>
                  {app.company_name}
                </h3>

                <p>
                  {app.position}
                </p>

              </div>

            ))}

        </div>

        <div className="column">

          <h2>Interview</h2>

          {applications
            .filter(
              app =>
                app.status === "Interview"
            )
            .map(app => (

              <div
                key={app.id}
                className="application-card"
              >

                <h3>
                    <Link
                      to={`/applications/${app.id}`}
                    >
                      {app.company_name}
                    </Link>
                </h3>

                <p>
                  {app.position}
                </p>

              </div>

            ))}

        </div>

        <div className="column">

          <h2>Offer</h2>

          {applications
            .filter(
              app =>
                app.status === "Offer"
            )
            .map(app => (

              <div
                key={app.id}
                className="application-card"
              >

                <h3>
                  {app.company_name}
                </h3>

                <p>
                  {app.position}
                </p>

              </div>

            ))}

        </div>

        <div className="column">

          <h2>Rejected</h2>

          {applications
            .filter(
              app =>
                app.status === "Rejected"
            )
            .map(app => (

              <div
                key={app.id}
                className="application-card"
              >

                <h3>
                  {app.company_name}
                </h3>

                <p>
                  {app.position}
                </p>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default App;