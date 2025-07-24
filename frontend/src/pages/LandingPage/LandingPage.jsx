import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  CheckCircle,
  MapPin,
  Camera,
  Clock,
  Shield,
  BarChart3,
  Users,
  ChevronDown,
} from "lucide-react";
import "./LandingPage.css";
import logoImage from "../../assets/360_logo.png";
import heroIllustration from "../../assets/hero-illustration.png"; // Make sure you have this image

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? "active" : ""}`}>
      <h3 onClick={() => setIsOpen(!isOpen)}>
        <span className="faq-question-text">{question}</span>
        <ChevronDown className="faq-toggle" />
      </h3>
      <div className="faq-content">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const LandingPage = ({ onLoginClick }) => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".fade-in-section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          section.classList.add("is-visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page-wrapper-v2">
      <header id="header" className="landing-header-v2">
        <div className="header-container-v2">
          <a href="#" className="logo">
            <img src={logoImage} alt="Medinati360 Logo" />
          </a>

          <nav className="navmenu">
            <ul>
              <li>
                <a href="#hero" className="active">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about">Notre Mission</a>
              </li>
              <li>
                <a href="#how-it-works">Processus</a>
              </li>
              <li>
                <a href="#features">Fonctionnalités</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </nav>
          <div className="header-social-links">
            <a href="#" className="twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </header>

      <main className="main">
        <section id="hero" className="hero section">
          <div className="container">
            <div className="row align-items-center content">
              <div className="col-lg-6">
                <h2>Améliorez Votre Ville, Un Signalement à la Fois</h2>
                <p className="lead">
                  La plateforme citoyenne pour signaler, suivre et résoudre les
                  incidents urbains. Ensemble, rendons nos villes meilleures.
                </p>
                <div className="cta-buttons">
                  <button onClick={onLoginClick} className="btn btn-primary">
                    Accéder à la Plateforme
                  </button>
                  <a href="#how-it-works" className="btn btn-outline">
                    Comment ça marche
                  </a>
                </div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">10,000+</span>
                    <span className="stat-label">Signalements Traités</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">Villes Actives</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">92%</span>
                    <span className="stat-label">Taux de Satisfaction</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-image">
                  <img
                    src={heroIllustration}
                    alt="Illustration d'une ville intelligente"
                    className="img-fluid"
                  />
                  <div className="shape-1"></div>
                  <div className="shape-2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about section light-background">
          <div className="container section-title">
            <h2>Notre Mission</h2>
            <p>
              Créer un pont entre les citoyens et leur administration pour
              construire des villes plus réactives, transparentes et agréables à
              vivre.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="resume section">
          <div className="container section-title">
            <h2>Le Processus de Résolution</h2>
            <p>
              De votre signalement à l'intervention, chaque étape est simple et
              transparente.
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="resume-wrapper">
                  <div className="resume-block">
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-left">
                          <h4 className="company">Étape 1</h4>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-right">
                          <h3 className="position">
                            <Camera className="icon" /> Signalement Facile
                          </h3>
                          <p className="description">
                            Prenez une photo, ajoutez une description et
                            localisez le problème. Votre signalement est créé en
                            moins d'une minute.
                          </p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-left">
                          <h4 className="company">Étape 2</h4>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-right">
                          <h3 className="position">
                            <Shield className="icon" /> Validation &
                            Transmission
                          </h3>
                          <p className="description">
                            Notre équipe de modération vérifie la validité du
                            signalement avant de le transmettre instantanément
                            au service municipal compétent.
                          </p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-left">
                          <h4 className="company">Étape 3</h4>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-right">
                          <h3 className="position">
                            <Clock className="icon" /> Suivi en Temps Réel
                          </h3>
                          <p className="description">
                            Suivez l'état d'avancement de votre signalement
                            (Reçu, En cours, Résolu) et recevez des
                            notifications à chaque étape clé.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="services section light-background">
          <div className="container section-title">
            <h2>Fonctionnalités Clés</h2>
          </div>
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="service-item">
                  <MapPin className="icon" />
                  <h3>Cartographie Interactive</h3>
                  <p>Visualisez tous les incidents sur une carte dynamique.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-item">
                  <BarChart3 className="icon" />
                  <h3>Statistiques Publiques</h3>
                  <p>
                    Accédez à des données transparentes sur la performance des
                    services.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-item">
                  <Users className="icon" />
                  <h3>Profil Citoyen</h3>
                  <p>Suivez l'historique et l'impact de vos contributions.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="service-item">
                  <CheckCircle className="icon" />
                  <h3>Notifications Automatisées</h3>
                  <p>Restez informé sans effort à chaque étape du processus.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq section">
          <div className="container section-title">
            <h2>Questions Fréquemment Posées</h2>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="faq-container">
                  <FAQItem
                    question="Est-ce que l'utilisation de Medinati360 est gratuite ?"
                    answer="Oui, la plateforme est entièrement gratuite pour tous les citoyens. Notre mission est de faciliter la participation civique sans aucune barrière."
                  />
                  <FAQItem
                    question="Mes données personnelles sont-elles en sécurité ?"
                    answer="Absolument. Nous respectons les normes les plus strictes en matière de protection des données. Vos informations personnelles ne sont jamais partagées sans votre consentement."
                  />
                  <FAQItem
                    question="Que se passe-t-il après que j'ai signalé un incident ?"
                    answer="Une fois soumis, votre signalement est examiné par un modérateur, puis transmis au service municipal compétent. Vous pouvez suivre chaque étape de ce processus directement depuis votre compte."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div className="container">
          <div className="copyright text-center">
            <p>
              © <span>Copyright</span>{" "}
              <strong className="px-1 sitename">Medinati360</strong>{" "}
              <span>Tous droits réservés</span>
            </p>
          </div>
          <div className="social-links d-flex justify-content-center">
            <a href="">
              <Twitter size={18} />
            </a>
            <a href="">
              <Facebook size={18} />
            </a>
            <a href="">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
