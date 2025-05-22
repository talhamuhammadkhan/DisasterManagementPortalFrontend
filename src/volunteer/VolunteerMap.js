import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Typography, Button } from "@mui/material";

const mapContainerStyle = {
    width: "100%",
    height: "80vh"
};

const defaultCenter = { lat: 42.9704, lng: -85.6722 }; // Default to Grand Rapids if no location

const VolunteerMap = ({ user, handleDialogOpen }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "(Enter your Google Maps API key here)",
    });

    const [volunteerLocation, setVolunteerLocation] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    useEffect(() => {
        if (user) {
            fetchVolunteerLocation(user.id);
        }
    }, [user]);

    const fetchVolunteerLocation = async (volunteerId) => {
        try {
            const response = await fetch(`http://localhost:8080/users/${volunteerId}/coordinates`);
            const data = await response.json();
            setVolunteerLocation({ lat: data.lat, lng: data.lng });

            // Fetch opportunities after getting volunteer location
            fetchOpportunities(volunteerId);
        } catch (error) {
            console.error("Error fetching user coordinates:", error);
        }
    };

    const fetchOpportunities = async (volunteerId) => {
        try {
            const response = await fetch(`http://localhost:8080/opportunities/closest/${volunteerId}`);
            const data = await response.json();
            setOpportunities(data);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        }
    };

    /*const applyForOpportunity = (opportunityId) => {
        alert(`Applying for opportunity ID: ${opportunityId}`);
    };*/

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            center={volunteerLocation || defaultCenter}
        >
            {opportunities.map((opportunity) => (
                <Marker
                    key={opportunity.id}
                    position={{ lat: opportunity.lat, lng: opportunity.lng }}
                    onClick={() => setSelectedOpportunity(opportunity)}
                />
            ))}

            {selectedOpportunity && (
                <InfoWindow
                    position={{ lat: selectedOpportunity.lat, lng: selectedOpportunity.lng }}
                    onCloseClick={() => setSelectedOpportunity(null)}
                >
                    <>
                        <Typography variant="h6" style={{ fontWeight: "bold", color: "#800000"}}>
                            {selectedOpportunity.title}
                        </Typography>
                        <Typography variant="body2" style={{ marginBottom: "10px", textAlign: "left" }}>
                            {selectedOpportunity.description}
                        </Typography>
                        {selectedOpportunity.organization?.name && (
                            <Typography variant="body2" style={{textAlign: "left" }}>
                                <strong>Organization:</strong> {selectedOpportunity.organization.name}
                            </Typography>
                        )}
                        <Typography variant="body2" style={{textAlign: "left" }}>
                            <strong>Date:</strong> {selectedOpportunity.date}
                        </Typography>
                        <Typography variant="body2" style={{textAlign: "left" }}>
                            <strong>Time:</strong> {selectedOpportunity.time}
                        </Typography>
                        {selectedOpportunity.streetAddress && selectedOpportunity.city && selectedOpportunity.state && selectedOpportunity.country && (
                            <Typography variant="body2" style={{textAlign: "left" }}>
                                <strong>Address:</strong> {selectedOpportunity.streetAddress}, {selectedOpportunity.city}, {selectedOpportunity.state}, {selectedOpportunity.country}
                            </Typography>
                        )}
                        <Typography variant="body2" style={{textAlign: "left" }}>
                            <strong>Required Volunteers:</strong> {selectedOpportunity.requiredVolunteers}
                        </Typography>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#800000", color: "white", marginTop: "10px", width: "50%" }}
                            onClick={() => handleDialogOpen(selectedOpportunity.id)}
                        >
                            Apply
                        </Button>
                    </>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default VolunteerMap;
