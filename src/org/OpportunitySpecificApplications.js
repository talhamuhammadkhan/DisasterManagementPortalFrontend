import React, { useState, useEffect } from "react";
import {
  Button, Typography, Card, CardContent, Grid, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const OpportunitySpecificApplications = ({ opportunity, showApplications, setShowApplications }) => {
  const [applications, setApplications] = useState([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:8080/applications/opportunity/${opportunity.id}`);
        const data = await response.json();
        setApplications(data.map(app => ({
          ...app,
          isTopVolunteer: app.isTopVolunteer || false,
        })));
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [opportunity.id]);

  const handleChangeStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/applications/${applicationId}/${newStatus}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        alert(`Application status updated to ${newStatus}`);
        setApplications(prevApplications =>
          prevApplications.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleMarkTopVolunteer = async (applicationId) => {
    try {
      const response = await fetch(`http://localhost:8080/applications/top-volunteer/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setApplications(prevApplications =>
          prevApplications.map(app =>
            app.id === applicationId
              ? { ...app, isTopVolunteer: !app.isTopVolunteer }
              : app
          )
        );
      } else {
        alert("Failed to update top volunteer status");
      }
    } catch (error) {
      console.error("Error updating top volunteer status:", error);
    }
  };

  const handleOpenMessageModal = async (applicationId) => {
    setSelectedApplicationId(applicationId);
    setMessageModalOpen(true);
    try {
      const response = await fetch(`http://localhost:8080/applications/${applicationId}/messages`);
      const data = await response.json();
      console.log("Fetched messages:", data);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch(`http://localhost:8080/applications/${selectedApplicationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          senderRole: "ORG"
        })
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages(prev => [...prev, savedMessage]);
        setNewMessage("");
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCloseModal = () => {
    setMessageModalOpen(false);
    setMessages([]);
    setNewMessage("");
    setSelectedApplicationId(null);
  };

  const handleGoBack = () => {
    setShowApplications(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={handleGoBack} style={{ marginBottom: '20px' }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Applicants for {opportunity.title}
      </Typography>

      {applications.length === 0 ? (
        <Typography>No applications found for this opportunity.</Typography>
      ) : (
        applications.map((application) => (
          <Card key={application.id} style={{ margin: "20px 0", padding: "20px" }}>
            <CardContent>
              <Grid container alignItems="center" justifyContent="center" spacing={1}>
                <Typography variant="h6" align="center">
                  <strong>{application.volunteer.name}</strong>
                </Typography>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Email:</strong> {application.volunteer.email}</Typography>
                  <Typography variant="body1"><strong>Phone:</strong> {application.volunteer.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>City:</strong> {application.volunteer.city}</Typography>
                  <Typography variant="body1"><strong>Bio:</strong> {application.volunteer.bio}</Typography>
                </Grid>
              </Grid>

              <Divider style={{ margin: '20px 0' }} />

              <Typography variant="body2" color="textSecondary">
                Status: {application.status}
              </Typography>

              <div style={{ marginTop: "10px" }}>
                <Button onClick={() => handleChangeStatus(application.id, "APPROVED")} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                  Approve
                </Button>
                <Button onClick={() => handleChangeStatus(application.id, "REJECTED")} variant="outlined" color="error" style={{ marginRight: '10px' }}>
                  Reject
                </Button>
                <Button onClick={() => handleChangeStatus(application.id, "COMPLETED")} variant="contained" color="secondary" style={{ marginRight: '10px' }}>
                  Mark as Completed
                </Button>
                <Button onClick={() => handleMarkTopVolunteer(application.id)} variant="outlined" style={{ marginRight: '10px' }}>
                  {application.isTopVolunteer ? "Unmark Top Volunteer" : "Mark as Top Volunteer"}
                </Button>
                <Button onClick={() => handleOpenMessageModal(application.id)} variant="contained" color="success">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* MESSAGE MODAL */}
      <Dialog open={messageModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Messages
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.senderRole === "ORG" ? "flex-end" : "flex-start",
                  backgroundColor: msg.senderRole === "ORG" ? "#007bff" : "#e0e0e0",
                  color: msg.senderRole === "ORG" ? "white" : "black",
                  padding: "10px 14px",
                  borderRadius: "18px",
                  maxWidth: "70%",
                  fontSize: "14px",
                  textAlign: msg.senderRole === "ORG" ? "right" : "left"
                }}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </DialogContent>

        <DialogActions>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") handleSendMessage(); }}
          />
          <Button onClick={handleSendMessage} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OpportunitySpecificApplications;
