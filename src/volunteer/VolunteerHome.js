import React, { useState, useEffect } from "react";
import VolunteerNavbar from "./VolunteerNavBar";
import VolunteerProfile from './VolunteerProfile';
import VolunteerMap from './VolunteerMap';
import AppliedOpportunities from './AppliedOpportunities';
import { Card, CardContent, Typography, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import { FaRegHandshake } from "react-icons/fa";

const VolunteerHome = ({ user, setUser, onLogout }) => {

  const [viewingProfile, setViewingProfile] = useState(false);
  const [viewingMap, setViewingMap] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [showAppliedOpportunities, setShowAppliedOpportunities] = useState(false);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]); // State for applied opportunities
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog visibility
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null); // Store the selected opportunity ID for confirmation
  const [logHoursOpportunity, setLogHoursOpportunity] = useState(null); // Opportunity for logging hours
  const [hours, setHours] = useState(""); // Hours input


  useEffect(() => {
    // Fetch the closest opportunities when the component mounts
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`http://localhost:8080/opportunities/closest/${user.id}`);
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, [user.id]);

  const updateUserDetails = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData); // Update the global user state
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleApplyClick = async (opportunityId) => {
    try {
      // Create application object to send
      const applicationData = {
        volunteer: { id: user.id },
        opportunity: { id: opportunityId },
        status: 'PENDING', // Initial status will be "PENDING"
      };

      console.log(applicationData)

      // Send POST request to apply for the opportunity
      const response = await fetch("http://localhost:8080/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Application successful:", result);
        alert("Application successful!");
      } else {
        console.error("Failed to apply for opportunity");
      }
    } catch (error) {
      console.error("Error applying for opportunity:", error);
    }
  };

  const handleDialogOpen = (opportunityId) => {
    setSelectedOpportunityId(opportunityId);
    setOpenDialog(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog without applying
  };

  const handleConfirmApply = () => {
    if (selectedOpportunityId) {
      handleApplyClick(selectedOpportunityId); // Apply for the selected opportunity
    }
    setOpenDialog(false); // Close the dialog after confirmation
  };

  const handleLogHours = async (applicationId, hours) => {
    try {
      const response = await fetch(`http://localhost:8080/applications/${applicationId}/log-hours?hoursLogged=${hours}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Hours logged successfully!");
        setLogHoursOpportunity(null); // Reset after successful logging
        setHours(""); // Clear the hours input
      } else {
        const errorData = await response.json();
        alert(errorData);
      }
    } catch (error) {
      console.error("Error logging hours:", error);
    }
  };

  const toggleView = () => {
    setShowAppliedOpportunities(!showAppliedOpportunities); // Toggle between views
  };

  return (
    <div style={{ textAlign: "center" }}>
      <VolunteerNavbar user={user} setViewingProfile={setViewingProfile} setViewingMap={setViewingMap} setShowAppliedOpportunities={setShowAppliedOpportunities} />
      {viewingProfile ? (
        <VolunteerProfile user={user} setUser={setUser} updateUserDetails={updateUserDetails} />
      ) :
        viewingMap ? <VolunteerMap user={user} handleDialogOpen={handleDialogOpen} /> :
          showAppliedOpportunities ? (
            <AppliedOpportunities
              user={user}
              appliedOpportunities={appliedOpportunities}
              setAppliedOpportunities={setAppliedOpportunities}
              setShowAppliedOpportunities={setShowAppliedOpportunities}
              updateUserDetails={updateUserDetails}
            />
          ) : (
            <div>
              <Button
                onClick={toggleView}
                style={{ marginTop: "20px", backgroundColor: "#800000", color: "white" }}
              >
                View my Applications
              </Button>
              <h2>Welcome, {user.name}! Here is a list of nearby opportunities:</h2>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                  {opportunities.map((opportunity) => (
                    <Grid item key={opportunity.id} sm={6} md={4} style={{ display: "flex", justifyContent: "center" }}>
                      <Card style={{ width: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#d3d3d3" }}>
                        <CardContent style={{ textAlign: "left" }}>
                          <Typography variant="body2">{opportunity.description}</Typography>
                          <div style={{ marginBottom: "10px" }}></div>
                          {opportunity.organization.name && (
                            <Typography variant="body2"><strong>Organization:</strong> {opportunity.organization.name}</Typography>
                          )}
                          <Typography variant="body2"><strong>Date:</strong> {opportunity.date}</Typography>
                          <Typography variant="body2"><strong>Time:</strong> {opportunity.time}</Typography>
                          {opportunity.streetAddress && opportunity.city && opportunity.state && opportunity.country && (
                            <Typography variant="body2">
                              <strong>Address:</strong> {opportunity.streetAddress}, {opportunity.city}, {opportunity.state}, {opportunity.country}
                            </Typography>
                          )}
                          <Typography variant="body2"><strong>Required Volunteers:</strong> {opportunity.requiredVolunteers}</Typography>
                        </CardContent>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#800000", color: "white", padding: "10px" }}>
                          <Typography variant="h6">{opportunity.title}</Typography>
                          <IconButton style={{ color: "white" }} onClick={() => handleDialogOpen(opportunity.id)}>
                            <Box display="flex" alignItems="center">
                              <Typography variant="h6" sx={{ mr: 1 }}>APPLY</Typography>
                              <FaRegHandshake />
                            </Box>
                          </IconButton>

                        </div>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Application</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to apply for this opportunity?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmApply} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <button onClick={onLogout} style={{ margin: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
};

export default VolunteerHome;
