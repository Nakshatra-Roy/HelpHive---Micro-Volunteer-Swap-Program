import React from 'react';

const ShowAdmins = ({ admins }) => {
    if (!admins?.length) {
        return (
            <div>
                <h2 className="card-title">Administrators</h2>
                <p>No administrators found.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="card-title">Administrators</h2>
            <div className="admin-list">
                {admins.map(admin => (
                    <div key={admin.id || admin._id} className="admin-row">
                        <div className="admin-info">
                            <div className="admin-avatar">
                                {admin.firstName?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <div className="admin-name">{admin.firstName} {admin.lastName}</div>
                                <div className="admin-email">{admin.email}</div>
                            </div>
                        </div>
                        <div className="admin-actions">
                            <button className="btn primary">Edit Role</button>
                            <button className="btn secondary">Deactivate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowAdmins;