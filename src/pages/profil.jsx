'use client';

import { useState } from 'react';

// Données mockées - à remplacer par vos appels API
const userData = {
  name: "Jean Dupont",
  role: "Responsable Qualité",
  stats: {
    audits: 24,
    documents: 156,
    nonConformites: 12
  },
  firstName: "Jean",
  lastName: "Dupont",
  email: "j.dupont@entreprise.com",
  phone: "+33 1 23 45 67 89",
  department: "Qualité",
  position: "Responsable Qualité",
  language: "fr",
  timezone: "Europe/Paris",
  notifications: true
};

export default function Profil() {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    department: userData.department,
    position: userData.position,
    language: userData.language,
    timezone: userData.timezone,
    notifications: userData.notifications
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous intégreriez votre appel API
    console.log('Données à sauvegarder:', formData);
    alert('Modifications enregistrées avec succès!');
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      position: userData.position,
      language: userData.language,
      timezone: userData.timezone,
      notifications: userData.notifications
    });
  };

  return (

    <LayoutRQ>
      <div className="profil-container">
        {/* Header */}
        <div className="profil-header">
          <h1 className="page-title">Mon Profil</h1>
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <span>{userData.name}</span>
          </div>
        </div>

        {/* Contenu du profil */}
        <div className="profil-content">
          {/* Sidebar du profil */}
          <div className="profil-sidebar">
            <div className="profile-picture">
              <i className="fas fa-user"></i>
            </div>
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-role">{userData.role}</p>

            <div className="profile-stats">
              <div className="stat">
                <div className="stat-value">{userData.stats.audits}</div>
                <div className="stat-label">Audits</div>
              </div>
              <div className="stat">
                <div className="stat-value">{userData.stats.documents}</div>
                <div className="stat-label">Documents</div>
              </div>
              <div className="stat">
                <div className="stat-value">{userData.stats.nonConformites}</div>
                <div className="stat-label">NC</div>
              </div>
            </div>

            <button className="btn btn-outline">
              <i className="fas fa-camera"></i> Changer la photo
            </button>
          </div>

          {/* Formulaire du profil */}
          <div className="profil-form-section">
            <h3 className="section-title">Informations Personnelles</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Département</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Poste</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>

              <h3 className="section-title">Paramètres du Compte</h3>

              <div className="form-group">
                <label htmlFor="language">Langue</label>
                <select
                  id="language"
                  name="language"
                  className="form-control"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timezone">Fuseau Horaire</label>
                <select
                  id="timezone"
                  name="timezone"
                  className="form-control"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                </select>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                />
                <label htmlFor="notifications">Recevoir les notifications par email</label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Annuler
                </button>
                <button type="submit" className="btn">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </LayoutRQ>
  );
}