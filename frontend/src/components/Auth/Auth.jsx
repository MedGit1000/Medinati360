import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
} from "lucide-react";
import apiService from "../../services/apiService";
import "./Auth.css";

const Auth = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isLogin) {
        response = await apiService.auth.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Validation pour l'inscription
        if (formData.password !== formData.password_confirmation) {
          setError("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }

        response = await apiService.auth.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      // Succès
      onSuccess(response.user);
      onClose();
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="auth-header">
          <p className="auth-subtitle">
            {isLogin
              ? "Connectez-vous pour signaler des incidents"
              : "Rejoignez la communauté Medinati360"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="name"
                  className="form-input with-icon"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="form-input with-icon"
                placeholder="vous@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input with-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required={!isLogin}
                  minLength={8}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                {isLogin ? "Connexion..." : "Inscription..."}
              </>
            ) : isLogin ? (
              "Se connecter"
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  password_confirmation: "",
                });
              }}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
