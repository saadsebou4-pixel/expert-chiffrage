// api/users.js — Gestion des utilisateurs côté serveur
// Les comptes sont stockés ici directement — visibles sur tous les appareils

// ⚠️ AJOUTE TES CLIENTS ICI — Format :
// "identifiant": { nom, societe, password, actif }

const USERS = {
  // Exemple — tu peux modifier ou supprimer
  "demo": {
    nom: "Client Demo",
    societe: "PowerCity Demo",
    password: "demo123",
    actif: true
  }
  // Ajoute tes clients ici après la virgule :
  // "ahmed.benali": {
  //   nom: "Ahmed Benali",
  //   societe: "Electro Maroc SARL",
  //   password: "electro2025",
  //   actif: true
  // },
};

// Mot de passe admin
const ADMIN_PASSWORD = "powercity2025";

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.body || req.query;

  // ── LOGIN CLIENT ───────────────────────────────────────────────────────
  if (action === 'login') {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Champs manquants' });

    const user = USERS[username.toLowerCase()];
    if (!user)
      return res.status(401).json({ error: 'Identifiant inconnu' });
    if (!user.actif)
      return res.status(403).json({ error: 'Compte désactivé. Contactez PowerCity.' });
    if (user.password !== password)
      return res.status(401).json({ error: 'Mot de passe incorrect' });

    return res.status(200).json({
      success: true,
      user: { username, nom: user.nom, societe: user.societe }
    });
  }

  // ── ADMIN LOGIN ────────────────────────────────────────────────────────
  if (action === 'admin_login') {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD)
      return res.status(401).json({ error: 'Mot de passe admin incorrect' });
    return res.status(200).json({ success: true });
  }

  // ── LIST USERS (admin) ─────────────────────────────────────────────────
  if (action === 'list_users') {
    const { adminPassword } = req.body;
    if (adminPassword !== ADMIN_PASSWORD)
      return res.status(401).json({ error: 'Non autorisé' });
    return res.status(200).json({ users: USERS });
  }

  return res.status(400).json({ error: 'Action inconnue' });
}
