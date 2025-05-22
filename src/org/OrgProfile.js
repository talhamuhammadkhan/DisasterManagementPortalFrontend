import React, { useState } from 'react';

const OrgProfile = ({ user, setUser, updateUserDetails }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [profileData, setProfileData] = useState(user);

    const handleEditClick = () => setIsEditing(true);
    const handleSaveClick = () => {
        setIsEditing(false);
        setUser(profileData);
        updateUserDetails(profileData);
    };
    const handleCancelClick = () => {
        setIsEditing(false);
        setProfileData(user);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const response = await fetch(`http://localhost:8080/users/${user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                localStorage.removeItem("user"); 
                setUser(null); 
                setIsModalOpen(false);
                alert("Account deleted successfully.");
            } else {
                console.error("Failed to delete account.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Organization Profile</h2>
            <div style={styles.profileBox}>
                {isEditing ? (
                    <>
                        <ProfileInput label="Organization Name" name="name" value={profileData.name} onChange={handleChange} />
                        <ProfileInput label="Email" name="email" value={profileData.email} disabled />
                        <ProfileInput label="Role" name="role" value={profileData.role} disabled />
                        <ProfileInput label="Phone Number" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} />
                        <ProfileInput label="City" name="city" value={profileData.city} onChange={handleChange} />
                        <ProfileInput label="Country" name="country" value={profileData.country} onChange={handleChange} />
                        <ProfileInput label="Mission Statement" name="mission" value={profileData.mission} onChange={handleChange} />
                        <ProfileInput label="Website" name="website" value={profileData.website} onChange={handleChange} />

                        <div style={styles.buttonGroup}>
                            <button style={styles.saveButton} onClick={handleSaveClick}>Save</button>
                            <button style={styles.cancelButton} onClick={handleCancelClick}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>Organization Name:</strong> {profileData.name}</p>
                        <p><strong>Email:</strong> {profileData.email}</p>
                        <p><strong>Role:</strong> {profileData.role}</p>
                        <p><strong>Phone Number:</strong> {profileData.phoneNumber || "Not Provided"}</p>
                        <p><strong>City:</strong> {profileData.city || "Not Provided"}</p>
                        <p><strong>Country:</strong> {profileData.country || "Not Provided"}</p>
                        <p><strong>Mission Statement:</strong> {profileData.mission || "No mission statement available"}</p>
                        <p><strong>Website:</strong> {profileData.website || "No website provided"}</p>
                        <div style={styles.buttonGroup}>
                            <button style={styles.editButton} onClick={handleEditClick}>Edit Profile</button>
                            <button style={styles.deleteButton} onClick={handleDeleteClick}>Delete Account</button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal for delete confirmation */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Are you sure?</h3>
                        <p>This action is irreversible. Your account will be permanently deleted.</p>
                        <div style={styles.buttonGroup}>
                            <button style={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button style={styles.confirmDeleteButton} onClick={confirmDeleteAccount}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileInput = ({ label, name, value, onChange, disabled = false }) => (
    <div style={styles.inputGroup}>
        <label style={styles.label}>{label}:</label>
        {name === "mission" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={disabled ? styles.disabledTextarea : styles.textarea}
            />
        ) : (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={disabled ? styles.disabledInput : styles.input}
            />
        )}
    </div>
);

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Inria Serif', serif",
        color: "#800000",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    profileBox: {
        width: "50%",
        padding: "20px",
        border: "2px solid #800000",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "#fff5f5",
        marginBottom: "15px"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    input: {
        padding: "8px",
        width: "80%",
        borderRadius: "5px",
        border: "1px solid #800000",
        fontSize: "16px",
    },
    disabledInput: {
        padding: "8px",
        width: "80%",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "#eee",
        fontSize: "16px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        gap: "10px",
    },
    saveButton: {
        backgroundColor: "green",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "#800000",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    editButton: {
        backgroundColor: "#800000",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    textarea: {
        padding: "8px",
        width: "80%",
        height: "100px", 
        borderRadius: "5px",
        border: "1px solid #800000",
        fontSize: "16px",
        resize: "none",
    },
    disabledTextarea: {
        padding: "8px",
        width: "80%",
        height: "100px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "#eee",
        fontSize: "16px",
        resize: "none",
    },
    deleteButton: {
        backgroundColor: "red",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    confirmDeleteButton: {
        backgroundColor: "red",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        border: "2px solid #800000",
    }
};

export default OrgProfile;
