import React, { useState, useEffect } from "react";
import {
    Grid, Card, CardContent, Typography, Button, IconButton, Divider, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star'; // Import Star icon
import CloseIcon from '@mui/icons-material/Close';
import Badge from "@mui/material/Badge";



const AppliedOpportunities = ({ user, appliedOpportunities, setAppliedOpportunities, setShowAppliedOpportunities, updateUserDetails }) => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [hours, setHours] = useState("");
    const [feedback, setFeedback] = useState(""); // NEW: State for feedback
    const [openModal, setOpenModal] = useState(false);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    

    useEffect(() => {
        fetchAppliedOpportunities();
    }, [user.id]);

    const fetchAppliedOpportunities = async () => {
        try {
            const response = await fetch(`http://localhost:8080/applications/volunteer/${user.id}`);
            const data = await response.json();

            console.log("Fetched applied opportunities:", data);

            // Check if isTopVolunteer exists and log it
            data.forEach(application => {
                console.log(`Application ID: ${application.id}, Top Volunteer: ${application.topVolunteer}`);
            });

            setAppliedOpportunities(data);
        } catch (error) {
            console.error("Error fetching applied opportunities:", error);
        }
    };

    const handleOpenModal = (application) => {
        setSelectedApplication(application);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setMessageModalOpen(false);
        setNewMessage("");
        setSelectedApplication(null);
        setHours("");
        setFeedback(""); // Reset feedback when closing modal
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/applications/${selectedApplication.id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newMessage,
                    senderRole: "VOLUNTEER",
                }),
            });

            if (response.ok) {
                setNewMessage("");
                fetchMessages(selectedApplication.id); // Refresh messages
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const fetchMessages = async (applicationId) => {
        try {
            const response = await fetch(`http://localhost:8080/applications/${applicationId}/messages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };


    const handleLogHours = async () => {
        if (!selectedApplication || !hours) return;

        try {
            const response = await fetch(`http://localhost:8080/applications/${selectedApplication.id}/log-hours?hoursLogged=${hours}&feedback=${feedback}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Hours and feedback logged successfully!");

                // Update user details
                const updatedUser = { ...user, totalHoursWorked: user.totalHoursWorked + parseInt(hours) };
                updateUserDetails(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user details

                fetchAppliedOpportunities(); // Refresh list
                handleCloseModal();
            } else {
                const errorData = await response.json();
                alert(errorData);
            }
        } catch (error) {
            console.error("Error logging hours:", error);
        }
    };

    return (
        <div>
            <IconButton onClick={() => setShowAppliedOpportunities(false)} style={styles.backButton}>
                <ArrowBackIcon />
            </IconButton>
            <h2>{appliedOpportunities.length > 0 ? "Your Applied Opportunities" : "You haven't applied to any opportunities yet. You can apply to an opportunity from the homepage or the map view!"}</h2>
            <div style={styles.gridContainer}>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    {appliedOpportunities.map((application) =>
                    (
                        <Grid item key={application.id} sm={6} md={4} style={styles.gridItem}>
                            <Card style={styles.card}>
                                <CardContent style={styles.cardContent}>
                                    <Typography variant="h6" style={styles.cardTitle}>
                                        {application.opportunity.title}
                                    </Typography>
                                    <Typography variant="body2" style={styles.cardDetails}>
                                        <strong>Organization:</strong> {application.opportunity.organization.name}
                                    </Typography>
                                    <Typography variant="body2" style={styles.cardDetails}>
                                        <strong>Description:</strong> {application.opportunity.description}
                                    </Typography>
                                    <Typography variant="body2" style={styles.cardDetails}>
                                        <strong>Location: </strong>
                                        {application.opportunity.streetAddress}, {application.opportunity.city}, {application.opportunity.state}, {application.opportunity.country}
                                    </Typography>
                                    <Typography variant="body2" style={styles.cardDetails}>
                                        <strong>Status:</strong> {application.status}
                                    </Typography>
                                    <Typography variant="body2" style={styles.cardDetails}>
                                        <strong>Hours Logged:</strong> {application.completedHours ?? "Not Logged"}
                                    </Typography>

                                    {/* Display "Top Volunteer" if marked as such */}
                                    {application.topVolunteer && (
                                        <>

                                            <Typography variant="body2" style={{ ...styles.cardDetails, color: '#D8BB58', fontWeight: 'bold' }}>
                                                <StarIcon style={{ fontSize: '16px', marginRight: '5px' }} />
                                                Top Volunteer
                                            </Typography>
                                            <Typography variant="body1" style={styles.cardDetails}>
                                                <>Congratulations! You are a top volunteer recognized by the organization!</>
                                            </Typography>
                                        </>
                                    )}

                                    <Divider style={styles.divider} />
                                    {application.status === "COMPLETED" && (!application.completedHours) && (
                                        <Button
                                            onClick={() => handleOpenModal(application)}
                                            style={styles.logButton}
                                        >
                                            Log Hours & Leave Feedback
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            fetchMessages(application.id);
                                            setMessageModalOpen(true);
                                        }}
                                        style={{ ...styles.logButton, backgroundColor: "#444", marginTop: "10px" }}
                                    >
                                        Message Organization
                                    </Button>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Log Hours Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Log Hours & Feedback</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Enter hours for <strong>{selectedApplication?.opportunity.title}</strong>
                    </Typography>
                    <TextField
                        label="Hours Worked"
                        type="number"
                        fullWidth
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        margin="dense"
                    />
                    <TextField
                        label="Feedback (optional)" // NEW: Feedback input
                        multiline
                        rows={3}
                        fullWidth
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogHours} style={styles.logButton}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Message Dialog */}
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
                                    alignSelf: msg.senderRole === "VOLUNTEER" ? "flex-end" : "flex-start",
                                    backgroundColor: msg.senderRole === "VOLUNTEER" ? "#007bff" : "#e0e0e0",
                                    color: msg.senderRole === "VOLUNTEER" ? "white" : "black",
                                    padding: "10px 14px",
                                    borderRadius: "18px",
                                    maxWidth: "70%",
                                    fontSize: "14px",
                                    textAlign: msg.senderRole === "VOLUNTEER" ? "right" : "left"
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

const styles = {
    backButton: {
        margin: "20px",
        fontSize: "24px",
        color: "#800000",
    },
    gridContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "10px",
    },
    gridItem: {
        display: "flex",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#d3d3d3",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "15px",
    },
    cardContent: {
        textAlign: "left",
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#800000",
        marginBottom: "10px",
    },
    cardDetails: {
        fontSize: "14px",
        marginBottom: "8px",
    },
    divider: {
        margin: "10px 0",
    },
    logButton: {
        backgroundColor: "#800000",
        color: "white",
        width: "100%",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default AppliedOpportunities;
