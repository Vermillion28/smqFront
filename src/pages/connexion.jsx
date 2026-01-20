import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/connexion.module.css";
import { FaRegUser, FaEye, FaRegEyeSlash } from "react-icons/fa";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useRouter } from "next/router";
import axios from "axios"; // Importer axios

export default function Inscription() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Ajout d'un état de chargement

  const router = useRouter();
  const togglePassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Informations invalides");
      return false;
    }
    return true;
  };

  // Consommation d'API avec Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Activer le chargement

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token); // sauvegarde le token
        toast.success(data.status_message || "Connexion réussie !");

        // Redirection vers le dashboard après 1 seconde
        setTimeout(() => {
          router.push("/responsableQ/dashboard");
        }, 4000);
      }
    } catch (error) {
      // Gestion des erreurs avec Axios
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        const data = error.response.data;

        // Cas 1 : erreurs de validation Laravel
        if (data.errorsList) {
          Object.values(data.errorsList)
            .flat()
            .forEach((msg) => toast.error(msg));
        }
        // Cas 2 : identifiants incorrects
        else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error(data.message || "Erreur lors de la connexion");
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        toast.error("Impossible de contacter le serveur");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        toast.error("Une erreur s'est produite");
      }
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <div className={styles.inscription}>
      <div className={styles.container}>
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>
                  Connectez-vous à votre compte SMQ
                </h2>
              </div>

              <form
                id="signupForm"
                className={styles.signupForm}
                onSubmit={handleSubmit}
              >
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">
                    Email
                  </label>
                  <div className={styles.inputContainer}>
                    <AiOutlineMail className={styles.inputIcon} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput}
                      placeholder="user@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading} // Désactiver pendant le chargement
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="password">
                    Mot de passe
                  </label>
                  <div className={styles.inputContainer}>
                    <AiOutlineLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={styles.formInput}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading} // Désactiver pendant le chargement
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => togglePassword("password")}
                      disabled={loading} // Désactiver pendant le chargement
                    >
                      <FaRegEyeSlash />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading} // Désactiver pendant le chargement
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </button>

                <div className={styles.loginLink}>
                  Vous n'avez pas de compte ?{" "}
                  <a href="/inscription">S'inscrire</a>
                </div>
              </form>

              <div className={styles.footerText}>
                En créant un compte, vous acceptez nos
                <a href="#"> Conditions d'utilisation</a> et notre
                <a href="#"> Politique de confidentialité</a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.leftSide}>
          <div className={styles.illustrationContent}>
            <div className={styles.illustration}>SMQ Platform</div>
            <h1 className={styles.illustrationTitle}>
              Système de Management de{" "}
              <span className={styles.gradientText}>Qualité</span>
            </h1>
            <p className={styles.illustrationSubtitle}>
              Optimisez vos processus qualité, assurez la conformité ISO et
              améliorez l'efficacité de votre organisation avec notre plateforme
              innovante de gestion SMQ.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureDot}></div>
                <span>Conformité ISO 9001</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureDot}></div>
                <span>Audit automatisé</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureDot}></div>
                <span>Rapports en temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}