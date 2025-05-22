import React, { useState, useEffect } from "react";
import OrgNavbar from "./OrgNavBar";
import OrgProfile from "./OrgProfile";
import OpportunitySpecificApplications from "./OpportunitySpecificApplications";
import { Card, CardContent, Typography, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";

const OrgHome = ({ user, setUser, onLogout }) => {
  const [viewingProfile, setViewingProfile] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState({});
  const [volunteerCounts, setVolunteerCounts] = useState({});
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    requiredVolunteers: 0,
    organization: { id: user.id },
  });
  const [showForm, setShowForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opportunities/organization/${user.id}`);
      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOpportunity),
      });
      if (response.ok) {
        alert("Opportunity created successfully!");
        fetchOpportunities();
        setNewOpportunity({
          title: "",
          description: "",
          date: "",
          time: "",
          streetAddress: "",
          city: "",
          state: "",
          country: "",
          requiredVolunteers: 0,
          organization: { id: user.id },
        });
        setShowForm(false);
      } else {
        alert("Failed to create opportunity.");
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewOpportunity({
      title: "",
      description: "",
      date: "",
      time: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      requiredVolunteers: 0,
      organization: { id: user.id },
    });
  };

  const handleDeleteClick = (opportunityId) => {
    setSelectedOpportunityId(opportunityId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opportunities/${selectedOpportunityId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted opportunity from the state
        setOpportunities((prevOpportunities) =>
          prevOpportunities.filter((opportunity) => opportunity.id !== selectedOpportunityId)
        );
        setDeleteModalOpen(false);
        alert("Opportunity deleted successfully!");
      } else {
        alert("Failed to delete opportunity.");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  const handleEditClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedOpportunity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/opportunities/${selectedOpportunity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOpportunity),
      });
      if (response.ok) {
        alert("Opportunity updated successfully!");
        fetchOpportunities();
        setEditModalOpen(false);
      } else {
        alert("Failed to update opportunity.");
      }
    } catch (error) {
      console.error("Error updating opportunity:", error);
    }
  };

  const handleViewApplications = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplications(true); // Toggle the state to show the application details
  };

  const fetchFeedbacks = async (opportunityId) => {
    try {
      const response = await fetch(`http://localhost:8080/applications/opportunity/${opportunityId}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleViewFeedback = (opportunity) => {
    setSelectedOpportunity(opportunity);
    fetchFeedbacks(opportunity.id);
    setFeedbackModalOpen(true);
  };


  return (
    <div style={{ textAlign: "center" }}>
      <OrgNavbar user={user} setViewingProfile={setViewingProfile} />
      {viewingProfile ? (
        <OrgProfile user={user} setUser={setUser} />
      ) : (
        <div>
          <h2>{user.name}</h2>
          {!showForm && !showApplications && (
            <button onClick={() => setShowForm(true)} style={createButtonStyle}>
              <FaPlusCircle size={20} style={{ marginRight: "8px" }} />
              Create New Opportunity
            </button>
          )}
          {showForm && !showApplications && (
            <div style={formContainerStyle}>
              <h3>Create a New Opportunity</h3>
              <form onSubmit={handleSubmit} style={formStyles}>
                <input type="text" name="title" placeholder="Title" value={newOpportunity.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={newOpportunity.description} onChange={handleChange} required />
                <input type="date" name="date" value={newOpportunity.date} onChange={handleChange} required />
                <input type="time" name="time" value={newOpportunity.time} onChange={handleChange} required />
                <input type="text" name="streetAddress" placeholder="Street Address" value={newOpportunity.streetAddress} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={newOpportunity.city} onChange={handleChange} required />
                <input type="text" name="state" placeholder="State" value={newOpportunity.state} onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" value={newOpportunity.country} onChange={handleChange} required />
                <input type="number" name="requiredVolunteers" placeholder="Required Volunteers" value={newOpportunity.requiredVolunteers} onChange={handleChange} required min="1" />
                <div style={buttonContainerStyle}>
                  <button type="button" onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
                  <button type="submit" style={submitButtonStyle}>Save</button>
                </div>
              </form>
            </div>
          )}

          {showApplications && selectedOpportunity ? (
            <OpportunitySpecificApplications opportunity={selectedOpportunity} showApplications={showApplications} setShowApplications={setShowApplications} />
          ) : (
            <div>
              <h3>Your Currently Listed Opportunities:</h3>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                  {opportunities.map((opportunity) => (
                    <Grid item key={opportunity.id} sm={6} md={4} style={{ display: "flex", justifyContent: "center" }}>
                      <Card style={{ width: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#d3d3d3" }}>
                        <CardContent style={{ textAlign: "left" }}>
                          <Typography variant="body2">{opportunity.description}</Typography>
                          <div style={{ marginBottom: "10px" }}></div>
                          <Typography variant="body2"><strong>Date:</strong> {opportunity.date}</Typography>
                          <Typography variant="body2"><strong>Time:</strong> {opportunity.time}</Typography>
                          {opportunity.streetAddress && opportunity.city && opportunity.state && opportunity.country && (
                            <Typography variant="body2">
                              <strong>Address:</strong> {opportunity.streetAddress}, {opportunity.city}, {opportunity.state}, {opportunity.country}
                            </Typography>
                          )}
                          <Typography variant="body2"><strong>Required Volunteers:</strong> {opportunity.requiredVolunteers}</Typography>
                          <Typography variant="body2"><strong>Completed Volunteers:</strong> {opportunity.completedCount}</Typography>
                          {/* View Applications Button */}
                          <IconButton
                            style={{
                              backgroundColor: "#800000",
                              color: "white",
                              padding: "10px",
                              borderRadius: "5px",
                              fontSize: "16px",
                              marginTop: "10px",
                              marginRight: "10px", // Space between the two buttons
                            }}
                            onClick={() => handleViewApplications(opportunity)}
                          >
                            View Applicants
                          </IconButton>

                          {/* View Feedback Button */}
                          <IconButton
                            style={{
                              backgroundColor: "#800000", // Green button for feedback
                              color: "white",
                              padding: "10px",
                              borderRadius: "5px",
                              fontSize: "16px",
                              marginTop: "10px",
                              textAlign: "right"
                            }}
                            onClick={() => handleViewFeedback(opportunity)} // Placeholder for your feedback view handler
                          >
                            View Feedback
                          </IconButton>
                        </CardContent>
                        <div style={titleStyle}>
                          <IconButton style={{ color: "white" }} onClick={() => handleEditClick(opportunity)}>
                            <FaEdit />
                          </IconButton>
                          <Typography variant="h6" color="white">{opportunity.title}</Typography>
                          <IconButton style={{ color: "white" }} onClick={() => handleDeleteClick(opportunity.id)}>
                            <FaTrash />
                          </IconButton>
                        </div>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          )}

          {/* Edit Opportunity Modal */}
          <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '800px' } }}>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogContent>
              <form onSubmit={handleEditSubmit} style={formStyles}>
                <input type="text" name="title" value={selectedOpportunity.title} onChange={handleEditChange} required />
                <textarea name="description" value={selectedOpportunity.description} onChange={handleEditChange} required />
                <input type="date" name="date" value={selectedOpportunity.date} onChange={handleEditChange} required />
                <input type="time" name="time" value={selectedOpportunity.time} onChange={handleEditChange} required />
                <input type="text" name="streetAddress" value={selectedOpportunity.streetAddress} onChange={handleEditChange} required />
                <input type="text" name="city" value={selectedOpportunity.city} onChange={handleEditChange} required />
                <input type="text" name="state" value={selectedOpportunity.state} onChange={handleEditChange} required />
                <input type="text" name="country" value={selectedOpportunity.country} onChange={handleEditChange} required />
                <input type="number" name="requiredVolunteers" value={selectedOpportunity.requiredVolunteers} onChange={handleEditChange} required min="1" />
                <DialogActions>
                  <Button onClick={() => setEditModalOpen(false)} color="primary">Cancel</Button>
                  <Button type="submit" color="primary">Save</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Opportunity Modal */}
          <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
            <DialogTitle>Delete Opportunity</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this opportunity? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteModalOpen(false)} color="primary">Cancel</Button>
              <Button onClick={confirmDelete} color="primary">Delete</Button>
            </DialogActions>
          </Dialog>

          {/* Feedback Modal */}
          <Dialog open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)}>
            <DialogTitle>Feedback for {selectedOpportunity.title}</DialogTitle>
            <DialogContent>
              {applications.filter(application => application.feedback).length > 0 ? (
                applications
                  .filter(application => application.feedback)
                  .map((application, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <Typography variant="body2"><strong>Feedback {index + 1}:</strong></Typography>
                      <Typography variant="body2">{application.feedback}</Typography>
                    </div>
                  ))
              ) : (
                <Typography variant="body2">No feedback available.</Typography>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setFeedbackModalOpen(false)} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <button onClick={onLogout} style={{ margin: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
};

// Styles
const createButtonStyle = {
  backgroundColor: "#800000",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "20px auto",
  border: "none",
};

const formContainerStyle = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  width: "50%",
  margin: "20px auto",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const formStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const submitButtonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const cancelButtonStyle = {
  backgroundColor: "#800000",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const logoutButtonStyle = {
  margin: "20px",
  padding: "10px 20px",
  fontSize: "16px",
};

const titleStyle = {
  backgroundColor: "#800000",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default OrgHome;
