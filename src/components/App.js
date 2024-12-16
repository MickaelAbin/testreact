import React, { useEffect, useState } from 'react';
import './App.css'; // Assure-toi d'importer le fichier CSS

function App() {
    const [apps, setApps] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selectedApp, setSelectedApp] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [platforms, setPlatforms] = useState({});

    useEffect(() => {
        fetch('http://localhost:3000/releases/list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Données récupérées :', data);
                setApps(data);

                // Vérifier les plateformes pour chaque application
                data.forEach(app => {
                    fetch(`http://localhost:3000/check-platforms/${app}`)
                        .then(response => response.json())
                        .then(platformData => {
                            setPlatforms(prevPlatforms => ({ ...prevPlatforms, [app]: platformData }));
                        })
                        .catch(error => console.error('Erreur lors de la vérification des plateformes:', error));
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des applications:', error));
    }, []);

    const fetchVersions = (appName, platform) => {
        fetch(`http://localhost:3000/release/${appName}/${platform}`)
            .then(response => response.json())
            .then(data => {
                console.log(`Versions pour ${appName} sur ${platform} :`, data);

                // Trier les versions par date de modification décroissante (la plus récente en premier)
                const sortedVersions = data.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

                setSelectedApp(appName);
                setSelectedPlatform(platform);
                setVersions(sortedVersions);
            })
            .catch(error => console.error('Erreur lors de la récupération des versions:', error));
    };

    return (
        <div className="container">
            <div className="apps-list">
                <h1>Applications Disponibles</h1>
                <ul>
                    {apps.length > 0 ? (
                        apps.map(app => (
                            <li key={app} className="app-item">
                                <span>{app}</span>
                                <span className="logos">
                                    {platforms[app]?.Android && (
                                        <img
                                            src="android-logo.png"
                                            alt="Android"
                                            className="logo"
                                            onClick={() => fetchVersions(app, 'Android')}
                                        />
                                    )}
                                    {platforms[app]?.IOS && (
                                        <img
                                            src="ios-logo.png"
                                            alt="iOS"
                                            className="logo"
                                            onClick={() => fetchVersions(app, 'iOS')}
                                        />
                                    )}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li>Aucune application disponible</li>
                    )}
                </ul>
            </div>

            <div className="versions-list">
                {versions.length > 0 && (
                    <div>
                        <h2>Versions disponibles pour {selectedApp} sur {selectedPlatform}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Release</th>
                                    <th>Date</th>
                                    <th>Télécharger</th>
                                </tr>
                            </thead>
                            <tbody>
                                {versions.map(({ version, birthtime }) => {
                                    const versionParts = version.split('.');
                                    const releaseNumber = versionParts.pop(); // Dernier groupe de chiffres
                                    const versionNumber = versionParts.join('.'); // Les trois premiers groupes de chiffres
                                    const downloadUrl = selectedPlatform === 'Android'
                                        ? `http://localhost:3000/releases/${selectedApp}/Android/${version}/${selectedApp}.apk`
                                        : `http://localhost:3000/releases/${selectedApp}/IOS/${version}/manifest.plist`;
                                    return (
                                        <tr key={version}>
                                            <td>{versionNumber}</td>
                                            <td>{releaseNumber}</td>
                                            <td>{new Date(birthtime).toLocaleString()}</td>
                                            <td>
                                                <a href={downloadUrl} download>
                                                    Télécharger
                                                </a>
                                            </td>
                                        </tr>
                                    );

                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
