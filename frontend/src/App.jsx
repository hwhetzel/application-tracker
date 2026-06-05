import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // Form field states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  // Stores all applications returned from backend
  const [applications, setApplications] = useState([]);

  // Search boxt text
  const [searchTerm, setSearchTerm] = useState("");

  // Current status filter selection
  const [statusFilter, setStatusFilter] = useState("All");

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
          status: status
        }
      );

      // Clear form after successful submit
      setCompany("");
      setRole("");
      setStatus("Applied");

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

  return (
    <div>

      <h1>Job Application Tracker</h1>

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

        <button type="submit">
          Add Application
        </button>

      </form>

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

      <h2>Applications</h2>

      {filteredApplications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        filteredApplications.map(
          (application) => 
          (
            <div
              key={application.id}
              style={{
                border: "1px solid gray",
                marginBottom: "10px",
                padding: "10px"
              }}
            >
              <h3>{application.company_name}</h3>

              <p>
                Role: {application.position}
              </p>

              <div>

                <label>Status:</label>

                <select
                  value={application.status}
                  onChange={(e) =>
                    updateStatus(
                      application.id,
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

              <button              
                onClick={() =>
                  deleteApplication(application.id)
                }
              >
                Delete
              </button>

            </div>

        ))
      )}

    </div>
  );
}

export default App;