import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';

function Signup() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const navigate = useNavigate();

const handleSignup = async (e) => {
e.preventDefault();
try {
const res = await fetch('/api/signup', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, email, password }),
});
const data = await res.json();
if (!res.ok) {
setError(data.error || 'Signup failed');
} else {
navigate('/login');
}
} catch {
setError('Something went wrong');
}
};

return (
<div className="auth-container">
<div className="auth-card">
<h2 className="auth-title">Sign Up</h2>
<form onSubmit={handleSignup}>
<div className="form-group">
<input
className="auth-input"
type="text"
placeholder="Name"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>
</div>
<div className="form-group">
<input
className="auth-input"
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</div>
<div className="form-group">
<input
className="auth-input"
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
</div>
{error && <p className="auth-error">{error}</p>}
<button className="auth-button" type="submit">Sign Up</button>
</form>
</div>
</div>
);
}

export default Signup;