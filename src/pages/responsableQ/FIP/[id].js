import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import React from 'react';
import { useProcessus } from '@/Context/ProcessusContext';
import LayoutRQ from "@/Layout/layoutResponsableQ";
import styles from "@/styles/processus.module.css";
import domtoimage from 'dom-to-image';

export default function ProcessusDetails() {
    const router = useRouter();
    const printRef = React.useRef(null);
    const { id } = router.query;
    const { getProcessusById } = useProcessus();

    const handleDownloadWithDomToImage = async () => {
        const element = printRef.current;
        if (!element) return;

        try {
            const dataUrl = await domtoimage.toPng(element, {
                bgcolor: '#ffffff',
                style: {
                    transform: 'none',
                    background: '#ffffff',
                },
                quality: 1,
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const img = new Image();
            img.src = dataUrl;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const imgWidth = pageWidth;
            const imgHeight = (img.height * imgWidth) / img.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`processus-${processus.name}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        }
    };

    if (!id) return <div className={styles.loading}>Chargement...</div>;

    const processus = getProcessusById(Number(id));

    if (!processus) {
        return (
            <LayoutRQ>
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <h2>Processus non trouvé</h2>
                        <p>Le processus que vous recherchez n'existe pas ou a été supprimé.</p>
                        <button 
                            onClick={() => router.push('/responsableQ/processus')}
                            className={styles.primaryButton}
                        >
                            Retour à la liste des processus
                        </button>
                    </div>
                </div>
            </LayoutRQ>
        );
    }

    // Fonctions pour afficher les données structurées
    const renderSimpleList = (data, emptyMessage = "Aucune donnée") => {
        if (Array.isArray(data) && data.length > 0) {
            return data.map((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    return <li key={index}>{item.name || item.libelle || JSON.stringify(item)}</li>;
                }
                return <li key={index}>{item}</li>;
            });
        } else if (typeof data === 'object' && data !== null && Object.keys(data).length > 0) {
            return Object.values(data).map((item, index) => (
                <li key={index}>{item}</li>
            ));
        }
        return <li className={styles.emptyItem}>{emptyMessage}</li>;
    };

    const renderProcessusRelations = (data) => {
        if (Array.isArray(data) && data.length > 0) {
            return data.map((item, index) => {
                if (item && typeof item === 'object' && item.name) {
                    return <li key={index}>{item.name} {item.id && `(ID: ${item.id})`}</li>;
                }
                if (typeof item === 'object') {
                    return <li key={index}>{JSON.stringify(item)}</li>;
                }
                return <li key={index}>{item}</li>;
            });
        }
        return <li className={styles.emptyItem}>Aucun processus défini</li>;
    };

    const renderRisques = (risques) => {
        if (Array.isArray(risques) && risques.length > 0) {
            return risques.map((risque, index) => (
                <div key={index} className={styles.riskRow}>
                    <div className={styles.riskCell}>
                        <span className={styles.riskLabel}>Risque :</span> {risque.risque_cle}
                    </div>
                    <div className={styles.riskCell}>
                        <span className={styles.riskLabel}>Action :</span> {risque.action_corrective}
                    </div>
                </div>
            ));
        }
        return <div className={styles.emptyData}>Aucun risque défini</div>;
    };

    const renderIndicateurs = (indicateurs) => {
        if (Array.isArray(indicateurs) && indicateurs.length > 0) {
            return indicateurs.map((ind, index) => (
                <div key={index} className={styles.indicatorRow}>
                    <div className={styles.indicatorCell}>
                        <span className={styles.indicatorLabel}>Indicateur :</span> {ind.indicateur}
                    </div>
                    <div className={styles.indicatorCell}>
                        <span className={styles.indicatorLabel}>Fréquence :</span> {ind.frequence}
                    </div>
                    <div className={styles.indicatorCell}>
                        <span className={styles.indicatorLabel}>Cible :</span> {ind.valeur_cible}
                    </div>
                </div>
            ));
        }
        return <div className={styles.emptyData}>Aucun indicateur défini</div>;
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'management': return '#1a365d';
            case 'support': return '#2d3748';
            case 'réalisation': return '#2c5282';
            default: return '#4a5568';
        }
    };

    return (
        <LayoutRQ>
            <div className={styles.container_fip}>
                {/* Header avec navigation */}
                <div className={styles.header}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        ← Retour
                    </button>
                    <div className={styles.headerActions}>
                        <button 
                            onClick={handleDownloadWithDomToImage} 
                            className={styles.downloadButton}
                        >
                            Télécharger PDF
                        </button>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className={styles.content}>
                    <div ref={printRef} className={styles.printableArea}>
                        {/* En-tête de la fiche */}
                        <div className={styles.ficheHeader}>
                            <div className={styles.entrepriseInfo}>
                                <div className={styles.logoPlaceholder}>
                                    
                                </div>
                                <div>
                                    <h2>ENTREPRISE XYZ</h2>
                                    <p>Fiche d'identité du processus</p>
                                </div>
                            </div>
                            <div className={styles.ficheMeta}>
                                <div className={styles.ficheId}>
                                    <strong>Réf. :</strong> PROC-{processus.id?.toString().padStart(3, '0')}
                                </div>
                                <div className={styles.ficheDate}>
                                    <strong>Éditée le :</strong> {new Date().toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        </div>

                        {/* Identité du processus */}
                        <div className={styles.identitySection}>
                            <div className={styles.identityHeader}>
                                <h1>{processus.name}</h1>
                                <div 
                                    className={styles.typeBadge}
                                    style={{ 
                                        backgroundColor: getTypeColor(processus.type),
                                        borderColor: getTypeColor(processus.type)
                                    }}
                                >
                                    {processus.type}
                                </div>
                            </div>
                            <div className={styles.identityGrid}>
                                <div className={styles.identityItem}>
                                    <strong>Pilote :</strong>
                                    <span>{processus.author}</span>
                                </div>
                                <div className={styles.identityItem}>
                                    <strong>Co-pilote :</strong>
                                    <span>{processus.copilote || 'Non défini'}</span>
                                </div>
                                <div className={styles.identityItem}>
                                    <strong>Dernière mise à jour :</strong>
                                    <span>{processus.lastUpdate}</span>
                                </div>
                                <div className={styles.identityItem}>
                                    <strong>Description :</strong>
                                    <span className={styles.descriptionText}>{processus.description}</span>
                                </div>
                            </div>
                        </div>

                        {/* Grille des sections */}
                        <div className={styles.sectionsGrid}>
                            {/* Cadrage */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>CADRAGE</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.fieldGroup}>
                                        <label>Finalité :</label>
                                        <p>{processus.finalité || 'Non définie'}</p>
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Champs d'application :</label>
                                        <p>{processus.champs_application || 'Non définis'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Objectifs */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>OBJECTIFS</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <ul className={styles.dataList}>
                                        {renderSimpleList(processus.objectifs, "Aucun objectif défini")}
                                    </ul>
                                </div>
                            </section>

                            {/* Exigences */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>EXIGENCES</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <ul className={styles.dataList}>
                                        {renderSimpleList(processus.exigences, "Aucune exigence définie")}
                                    </ul>
                                </div>
                            </section>

                            {/* Ressources */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>RESSOURCES ASSOCIÉES</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <ul className={styles.dataList}>
                                        {renderSimpleList(processus.ressources_associees, "Aucune ressource définie")}
                                    </ul>
                                </div>
                            </section>

                            {/* Flux */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>FLUX</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.fluxGroup}>
                                        <h4>Éléments entrants</h4>
                                        <ul className={styles.dataList}>
                                            {renderSimpleList(processus.element_entres, "Aucun élément entrant")}
                                        </ul>
                                    </div>
                                    <div className={styles.fluxGroup}>
                                        <h4>Éléments sortants</h4>
                                        <ul className={styles.dataList}>
                                            {renderSimpleList(processus.element_sortis, "Aucun élément sortant")}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Parties prenantes */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>PARTIES PRENANTES</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.stakeholderGroup}>
                                        <h4>Bénéficiaires</h4>
                                        <ul className={styles.dataList}>
                                            {renderSimpleList(processus.beneficiare, "Aucun bénéficiaire défini")}
                                        </ul>
                                    </div>
                                    <div className={styles.stakeholderGroup}>
                                        <h4>Processus amont</h4>
                                        <ul className={styles.dataList}>
                                            {renderProcessusRelations(processus.processus_amont)}
                                        </ul>
                                    </div>
                                    <div className={styles.stakeholderGroup}>
                                        <h4>Processus aval</h4>
                                        <ul className={styles.dataList}>
                                            {renderProcessusRelations(processus.processus_aval)}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Risques et actions - Pleine largeur */}
                            <section className={styles.fullWidthSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>RISQUES ET ACTIONS CORRECTIVES</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.risksTable}>
                                        {renderRisques(processus.risque_actions)}
                                    </div>
                                </div>
                            </section>

                            {/* Indicateurs - Pleine largeur */}
                            <section className={styles.fullWidthSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>INDICATEURS DE PERFORMANCE</h3>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.indicatorsTable}>
                                        {renderIndicateurs(processus.indicateur_performance)}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Pied de page */}
                        {/* <div className={styles.footer}>
                            <div className={styles.footerInfo}>
                                <p><strong>Document confidentiel</strong> - Propriété de ENTREPRISE XYZ</p>
                                <p>Page 1/1</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </LayoutRQ>
    );
}