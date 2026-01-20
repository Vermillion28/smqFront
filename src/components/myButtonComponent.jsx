import styles from "../styles/MybtnComponent.module.css";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import {FichePosteForm, FicheProcessusForm} from './ficheForm';

function MyButton({text, onClick }) {
    return (
        <button onClick={onClick} type="button" className={styles.myButton}>{text}</button>
    );
}


function MyDocButton({ text, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const dropdownRef = useRef(null);

    const documentTypes = [
        { id: 'fiche-poste', label: 'Fiche de Poste', component: FichePosteForm },
        { id: 'fiche-processus', label: "Fiche d'identité processus" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleDocumentSelect = (documentType) => {
        if (!disabled) {
            setIsOpen(false);
            setSelectedDocument(documentType);
        }
    };

    const handleCloseForm = () => {
        setSelectedDocument(null);
    };

    const handleSubmitForm = (formData) => {
        console.log('Données du formulaire:', formData);
        // Ici vous pouvez envoyer les données à votre API
        // ou générer le PDF
        alert('Fiche de poste créée avec succès!');
        setSelectedDocument(null);
    };

    return (
        <>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
                <button 
                    onClick={handleToggle} 
                    type="button" 
                    className={`${styles.myButton} ${disabled ? styles.disabled : ''}`}
                    disabled={disabled}
                >
                    {text}
                </button>
                
                {isOpen && !disabled && (
                    <div className={styles.dropdownMenu}>
                        {documentTypes.map((docType) => (
                            <div 
                                key={docType.id} 
                                className={styles.dropdownItem} 
                                onClick={() => handleDocumentSelect(docType)}
                            >
                                {docType.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Afficher le formulaire correspondant */}
            {selectedDocument && selectedDocument.id === 'fiche-poste' && (
                <FichePosteForm onClose={handleCloseForm} onSubmit={handleSubmitForm}/>
            )}
        </>
    );
}

export {MyButton, MyDocButton};