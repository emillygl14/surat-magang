async function testRegister() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: "Test User",
        email: "test" + Date.now() + "@example.com",
        password: "password123",
        nim: "123" + Math.floor(Math.random() * 100000),
        role: "MAHASISWA"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testRegister();
