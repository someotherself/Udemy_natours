const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:8080/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Unknown error occurred');
    }
    if (res.status === 200) {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
};

const handleSubmit = e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
};

document.querySelector('.form').addEventListener('submit', handleSubmit);
