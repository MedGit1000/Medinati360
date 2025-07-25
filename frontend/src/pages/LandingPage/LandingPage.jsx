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
  Star,
  Zap,
  Globe,
  Award,
  Play,
  Menu,
  X,
  Phone,
  Mail,
  Heart,
  TrendingUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import "./LandingPage.css"; // Import your CSS styles

// Mock logo - replace with your actual logo
const LogoComponent = () => (
  <div className="logo-placeholder">
    <div className="logo-icon">
      <Shield size={28} />
    </div>
    <span className="logo-text">Medinati360</span>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`modern-faq-item ${isOpen ? "active" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown className={`faq-icon ${isOpen ? "rotated" : ""}`} />
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <div className="feature-card-modern" style={{ animationDelay: `${delay}ms` }}>
    <div className="feature-icon-wrapper">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, rating, avatar }) => (
  <div className="testimonial-card-modern">
    <div className="testimonial-header">
      <div className="testimonial-avatar">{avatar || name[0]}</div>
      <div className="testimonial-info">
        <h4>{name}</h4>
        <p>{role}</p>
      </div>
      <div className="testimonial-rating">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
    </div>
    <p className="testimonial-content">"{content}"</p>
  </div>
);

const StatCard = ({ number, label, icon }) => (
  <div className="stat-card-modern">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{number}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const LandingPage = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Animate elements on scroll
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animated");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Amina Benali",
      role: "Résidente de Casablanca",
      content:
        "Grâce à Medinati360, le problème d'éclairage dans ma rue a été résolu en une semaine. Interface très intuitive !",
      rating: 5,
    },
    {
      name: "Omar Tazi",
      role: "Commerçant à Rabat",
      content:
        "Enfin une plateforme qui fonctionne ! Les autorités répondent rapidement et on peut suivre l'évolution en temps réel.",
      rating: 5,
    },
    {
      name: "Fatima El Amrani",
      role: "Enseignante à Temara",
      content:
        "Une vraie révolution pour la participation citoyenne. Mes élèves utilisent aussi la plateforme pour leur quartier.",
      rating: 5,
    },
  ];

  return (
    <div className="modern-landing">
      {/* Header */}
      <header className={`modern-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <LogoComponent />

          <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              Mission
            </a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
              Processus
            </a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              Fonctionnalités
            </a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>
              Témoignages
            </a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </a>
          </nav>

          <div className="header-actions">
            <button className="btn-login" onClick={onLoginClick}>
              Se connecter
            </button>
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-modern">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text animate-on-scroll">
              <div className="hero-badge">
                <Zap size={16} />
                <span>Plateforme #1 au Maroc</span>
              </div>
              <h1>
                Transformez Votre Ville,{" "}
                <span className="gradient-text">Un Signalement à la Fois</span>
              </h1>
              <p className="hero-description">
                La plateforme citoyenne intelligente qui connecte les résidents
                aux autorités locales. Signalez, suivez et célébrez les
                améliorations de votre quartier en temps réel.
              </p>

              <div className="hero-actions">
                <button className="btn-primary-hero" onClick={onLoginClick}>
                  <Play size={20} />
                  Commencer maintenant
                </button>
                <button className="btn-secondary-hero">
                  <Eye size={20} />
                  Voir la démo
                </button>
              </div>

              <div className="hero-stats-grid">
                <StatCard
                  number="15K+"
                  label="Signalements traités"
                  icon={<CheckCircle size={20} />}
                />
                <StatCard
                  number="8 villes"
                  label="Déjà connectées"
                  icon={<MapPin size={20} />}
                />
                <StatCard
                  number="96%"
                  label="Satisfaction citoyenne"
                  icon={<Heart size={20} />}
                />
              </div>
            </div>

            <div className="hero-visual animate-on-scroll">
              <div className="hero-mockup">
                <div className="mockup-container">
                  <div className="phone-mockup">
                    <div className="phone-screen">
                      <div className="app-interface">
                        <div className="app-header">
                          <div className="app-title">Medinati360</div>
                          <div className="notification-badge">3</div>
                        </div>
                        <div className="map-preview">
                          <div className="map-pins">
                            <div className="pin pin-1"></div>
                            <div className="pin pin-2"></div>
                            <div className="pin pin-3"></div>
                          </div>
                        </div>
                        <div className="incident-card">
                          <div className="incident-status resolved"></div>
                          <div className="incident-info">
                            <h4>Éclairage réparé</h4>
                            <p>Rue Mohammed V</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-modern animate-on-scroll">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Notre Mission</h2>
              <p className="lead">
                Créer un pont numérique entre les citoyens et leur
                administration pour construire des villes plus réactives,
                transparentes et agréables à vivre.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Transparence totale</h4>
                    <p>Suivi en temps réel de chaque signalement</p>
                  </div>
                </div>
                <div className="mission-point">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Efficacité garantie</h4>
                    <p>Réduction de 60% du temps de traitement</p>
                  </div>
                </div>
                <div className="mission-point">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Participation citoyenne</h4>
                    <p>Donnez une voix à chaque résident</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="process-modern animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>Un Processus Simple en 3 Étapes</h2>
            <p>
              De votre signalement à la résolution, chaque étape est optimisée
              pour l'efficacité
            </p>
          </div>

          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <Camera size={32} />
                </div>
                <h3>Signalement Instantané</h3>
                <p>
                  Prenez une photo, ajoutez une description et géolocalisez le
                  problème. Votre signalement est créé en moins de 30 secondes.
                </p>
                <div className="timeline-features">
                  <span>📱 Interface intuitive</span>
                  <span>📍 Géolocalisation automatique</span>
                  <span>⚡ Validation instantanée</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <Shield size={32} />
                </div>
                <h3>Validation & Transmission</h3>
                <p>
                  Notre IA et notre équipe de modération vérifient la validité
                  avant transmission automatique au service compétent.
                </p>
                <div className="timeline-features">
                  <span>🤖 IA de validation</span>
                  <span>⚡ Transmission instantanée</span>
                  <span>🎯 Service approprié</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <TrendingUp size={32} />
                </div>
                <h3>Suivi & Résolution</h3>
                <p>
                  Suivez l'évolution en temps réel avec des notifications
                  automatiques à chaque étape clé du processus.
                </p>
                <div className="timeline-features">
                  <span>📊 Suivi en temps réel</span>
                  <span>🔔 Notifications automatiques</span>
                  <span>✅ Confirmation de résolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-modern animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>Fonctionnalités Avancées</h2>
            <p>
              Des outils puissants pour une expérience citoyenne exceptionnelle
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<MapPin size={32} />}
              title="Cartographie Interactive"
              description="Visualisez tous les incidents sur une carte dynamique avec filtres avancés et données en temps réel."
              delay={0}
            />
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Analytics Publiques"
              description="Accédez à des statistiques transparentes sur la performance des services municipaux."
              delay={100}
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Profil Citoyen"
              description="Suivez l'historique et l'impact de vos contributions avec un système de points et badges."
              delay={200}
            />
            <FeatureCard
              icon={<MessageSquare size={32} />}
              title="Communication Directe"
              description="Échangez directement avec les services municipaux via un système de messagerie intégré."
              delay={300}
            />
            <FeatureCard
              icon={<Award size={32} />}
              title="Gamification"
              description="Gagnez des récompenses et des reconnaissances pour votre engagement civique."
              delay={400}
            />
            <FeatureCard
              icon={<Globe size={32} />}
              title="Multi-plateformes"
              description="Accédez à tous vos signalements depuis le web, mobile iOS et Android."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="testimonials-modern animate-on-scroll"
      >
        <div className="container">
          <div className="section-header">
            <h2>Ce Que Disent Nos Citoyens</h2>
            <p>Plus de 50,000 utilisateurs actifs nous font confiance</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-modern animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>Questions Fréquemment Posées</h2>
            <p>Tout ce que vous devez savoir sur Medinati360</p>
          </div>

          <div className="faq-container">
            <FAQItem
              question="Est-ce que l'utilisation de Medinati360 est gratuite ?"
              answer="Oui, la plateforme est entièrement gratuite pour tous les citoyens. Notre mission est de faciliter la participation civique sans aucune barrière financière."
            />
            <FAQItem
              question="Mes données personnelles sont-elles en sécurité ?"
              answer="Absolument. Nous respectons les normes les plus strictes en matière de protection des données (RGPD). Vos informations personnelles ne sont jamais partagées sans votre consentement explicite."
            />
            <FAQItem
              question="Que se passe-t-il après que j'ai signalé un incident ?"
              answer="Votre signalement est d'abord validé par notre système IA puis par notre équipe. Une fois approuvé, il est automatiquement transmis au service municipal compétent. Vous recevez des notifications à chaque étape."
            />
            <FAQItem
              question="Combien de temps faut-il pour qu'un incident soit résolu ?"
              answer="Le délai varie selon le type d'incident et la ville. En moyenne, 70% des signalements sont traités dans les 7 jours. Vous pouvez suivre le progrès en temps réel sur votre tableau de bord."
            />
            <FAQItem
              question="Puis-je signaler anonymement ?"
              answer="Oui, vous pouvez choisir de faire un signalement anonyme. Cependant, créer un compte vous permet de suivre vos signalements et de gagner des points de reconnaissance."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-modern animate-on-scroll">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à Transformer Votre Ville ?</h2>
            <p>
              Rejoignez des milliers de citoyens engagés et faites la différence
              dès aujourd'hui
            </p>
            <div className="cta-actions">
              <button className="btn-cta-primary" onClick={onLoginClick}>
                <Zap size={20} />
                Commencer Gratuitement
              </button>
              <div className="cta-info">
                <div className="info-item">
                  <Phone size={16} />
                  <span>+212 50293402</span>
                </div>
                <div className="info-item">
                  <Mail size={16} />
                  <span>contact@medinati360.ma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <LogoComponent />
              <p>
                La plateforme citoyenne qui transforme la façon dont nous
                améliorons nos villes.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Produit</h4>
              <a href="#features">Fonctionnalités</a>
              <a href="#how-it-works">Comment ça marche</a>
              <a href="#testimonials">Témoignages</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-section">
              <h4>Société</h4>
              <a href="#about">À propos</a>
              <a href="#">Blog</a>
              <a href="#">Carrières</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <a href="#">Centre d'aide</a>
              <a href="#">Politique de confidentialité</a>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Status</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Medinati360. Tous droits réservés.</p>
            <p>Fait avec ❤️ pour les citoyens marocains</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
